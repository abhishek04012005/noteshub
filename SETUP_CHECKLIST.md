# Setup Checklist - Admin Authentication

## Pre-Setup Requirements
- [ ] Node.js 18+ installed
- [ ] npm/yarn package manager
- [ ] Supabase project created and accessible
- [ ] Development server can run (`npm run dev`)

## Step 1: Install Dependencies ⚙️
```bash
npm install bcryptjs jsonwebtoken
npm install --save-dev @types/bcryptjs @types/jsonwebtoken
```
- [ ] bcryptjs installed
- [ ] jsonwebtoken installed
- [ ] Type definitions installed
- [ ] No installation errors in terminal

## Step 2: Database Setup 🗄️

### Go to Supabase Dashboard
- [ ] Log in to Supabase
- [ ] Select your project
- [ ] Navigate to SQL Editor

### Create admin_users Table
Copy and run this SQL:
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

- [ ] Table created successfully
- [ ] Index created
- [ ] RLS enabled
- [ ] No SQL errors

### Verify Table
- [ ] Go to Table Editor
- [ ] See `admin_users` table listed
- [ ] See 4 columns: id, email, password_hash, created_at, updated_at

## Step 3: Environment Variables 🔑

### Open `.env.local`
```
JWT_SECRET=your-super-secret-jwt-key-change-this-to-32-chars-minimum
ADMIN_SECRET_KEY=your-admin-secret-key-change-this-to-32-chars-minimum
```

### Important!
- [ ] Change JWT_SECRET to random 32+ character string
- [ ] Change ADMIN_SECRET_KEY to random 32+ character string
- [ ] Both should be complex (letters, numbers, symbols)
- [ ] Never use default values in production
- [ ] Don't commit .env.local to git

### Optional: Generate Secure Keys
Use online key generators or:
```bash
# Linux/Mac
openssl rand -base64 32

# Windows PowerShell
[Convert]::ToBase64String((1..32 | ForEach-Object { [byte](Get-Random -Maximum 256) }))
```

- [ ] JWT_SECRET is strong
- [ ] ADMIN_SECRET_KEY is strong

## Step 4: Create First Admin User 👤

### Start Development Server
```bash
npm run dev
```
- [ ] Server running on http://localhost:3000

### Create Admin via API

#### Option A: Using curl (Linux/Mac)
```bash
curl -X POST http://localhost:3000/api/admin/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "MySecurePassword123!",
    "adminSecret": "your-admin-secret-key-change-this-to-32-chars-minimum"
  }'
```

#### Option B: Using curl (Windows PowerShell)
```powershell
$body = @{
    email = "admin@example.com"
    password = "MySecurePassword123!"
    adminSecret = "your-admin-secret-key-change-this-to-32-chars-minimum"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:3000/api/admin/register" `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body $body
```

#### Option C: Using Postman
1. Open Postman
2. Create new POST request
3. URL: `http://localhost:3000/api/admin/register`
4. Headers: `Content-Type: application/json`
5. Body (JSON):
```json
{
  "email": "admin@example.com",
  "password": "MySecurePassword123!",
  "adminSecret": "your-admin-secret-key-change-this-to-32-chars-minimum"
}
```
6. Send request

### Verify Response
Response should be:
```json
{
  "success": true,
  "message": "Admin user created successfully",
  "data": {
    "id": "...",
    "email": "admin@example.com",
    "created_at": "..."
  }
}
```

- [ ] Request successful (HTTP 200)
- [ ] Response contains "success": true
- [ ] Admin user created with your email
- [ ] Check Supabase admin_users table - see new record

## Step 5: Test Login 🔐

### Navigate to Login Page
```
http://localhost:3000/admin/login
```

### Enter Credentials
- Email: admin@example.com
- Password: MySecurePassword123!

### Click Login
- [ ] Login button clicked
- [ ] No errors shown
- [ ] Redirected to /admin/dashboard
- [ ] Dashboard loads successfully

## Step 6: Verify Admin Routes 🛡️

