from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from supabase import create_client, Client
import os
from dotenv import load_dotenv

load_dotenv()

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")

if not url or not key:
    raise ValueError("SUPABASE_URL and SUPABASE_KEY must be set in .env")

supabase: Client = create_client(url, key)

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Academic Portfolio API is running"}

@app.get("/api/blog")
def get_blog_posts():
    response = supabase.table("blog_posts").select("*").execute()
    return response.data

@app.get("/api/tracking")
def get_tracking_stats():
    try:
        response = supabase.table("tracking_stats").select("*").execute()
        # Transform list to dictionary keyed by category for easier frontend consumption
        data = {}
        for item in response.data:
            data[item['category']] = item['data']
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
