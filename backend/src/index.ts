import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import characterRoutes from './routes/characters';
import postRoutes from './routes/posts';
import feedRoutes from './routes/feed';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000' }));
app.use(express.json());

// Health check
app.get('/health', (_, res) => res.json({ status: 'ok', service: 'charverse-api' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/characters', characterRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/feed', feedRoutes);

app.listen(PORT, () => {
  console.log(`🚀 CharVerse API running on http://localhost:${PORT}`);
});

export default app;
