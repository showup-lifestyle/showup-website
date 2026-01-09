import { query, transaction } from './index';
import {
  OnboardingSession,
  OnboardingStep,
  ChallengeDraft,
  AIMessage,
  OnboardingAnalyticsEvent,
  AnalyticsEventType,
  AIConversation,
  SuggestedChallenge,
} from '@/types/onboarding';

// Onboarding Sessions

export async function createOnboardingSession(
  userId: string
): Promise<OnboardingSession> {
  const result = await query<OnboardingSession>(
    `INSERT INTO onboarding_sessions (user_id, current_step, steps_completed, challenge_draft, ai_messages)
     VALUES ($1, 'terms', '[]', '{}', '[]')
     RETURNING *`,
    [userId]
  );
  return result.rows[0];
}

export async function getOnboardingSession(
  sessionId: string
): Promise<OnboardingSession | null> {
  const result = await query<OnboardingSession>(
    `SELECT * FROM onboarding_sessions WHERE id = $1`,
    [sessionId]
  );
  return result.rows[0] || null;
}

export async function getActiveOnboardingSession(
  userId: string
): Promise<OnboardingSession | null> {
  const result = await query<OnboardingSession>(
    `SELECT * FROM onboarding_sessions 
     WHERE user_id = $1 AND completed_at IS NULL AND abandoned_at IS NULL
     ORDER BY created_at DESC LIMIT 1`,
    [userId]
  );
  return result.rows[0] || null;
}

export async function updateOnboardingSession(
  sessionId: string,
  updates: {
    current_step?: OnboardingStep;
    steps_completed?: OnboardingStep[];
    challenge_draft?: ChallengeDraft;
    ai_messages?: AIMessage[];
    completed_at?: Date;
    abandoned_at?: Date;
  }
): Promise<OnboardingSession | null> {
  const setClauses: string[] = [];
  const values: unknown[] = [];
  let paramIndex = 1;

  if (updates.current_step !== undefined) {
    setClauses.push(`current_step = $${paramIndex++}`);
    values.push(updates.current_step);
  }
  if (updates.steps_completed !== undefined) {
    setClauses.push(`steps_completed = $${paramIndex++}`);
    values.push(JSON.stringify(updates.steps_completed));
  }
  if (updates.challenge_draft !== undefined) {
    setClauses.push(`challenge_draft = $${paramIndex++}`);
    values.push(JSON.stringify(updates.challenge_draft));
  }
  if (updates.ai_messages !== undefined) {
    setClauses.push(`ai_messages = $${paramIndex++}`);
    values.push(JSON.stringify(updates.ai_messages));
  }
  if (updates.completed_at !== undefined) {
    setClauses.push(`completed_at = $${paramIndex++}`);
    values.push(updates.completed_at);
  }
  if (updates.abandoned_at !== undefined) {
    setClauses.push(`abandoned_at = $${paramIndex++}`);
    values.push(updates.abandoned_at);
  }

  if (setClauses.length === 0) return null;

  values.push(sessionId);
  const result = await query<OnboardingSession>(
    `UPDATE onboarding_sessions SET ${setClauses.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
    values
  );
  return result.rows[0] || null;
}

// Analytics Events

export async function trackOnboardingEvent(
  sessionId: string,
  userId: string,
  eventType: AnalyticsEventType,
  stepName?: OnboardingStep | null,
  eventData?: Record<string, unknown>,
  timeSpentSeconds?: number | null
): Promise<void> {
  await query(
    `INSERT INTO onboarding_analytics (session_id, user_id, event_type, step_name, event_data, time_spent_seconds)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [
      sessionId,
      userId,
      eventType,
      stepName || null,
      JSON.stringify(eventData || {}),
      timeSpentSeconds || null,
    ]
  );
}

export async function getOnboardingAnalytics(
  sessionId: string
): Promise<OnboardingAnalyticsEvent[]> {
  const result = await query<OnboardingAnalyticsEvent>(
    `SELECT * FROM onboarding_analytics WHERE session_id = $1 ORDER BY created_at ASC`,
    [sessionId]
  );
  return result.rows;
}

// AI Conversations

