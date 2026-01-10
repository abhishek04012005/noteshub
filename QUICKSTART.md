# 🚀 Quick Start Guide - Notes Marketplace

## Project Overview
You now have a fully functional Notes Marketplace website built with Next.js. This is a two-sided platform where students can purchase study notes and admins can upload and manage them.

## ✅ What's Included

### Pages Created:
1. **Home Page** (`/`) - Landing page with featured notes
2. **Browse Notes** (`/student/browse`) - All available notes listing
3. **Note Details** (`/student/notes/[id]`) - Individual note page with purchase button
4. **Download Page** (`/student/download`) - Post-purchase confirmation
5. **Admin Login** (`/admin/login`) - Admin authentication
6. **Admin Dashboard** (`/admin/dashboard`) - Upload and manage notes

### Components:
- `BuyNotesButton` - Payment integration component
- `UploadNotesForm` - Notes upload form for admins
- `NotesCard` - Reusable notes display component

### API Routes:
- `/api/notes` - Get all notes, create new notes
- `/api/notes/[id]` - Get, update, delete individual notes
- `/api/payment/order` - Create Razorpay payment orders
- `/api/payment/verify` - Verify Razorpay payments
- `/api/purchases` - Retrieve student purchases
- `/api/upload-notes` - Upload notes with PDF files

## 🔧 Setup Instructions (IMPORTANT!)

### Step 1: Environment Setup
1. Copy `.env.example` to `.env.local`
2. Fill in all the required values (see below)

### Step 2: Supabase Setup
1. Create account at [supabase.com](https://supabase.com)
2. Create a new project
3. Create two tables using the SQL queries below:

**Table: notes**
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
```

**Table: purchases**
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
```

4. Get your Supabase URL and API keys from Settings → API

### Step 3: Razorpay Setup
1. Sign up at [razorpay.com](https://razorpay.com)
2. Go to Settings → API Keys
3. Copy Key ID and Key Secret
4. Use **Test Keys** for development

### Step 4: Google Drive Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Google Drive API
4. Create OAuth 2.0 credentials (Service Account)
5. Download the JSON key file
6. Create a folder in Google Drive for notes storage
7. Share the folder with the service account email
8. Get the folder ID from the folder URL

### Step 5: Update .env.local
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Razorpay (Test Keys)
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=your-secret-key

# Google Drive
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-secret
GOOGLE_REFRESH_TOKEN=your-refresh-token
GOOGLE_DRIVE_FOLDER_ID=your-folder-id

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## ▶️ Running the Project

### Development:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

### Production Build:
```bash
npm run build
npm start
```

## 📖 How to Use

### For Students:
1. Go to home page
2. Click "Browse Notes"
3. Click on any note
4. Click "Buy Now"
5. Enter email and name
6. Complete payment
7. Get download link instantly

### For Admin:
1. Visit `/admin/login`
2. Use any email with password "admin" (test mode)
3. Fill the upload form with note details
4. Select PDF file
5. Click upload
6. Manage notes from dashboard

## 📁 Project Structure
```
src/
├── app/                    # Pages and API routes
│   ├── admin/             # Admin pages
│   ├── student/           # Student pages
│   ├── api/               # API endpoints
│   └── page.tsx           # Home page
├── components/            # React components
├── lib/                   # Library setup (Supabase, Razorpay)
├── types/                 # TypeScript types
├── utils/                 # Utility functions
└── hooks/                 # Custom hooks (future)
```

## 🔐 Security Notes

⚠️ **Important for Production:**
- Replace the basic admin auth with Supabase Auth
- Use proper JWT tokens for authentication
- Enable Row Level Security (RLS) on Supabase tables
- Add rate limiting to payment endpoints
- Hash admin passwords properly
- Never commit `.env.local` to version control

## 🚀 Next Steps

1. **Test locally** with placeholder data
2. **Configure Supabase** tables
3. **Setup Razorpay** test mode
4. **Upload first notes** via admin panel
5. **Test payment** flow
6. **Deploy to Vercel** (production ready)

## 📝 Deployment to Vercel

```bash
npm install -g vercel
vercel
```

Then add environment variables in Vercel dashboard under Project Settings → Environment Variables.

## 💡 Tips

- Use Razorpay **Test Mode** initially
- Test with test credit card: `4111 1111 1111 1111`
- Check browser console for errors during payment
- Verify Supabase tables have correct data

## 🆘 Troubleshooting

**Payment not working?**
- Check Razorpay keys in `.env.local`
- Verify using test keys, not live keys
- Check browser console for CORS errors

**PDF upload fails?**
- Verify Google Drive credentials
- Check folder permissions
- Ensure refresh token is valid

**Data not saving?**
- Check Supabase URL and keys
- Verify table names match exactly
- Check RLS policies if enabled

## 📞 Support
For detailed documentation, see [README.md](./README.md)

---

**Your project is ready! Start with `npm run dev` and enjoy building!** 🎉
