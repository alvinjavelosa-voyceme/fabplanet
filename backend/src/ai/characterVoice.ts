/**
 * CharVerse AI — Character Voice Service
 * Generates posts and replies in a character's voice using OpenAI GPT-4o.
 * Posts are suggested to the creator for approval before publishing.
 */

interface CharacterPersonality {
  name: string;
  universe?: string;
  bio?: string;
  traits?: string[];      // e.g. ["brave", "sarcastic", "loyal"]
  speechPatterns?: string; // e.g. "speaks in short sentences, uses archaic words"
  relationships?: string;  // e.g. "best friends with Aria, rivals with Dax"
}

interface PostSuggestion {
  content: string;
  tags: string[];
  confidence: number;
}

export async function generateCharacterPost(
  personality: CharacterPersonality,
  context?: string  // optional: "recent story events", "seasonal theme", etc.
): Promise<PostSuggestion> {
  const systemPrompt = buildSystemPrompt(personality);
  const userPrompt = context
    ? `Write a social media post for this character based on: ${context}`
    : `Write a casual in-character social media post. Make it feel natural and authentic.`;

  // TODO: Replace with actual OpenAI API call when API key is configured
  // const response = await openai.chat.completions.create({
  //   model: 'gpt-4o',
  //   messages: [
  //     { role: 'system', content: systemPrompt },
  //     { role: 'user', content: userPrompt }
  //   ],
  //   temperature: 0.8,
  //   max_tokens: 280
  // });

  // Placeholder response until OpenAI is wired up
  return {
    content: `[AI suggestion for ${personality.name} — connect OpenAI API to activate]`,
    tags: [personality.universe || 'charverse'].filter(Boolean),
    confidence: 0.0
  };
}

export async function generateCharacterReply(
  personality: CharacterPersonality,
  originalPost: string,
  fanComment: string
): Promise<string> {
  // Generate an in-character reply to a fan comment
  const systemPrompt = buildSystemPrompt(personality);
  const userPrompt = `
Original post: "${originalPost}"
Fan commented: "${fanComment}"
Reply in character. Keep it short (1-2 sentences). Stay authentic to the character.
`;

  // TODO: Wire OpenAI API
  return `[AI reply from ${personality.name} — connect OpenAI API to activate]`;
}

function buildSystemPrompt(personality: CharacterPersonality): string {
  return `You are ${personality.name}, a fictional character${personality.universe ? ` from ${personality.universe}` : ''}.
${personality.bio ? `About you: ${personality.bio}` : ''}
${personality.traits?.length ? `Your personality traits: ${personality.traits.join(', ')}` : ''}
${personality.speechPatterns ? `How you speak: ${personality.speechPatterns}` : ''}
${personality.relationships ? `Your relationships: ${personality.relationships}` : ''}

IMPORTANT RULES:
- Always stay in character. Never break the fourth wall.
- Write as if posting on social media — conversational, authentic, brief.
- Do NOT reference being an AI, a fictional character, or being in a story.
- Maximum 280 characters for posts.`;
}
