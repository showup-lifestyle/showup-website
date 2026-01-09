import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { acceptTerms, trackOnboardingEvent, getActiveOnboardingSession, updateOnboardingSession } from '@/lib/db/onboarding';

// POST - Accept terms and conditions
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
    const { sessionId, termsVersion } = body as {
      sessionId: string;
      termsVersion?: string;
    };

    // Accept terms
    await acceptTerms(payload.userId);

    // Track terms acceptance
    if (sessionId) {
      await trackOnboardingEvent(
        sessionId,
        payload.userId,
        'terms_accepted',
        'terms',
        { termsVersion: termsVersion || '1.0' }
      );

      // Update session to move to next step
      const session = await getActiveOnboardingSession(payload.userId);
      if (session) {
        await updateOnboardingSession(sessionId, {
          current_step: 'ai-chat',
          steps_completed: ['terms'],
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Accept terms error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
