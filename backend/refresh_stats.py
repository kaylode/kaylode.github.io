import os
import json
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

url: str = os.environ.get("SUPABASE_URL")
# Prefer Service Role Key for backend scripts to bypass RLS
key: str = os.environ.get("SUPABASE_SERVICE_KEY") or os.environ.get("SUPABASE_KEY")

if not url or not key:
    print("Error: SUPABASE_URL and SUPABASE_KEY (or SUPABASE_SERVICE_KEY) must be set in .env")
    exit(1)

supabase: Client = create_client(url, key)

import requests
from datetime import datetime, timedelta
import calendar

def refresh_github_stats():
    print("Fetching GitHub stats...")
    
    github_token = os.environ.get("GITHUB_TOKEN")
    github_username = os.environ.get("GITHUB_USERNAME")
    
    if not github_token or not github_username:
        print("Warning: GITHUB_TOKEN or GITHUB_USERNAME not set. Skipping GitHub stats.")
        return

    headers = {
        "Authorization": f"token {github_token}",
        "Accept": "application/vnd.github.v3+json"
    }

    try:
        # 1. Fetch Total Stars
        # URL for user repositories (handles pagination if user has > 100 repos, usually loop needed, simplified here)
        repos_url = f"https://api.github.com/users/{github_username}/repos?per_page=100&type=public"
        response = requests.get(repos_url, headers=headers)
        response.raise_for_status()
        repos = response.json()
        
        total_stars = sum(repo['stargazers_count'] for repo in repos)
        print(f"Total Stars: {total_stars}")

        # 2. Fetch Monthly Commits (Last 12 Months)
        monthly_commits = []
        today = datetime.now()
        
        # Iterate back 12 months
        for i in range(12):
            # Calculate month range
            # Current month iteration: 0 -> This month, 1 -> Last month, etc.
            # But we want to go from oldest to newest usually for charts, or newest first?
            # Let's do oldest to newest (11 months ago -> current month)
            
            # Target date: 1st of the month (11-i) months ago
            target_date = today.replace(day=1) 
            # Adjust month/year
            month_diff = 11 - i
            
            # Simple month subtraction logic
            year = target_date.year
            month = target_date.month - month_diff
            while month <= 0:
                month += 12
                year -= 1
            
            start_date = datetime(year, month, 1)
            
            # End date: Last day of this month
            last_day = calendar.monthrange(year, month)[1]
            end_date = datetime(year, month, last_day)
            
            start_str = start_date.strftime("%Y-%m-%d")
            end_str = end_date.strftime("%Y-%m-%d")
            month_label = start_date.strftime("%b") # e.g., "Jan"

            # Search API for commits
            # q=author:USERNAME committer-date:START..END
            search_url = f"https://api.github.com/search/commits?q=author:{github_username}+committer-date:{start_str}..{end_str}"
            # Search API has rate limits (30 req/min for authenticated), we make 12 requests. Should be fine.
            # Using specific header for commit search text-match if needed, but count is standard.
            search_headers = headers.copy()
            search_headers["Accept"] = "application/vnd.github.cloak-preview+json" # Historical preview, now standard usually
            
            resp = requests.get(search_url, headers=headers) # Using standard headers
            if resp.status_code == 200:
                count = resp.json().get('total_count', 0)
            else:
                print(f"Error searching commits for {month_label}: {resp.status_code}")
                count = 0
            
            monthly_commits.append({
                "month": month_label,
                "year": year,
                "commits": count
            })
            print(f"Commits for {month_label} {year}: {count}")

        # 3. Update Supabase
        new_stats = {
            "totalStars": total_stars,
            "monthlyCommits": monthly_commits,
            "lastUpdated": datetime.now().isoformat()
        }
        
        supabase.table("tracking_stats").upsert({
            "category": "github",
            "data": new_stats
        }).execute()
        
        print("GitHub stats updated successfully.")
        
    except Exception as e:
        print(f"Error refreshing GitHub stats: {e}")

