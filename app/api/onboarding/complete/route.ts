import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { query } from '@/lib/db';
import {
  completeOnboardingWithChallenge,
  trackOnboardingEvent,
  getOnboardingSession,
} from '@/lib/db/onboarding';
import { ChallengeDraft } from '@/types/onboarding';

// POST - Complete onboarding and create challenge (prepare for payment)
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const payload = await verifyToken(token);
    if (!payload || payload.type !== 'access') {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const body = await request.json();
    const { sessionId, challengeDraft } = body as {
      sessionId: string;
      challengeDraft: ChallengeDraft;
    };

    if (!sessionId || !challengeDraft) {
      return NextResponse.json(
        { error: 'Session ID and challenge draft are required' },
        { status: 400 }
      );
    }

    // Validate required fields
    if (!challengeDraft.title || !challengeDraft.description) {
      return NextResponse.json(
        { error: 'Challenge title and description are required' },
        { status: 400 }
      );
    }

    if (!challengeDraft.depositAmount || challengeDraft.depositAmount < 1) {
      return NextResponse.json(
        { error: 'A valid deposit amount is required' },
        { status: 400 }
      );
    }

    if (!challengeDraft.guarantors || challengeDraft.guarantors.length === 0) {
      return NextResponse.json(
        { error: 'At least one guarantor is required' },
        { status: 400 }
      );
    }

    // Get session to verify it belongs to user
    const session = await getOnboardingSession(sessionId);
    if (!session || session.user_id !== payload.userId) {
      return NextResponse.json(
        { error: 'Invalid session' },
        { status: 403 }
      );
    }

    // Get user email
    const userResult = await query<{ email: string }>(
      'SELECT email FROM users WHERE id = $1',
      [payload.userId]
    );
    
    if (userResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const userEmail = userResult.rows[0].email;

    // Generate unique challenge ID
    const challengeId = `challenge_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    // Create the challenge (pending payment)
    const result = await completeOnboardingWithChallenge(
      sessionId,
      payload.userId,
      {
        challenge_id: challengeId,
        title: challengeDraft.title,
        description: challengeDraft.description,
        duration_days: challengeDraft.durationDays || 14,
        amount_usd: challengeDraft.depositAmount,
        user_email: userEmail,
        guarantors: challengeDraft.guarantors,
        challenge_type: challengeDraft.type || 'custom',
        resolution_method: challengeDraft.resolutionMethod || '',
        frequency: challengeDraft.frequency || 'daily',
        frequency_details: challengeDraft.frequencyDetails ? JSON.parse(JSON.stringify(challengeDraft.frequencyDetails)) : {},
        notification_settings: challengeDraft.notificationSettings ? JSON.parse(JSON.stringify(challengeDraft.notificationSettings)) : {},
        deposit_recipient: challengeDraft.depositRecipient || 'platform',
        linked_friend_email: challengeDraft.linkedFriendEmail,
        ai_conversation_id: challengeDraft.aiConversationId,
        ai_suggested: challengeDraft.aiSuggested || false,
      }
    );

    // Track completion
    await trackOnboardingEvent(
      sessionId,
      payload.userId,
      'session_completed',
      'sharing',
      {
        challengeId,
        challengeTitle: challengeDraft.title,
        depositAmount: challengeDraft.depositAmount,
        guarantorCount: challengeDraft.guarantors.length,
      }
    );

    return NextResponse.json({
      success: true,
      challengeId,
      // Return data needed for Stripe checkout
      checkoutData: {
        challengeId,
        amount: challengeDraft.depositAmount,
        title: challengeDraft.title,
        duration: challengeDraft.durationDays || 14,
        guarantors: challengeDraft.guarantors,
      },
    });
  } catch (error) {
    console.error('Complete onboarding error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
