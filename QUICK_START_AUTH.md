# Quick Start - Admin Authentication

## 1️⃣ Install Dependencies (5 seconds)
```bash
npm install bcryptjs jsonwebtoken
npm install --save-dev @types/bcryptjs @types/jsonwebtoken
```

## 2️⃣ Update Environment File
Add to `.env.local`:
```
JWT_SECRET=your-super-secret-key-123
ADMIN_SECRET_KEY=your-admin-secret-456
```

## 3️⃣ Create Database Table
Copy and paste this SQL in Supabase SQL Editor:

```sql
CREATE TABLE admin_users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_admin_users_email ON admin_users(email);

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
```

## 4️⃣ Create Your First Admin
Run in terminal or Postman:

```bash
curl -X POST http://localhost:3000/api/admin/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "MySecurePassword123!",
    "adminSecret": "your-admin-secret-456"
  }'
```

Or with curl (Windows PowerShell):
```powershell
$body = @{
    email = "admin@example.com"
    password = "MySecurePassword123!"
    adminSecret = "your-admin-secret-456"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:3000/api/admin/register" `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body $body
```

## 5️⃣ Test Login
1. Go to `http://localhost:3000/admin/login`
2. Enter:
   - Email: `admin@example.com`
   - Password: `MySecurePassword123!`
3. Click Login
4. You should be redirected to dashboard ✅

## 6️⃣ Test Download Protection

**Test Completed Payment:**
1. Visit: `http://localhost:3000/student/download?email=test@example.com`
2. First check Supabase - ensure a completed payment exists for that email
3. Should show download button ✅

**Test Failed Payment:**
1. Modify purchase record status to "failed" in Supabase
2. Reload the page
3. Should show "Payment Failed" message ✅

**Test Pending Payment:**
1. Modify purchase record status to "pending" 
2. Reload the page
3. Should show "Payment Pending" message ✅

## What's Protected Now?

✅ `/admin/dashboard` - Requires login
✅ `/admin/dashboard/upload` - Requires login
✅ `/admin/dashboard/edit/[id]` - Requires login
✅ `/admin/dashboard/sales` - Requires login
✅ `/student/download` - Shows content only if payment completed

## Default Login Credentials
```
Email: admin@example.com
Password: MySecurePassword123!
```
(Change these immediately after first login!)

## Common Issues & Solutions

### "Cannot find module 'bcryptjs'"
```bash
npm install bcryptjs
```

### "Cannot find module 'jsonwebtoken'"
```bash
npm install jsonwebtoken
```

### Admin page still accessible without login
- Restart dev server: `npm run dev`
- Clear browser cache (Ctrl+Shift+Delete)
- Check middleware.ts exists in root directory

### Login shows "Invalid email or password"
- Make sure admin_users table exists in Supabase
- Verify the admin was created successfully (check Supabase table)
- Check email is exact match (case-sensitive on some systems)

### Download page not showing payment status
- Check purchases table has a record for the test email
- Verify status field is set correctly ("completed", "pending", or "failed")
- Clear browser cache

## Security Reminders

⚠️ Change `JWT_SECRET` and `ADMIN_SECRET_KEY` to strong random values
⚠️ Never commit `.env.local` to git
⚠️ Use HTTPS in production
⚠️ Change default admin credentials after first login
⚠️ Use strong passwords (minimum 12 characters)

## Next Steps

1. Create additional admin users as needed
2. Test the upload and edit features (now protected)
3. Implement password reset functionality
4. Add admin activity logging
5. Set up 2FA for extra security

## Files Created/Modified

**New Files:**
- `src/lib/admin-auth.ts`
- `src/app/api/admin/login/route.ts`
- `src/app/api/admin/register/route.ts`
- `middleware.ts`
- `ADMIN_AUTH_SETUP.md`
- `IMPLEMENTATION_SUMMARY_AUTH.md`

**Modified Files:**
- `src/app/admin/login/page.tsx`
- `src/app/student/download/page.tsx`

## Support

For detailed documentation, see:
- `ADMIN_AUTH_SETUP.md` - Complete setup guide
- `IMPLEMENTATION_SUMMARY_AUTH.md` - Technical details
