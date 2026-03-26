const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

export async function POST(req: Request) {
  const { character, prompt, mode = 'post' } = await req.json();

  if (!character || !prompt) {
    return Response.json({ error: 'character and prompt are required' }, { status: 400 });
  }

  const systemPrompt = buildSystemPrompt(character, mode);

  const groqRes = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt },
      ],
      max_tokens: 256,
      stream: true,
    }),
  });

  if (!groqRes.ok || !groqRes.body) {
    const err = await groqRes.text().catch(() => 'Groq request failed');
    return Response.json({ error: err }, { status: groqRes.status });
  }

  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  const readable = new ReadableStream({
    async start(controller) {
      const reader = groqRes.body!.getReader();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || !trimmed.startsWith('data: ')) continue;
          const data = trimmed.slice(6);
          if (data === '[DONE]') break;

          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              controller.enqueue(encoder.encode(content));
            }
          } catch {
            // skip malformed chunks
          }
        }
      }

      controller.close();
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
You are posting on CharVerse, an anime social media platform.
${character.bio ? `Background: ${character.bio}` : ''}
${character.arc ? `Current arc: ${character.arc}` : ''}

Stay completely in character — personality, speech patterns, goals, and worldview.`;

  const modeInstructions: Record<string, string> = {
    post: `Write a social media post as ${character.name}. Keep it concise (1-3 sentences), authentic, and engaging. Do not use hashtags unless they feel natural to the character.`,
    reply: `Write a reply as ${character.name} to the given message. Stay in character and keep the response brief and natural. Do not use quotation marks. Do not start with the character's name.`,
    arc: `Write a story arc update or dramatic moment as ${character.name}. Can be longer and more narrative in style.`,
  };

  return `${base}\n\n${modeInstructions[mode] ?? modeInstructions.post}`;
}