export async function createAIConversation(
  userId: string,
  onboardingSessionId?: string
): Promise<AIConversation> {
  const result = await query<AIConversation>(
    `INSERT INTO ai_conversations (user_id, onboarding_session_id, messages, suggested_challenges)
     VALUES ($1, $2, '[]', '[]')
     RETURNING *`,
    [userId, onboardingSessionId || null]
  );
  return result.rows[0];
}

export async function getAIConversation(
  conversationId: string
): Promise<AIConversation | null> {
  const result = await query<AIConversation>(
    `SELECT * FROM ai_conversations WHERE id = $1`,
    [conversationId]
  );
  return result.rows[0] || null;
}

export async function updateAIConversation(
  conversationId: string,
  updates: {
    messages?: AIMessage[];
    suggested_challenges?: SuggestedChallenge[];
    selected_challenge?: SuggestedChallenge | null;
    model_used?: string;
    total_tokens_used?: number;
  }
): Promise<AIConversation | null> {
  const setClauses: string[] = [];
  const values: unknown[] = [];
  let paramIndex = 1;

  if (updates.messages !== undefined) {
    setClauses.push(`messages = $${paramIndex++}`);
    values.push(JSON.stringify(updates.messages));
  }
  if (updates.suggested_challenges !== undefined) {
    setClauses.push(`suggested_challenges = $${paramIndex++}`);
    values.push(JSON.stringify(updates.suggested_challenges));
  }
  if (updates.selected_challenge !== undefined) {
    setClauses.push(`selected_challenge = $${paramIndex++}`);
    values.push(JSON.stringify(updates.selected_challenge));
  }
  if (updates.model_used !== undefined) {
    setClauses.push(`model_used = $${paramIndex++}`);
    values.push(updates.model_used);
  }
  if (updates.total_tokens_used !== undefined) {
    setClauses.push(`total_tokens_used = $${paramIndex++}`);
    values.push(updates.total_tokens_used);
  }

  if (setClauses.length === 0) return null;

  values.push(conversationId);
  const result = await query<AIConversation>(
    `UPDATE ai_conversations SET ${setClauses.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
    values
  );
  return result.rows[0] || null;
}

// User Terms Acceptance

export async function acceptTerms(userId: string): Promise<void> {
  await query(
    `UPDATE users SET terms_accepted_at = CURRENT_TIMESTAMP WHERE id = $1`,
    [userId]
  );
}

export async function hasAcceptedTerms(userId: string): Promise<boolean> {
  const result = await query<{ terms_accepted_at: Date | null }>(
    `SELECT terms_accepted_at FROM users WHERE id = $1`,
    [userId]
  );
  return result.rows[0]?.terms_accepted_at !== null;
}

export async function markOnboardingComplete(userId: string): Promise<void> {
  await query(
    `UPDATE users SET onboarding_completed_at = CURRENT_TIMESTAMP WHERE id = $1`,
    [userId]
  );
}

export async function hasCompletedOnboarding(userId: string): Promise<boolean> {
  const result = await query<{ onboarding_completed_at: Date | null }>(
    `SELECT onboarding_completed_at FROM users WHERE id = $1`,
    [userId]
  );
  return result.rows[0]?.onboarding_completed_at !== null;
}

// Complete onboarding and create challenge
export async function completeOnboardingWithChallenge(
  sessionId: string,
  userId: string,
  challengeData: {
    challenge_id: string;
    title: string;
    description: string;
    duration_days: number;
    amount_usd: number;
    user_email: string;
    guarantors: string[];
    challenge_type: string;
    resolution_method: string;
    frequency: string;
    frequency_details: Record<string, unknown>;
    notification_settings: Record<string, unknown>;
    deposit_recipient: string;
    linked_friend_email?: string;
    ai_conversation_id?: string;
    ai_suggested: boolean;
    metadata_uri?: string;
  }
): Promise<{ challengeId: string }> {
  return transaction(async (client) => {
    // Create the challenge
    const challengeResult = await client.query(
      `INSERT INTO challenges (
        challenge_id, title, description, duration_days, amount_usd, user_email, user_id,
        guarantors, challenge_type, resolution_method, frequency, frequency_details,
        notification_settings, deposit_recipient, linked_friend_email, ai_conversation_id,
        ai_suggested, metadata_uri, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, 'pending')
      RETURNING id`,
      [
        challengeData.challenge_id,
        challengeData.title,
        challengeData.description,
        challengeData.duration_days,
        challengeData.amount_usd,
        challengeData.user_email,
        userId,
        JSON.stringify(challengeData.guarantors),
        challengeData.challenge_type,
        challengeData.resolution_method,
        challengeData.frequency,
        JSON.stringify(challengeData.frequency_details),
        JSON.stringify(challengeData.notification_settings),
        challengeData.deposit_recipient,
        challengeData.linked_friend_email || null,
        challengeData.ai_conversation_id || null,
        challengeData.ai_suggested,
        challengeData.metadata_uri || null,
      ]
    );

    // Mark onboarding session as completed
    await client.query(
      `UPDATE onboarding_sessions SET completed_at = CURRENT_TIMESTAMP WHERE id = $1`,
      [sessionId]
    );

    // Mark user onboarding as complete
    await client.query(
      `UPDATE users SET onboarding_completed_at = CURRENT_TIMESTAMP WHERE id = $1`,
      [userId]
    );

    return { challengeId: challengeResult.rows[0].id };
  });
}

// Get onboarding metrics for analytics
export async function getOnboardingMetrics(
  startDate?: Date,
  endDate?: Date
): Promise<{
  totalSessions: number;
  completedSessions: number;
  abandonedSessions: number;
  averageTimeToComplete: number;
  stepDropoffRates: Record<OnboardingStep, number>;
  popularChallengeTypes: Array<{ type: string; count: number }>;
}> {
  const dateFilter = startDate && endDate 
    ? `AND created_at BETWEEN $1 AND $2` 
    : '';
  const params = startDate && endDate ? [startDate, endDate] : [];

  const totalResult = await query<{ count: string }>(
    `SELECT COUNT(*) as count FROM onboarding_sessions WHERE 1=1 ${dateFilter}`,
    params
  );

  const completedResult = await query<{ count: string }>(
    `SELECT COUNT(*) as count FROM onboarding_sessions WHERE completed_at IS NOT NULL ${dateFilter}`,
    params
  );

  const abandonedResult = await query<{ count: string }>(
    `SELECT COUNT(*) as count FROM onboarding_sessions WHERE abandoned_at IS NOT NULL ${dateFilter}`,
    params
  );

  const avgTimeResult = await query<{ avg_time: string }>(
    `SELECT AVG(EXTRACT(EPOCH FROM (completed_at - started_at))) as avg_time 
     FROM onboarding_sessions WHERE completed_at IS NOT NULL ${dateFilter}`,
    params
  );

  // Step dropoff analysis
  const dropoffResult = await query<{ step_name: OnboardingStep; count: string }>(
    `SELECT step_name, COUNT(*) as count 
     FROM onboarding_analytics 
     WHERE event_type = 'step_started' ${dateFilter.replace('created_at', 'onboarding_analytics.created_at')}
     GROUP BY step_name`,
    params
  );

  const stepDropoffRates: Record<OnboardingStep, number> = {} as Record<OnboardingStep, number>;
  dropoffResult.rows.forEach(row => {
    stepDropoffRates[row.step_name] = parseInt(row.count);
  });

  // Popular challenge types
  const challengeTypesResult = await query<{ challenge_type: string; count: string }>(
    `SELECT challenge_type, COUNT(*) as count 
     FROM challenges 
     WHERE challenge_type IS NOT NULL ${dateFilter}
     GROUP BY challenge_type 
     ORDER BY count DESC 
     LIMIT 10`,
    params
  );

  return {
    totalSessions: parseInt(totalResult.rows[0]?.count || '0'),
    completedSessions: parseInt(completedResult.rows[0]?.count || '0'),
    abandonedSessions: parseInt(abandonedResult.rows[0]?.count || '0'),
    averageTimeToComplete: parseFloat(avgTimeResult.rows[0]?.avg_time || '0'),
    stepDropoffRates,
    popularChallengeTypes: challengeTypesResult.rows.map(row => ({
      type: row.challenge_type,
      count: parseInt(row.count),
    })),
  };
}