### Test Protected Routes
1. Go to `/admin/dashboard`
   - [ ] Accessible (you're logged in)
   
2. Open new incognito window
3. Go to `/admin/dashboard` in incognito
   - [ ] Redirected to `/admin/login` ✅

4. Try to login with wrong password
   - [ ] Shows "Invalid email or password" ❌

5. Login with correct password
   - [ ] Redirected to dashboard ✅

## Step 7: Test Payment Protection 💳

### Create Test Purchase (in Supabase)
1. Go to Supabase → Table Editor
2. Click `purchases` table
3. Add test record:
   - customer_email: test@example.com
   - status: "completed"
   - download_url: "https://example.com/file.pdf"

### Test Download Page
1. Visit: `http://localhost:3000/student/download?email=test@example.com`
   - [ ] Should show "Payment Successful!" ✅
   - [ ] Download button visible ✅

### Change Status and Test
1. Update purchase status to "pending"
2. Refresh page
   - [ ] Should show "Payment Pending" ⏳

3. Change status to "failed"
4. Refresh page
   - [ ] Should show "Payment Failed" ❌

## Step 8: Security Check ✅

- [ ] JWT_SECRET is strong (32+ chars)
- [ ] ADMIN_SECRET_KEY is strong (32+ chars)
- [ ] .env.local is in .gitignore (not committed)
- [ ] Admin password is strong (12+ chars)
- [ ] HTTPS will be used in production
- [ ] No hardcoded credentials in code
- [ ] Middleware.ts exists in root directory
- [ ] Database table RLS is enabled

## Step 9: Final Verification 🎯

### Routes Protection
- [ ] `/admin/login` → Always accessible
- [ ] `/admin/dashboard` → Requires login
- [ ] `/admin/dashboard/upload` → Requires login
- [ ] `/admin/dashboard/edit/[id]` → Requires login
- [ ] `/admin/dashboard/sales` → Requires login

### Login System
- [ ] Can login with correct credentials
- [ ] Cannot login with wrong password
- [ ] Cannot access /admin routes without login
- [ ] Redirects to login when token invalid
- [ ] Token expires after 24 hours

### Payment System
- [ ] Download shows for "completed" status
- [ ] Download shows message for "pending" status
- [ ] Download shows message for "failed" status
- [ ] No download shown without payment

## Troubleshooting 🔧

### If Login Still Shows Wrong Credentials
- [ ] Clear browser cache (Ctrl+Shift+Delete)
- [ ] Clear localStorage in browser console
- [ ] Verify email in admin_users table matches
- [ ] Check password was entered correctly
- [ ] Restart dev server

### If Admin Page Accessible Without Login
- [ ] Restart dev server (`npm run dev`)
- [ ] Clear browser cache
- [ ] Check middleware.ts exists in root
- [ ] Verify no TypeScript errors

### If Download Status Not Showing
- [ ] Check purchases table has records
- [ ] Verify email matches exactly
- [ ] Clear browser cache
- [ ] Check browser console for errors

## Next Steps 🚀

After setup is complete:

1. **Change Default Admin Password**
   ```
   Go to Supabase → admin_users table
   Update password_hash (use /api/admin/register endpoint)
   ```

2. **Create Additional Admin Users**
   - Use `/api/admin/register` endpoint
   - Each needs unique email
   - Use strong passwords

3. **Enable HTTPS**
   - Required for production
   - Ensures token security

4. **Implement Additional Features**
   - Password reset
   - Email verification
   - Admin activity logging
   - 2FA authentication

5. **Test in Production**
   - Deploy to production environment
   - Test all flows again
   - Monitor for issues

## Completion Status

```
✅ Dependencies installed
✅ Database table created
✅ Environment variables set
✅ First admin user created
✅ Login system working
✅ Routes protected
✅ Payment protection working
✅ Security verified
```

---

**You're all set! 🎉**

Your authentication system is now live and secure.

For questions, refer to:
- `COMPLETE_AUTH_GUIDE.md` - Complete reference
- `AUTH_FLOW_DIAGRAM.md` - Visual diagrams
- `QUICK_START_AUTH.md` - Quick commands
