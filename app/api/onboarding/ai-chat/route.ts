import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import {
  createAIConversation,
  updateAIConversation,
  getAIConversation,
  trackOnboardingEvent,
  updateOnboardingSession,
} from '@/lib/db/onboarding';
import { AIMessage, SuggestedChallenge, ChallengeType } from '@/types/onboarding';

// System prompt for the AI assistant
const SYSTEM_PROMPT = `You are a supportive and motivating coach helping users discover meaningful personal challenges. Your role is to:

1. Help users identify challenges that will genuinely improve their lives
2. Encourage starting with simple, behavioral challenges (like "maintain a skincare routine" or "drink 8 glasses of water daily")
3. Focus on consistency over intensity - small daily habits often create the biggest changes
4. Ask clarifying questions to understand their motivation and lifestyle
5. Suggest realistic timeframes and deposit amounts that feel meaningful but not overwhelming

Key principles:
- The best challenges are often mundane things we want to do consistently
- Behavioral challenges (doing something regularly) work better than outcome-based goals
- Start small - it's better to succeed at a 7-day challenge than fail at a 30-day one
- The deposit should feel significant enough to motivate, but not cause financial stress
- Encourage challenges that build positive habits rather than restrictive ones

When suggesting a challenge, structure your response to include:
- A clear, actionable title
- A specific description of what success looks like
- Recommended frequency and duration
- A suggested deposit amount (usually $25-100 for beginners)
- Why this particular challenge suits them

Be warm, encouraging, and realistic. Celebrate their decision to invest in themselves.`;

// Mock AI response for development (replace with actual AI API call)
async function generateAIResponse(
  messages: AIMessage[],
  userMessage: string
): Promise<{ content: string; suggestedChallenge?: SuggestedChallenge }> {
  // In production, this would call OpenAI, Anthropic, or another AI provider
  // For now, we provide intelligent mock responses based on keywords
  
  const lowerMessage = userMessage.toLowerCase();
  
  // Initial greeting
  if (messages.length <= 2) {
    return {
      content: `Welcome! I'm here to help you discover a challenge that will make a real difference in your life.

The most powerful challenges are often the simple ones - things we know we should do but struggle to stay consistent with. Things like maintaining a skincare routine, drinking enough water, or going for a daily walk.

What's something you've been meaning to do more consistently? Or is there a habit you'd like to build?`,
    };
  }

  // Detect challenge-related keywords
  if (lowerMessage.includes('skincare') || lowerMessage.includes('skin care')) {
    return {
      content: `A skincare routine is a perfect challenge! It's exactly the kind of daily habit that compounds over time - both for your skin and for building discipline.

Here's what I'd suggest for you:`,
      suggestedChallenge: {
        title: 'Daily Skincare Ritual',
        description: 'Complete your morning and evening skincare routine every day. This includes cleansing, moisturizing, and any treatments you use.',
        type: 'habit' as ChallengeType,
        suggestedFrequency: 'daily',
        suggestedDuration: 14,
        suggestedDeposit: 50,
        reasoning: 'Two weeks is enough to start seeing results and building the habit. A $50 deposit is meaningful without being overwhelming - think of it as investing in yourself.',
      },
    };
  }

  if (lowerMessage.includes('exercise') || lowerMessage.includes('workout') || lowerMessage.includes('gym')) {
    return {
      content: `Exercise is a great choice! But let's make sure we set you up for success. Many people set ambitious goals and then struggle to maintain them.

What if we started with something achievable?`,
      suggestedChallenge: {
        title: 'Daily Movement Practice',
        description: 'Get at least 20 minutes of intentional physical activity each day. This could be a walk, workout, yoga, or any movement that gets your heart rate up.',
        type: 'fitness' as ChallengeType,
        suggestedFrequency: 'daily',
        suggestedDuration: 7,
        suggestedDeposit: 25,
        reasoning: 'Starting with just 7 days and 20 minutes makes this achievable. Once you complete this, you can take on a bigger challenge!',
      },
    };
  }

  if (lowerMessage.includes('meditat') || lowerMessage.includes('mindful') || lowerMessage.includes('calm')) {
    return {
      content: `Meditation is one of the most impactful habits you can build. Even just 5-10 minutes a day can transform your mental clarity and stress levels.`,
      suggestedChallenge: {
        title: 'Daily Mindfulness Practice',
        description: 'Spend at least 10 minutes each day in meditation or mindfulness practice. Use an app like Headspace, Calm, or simply sit in quiet reflection.',
        type: 'wellness' as ChallengeType,
        suggestedFrequency: 'daily',
        suggestedDuration: 21,
        suggestedDeposit: 75,
        reasoning: '21 days is the classic habit-formation period. The $75 deposit shows you\'re serious about this investment in your mental wellbeing.',
      },
    };
  }

  if (lowerMessage.includes('read') || lowerMessage.includes('book') || lowerMessage.includes('learn')) {
    return {
      content: `Reading and learning expand your mind in ways nothing else can. Let's make it a consistent part of your routine.`,
      suggestedChallenge: {
        title: 'Daily Reading Habit',
        description: 'Read for at least 20 minutes every day. This can be books, quality long-form articles, or educational content related to your interests.',
        type: 'learning' as ChallengeType,
        suggestedFrequency: 'daily',
        suggestedDuration: 14,
        suggestedDeposit: 50,
        reasoning: 'Two weeks of daily reading will help you see how much you can accomplish. 20 minutes is achievable even on busy days.',
      },
    };
  }

  if (lowerMessage.includes('water') || lowerMessage.includes('hydrat')) {
    return {
      content: `Staying hydrated is such a foundational habit - it affects your energy, skin, focus, and overall health. Let's make it automatic!`,
      suggestedChallenge: {
        title: 'Hydration Hero',
        description: 'Drink at least 8 glasses (64oz) of water every day. Track your intake using a water bottle with measurements or a simple tally.',
        type: 'wellness' as ChallengeType,
        suggestedFrequency: 'daily',
        suggestedDuration: 7,
        suggestedDeposit: 25,
        reasoning: 'A week is enough to feel the difference proper hydration makes. The $25 deposit keeps it light while still meaningful.',
      },
    };
  }

  if (lowerMessage.includes('sleep') || lowerMessage.includes('bed') || lowerMessage.includes('rest')) {
    return {
      content: `Better sleep changes everything - your mood, productivity, health, and relationships all improve. This is a high-impact challenge!`,
      suggestedChallenge: {
        title: 'Consistent Sleep Schedule',
        description: 'Go to bed and wake up at the same time every day (within a 30-minute window). Aim for 7-8 hours of sleep.',
        type: 'wellness' as ChallengeType,
        suggestedFrequency: 'daily',
        suggestedDuration: 14,
        suggestedDeposit: 75,
        reasoning: 'Two weeks allows your body to adjust to the new rhythm. The $75 deposit reflects the significant impact this will have on your life.',
      },
    };
  }

  // Generic response for unrecognized input
  return {
    content: `That's interesting! Tell me more about what specifically you'd like to work on. 

Some questions to consider:
- Is this something you want to do daily, or a few times a week?
- What would success look like for you?
- What's been stopping you from doing this consistently before?

The more I understand your situation, the better I can help you design a challenge that actually works for you.`,
  };
}

