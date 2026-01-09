import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import {
  verifyPassword,
  generateAccessToken,
  generateRefreshToken,
  getRefreshTokenExpiry,
} from '@/lib/auth';
import { UserWithPassword, LoginRequest, AuthResponse, User } from '@/types/auth';

export async function POST(request: NextRequest) {
  try {
    const body: LoginRequest = await request.json();
    const { email, password } = body;

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find user by email
    const result = await query<UserWithPassword>(
      `SELECT id, email, password_hash, username, wallet_address, 
              created_at, updated_at, email_verified, is_active
       FROM users WHERE email = $1`,
      [email.toLowerCase()]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const userWithPassword = result.rows[0];

    // Check if account is active
    if (!userWithPassword.is_active) {
      return NextResponse.json(
        { error: 'Account is deactivated' },
        { status: 403 }
      );
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, userWithPassword.password_hash);

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Generate tokens
    const accessToken = await generateAccessToken(userWithPassword.id, userWithPassword.email);
    const refreshToken = await generateRefreshToken(userWithPassword.id, userWithPassword.email);

    // Store refresh token in sessions
    const userAgent = request.headers.get('user-agent') || null;
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 
               request.headers.get('x-real-ip') || 
               null;

    await query(
      `INSERT INTO sessions (user_id, refresh_token, expires_at, user_agent, ip_address)
       VALUES ($1, $2, $3, $4, $5)`,
      [userWithPassword.id, refreshToken, getRefreshTokenExpiry(), userAgent, ip]
    );

    // Remove password_hash from response
    const user: User = {
      id: userWithPassword.id,
      email: userWithPassword.email,
      username: userWithPassword.username,
      wallet_address: userWithPassword.wallet_address,
      created_at: userWithPassword.created_at,
      updated_at: userWithPassword.updated_at,
      email_verified: userWithPassword.email_verified,
      is_active: userWithPassword.is_active,
    };

    const response: AuthResponse = {
      user,
      accessToken,
      refreshToken,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
