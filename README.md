# CharVerse 🎭

> A social media platform where fictional characters have their own accounts.

Follow characters from your favorite comics, webtoons, and novels. Get their posts in your feed. Talk to them between chapter releases.

## Project Structure

```
charverse/
├── frontend/    # Next.js 14 (App Router, TypeScript, Tailwind)
└── backend/     # Node.js + Express + Prisma + PostgreSQL
```

## Quick Start

### Backend
```bash
cd backend
cp .env.example .env   # fill in your DB URL and JWT secret
npm install
npm run db:generate
npm run db:migrate
npm run dev            # runs on http://localhost:4000
```

### Frontend
```bash
cd frontend
npm install
npm run dev            # runs on http://localhost:3000
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | /api/auth/register | Register a new user |
| POST | /api/auth/login | Login |
| GET | /api/feed | Personalized character feed |
| GET | /api/feed/explore | Trending / discovery |
| GET | /api/characters | List characters |
| POST | /api/characters | Create a character (creator) |
| POST | /api/characters/:id/follow | Follow / unfollow a character |
| GET | /api/posts/character/:id | Get a character's posts |
| POST | /api/posts | Create a post (creator) |
| POST | /api/posts/:id/like | Like / unlike a post |
| POST | /api/posts/:id/comment | Comment on a post |

## Roadmap

- [x] Project scaffold & architecture
- [x] Database schema (Prisma)
- [x] Auth (register/login/JWT)
- [x] Character CRUD + follow system
- [x] Posts + likes + comments
- [x] Feed (personalized + explore)
- [x] AI character voice service (stub)
- [ ] Frontend UI — feed, profiles, explore
- [ ] AI post suggestions (OpenAI GPT-4o)
- [ ] Scheduling & notifications
- [ ] Creator dashboard
- [ ] Monetization

---

Built with ❤️ by VoyceMe
