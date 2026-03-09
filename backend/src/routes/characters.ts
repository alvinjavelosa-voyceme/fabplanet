import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, requireCreator, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// GET /api/characters — list all (with search/filter)
router.get('/', async (req, res) => {
  const { universe, search, page = '1', limit = '20' } = req.query;
  const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

  const characters = await prisma.character.findMany({
    where: {
      ...(universe ? { universe: universe as string } : {}),
      ...(search ? { name: { contains: search as string, mode: 'insensitive' } } : {})
    },
    include: { creator: { select: { id: true, username: true } } },
    orderBy: { followerCount: 'desc' },
    skip,
    take: parseInt(limit as string)
  });

  return res.json(characters);
});

// GET /api/characters/:id
router.get('/:id', async (req, res) => {
  const character = await prisma.character.findUnique({
    where: { id: req.params.id },
    include: { creator: { select: { id: true, username: true, avatar: true } } }
  });
  if (!character) return res.status(404).json({ error: 'Character not found' });
  return res.json(character);
});

// POST /api/characters — create (creator only)
router.post('/', authenticate, requireCreator, async (req: AuthRequest, res: Response) => {
  const { name, avatar, bio, universe } = req.body;
  if (!name) return res.status(400).json({ error: 'Character name is required' });

  const character = await prisma.character.create({
    data: { name, avatar, bio, universe, creatorId: req.userId! }
  });
  return res.status(201).json(character);
});

// PUT /api/characters/:id
router.put('/:id', authenticate, requireCreator, async (req: AuthRequest, res: Response) => {
  const character = await prisma.character.findUnique({ where: { id: req.params.id } });
  if (!character) return res.status(404).json({ error: 'Character not found' });
  if (character.creatorId !== req.userId) return res.status(403).json({ error: 'Forbidden' });

  const updated = await prisma.character.update({
    where: { id: req.params.id },
    data: req.body
  });
  return res.json(updated);
});

// POST /api/characters/:id/follow
router.post('/:id/follow', authenticate, async (req: AuthRequest, res: Response) => {
  const { id: characterId } = req.params;

  const existing = await prisma.follow.findUnique({
    where: { followerId_characterId: { followerId: req.userId!, characterId } }
  });

  if (existing) {
    await prisma.follow.delete({ where: { id: existing.id } });
    await prisma.character.update({ where: { id: characterId }, data: { followerCount: { decrement: 1 } } });
    return res.json({ followed: false });
  }

  await prisma.follow.create({ data: { followerId: req.userId!, characterId } });
  await prisma.character.update({ where: { id: characterId }, data: { followerCount: { increment: 1 } } });
  return res.json({ followed: true });
});

export default router;
