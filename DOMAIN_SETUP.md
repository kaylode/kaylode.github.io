# Custom Domain Setup: kaylode.com

This guide will help you configure your custom domain `kaylode.com` purchased from Namecheap to work with your Vercel deployment.

## Step 1: Configure Domain in Vercel

1. **Add Domain in Vercel Dashboard**:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Select your **portfolio** project
   - Navigate to **Settings** → **Domains**
   - Click **Add Domain**
   - Enter: `kaylode.com`
   - Click **Add**

2. **Add www Subdomain** (Recommended):
   - Click **Add Domain** again
   - Enter: `www.kaylode.com`
   - Select **Redirect to kaylode.com**
   - Click **Add**

## Step 2: Configure DNS Records in Namecheap

1. **Login to Namecheap**:
   - Go to [Namecheap Dashboard](https://www.namecheap.com/myaccount/)
   - Find your `kaylode.com` domain
   - Click **Manage**

2. **Navigate to DNS Settings**:
   - Go to **Advanced DNS** tab
   - You'll see a list of DNS records

3. **Add/Update DNS Records**:

### Required DNS Records:

| Type  | Host | Value                    | TTL  |
|-------|------|--------------------------|------|
| A     | @    | 76.76.19.19             | Auto |
| CNAME | www  | cname.vercel-dns.com    | Auto |

### Detailed Steps:

#### For Root Domain (kaylode.com):
- **Type**: A Record
- **Host**: @ (this represents your root domain)
- **Value**: `76.76.19.19` (Vercel's IP)
- **TTL**: Automatic

#### For WWW Subdomain (www.kaylode.com):
- **Type**: CNAME
- **Host**: www
- **Value**: `cname.vercel-dns.com`
- **TTL**: Automatic

#### Remove Conflicting Records:
- Delete any existing A records pointing to @
- Delete any existing CNAME records for www
- Keep MX records (for email) if you have any

## Step 3: Verify Configuration

### In Vercel Dashboard:
1. Go back to **Settings** → **Domains**
2. You should see:
   - `kaylode.com` - Primary domain
   - `www.kaylode.com` - Redirects to kaylode.com
3. Wait for DNS propagation (can take 24-48 hours, usually much faster)

### Check Domain Status:
- **Valid**: Domain is working correctly
- **Pending**: DNS records are propagating
- **Invalid**: Check your DNS configuration

## Step 4: Test Your Domain

### DNS Propagation Check:
```bash
# Check if DNS has propagated
nslookup kaylode.com
nslookup www.kaylode.com

# Or use online tools:
# https://whatsmydns.net/
# https://dnschecker.org/
```

### Test in Browser:
1. Visit: `https://kaylode.com`
2. Visit: `https://www.kaylode.com` (should redirect to kaylode.com)
3. Both should show your portfolio

## Step 5: SSL Certificate

Vercel automatically provides SSL certificates for custom domains:
- Certificate is issued automatically
- HTTPS is enforced by default
- No additional configuration needed

## Troubleshooting

### Common Issues:

1. **"Domain not found" error**:
   - Check DNS records are correct
   - Wait for DNS propagation (up to 48 hours)
   - Use `nslookup kaylode.com` to verify

2. **SSL Certificate issues**:
   - Vercel automatically handles SSL
   - May take a few minutes after DNS propagation
   - Try force refresh (Ctrl+F5 or Cmd+Shift+R)

3. **www not redirecting**:
   - Ensure CNAME record for www is set to `cname.vercel-dns.com`
   - Check Vercel domain settings

### Verification Commands:

```bash
# Check A record
dig kaylode.com A

# Check CNAME record
dig www.kaylode.com CNAME

# Check from different locations
nslookup kaylode.com 8.8.8.8
```

## Alternative DNS Configuration (Advanced)

If you prefer using Vercel's nameservers instead of Namecheap's DNS:

1. **In Vercel Dashboard**:
   - Go to domain settings
   - Choose "Use Vercel DNS"
   - Note the nameservers provided

2. **In Namecheap**:
   - Go to Domain List → Manage
   - Change nameservers to Vercel's nameservers
   - This gives Vercel full DNS control

## Expected Timeline

- **Immediate**: Vercel configuration
- **5-15 minutes**: DNS record updates in Namecheap
- **1-4 hours**: DNS propagation (usually faster)
- **24-48 hours**: Maximum time for global DNS propagation

## Security Best Practices

1. **Enable DNSSEC** (in Namecheap):
   - Go to Advanced DNS
   - Enable DNSSEC if available

2. **Domain Lock**:
   - Keep domain lock enabled in Namecheap
   - Prevents unauthorized transfers

3. **Two-Factor Authentication**:
   - Enable 2FA on both Namecheap and Vercel accounts

## Next Steps After Setup

1. Update all references to old domain in your portfolio
2. Set up redirects from old domain if needed
3. Update social media links and business cards
4. Monitor domain performance in Vercel analytics
