import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import {
  verifyToken,
  generateAccessToken,
  generateRefreshToken,
  getRefreshTokenExpiry,
} from '@/lib/auth';
import { User, Session } from '@/types/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { refreshToken } = body;

    if (!refreshToken) {
      return NextResponse.json(
        { error: 'Refresh token is required' },
        { status: 400 }
      );
    }

    // Verify the refresh token
    const payload = await verifyToken(refreshToken);

    if (!payload || payload.type !== 'refresh') {
      return NextResponse.json(
        { error: 'Invalid refresh token' },
        { status: 401 }
      );
    }

    // Check if session exists and is not expired
    const sessionResult = await query<Session>(
      `SELECT id, user_id, expires_at FROM sessions 
       WHERE refresh_token = $1 AND expires_at > NOW()`,
      [refreshToken]
    );

    if (sessionResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Session expired or not found' },
        { status: 401 }
      );
    }

    const session = sessionResult.rows[0];

    // Get user data
    const userResult = await query<User>(
      `SELECT id, email, username, wallet_address, created_at, updated_at, email_verified, is_active
       FROM users WHERE id = $1 AND is_active = true`,
      [session.user_id]
    );

    if (userResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'User not found or deactivated' },
        { status: 401 }
      );
    }

    const user = userResult.rows[0];

    // Generate new tokens
    const newAccessToken = await generateAccessToken(user.id, user.email);
    const newRefreshToken = await generateRefreshToken(user.id, user.email);

    // Update the session with new refresh token
    const userAgent = request.headers.get('user-agent') || null;
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 
               request.headers.get('x-real-ip') || 
               null;

    await query(
      `UPDATE sessions 
       SET refresh_token = $1, expires_at = $2, user_agent = $3, ip_address = $4
       WHERE id = $5`,
      [newRefreshToken, getRefreshTokenExpiry(), userAgent, ip, session.id]
    );

    return NextResponse.json({
      user,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    console.error('Token refresh error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
