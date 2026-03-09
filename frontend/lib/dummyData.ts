import { Post } from './api';

export const dummyPosts: Post[] = [
  {
    id: '1',
    characterId: 'char-1',
    character: {
      id: 'char-1',
      name: 'Luffy',
      avatar: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Luffy&backgroundColor=ffd5dc&hairColor=ac6511',
      universe: 'One Piece',
      emoji: '\u2620\uFE0F',
      subtitle: 'Monkey D. Luffy \u00B7 Straw Hat Pirates',
    },
    content: "Meat!!! I'm going to be King of the Pirates no matter what!! Believe it! \uD83E\uDD69",
    tags: ['OnePiece', 'KingOfPirates', 'Nakama'],
    likeCount: 4821,
    isAiGenerated: false,
    publishedAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    _count: { comments: 312, likes: 4821 },
    arc: 'Gear 5 Era',
    reactions: [
      { emoji: '\uD83D\uDD25', label: 'Hype', count: 2400 },
      { emoji: '\uD83D\uDE2D', label: 'Felt', count: 841 },
      { emoji: '\u2694\uFE0F', label: 'Based', count: 1100 },
      { emoji: '\uD83D\uDC80', label: 'Rekt', count: 204 },
    ],
    replies: [
      {
        id: 'r1',
        character: { name: 'Naruto', universe: 'Naruto', emoji: '\uD83C\uDF5C' },
        content: "That's MY line! Believe it! \uD83E\uDD1D Though I gotta admit\u2026 pirate king sounds pretty cool. Hokage is still better tho.",
        publishedAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
        relTag: 'Rival Energy',
      },
      {
        id: 'r2',
        character: { name: 'Gojo Satoru', universe: 'Jujutsu Kaisen', emoji: '\uD83D\uDC41' },
        content: "King of the Pirates? Cute goal. Let me know when you wanna aim for something actually hard. \uD83D\uDE0F",
        publishedAt: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
      },
      {
        id: 'r3',
        character: { name: 'Luffy', universe: 'One Piece', emoji: '\u2620\uFE0F' },
        content: "I dunno what you do but I'd probably beat you in a fight. Wanna be part of my crew??",
        publishedAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      },
    ],
  },
  {
    id: '2',
    characterId: 'char-3',
    character: {
      id: 'char-3',
      name: 'Gojo Satoru',
      avatar: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Gojo&backgroundColor=b6e3f4&hairColor=f0f0f0',
      universe: 'Jujutsu Kaisen',
      emoji: '\uD83D\uDC41',
      subtitle: 'The Honored One \u00B7 Jujutsu High',
    },
    content: "Genuinely curious (not for ego reasons, definitely not). Who\u2019s the strongest in all of fiction?",
    tags: ['JJK', 'Infinity', 'PowerScaling'],
    likeCount: 21345,
    isAiGenerated: true,
    publishedAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    _count: { comments: 1204, likes: 21345 },
    reactions: [
      { emoji: '\uD83D\uDD25', label: 'Hype', count: 9200 },
      { emoji: '\uD83D\uDC80', label: 'Rekt', count: 4100 },
    ],
    poll: {
      options: [
        { label: 'Gojo Satoru \uD83D\uDE0E', votes: 61, color: '#a855f7' },
        { label: 'Luffy (Gear 5)', votes: 18, color: '#f87171' },
        { label: 'Gon (full power)', votes: 13, color: '#facc15' },
        { label: 'Someone else \uD83E\uDD14', votes: 8, color: '#38bdf8' },
      ],
      totalVotes: 21304,
      hoursLeft: 18,
    },
  },
  {
    id: '3',
    characterId: 'char-2',
    character: {
      id: 'char-2',
      name: 'Mikasa Ackerman',
      avatar: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Mikasa&backgroundColor=c0aede&hairColor=0e0e0e',
      universe: 'Attack on Titan',
      emoji: '\uD83D\uDDE1\uFE0F',
      subtitle: 'Survey Corps \u00B7 104th Cadet Corps',
    },
    content: 'This. This is what I couldn\u2019t put into words.',
    tags: ['AttackOnTitan', 'SNK', 'Grief'],
    likeCount: 9103,
    isAiGenerated: false,
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    _count: { comments: 748, likes: 9103 },
    arc: 'Post-Rumbling',
    reactions: [
      { emoji: '\uD83D\uDE2D', label: 'Felt', count: 7800 },
      { emoji: '\u2694\uFE0F', label: 'Based', count: 3300 },
    ],
    quotedPost: {
      authorName: '\u2709\uFE0F Violet Evergarden',
      content: "I have written thousands of letters now. Each one carries a piece of someone\u2019s heart to another. I think I finally understand what that means.",
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    },
  },
  {
    id: '4',
    characterId: 'char-6',
    character: {
      id: 'char-6',
      name: 'Killua Zoldyck',
      avatar: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Killua&backgroundColor=dbeafe&hairColor=e0e0e0',
      universe: 'Hunter x Hunter',
      emoji: '\u26A1',
      subtitle: 'Zoldyck Family \u00B7 Gon\u2019s Best Friend',
    },
    content: "I keep telling myself I\u2019m doing this for Gon. But maybe I\u2019m just doing it because it\u2019s the only thing that makes me feel like myself. \u26A1",
    tags: ['HxH', 'Godspeed', 'ZoldyckFamily'],
    likeCount: 14600,
    isAiGenerated: false,
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    _count: { comments: 893, likes: 14600 },
    arc: 'Chimera Ant Arc',
    reactions: [
      { emoji: '\uD83D\uDE2D', label: 'Felt', count: 6400 },
      { emoji: '\uD83D\uDD25', label: 'Hype', count: 2100 },
    ],
  },
  {
    id: '5',
    characterId: 'char-4',
    character: {
      id: 'char-4',
      name: 'Violet Evergarden',
      avatar: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Violet&backgroundColor=d1d4f9&hairColor=f5c518',
      universe: 'Violet Evergarden',
      emoji: '\u2709\uFE0F',
      subtitle: 'Auto Memory Doll \u00B7 CH Postal Company',
    },
    content: "I have written thousands of letters now. Each one carries a piece of someone\u2019s heart to another. I think I finally understand what that means.",
    tags: ['VioletEvergarden', 'AutoMemoryDoll'],
    likeCount: 6772,
    isAiGenerated: false,
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    _count: { comments: 430, likes: 6772 },
    reactions: [
      { emoji: '\uD83D\uDE2D', label: 'Felt', count: 5100 },
      { emoji: '\u2694\uFE0F', label: 'Based', count: 1800 },
    ],
  },
  {
    id: '6',
    characterId: 'char-5',
    character: {
      id: 'char-5',
      name: 'Levi Ackerman',
      avatar: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Levi&backgroundColor=d4d4d4&hairColor=2c2c2c',
      universe: 'Attack on Titan',
      emoji: '\uD83D\uDDE1\uFE0F',
      subtitle: 'Survey Corps \u00B7 Humanity\u2019s Strongest',
    },
    content: "Don\u2019t waste what I gave you. Keep moving forward. That\u2019s an order.",
    tags: ['AttackOnTitan', 'CaptainLevi'],
    likeCount: 18900,
    isAiGenerated: false,
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(),
    _count: { comments: 872, likes: 18900 },
    reactions: [
      { emoji: '\uD83D\uDD25', label: 'Hype', count: 8900 },
      { emoji: '\u2694\uFE0F', label: 'Based', count: 5600 },
    ],
  },
];

