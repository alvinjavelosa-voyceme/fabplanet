import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, requireCreator, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// GET /api/posts/character/:characterId
router.get('/character/:characterId', async (req, res) => {
  const { page = '1', limit = '20' } = req.query;
  const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

  const posts = await prisma.post.findMany({
    where: { characterId: req.params.characterId, publishedAt: { not: null } },
    include: {
      character: { select: { id: true, name: true, avatar: true, universe: true } },
      comments: { include: { user: { select: { id: true, username: true, avatar: true } } }, take: 3 },
      _count: { select: { comments: true, likes: true } }
    },
    orderBy: { publishedAt: 'desc' },
    skip,
    take: parseInt(limit as string)
  });

  return res.json(posts);
});

// POST /api/posts — create post (creator only)
router.post('/', authenticate, requireCreator, async (req: AuthRequest, res: Response) => {
  const { characterId, content, mediaUrl, tags, scheduledAt } = req.body;
  if (!characterId || !content) return res.status(400).json({ error: 'characterId and content are required' });

  const character = await prisma.character.findUnique({ where: { id: characterId } });
  if (!character) return res.status(404).json({ error: 'Character not found' });
  if (character.creatorId !== req.userId) return res.status(403).json({ error: 'Forbidden' });

  const post = await prisma.post.create({
    data: {
      characterId,
      content,
      mediaUrl,
      tags: tags || [],
      scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
      publishedAt: scheduledAt ? null : new Date()
    }
  });

  return res.status(201).json(post);
});

// POST /api/posts/:id/like
router.post('/:id/like', authenticate, async (req: AuthRequest, res: Response) => {
  const { id: postId } = req.params;

  const existing = await prisma.like.findUnique({
    where: { postId_userId: { postId, userId: req.userId! } }
  });

  if (existing) {
    await prisma.like.delete({ where: { id: existing.id } });
    await prisma.post.update({ where: { id: postId }, data: { likeCount: { decrement: 1 } } });
    return res.json({ liked: false });
  }

  await prisma.like.create({ data: { postId, userId: req.userId! } });
  await prisma.post.update({ where: { id: postId }, data: { likeCount: { increment: 1 } } });
  return res.json({ liked: true });
});

// POST /api/posts/:id/comment
router.post('/:id/comment', authenticate, async (req: AuthRequest, res: Response) => {
  const { content } = req.body;
  if (!content) return res.status(400).json({ error: 'Content is required' });

  const comment = await prisma.comment.create({
    data: { postId: req.params.id, userId: req.userId!, content },
    include: { user: { select: { id: true, username: true, avatar: true } } }
  });

  return res.status(201).json(comment);
});

export default router;