def refresh_leetcode_stats():
    print("Fetching LeetCode stats...")
    
    # Using a hardcoded username or getting it from env
    # For now, let's assume 'kaylode' or get from env if set
    # Note: LeetCode username might be different from GitHub
    leetcode_username = os.environ.get("LEETCODE_USERNAME", "kaylode") 

    url = "https://leetcode.com/graphql"
    
    # Query for total solved and submission calendar
    query_solved = """
    query userProfile($username: String!) {
      allQuestionsCount {
        difficulty
        count
      }
      matchedUser(username: $username) {
        submitStats {
          acSubmissionNum {
            difficulty
            count
            submissions
          }
        }
        submissionCalendar
      }
    }
    """
    
    try:
        # 1. Fetch Data
        response = requests.post(url, json={'query': query_solved, 'variables': {'username': leetcode_username}})
        if response.status_code == 200:
            data = response.json()
            if 'errors' in data:
                print(f"LeetCode API Error: {data['errors']}")
                return

            matched_user = data['data']['matchedUser']
            if not matched_user:
                print(f"User {leetcode_username} not found")
                return

            ac_stats = matched_user['submitStats']['acSubmissionNum']
            # ac_stats is a list: All, Easy, Medium, Hard. Index 0 is usually 'All'.
            total_solved = next((item['count'] for item in ac_stats if item['difficulty'] == 'All'), 0)
            
            print(f"LeetCode Total Solved: {total_solved}")

            # Process Submission Calendar
            submission_calendar = json.loads(matched_user['submissionCalendar'])
            
            # Aggregate monthly solves for the last 12 months
            monthly_solves = []
            today = datetime.now()
            
            for i in range(12):
                # Target range for this month
                # Logic same as GitHub stats: From 11 months ago to current month
                target_date = today.replace(day=1)
                month_diff = 11 - i
                
                year = target_date.year
                month = target_date.month - month_diff
                while month <= 0:
                    month += 12
                    year -= 1
                
                start_date = datetime(year, month, 1)
                last_day = calendar.monthrange(year, month)[1]
                end_date = datetime(year, month, last_day) + timedelta(days=1) # End of month (exclusive for timestamp comparison)

                start_ts = int(start_date.timestamp())
                end_ts = int(end_date.timestamp())
                
                # Sum commits (solves) in this range
                count = 0
                for ts_str, val in submission_calendar.items():
                    ts = int(ts_str)
                    if start_ts <= ts < end_ts:
                        count += val
                
                month_label = start_date.strftime("%b")
                monthly_solves.append({
                    "month": month_label,
                    "year": year,
                    "solved": count
                })
                print(f"Solves for {month_label} {year}: {count}")

            # Process Total Questions
            all_questions = data['data']['allQuestionsCount']
            total_questions = next((item['count'] for item in all_questions if item['difficulty'] == 'All'), 0)
            print(f"LeetCode Total Questions: {total_questions}")

            # 2. Update Supabase
            existing = supabase.table("tracking_stats").select("data").eq("category", "leetcode").execute()
            current_data = existing.data[0]['data'] if existing.data else {}
            
            new_stats = {
                "solved": total_solved,
                "totalQuestions": total_questions,
                "streak": current_data.get('streak', 0),
                "dailyDone": current_data.get('dailyDone', False),
                "monthlySolves": monthly_solves,
                "lastUpdated": datetime.now().isoformat()
            }

            supabase.table("tracking_stats").upsert({
                "category": "leetcode",
                "data": new_stats
            }).execute()
            
            print("LeetCode stats updated successfully.")
            
        else:
            print(f"LeetCode Request failed: {response.status_code}")

    except Exception as e:
        print(f"Error refreshing LeetCode stats: {e}")
if __name__ == "__main__":
    print("Starting stats refresh...")
    refresh_github_stats()
    refresh_leetcode_stats()
    print("Stats refresh complete.")