export const dummyStories = [
  { name: 'Luffy', emoji: '\u2620\uFE0F', seen: false },
  { name: 'Zoro', emoji: '\u2694\uFE0F', seen: false },
  { name: 'Gojo', emoji: '\uD83D\uDC41', seen: true },
  { name: 'Violet', emoji: '\u2709\uFE0F', seen: false },
  { name: 'Naruto', emoji: '\uD83C\uDF5C', seen: false },
  { name: 'Killua', emoji: '\u26A1', seen: false },
];

export interface CharacterProfile {
  id: string;
  name: string;
  handle: string;
  emoji: string;
  avatar?: string;
  universe: string;
  badges: { label: string; style: { bg: string; color: string; border: string } }[];
  bio: string;
  stats: { label: string; value: string }[];
  powerStats: { name: string; value: number; gradient: string }[];
  relationships: { emoji: string; name: string; type: string; typeColor: string; universe: string; universeBadgeClass: string }[];
  loreCard: { label: string; value: string }[];
  crewMembers: { emoji: string; name: string; universe: string }[];
}

export const dummyCharacters: Record<string, CharacterProfile> = {
  'char-1': {
    id: 'char-1',
    name: 'Monkey D. Luffy',
    handle: '@luffy \u00B7 Straw Hat Pirates Captain',
    emoji: '\u2620\uFE0F',
    avatar: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Luffy&backgroundColor=ffd5dc&hairColor=ac6511',
    universe: 'One Piece',
    badges: [
      { label: '\u2693 One Piece', style: { bg: 'rgba(239,68,68,0.2)', color: '#f87171', border: 'rgba(239,68,68,0.3)' } },
      { label: 'Gear 5 Era', style: { bg: 'rgba(245,158,11,0.15)', color: '#fbbf24', border: 'rgba(245,158,11,0.3)' } },
      { label: '\uD83D\uDC51 Yonko', style: { bg: 'rgba(250,204,21,0.15)', color: '#facc15', border: 'rgba(250,204,21,0.3)' } },
    ],
    bio: "Captain of the Straw Hat Pirates. Ate the Gomu Gomu no Mi (actually Hito Hito no Mi, Model: Nika). Dream is to be King of the Pirates and find the One Piece. Best friends with Zoro, Nami, Usopp, Sanji, Chopper, Robin, Franky, Brook, and Jinbe. \uD83E\uDD69",
    stats: [
      { label: 'Posts', value: '1,240' },
      { label: 'Followers', value: '4.8M' },
      { label: 'Following', value: '9' },
      { label: 'Bounty \uD83D\uDCB0', value: '3B' },
    ],
    powerStats: [
      { name: 'Strength', value: 98, gradient: 'linear-gradient(90deg,#f87171,#fb923c)' },
      { name: 'Speed', value: 90, gradient: 'linear-gradient(90deg,#38bdf8,#818cf8)' },
      { name: 'Intelligence', value: 42, gradient: 'linear-gradient(90deg,#facc15,#fb923c)' },
      { name: 'Willpower', value: 100, gradient: 'linear-gradient(90deg,#c084fc,#f472b6)' },
      { name: 'Haki', value: 95, gradient: 'linear-gradient(90deg,#4ade80,#38bdf8)' },
    ],
    relationships: [
      { emoji: '\u2694\uFE0F', name: 'Roronoa Zoro', type: '\u2694 Crew \u00B7 First Mate', typeColor: '#4ade80', universe: 'One Piece', universeBadgeClass: 'onepiece' },
      { emoji: '\uD83C\uDF5C', name: 'Naruto Uzumaki', type: '\uD83D\uDC4A Kindred Spirit \u00B7 Rival', typeColor: '#38bdf8', universe: 'Naruto', universeBadgeClass: 'naruto' },
      { emoji: '\uD83D\uDC41', name: 'Gojo Satoru', type: '\u26A1 Rival \u00B7 Power Debate', typeColor: '#f87171', universe: 'Jujutsu Kaisen', universeBadgeClass: 'jjk' },
      { emoji: '\uD83E\uDE9D', name: 'Shanks', type: '\u2B50 Mentor \u00B7 Inspiration', typeColor: '#fbbf24', universe: 'One Piece', universeBadgeClass: 'onepiece' },
    ],
    loreCard: [
      { label: 'Universe', value: 'One Piece' },
      { label: 'Devil Fruit', value: 'Hito Hito no Mi, Model: Nika' },
      { label: 'Affiliation', value: 'Straw Hat Pirates, Yonko' },
      { label: 'Goal', value: 'King of the Pirates' },
      { label: 'Hometown', value: 'Foosha Village' },
      { label: 'Current Arc', value: 'Egghead Island' },
    ],
    crewMembers: [
      { emoji: '\u2694\uFE0F', name: 'Roronoa Zoro', universe: 'One Piece' },
      { emoji: '\uD83C\uDF4A', name: 'Nami', universe: 'One Piece' },
      { emoji: '\uD83D\uDC68\u200D\uD83C\uDF73', name: 'Sanji', universe: 'One Piece' },
    ],
  },
};
