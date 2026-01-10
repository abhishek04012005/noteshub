# Notes Marketplace - Student Notes Buying Platform

A modern web application where students can purchase quality study notes and admins can upload and manage them. Built with Next.js, Supabase, Razorpay, and Google Drive integration.

## Features

### 🎓 Student Features
- Browse available study notes
- View detailed notes information (title, description, subject, price, author)
- Purchase notes without login required
- Secure payment via Razorpay
- Instant download access after payment
- Email confirmation of purchase with download link

### 👨‍💼 Admin Features
- Secure admin login
- Upload PDF notes to Google Drive
- Manage notes (create, update, delete)
- Set pricing for notes
- View all uploaded notes

### 💳 Payment Integration
- Razorpay payment gateway integration
- Secure payment verification
- Order management and tracking
- Payment status tracking

### 📦 Storage & Database
- **Supabase**: Store all application data (notes, purchases, user information)
- **Google Drive**: Store PDF files securely
- Download URLs generated dynamically from Google Drive

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Payment**: Razorpay
- **File Storage**: Google Drive API
- **Authentication**: Custom Admin Auth
- **HTTP Client**: Axios

## Project Structure

```
src/
├── app/
│   ├── admin/
│   │   ├── login/page.tsx         # Admin login page
│   │   └── dashboard/page.tsx     # Admin dashboard
│   ├── student/
│   │   ├── browse/page.tsx        # Browse all notes
│   │   ├── notes/[id]/page.tsx    # Single note detail
│   │   └── download/page.tsx      # Download confirmation
│   ├── api/
│   │   ├── notes/                 # Notes CRUD operations
│   │   ├── payment/               # Payment endpoints
│   │   ├── purchases/             # Purchase tracking
│   │   └── upload-notes/          # File upload
│   └── page.tsx                   # Home page
├── components/
│   ├── BuyNotesButton.tsx         # Payment button component
│   ├── UploadNotesForm.tsx        # Notes upload form
│   └── NotesCard.tsx              # Notes list component
├── lib/
│   ├── supabase.ts                # Supabase client setup
│   └── razorpay.ts                # Razorpay instance
├── types/
│   └── index.ts                   # TypeScript types
├── utils/
│   ├── auth.ts                    # Auth utilities
│   ├── google-drive.ts            # Google Drive integration
│   └── razorpay-loader.ts         # Razorpay script loader
└── hooks/                          # Custom React hooks (future)
```

## Setup Instructions

### Prerequisites
- Node.js 16+ and npm/yarn
- Supabase account
- Razorpay account
- Google Cloud Console project with Drive API enabled
- Git

### 1. Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Razorpay Configuration
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Google Drive Configuration
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REFRESH_TOKEN=your_google_refresh_token
GOOGLE_DRIVE_FOLDER_ID=your_google_drive_folder_id

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 2. Setup Supabase Database

Create the following tables in your Supabase project:

#### notes table
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

#### purchases table
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

### 3. Setup Google Drive Integration

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Google Drive API
4. Create OAuth 2.0 credentials (Service Account)
5. Generate a refresh token
6. Create a folder in Google Drive for storing notes
7. Add credentials to `.env.local`

### 4. Setup Razorpay

1. Create account at [Razorpay](https://razorpay.com/)
2. Get your API Key and Secret from dashboard
3. Add to `.env.local`

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Endpoints

### Notes Management
- `GET /api/notes` - Get all notes
- `POST /api/notes` - Create new note (Admin)
- `GET /api/notes/[id]` - Get single note
- `PUT /api/notes/[id]` - Update note (Admin)
- `DELETE /api/notes/[id]` - Delete note (Admin)

### Payment Processing
- `POST /api/payment/order` - Create Razorpay order
- `POST /api/payment/verify` - Verify payment

### Purchases
- `GET /api/purchases?email=student@example.com` - Get student purchases

### File Upload
- `POST /api/upload-notes` - Upload notes with PDF (Admin)

## Usage Guide

### For Students

1. Visit the home page
2. Click "Browse Notes" to see all available notes
3. Click on any note to view details
4. Click "Buy Now" button
5. Enter your name and email
6. Complete payment via Razorpay
7. Get instant download link

### For Admin

1. Visit `/admin/login`
2. Enter admin credentials
3. On dashboard, fill the upload form
4. Select PDF file and submit
5. View all uploaded notes
6. Delete notes as needed

## Security Notes

⚠️ **Important**: The current admin authentication is basic. For production:
- Implement proper JWT-based authentication
- Use Supabase Auth for admin accounts
- Hash and securely store admin passwords
- Add role-based access control (RBAC)
- Implement rate limiting on payment endpoints
- Add CSRF protection

## Future Enhancements

- [ ] Advanced search and filtering
- [ ] Notes ratings and reviews
- [ ] Admin analytics dashboard
- [ ] Email notifications
- [ ] Wishlist feature
- [ ] Bulk upload for admins
- [ ] Notes preview/sample pages
- [ ] Subscription plans
- [ ] Student dashboard with purchase history
- [ ] Multiple language support

## Troubleshooting

### Payment not working
- Check Razorpay keys are correct
- Verify payment is in test mode
- Check console for CORS errors

### Google Drive upload fails
- Verify Google credentials and permissions
- Check refresh token is valid
- Ensure folder ID is correct

### Database errors
- Verify Supabase URL and keys
- Check table structure matches schema
- Review RLS policies if data not accessible

## Deployment

### Deploy to Vercel

```bash
npm install -g vercel
vercel
```

Set environment variables in Vercel dashboard.

## Support & Contact

For issues or questions, please create an issue in the repository.

## License

This project is open source and available under the MIT License.

---

**Note**: Make sure to keep your API keys and secrets secure. Never commit `.env.local` to version control.
