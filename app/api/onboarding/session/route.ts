import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import {
  createOnboardingSession,
  getActiveOnboardingSession,
  updateOnboardingSession,
  trackOnboardingEvent,
  hasAcceptedTerms,
} from '@/lib/db/onboarding';
import { OnboardingStep, ChallengeDraft, AIMessage } from '@/types/onboarding';

// GET - Get or create active onboarding session
export async function GET(request: NextRequest) {
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

    // Check for existing active session
    let session = await getActiveOnboardingSession(payload.userId);
    
    if (!session) {
      // Create new session
      session = await createOnboardingSession(payload.userId);
      
      // Track session started
      await trackOnboardingEvent(
        session.id,
        payload.userId,
        'session_started',
        'terms'
      );
    }

    // Check if user has already accepted terms
    const termsAccepted = await hasAcceptedTerms(payload.userId);

    return NextResponse.json({
      session,
      termsAccepted,
    });
  } catch (error) {
    console.error('Get onboarding session error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH - Update onboarding session
export async function PATCH(request: NextRequest) {
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
    const {
      sessionId,
      currentStep,
      stepsCompleted,
      challengeDraft,
      aiMessages,
      timeSpentSeconds,
    } = body as {
      sessionId: string;
      currentStep?: OnboardingStep;
      stepsCompleted?: OnboardingStep[];
      challengeDraft?: ChallengeDraft;
      aiMessages?: AIMessage[];
      timeSpentSeconds?: number;
    };

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    const updates: Record<string, unknown> = {};
    
    if (currentStep) {
      updates.current_step = currentStep;
      
      // Track step change
      await trackOnboardingEvent(
        sessionId,
        payload.userId,
        'step_started',
        currentStep,
        { previousTimeSpent: timeSpentSeconds }
      );
    }
    
    if (stepsCompleted) {
      updates.steps_completed = stepsCompleted;
    }
    
    if (challengeDraft) {
      updates.challenge_draft = challengeDraft;
    }
    
    if (aiMessages) {
      updates.ai_messages = aiMessages;
    }

    const session = await updateOnboardingSession(sessionId, updates);

    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ session });
  } catch (error) {
    console.error('Update onboarding session error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
