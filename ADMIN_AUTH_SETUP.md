# Admin Authentication Setup Guide

## Step 1: Create Database Table in Supabase

Run this SQL in your Supabase SQL Editor to create the `admin_users` table:

```sql
-- Create admin_users table
CREATE TABLE admin_users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add indexes for faster queries
CREATE INDEX idx_admin_users_email ON admin_users(email);

-- Enable Row Level Security
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Create policy to allow admins to read their own data
CREATE POLICY "Admins can read their own data" ON admin_users
  FOR SELECT USING (auth.uid()::text = id::text);
```

## Step 2: Install Required Dependencies

```bash
npm install bcryptjs jsonwebtoken
npm install --save-dev @types/bcryptjs @types/jsonwebtoken
```

## Step 3: Set Environment Variables

Add these to your `.env.local`:

```
# JWT Secret for token signing
JWT_SECRET=your-super-secret-jwt-key-change-this

# Admin secret for registration (use this when creating the first admin)
ADMIN_SECRET_KEY=your-admin-secret-key-change-this

# Existing Supabase variables (should already be set)
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Step 4: Create Your First Admin User

Run this curl command or use an API tool like Postman:

```bash
curl -X POST http://localhost:3000/api/admin/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "your-secure-password",
    "adminSecret": "your-admin-secret-key-change-this"
  }'
```

Replace:
- `admin@example.com` with your admin email
- `your-secure-password` with a strong password
- `your-admin-secret-key-change-this` with the value from `ADMIN_SECRET_KEY` in `.env.local`

## Step 5: Login to Admin Dashboard

1. Go to `/admin/login`
2. Enter your email and password
3. You'll be redirected to `/admin/dashboard`

## Features Implemented

✅ **Admin Authentication**
- Secure password hashing with bcryptjs
- JWT token-based authentication
- 24-hour token expiration

✅ **Protected Routes**
- Middleware blocks access to `/admin/*` routes without valid token
- Automatic redirect to login page for unauthorized access

✅ **Payment Verification**
- Download page checks payment status
- Only shows download links for completed payments
- Shows appropriate status messages for pending/failed payments

## Token Storage

Tokens are stored in `localStorage`:
- `adminToken`: JWT token for API requests
- `adminEmail`: Admin email address
- `adminId`: Admin user ID

## API Endpoints

### Login
```
POST /api/admin/login
Body: { email: string, password: string }
```

### Register (Admin Only)
```
POST /api/admin/register
Body: { email: string, password: string, adminSecret: string }
```

## Security Best Practices

1. **Change default secrets**: Update `JWT_SECRET` and `ADMIN_SECRET_KEY` in `.env.local`
2. **Use HTTPS**: Always use HTTPS in production
3. **Secure passwords**: Enforce strong passwords for admin accounts
4. **Token rotation**: Consider implementing token refresh mechanism
5. **Audit logs**: Log all admin activities for security monitoring

## Troubleshooting

### "Module not found: Can't resolve 'bcryptjs'"
```bash
npm install bcryptjs
npm install --save-dev @types/bcryptjs
```

### "Module not found: Can't resolve 'jsonwebtoken'"
```bash
npm install jsonwebtoken
npm install --save-dev @types/jsonwebtoken
```

### Login page shows "Invalid email or password"
- Ensure admin user exists in `admin_users` table
- Verify password is correct
- Check that table was created with correct SQL

### Admin page still accessible without login
- Ensure middleware.ts is in the root project directory
- Restart the development server after creating middleware
- Clear browser cache and localStorage
