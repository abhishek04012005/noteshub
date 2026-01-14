# Authentication & Authorization Flow Diagram

## Admin Login Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    ADMIN LOGIN PROCESS                          │
└─────────────────────────────────────────────────────────────────┘

1. User visits /admin/login
   │
   ├─→ Check localStorage for adminToken
   │   └─→ If exists → Redirect to /admin/dashboard
   │
   └─→ Show login form

2. User enters email & password, clicks "Login"
   │
   ├─→ POST /api/admin/login
   │   │
   │   ├─→ Fetch admin_users table by email
   │   │   └─→ User not found? Return "Invalid credentials"
   │   │
   │   ├─→ Compare password with bcryptjs
   │   │   └─→ Password mismatch? Return "Invalid credentials"
   │   │
   │   └─→ Create JWT token (24h expiration)
   │       └─→ Return: { token, adminId, email }
   │
   ├─→ Store in localStorage:
   │   ├─ adminToken
   │   ├─ adminId
   │   └─ adminEmail
   │
   └─→ Redirect to /admin/dashboard ✅

```

## Protected Admin Routes Flow

```
┌─────────────────────────────────────────────────────────────────┐
│              MIDDLEWARE PROTECTION FLOW                          │
└─────────────────────────────────────────────────────────────────┘

User requests /admin/dashboard
   │
   ├─→ middleware.ts intercepts request
   │   │
   │   ├─→ Is path /admin/login? → Allow access
   │   │
   │   └─→ Is path /admin/* ? → Check token
   │       │
   │       ├─→ No token found? 
   │       │   └─→ Redirect to /admin/login ❌
   │       │
   │       ├─→ Token exists?
   │       │   │
   │       │   ├─→ Verify JWT signature
   │       │   │   │
   │       │   │   ├─→ Invalid? → Redirect to /admin/login ❌
   │       │   │   │
   │       │   │   └─→ Expired? → Redirect to /admin/login ❌
   │       │   │
   │       │   └─→ Valid & not expired → Allow access ✅
   │
   └─→ Load page /admin/dashboard

Protected Routes:
  ✓ /admin/dashboard
  ✓ /admin/dashboard/upload
  ✓ /admin/dashboard/edit/[id]
  ✓ /admin/dashboard/sales
  ✗ /admin/login (no protection, always accessible)

```

## Download Page - Payment Protection Flow

```
┌─────────────────────────────────────────────────────────────────┐
│           DOWNLOAD PAGE PAYMENT VERIFICATION                    │
└─────────────────────────────────────────────────────────────────┘

User visits /student/download?email=user@example.com
   │
   ├─→ Check if email parameter exists
   │   └─→ No email? → Show "Invalid Request" ❌
   │
   ├─→ Fetch GET /api/purchases?email=user@example.com
   │   │
   │   ├─→ No purchases found?
   │   │   └─→ Show "Payment Pending" ⏳
   │   │
   │   ├─→ Purchase found!
   │   │   │
   │   │   ├─→ status === "completed"?
   │   │   │   └─→ Show download button ✅
   │   │   │       └─→ User can download file
   │   │   │
   │   │   ├─→ status === "pending"?
   │   │   │   └─→ Show "Payment Pending" ⏳
   │   │   │       └─→ No download access
   │   │   │
   │   │   └─→ status === "failed"?
   │   │       └─→ Show "Payment Failed" ❌
   │   │           └─→ No download access
   │   │
   │   └─→ Error fetching purchases?
   │       └─→ Show "Payment Failed" ❌

Payment Status States:
  ✅ "completed" → Full access to download
  ⏳ "pending"   → Waiting for payment confirmation
  ❌ "failed"    → Payment unsuccessful, try again
  ❌ none        → No purchase history found

```

## Admin Registration Flow (For Setup)

```
┌─────────────────────────────────────────────────────────────────┐
│                  ADMIN REGISTRATION (ONE-TIME)                  │
└─────────────────────────────────────────────────────────────────┘

Setup: Create First Admin User

curl -X POST /api/admin/register \
  -d '{
    "email": "admin@example.com",
    "password": "SecurePass123",
    "adminSecret": "YOUR_ADMIN_SECRET"
  }'
   │
   ├─→ Verify adminSecret matches ENV variable
   │   └─→ Wrong secret? → Return 403 Unauthorized ❌
   │
   ├─→ Check if email already exists
   │   └─→ Email exists? → Return "User already exists" ❌
   │
   ├─→ Hash password with bcryptjs (10 salt rounds)
   │   │
   │   └─→ Create password_hash: $2a$10$...
   │
   ├─→ Insert into admin_users table
   │   │
   │   └─→ INSERT {
   │       email: "admin@example.com",
   │       password_hash: "$2a$10$...",
   │       created_at: now()
   │     }
   │
   └─→ Return success ✅

After Registration:
  User can now login with:
    Email: admin@example.com
    Password: SecurePass123

```

## Token Structure

```
JWT Token Format:
┌────────────────────────────────────────────────────────────────┐
│ Header.Payload.Signature                                       │
└────────────────────────────────────────────────────────────────┘

Header (Base64):
{
  "alg": "HS256",
  "typ": "JWT"
}

Payload (Base64):
{
  "adminId": "550e8400-e29b-41d4-a716-446655440000",
  "email": "admin@example.com",
  "iat": 1705000000000,
  "exp": 1705086400000  ← 24 hours from now
}

Signature:
HMACSHA256(
  base64UrlEncode(header) + "." + base64UrlEncode(payload),
  "JWT_SECRET"
)

Token Expiration:
├─ 24 hours from login
└─ User must login again after expiration
```

## Database Schema

```
admin_users Table:
┌────────────────────────────────────────────────────────────────┐
│ id         │ UUID (Primary Key)                                 │
├────────────────────────────────────────────────────────────────┤
│ email      │ VARCHAR(255) - UNIQUE                              │
├────────────────────────────────────────────────────────────────┤
│ password_  │ VARCHAR(255) - Hashed with bcryptjs               │
│ hash       │ Example: $2a$10$XxNf1Jq8Hx...                      │
├────────────────────────────────────────────────────────────────┤
│ created_at │ TIMESTAMP - When user was created                  │
├────────────────────────────────────────────────────────────────┤
│ updated_at │ TIMESTAMP - Last update time                       │
└────────────────────────────────────────────────────────────────┘

purchases Table (Existing):
┌────────────────────────────────────────────────────────────────┐
│ id              │ UUID                                           │
├────────────────────────────────────────────────────────────────┤
│ notes_id        │ Foreign Key to notes                           │
├────────────────────────────────────────────────────────────────┤
│ customer_email  │ VARCHAR - Email of buyer                       │
├────────────────────────────────────────────────────────────────┤
│ status          │ "completed" | "pending" | "failed"             │
├────────────────────────────────────────────────────────────────┤
│ download_url    │ VARCHAR - Link to download file                │
├────────────────────────────────────────────────────────────────┤
│ created_at      │ TIMESTAMP                                      │
└────────────────────────────────────────────────────────────────┘
```

## Security Summary

```
Authentication Layers:
┌──────────────────────────────────────────────────────────────┐
│ 1. Password Hashing        → bcryptjs (10 salt rounds)        │
│    Input: plain password   → Output: $2a$10$...              │
│                                                                │
│ 2. Token Generation        → JWT (HMACSHA256)                 │
│    Expires in 24 hours     → Automatic re-login required      │
│                                                                │
│ 3. Middleware Protection   → Next.js middleware               │
│    Validates token         → Blocks unauthorized requests     │
│                                                                │
│ 4. Payment Verification    → Status check before download     │
│    Only "completed" → Download link shown                     │
│    "pending" → Waiting message shown                          │
│    "failed" → Error message shown                             │
└──────────────────────────────────────────────────────────────┘
```

## Environment Variables Needed

```
.env.local:
┌──────────────────────────────────────────────────────────────┐
│ JWT_SECRET=your-super-secret-key-for-tokens                 │
│   → Used to sign and verify JWT tokens                       │
│   → Change to random 32+ character string                    │
│                                                                │
│ ADMIN_SECRET_KEY=your-admin-registration-secret              │
│   → Used when creating new admin users                       │
│   → Prevents unauthorized admin registration                 │
│   → Change to random 32+ character string                    │
│                                                                │
│ NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co            │
│   → Supabase project URL (already set)                       │
│                                                                │
│ NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...                        │
│   → Supabase anonymous key (already set)                     │
│                                                                │
│ SUPABASE_SERVICE_ROLE_KEY=eyJ...                            │
│   → Supabase service role key (already set)                  │
└──────────────────────────────────────────────────────────────┘
```
