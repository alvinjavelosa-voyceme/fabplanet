const HASURA_URL = process.env.HASURA_GRAPHQL_URL || 'https://dev-graphql.voyce.me/v1/graphql/';
const HASURA_SECRET = process.env.HASURA_SECRET || '';

const QUERY = `
  query ChatbotsUserFables {
    storypack_chatbots(
      where: { is_active: { _eq: true } }
      order_by: { updated_at: desc }
      limit: 20
    ) {
      id
      slug
      image
      title
      description
      tags { tag { id, title } }
      plays_count { plays_count }
      likes_count { likes_count }
      created_at
    }
  }
`;

export async function GET() {
  if (!HASURA_SECRET) {
    return Response.json({ error: 'HASURA_SECRET not configured' }, { status: 500 });
  }

  const res = await fetch(HASURA_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-hasura-admin-secret': HASURA_SECRET,
    },
    body: JSON.stringify({ query: QUERY }),
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    return Response.json({ error: 'Failed to fetch chatbots' }, { status: res.status });
  }

  const json = await res.json();
  const chatbots = json.data?.storypack_chatbots || [];

  const CDN_URL = process.env.NEXT_PUBLIC_CDN_URL || 'https://dlkfxmdtxtzpb.cloudfront.net';

  const mapped = chatbots.map((bot: {
    id: number;
    slug: string;
    image: string;
    title: string;
    description: string | null;
    tags: { tag: { id: number; title: string } }[];
    plays_count: { plays_count: number } | null;
    likes_count: { likes_count: number } | null;
    created_at: string;
  }) => ({
    id: `fv-${bot.id}`,
    slug: bot.slug,
    name: bot.title,
    avatar: bot.image ? `${CDN_URL}/${bot.image}` : null,
    description: bot.description || '',
    tags: bot.tags.map((t) => t.tag.title),
    playsCount: bot.plays_count?.plays_count || 0,
    likesCount: bot.likes_count?.likes_count || 0,
    createdAt: bot.created_at,
  }));

  return Response.json({ chatbots: mapped });
}
