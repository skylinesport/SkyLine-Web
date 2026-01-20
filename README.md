# LocaTrack - Non-Academic Achievement Tracker

A web application for tracking and showcasing non-academic achievements like sports, arts, volunteering, and more. Users earn stars (0-7) based on their accomplishments and can share their digital identity card.

## Features

- 🌟 **Star Rating System**: Dynamic 0-7 star rating based on achievement weights
- 🏆 **Achievement Tracking**: Add, edit, and delete achievements across multiple categories
- 🎖️ **Badge System**: Earn badges automatically when you meet requirements
- 📊 **Leaderboard**: Compete with others filtered by time and category
- 🪪 **Digital Identity Card**: Downloadable PNG with your stats
- 🔔 **Notifications**: Get notified for badges, verifications, and star milestones
- 👑 **Admin Panel**: Verify achievements, manage users, categories, and badges
- 🌙 **Dark/Light Mode**: Toggle between themes
- 📱 **Responsive Design**: Works on desktop and mobile

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Framer Motion
- **UI Components**: shadcn/ui (Radix UI)
- **Backend**: Supabase (PostgreSQL, Auth, RLS)
- **State Management**: TanStack Query (React Query)

## Local Development Setup

### Prerequisites

- Node.js 18+ (or Bun)
- npm or bun package manager
- A Supabase account (free tier works)

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd locatrack
```

### 2. Install Dependencies

```bash
npm install
# or
bun install
```

### 3. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to be provisioned (~2 minutes)

### 4. Run Database Migrations

In your Supabase project dashboard:

1. Go to **SQL Editor**
2. Copy and run each migration file from `supabase/migrations/` in order
3. The migrations create:
   - Tables: profiles, achievements, categories, badges, user_badges, notifications, user_roles
   - Functions: calculate_star_rating, is_admin, has_role, check_and_award_badges
   - Triggers: Auto-update stats, auto-award badges, send notifications
   - RLS policies: Secure data access

### 5. Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env` with your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key
```

Find these in Supabase: **Settings > API**

### 6. Enable Email Auto-Confirm (Development)

For easier testing, enable auto-confirm:

1. Go to **Authentication > Providers > Email**
2. Turn OFF "Confirm email"

### 7. Start Development Server

```bash
npm run dev
# or
bun dev
```

Open [http://localhost:5173](http://localhost:5173)

## Creating Your First Admin User

1. Sign up through the app
2. In Supabase SQL Editor, run:

```sql
-- Replace 'your-user-id' with your actual user ID from auth.users
INSERT INTO public.user_roles (user_id, role)
VALUES ('your-user-id', 'admin');
```

Find your user ID in **Authentication > Users**

## Default Data

The migrations automatically create:

**Categories:**
- Sports, Arts & Culture, Volunteering, Leadership
- Academic Extras, Certifications, Events, Other

**Badges:**
- Rising Star (1+ stars)
- Achiever (5+ achievements)
- Multi-Talent (3+ categories)
- Sports Champion, Creative Master, Community Hero
- Certified Pro, Legend (7 stars)

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── admin/           # Admin panel components
│   ├── ui/              # shadcn/ui components
│   ├── AchievementCard.tsx
│   ├── Badge.tsx
│   ├── IdentityCard.tsx
│   ├── LeaderboardCard.tsx
│   ├── NotificationBell.tsx
│   ├── ProgressBar.tsx
│   ├── StarRating.tsx
│   └── ThemeToggle.tsx
├── integrations/
│   └── supabase/        # Supabase client and types
├── lib/
│   ├── auth.tsx         # Auth context provider
│   └── utils.ts         # Utility functions
├── pages/
│   ├── Admin.tsx        # Admin dashboard
│   ├── Auth.tsx         # Login/Signup
│   ├── Dashboard.tsx    # User dashboard
│   ├── Index.tsx        # Landing page
│   ├── Profile.tsx      # Public profile
│   └── NotFound.tsx
├── App.tsx              # Routes and providers
├── index.css            # Global styles and themes
└── main.tsx             # Entry point

supabase/
├── config.toml          # Supabase configuration
└── migrations/          # SQL migration files
```

## Database Schema

### Tables

| Table | Description |
|-------|-------------|
| profiles | User profiles (linked to auth.users) |
| achievements | User achievements with status |
| categories | Achievement categories |
| badges | Badge definitions with requirements |
| user_badges | Awarded badges per user |
| notifications | User notifications |
| user_roles | Admin/user role assignments |

### Key Functions

- `calculate_star_rating(user_id)`: Calculates 0-7 star rating
- `check_and_award_badges(user_id)`: Awards eligible badges
- `is_admin(user_id)`: Checks admin status for RLS

## Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## Customization

### Changing Theme Colors

Edit `src/index.css` - look for CSS variables in `:root` and `.dark`

### Adding New Badge Types

1. Add badge in Admin Panel or via SQL
2. Update `check_and_award_badges()` function if needed

### Modifying Star Calculation

Edit the `calculate_star_rating()` function in Supabase SQL Editor

## Troubleshooting

### "Row level security" errors
- Make sure you're logged in
- Check RLS policies in Supabase

### Auth not working
- Verify environment variables are correct
- Check if email auto-confirm is enabled

### Badges not awarding
- Achievements must be "approved" status
- Check the trigger is working in Supabase logs

## License

MIT License - feel free to use for personal or commercial projects.

## Contributing

Contributions welcome! Please open an issue first to discuss changes.
