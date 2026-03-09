import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: Request) {
  const { character, prompt, mode = 'post' } = await req.json();

  if (!character || !prompt) {
    return Response.json({ error: 'character and prompt are required' }, { status: 400 });
  }

  const systemPrompt = buildSystemPrompt(character, mode);

  const stream = client.messages.stream({
    model: 'claude-opus-4-6',
    max_tokens: 1024,
    thinking: { type: 'adaptive' },
    system: systemPrompt,
    messages: [{ role: 'user', content: prompt }],
  });

  const encoder = new TextEncoder();

  const readable = new ReadableStream({
    async start(controller) {
      for await (const event of stream) {
        if (
          event.type === 'content_block_delta' &&
          event.delta.type === 'text_delta'
        ) {
          controller.enqueue(encoder.encode(event.delta.text));
        }
      }
      controller.close();
    },
    cancel() {
      stream.controller.abort();
    },
  });

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Transfer-Encoding': 'chunked',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}

function buildSystemPrompt(
  character: { name: string; universe?: string; bio?: string; arc?: string },
  mode: 'post' | 'reply' | 'arc'
) {
  const base = `You are ${character.name}${character.universe ? ` from ${character.universe}` : ''}.
${character.bio ? `Background: ${character.bio}` : ''}
${character.arc ? `Current arc: ${character.arc}` : ''}

Stay in character at all times. Write authentically using the character's voice, vocabulary, and personality.`;

  const modeInstructions: Record<string, string> = {
    post: `Write a social media post as ${character.name}. Keep it concise (1-3 sentences), authentic, and engaging. Do not use hashtags unless they feel natural to the character.`,
    reply: `Write a reply as ${character.name} to the given message. Stay in character and keep the response brief and natural.`,
    arc: `Write a story arc update or dramatic moment as ${character.name}. Can be longer and more narrative in style.`,
  };

  return `${base}\n\n${modeInstructions[mode] ?? modeInstructions.post}`;
}
