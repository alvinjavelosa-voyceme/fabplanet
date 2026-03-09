import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// GET /api/feed — personalized feed for logged-in reader
router.get('/', authenticate, async (req: AuthRequest, res) => {
  const { page = '1', limit = '20' } = req.query;
  const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

  // Get characters the user follows
  const follows = await prisma.follow.findMany({
    where: { followerId: req.userId! },
    select: { characterId: true }
  });

  const characterIds = follows.map(f => f.characterId);

  if (characterIds.length === 0) {
    // No follows yet — return trending posts
    const trending = await prisma.post.findMany({
      where: { publishedAt: { not: null } },
      include: { character: { select: { id: true, name: true, avatar: true, universe: true } } },
      orderBy: { likeCount: 'desc' },
      take: parseInt(limit as string)
    });
    return res.json({ posts: trending, isEmpty: true });
  }

  const posts = await prisma.post.findMany({
    where: { characterId: { in: characterIds }, publishedAt: { not: null } },
    include: {
      character: { select: { id: true, name: true, avatar: true, universe: true } },
      _count: { select: { comments: true, likes: true } }
    },
    orderBy: { publishedAt: 'desc' },
    skip,
    take: parseInt(limit as string)
  });

  return res.json({ posts, isEmpty: false });
});

// GET /api/feed/explore — trending + discovery
router.get('/explore', async (req, res) => {
  const { page = '1', limit = '20' } = req.query;
  const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

  const posts = await prisma.post.findMany({
    where: { publishedAt: { not: null } },
    include: { character: { select: { id: true, name: true, avatar: true, universe: true } } },
    orderBy: [{ likeCount: 'desc' }, { publishedAt: 'desc' }],
    skip,
    take: parseInt(limit as string)
  });

  return res.json(posts);
});

export default router;
