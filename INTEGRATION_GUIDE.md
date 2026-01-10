# Integration Guide - External Services Setup

This guide provides step-by-step instructions for setting up each external service required by the Notes Marketplace.

## 1. Supabase Setup

### Create Project
1. Go to https://supabase.com
2. Sign up or login
3. Click "New Project"
4. Choose a project name and strong password
5. Select your region (closest to your users)
6. Wait for project to initialize (2-3 minutes)

### Get API Credentials
1. Go to Settings → API
2. Copy:
   - `URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role secret` → `SUPABASE_SERVICE_ROLE_KEY`

### Create Tables
1. Go to SQL Editor
2. Click "New Query"
3. Copy and paste the table creation SQL
4. Click Run

#### notes Table SQL:
```sql
CREATE TABLE notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  subject VARCHAR(255),
  price DECIMAL(10, 2),
  author VARCHAR(255),
  image_url VARCHAR(500),
  google_drive_file_id VARCHAR(255),
  download_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notes_subject ON notes(subject);
CREATE INDEX idx_notes_created_at ON notes(created_at DESC);
```

#### purchases Table SQL:
```sql
CREATE TABLE purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  notes_id UUID NOT NULL REFERENCES notes(id) ON DELETE CASCADE,
  customer_email VARCHAR(255) NOT NULL,
  customer_name VARCHAR(255),
  amount DECIMAL(10, 2),
  razorpay_payment_id VARCHAR(255),
  razorpay_order_id VARCHAR(255) NOT NULL UNIQUE,
  status VARCHAR(50) DEFAULT 'pending',
  download_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_purchases_email ON purchases(customer_email);
CREATE INDEX idx_purchases_notes_id ON purchases(notes_id);
CREATE INDEX idx_purchases_status ON purchases(status);
```

### Test Connection
1. Run `npm run dev`
2. Visit `/admin/login`
3. If no errors appear, Supabase is connected

---

## 2. Razorpay Setup

### Create Account
1. Go to https://razorpay.com
2. Sign up with email
3. Verify email and complete business details
4. Accept terms and conditions

### Get API Keys (TEST MODE)
1. Go to Dashboard
2. Click on Account Settings (gear icon)
3. Select "API Keys"
4. Copy under "Test Mode":
   - Key ID → `NEXT_PUBLIC_RAZORPAY_KEY_ID`
   - Key Secret → `RAZORPAY_KEY_SECRET`

### Test Payment
Use these test credentials:
- **Card Number**: `4111 1111 1111 1111`
- **Expiry**: Any future date (e.g., 12/25)
- **CVV**: Any 3 digits (e.g., 123)
- **Name**: Any name

### Switch to Live Keys (Production Only)
1. Go to API Keys
2. Toggle to "Live Mode"
3. Copy your production keys
4. Update environment variables in deployment

### Settlement Details
1. Go to Account Settings → Settlement
2. Add your bank account
3. Razorpay will verify in 2-3 days
4. Payments will be settled every 2 days

---

## 3. Google Drive Setup

### Create Google Cloud Project
1. Go to https://console.cloud.google.com/
2. Click project dropdown → "New Project"
3. Enter project name (e.g., "Notes Marketplace")
4. Click Create

### Enable Google Drive API
1. Go to APIs & Services → Library
2. Search for "Google Drive API"
3. Click it and press "Enable"
4. Go to APIs & Services → Credentials

### Create Service Account
1. Click "Create Credentials" → "Service Account"
2. Fill in:
   - Service account name: "notes-uploader"
   - Service account ID: (auto-filled)
   - Click Create and Continue
3. Skip optional steps
4. Click "Create Key" → "JSON"
5. A JSON file downloads - keep it safe!

### Get Credentials from JSON
Open the downloaded JSON file and find:
- `client_id` → `GOOGLE_CLIENT_ID`
- `client_secret` → `GOOGLE_CLIENT_SECRET`

### Generate Refresh Token
1. Go to https://myaccount.google.com/permissions
2. Search for "Google Drive API"
3. Or use Google OAuth Playground:
   - https://developers.google.com/oauthplayground
   - Select "Drive API v3"
   - Authorize
   - Copy `refresh_token`

### Create Google Drive Folder
1. Go to Google Drive
2. Create a new folder (e.g., "Notes Marketplace")
3. Right-click → Get link → Copy folder ID from URL
   - URL format: `https://drive.google.com/drive/folders/FOLDER_ID`
   - Extract: `FOLDER_ID` → `GOOGLE_DRIVE_FOLDER_ID`

### Share Folder with Service Account
1. In the JSON file, find `client_email`
2. Go to Notes Marketplace folder in Google Drive
3. Click Share
4. Paste the service account email
5. Give "Editor" permission
6. Uncheck "Notify people"
7. Share

### Test Upload
1. Fill environment variables
2. Run `npm run dev`
3. Go to `/admin/dashboard`
4. Try uploading a PDF
5. Check Google Drive folder

---

## 4. Environment Variables Summary

Create `.env.local` with all these values:

```env
# ====== SUPABASE ======
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# ====== RAZORPAY ======
# For Testing: Use Test Keys (key_id starts with "rzp_test_")
# For Production: Use Live Keys (key_id starts with "rzp_live_")
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxxxxx

# ====== GOOGLE DRIVE ======
GOOGLE_CLIENT_ID=123456789-abcdefghijklmnop.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxxxxxxxxxxxxxxxxxxxxx
GOOGLE_REFRESH_TOKEN=1//0gxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
GOOGLE_DRIVE_FOLDER_ID=1abc2def3ghi4jkl5mno6pqr7stu8vwx

# ====== APP CONFIG ======
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 5. Verification Checklist

- [ ] Supabase project created
- [ ] Database tables created
- [ ] Supabase credentials added to `.env.local`
- [ ] Razorpay account created
- [ ] Razorpay test keys added to `.env.local`
- [ ] Google Cloud project created
- [ ] Google Drive API enabled
- [ ] Service account created and JSON downloaded
- [ ] Refresh token generated
- [ ] Google Drive folder created
- [ ] Service account shared to folder
- [ ] Google Drive credentials added to `.env.local`
- [ ] `npm run dev` starts without errors
- [ ] Home page loads at localhost:3000

---

## 6. Troubleshooting

### "supabaseUrl is required"
- Check `NEXT_PUBLIC_SUPABASE_URL` is correct
- Restart dev server after changing env variables

### "CORS error during payment"
- Check `NEXT_PUBLIC_RAZORPAY_KEY_ID` is correct test key
- Ensure Razorpay is in test mode

### "Cannot upload to Google Drive"
- Check all Google Drive credentials
- Verify service account has folder access
- Check refresh token is not expired

### "Database error: relation 'notes' does not exist"
- Ensure SQL was run in Supabase
- Table names must be lowercase
- Check you're in the correct project

---

## 7. Production Deployment

When deploying to production:

1. **Use Live Razorpay Keys**
   - Go to Razorpay → API Keys → Live Mode
   - Update `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`

2. **Create Production Supabase**
   - Create separate production project
   - Use production credentials

3. **Enable RLS on Supabase**
   - Go to Authentication → RLS
   - Create policies for secure access

4. **Set correct APP_URL**
   - `NEXT_PUBLIC_APP_URL=https://yourdomain.com`

5. **Deploy to Vercel**
   ```bash
   vercel --prod
   ```

---

For more information, visit:
- Supabase Docs: https://supabase.com/docs
- Razorpay Docs: https://razorpay.com/docs/
- Google Drive API: https://developers.google.com/drive
