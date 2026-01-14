import { supabase, supabaseAdmin } from './supabase';
import bcrypt from 'bcryptjs';

// Register a new admin user (call from a secure endpoint)
export async function registerAdmin(email: string, password: string) {
  try {
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert into admin_users table
    const { data, error } = await supabaseAdmin
      .from('admin_users')
      .insert([
        {
          email,
          password_hash: hashedPassword,
          created_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) {
      throw new Error(error.message);
    }

    return { success: true, data };
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
}

// Verify admin login credentials
export async function verifyAdminLogin(email: string, password: string) {
  try {
    // Fetch admin user
    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !data) {
      return { success: false, message: 'Invalid email or password' };
    }

    // Compare password with hash
    const passwordMatch = await bcrypt.compare(password, data.password_hash);

    if (!passwordMatch) {
      return { success: false, message: 'Invalid email or password' };
    }

    // Return user data (without password)
    return {
      success: true,
      user: {
        id: data.id,
        email: data.email,
      },
    };
  } catch (error) {
    console.error('Login verification error:', error);
    return { success: false, message: 'Authentication failed' };
  }
}

// Create a JWT token for admin session (simplified - use proper JWT library in production)
export function createAdminToken(adminId: string, email: string): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(
    JSON.stringify({
      adminId,
      email,
      iat: Date.now(),
      exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    })
  );
  const signature = btoa(adminId + email + process.env.JWT_SECRET);
  return `${header}.${payload}.${signature}`;
}

// Verify admin token
export function verifyAdminToken(token: string): {
  valid: boolean;
  adminId?: string;
  email?: string;
} {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return { valid: false };
    }

    const payload = JSON.parse(atob(parts[1]));
    if (payload.exp < Date.now()) {
      return { valid: false };
    }

    return {
      valid: true,
      adminId: payload.adminId,
      email: payload.email,
    };
  } catch (error) {
    console.error('Token verification error:', error);
    return { valid: false };
  }
}