// POST - Send message to AI
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
    const { sessionId, conversationId, message } = body as {
      sessionId: string;
      conversationId?: string;
      message: string;
    };

    if (!message?.trim()) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Get or create conversation
    let conversation;
    if (conversationId) {
      conversation = await getAIConversation(conversationId);
      if (!conversation) {
        return NextResponse.json(
          { error: 'Conversation not found' },
          { status: 404 }
        );
      }
    } else {
      conversation = await createAIConversation(payload.userId, sessionId);
    }

    // Add user message
    const userMessage: AIMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      role: 'user',
      content: message,
      timestamp: new Date(),
    };

    const messages = [...(conversation.messages || []), userMessage];

    // Track user message
    await trackOnboardingEvent(
      sessionId,
      payload.userId,
      'ai_message_sent',
      'ai-chat',
      { messageLength: message.length }
    );

    // Generate AI response
    const aiResponse = await generateAIResponse(messages, message);

    // Add AI message
    const assistantMessage: AIMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      role: 'assistant',
      content: aiResponse.content,
      timestamp: new Date(),
      suggestedChallenge: aiResponse.suggestedChallenge,
    };

    messages.push(assistantMessage);

    // Update suggested challenges if we have a new one
    const suggestedChallenges = conversation.suggested_challenges || [];
    if (aiResponse.suggestedChallenge) {
      suggestedChallenges.push(aiResponse.suggestedChallenge);
    }

    // Update conversation
    await updateAIConversation(conversation.id, {
      messages,
      suggested_challenges: suggestedChallenges,
    });

    // Update onboarding session with AI messages
    await updateOnboardingSession(sessionId, {
      ai_messages: messages,
    });

    // Track AI response
    await trackOnboardingEvent(
      sessionId,
      payload.userId,
      'ai_message_received',
      'ai-chat',
      { 
        hasSuggestion: !!aiResponse.suggestedChallenge,
        suggestionTitle: aiResponse.suggestedChallenge?.title,
      }
    );

    return NextResponse.json({
      conversationId: conversation.id,
      message: assistantMessage,
      suggestedChallenges,
    });
  } catch (error) {
    console.error('AI chat error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Select a suggested challenge
export async function PUT(request: NextRequest) {
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
    const { sessionId, conversationId, selectedChallenge } = body as {
      sessionId: string;
      conversationId: string;
      selectedChallenge: SuggestedChallenge;
    };

    if (!conversationId || !selectedChallenge) {
      return NextResponse.json(
        { error: 'Conversation ID and selected challenge are required' },
        { status: 400 }
      );
    }

    // Update conversation with selected challenge
    await updateAIConversation(conversationId, {
      selected_challenge: selectedChallenge,
    });

    // Update onboarding session with challenge draft
    await updateOnboardingSession(sessionId, {
      current_step: 'challenge-definition',
      steps_completed: ['terms', 'ai-chat'],
      challenge_draft: {
        title: selectedChallenge.title,
        description: selectedChallenge.description,
        type: selectedChallenge.type,
        frequency: selectedChallenge.suggestedFrequency,
        durationDays: selectedChallenge.suggestedDuration,
        depositAmount: selectedChallenge.suggestedDeposit,
        aiSuggested: true,
        aiConversationId: conversationId,
      },
    });

    // Track challenge selection
    await trackOnboardingEvent(
      sessionId,
      payload.userId,
      'challenge_selected',
      'ai-chat',
      { 
        challengeTitle: selectedChallenge.title,
        challengeType: selectedChallenge.type,
      }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Select challenge error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
