# TroupeX Mobile Experience

Modern, LinkedIn-inspired React Native app polished with NativeWind and Expo Router. The experience covers authentication, feed, jobs, applications, profile, post comments, and a refined job detail flow – all wrapped in a cohesive design system and animated micro-interactions.

## ✨ Highlights

- **Immersive onboarding** – gradient app loader, OTP login, and resend cooldown flows with haptics.
- **Social feed** – curated hero, filter chips, animated engagement (like/comment) controls, infinite scroll, and empty states.
- **Career workflows** – jobs list with filters, rich job detail hero, and applications hub showing status, date, and guidance.
- **Personal profile** – editable summary, completeness indicator, availability prompts, avatar picker, and animated sections.
- **Comment threads** – gradient discussion header, glass cards, safe-area aware composer with gradient send button.
- **Design system** – custom color palette, glassmorphism cards, gradient CTAs, badges, press animations, and reusable primitives (Card, PrimaryButton, PressableScale, FadeIn, Avatar, SectionHeading, etc.).

## 🧰 Tech Stack

- **Expo 54** with Expo Router for file-based navigation
- **React Native 0.81** (iOS/Android)
- **NativeWind 4** for Tailwind-style styling
- **React Query 5** for data fetching and caching
- **Zustand** for auth state
- **Expo Linear Gradient, Haptics, Safe Area Context**
- **TypeScript** + ESLint (Expo config)

## 🚀 Getting Started

> **Node requirement:** Expo SDK 54’s React Native dependencies expect Node **≥ 20.19.4**. Upgrade with `nvm install 20.19.4 && nvm use 20.19.4` if needed.

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Start Metro / dev server**

   ```bash
   npx expo start
   ```

   Choose a platform target:

   - `i` for iOS simulator
   - `a` for Android emulator
   - Scan the QR code with Expo Go for device testing

3. **Environment**

   - API base URLs and auth tokens live in `src/lib/api.ts`. Configure these to match your backend.
   - React Query + Zustand handle caching and session state.

## 📁 Project Structure

```
app/
  _layout.tsx          # Root layout with global providers & loader
  index.tsx            # OTP login entry
  otp.tsx              # OTP verification screen
  (tabs)/              # Tab navigator (feed, jobs, profile, applications)
  jobs/[id].tsx        # Job detail view
  comments/[id].tsx    # Post comments thread
src/
  components/          # UI primitives & feature components
  hooks/               # React Query hooks (posts, jobs)
  lib/format.ts        # Formatting helpers (relative time, salary)
  store/               # Zustand auth store
  services/            # API services

tailwind.config.js     # NativeWind theme extensions

```

## 🧩 Key Components

- `src/components/layout/AppLoader` – gradient splash with fade-in content shown on boot.
- `src/components/ui/PressableScale` – animated press state + optional haptics.
- `src/components/ui/Card` – glassmorphism surface with elevation.
- `src/components/ui/PrimaryButton` – gradient CTA with loading state.
- `src/components/ui/FadeIn` – RN Animated helper for subtle entrance motions.
- `src/components/jobs/JobCard`, `src/components/applications/ApplicationCard`, `src/components/PostCard` – domain-specific cards.

## 🧪 Scripts

| Command            | Description                    |
|--------------------|--------------------------------|
| `npm run lint`     | Run Expo ESLint config         |
| `npx expo start`   | Launch Metro bundler           |
| `npm run reset-project` | Reset to Expo starter template |

Linting is currently the only automated check. Run it before committing to ensure styling/TypeScript rules pass.

## 🎨 Design Notes

- Palette defined in `tailwind.config.js` (`primary`, `indigo`, `fuchsia`, etc.).
- Gradients rely on `expo-linear-gradient` – apply styles via `StyleSheet` for non-view primitives.
- Safe area handling uses `Screen` layout component wrapping `SafeAreaView`.
- Scroll indicators are disabled for all lists to keep edges clean (`showsVerticalScrollIndicator={false}`).

## 📦 Backend Integration

The project assumes REST endpoints:

- Auth: `/api/auth/login`, `/api/auth/verify`
- Posts: `/api/posts`, `/api/posts/:id/comments`
- Jobs: `/api/jobs`, `/api/jobs/:id`, `/api/jobs/:id/apply`
- Applications: `/api/applications/me`
- Profile: `/api/users/me`

Adjust `src/services/*` or provide environment variables as your backend requires.

## 🙌 Contributing / Customizing

- Extend the design system by updating `Card`, `PrimaryButton`, and Tailwind theme tokens.
- Add new tabs/routes by creating files inside `app/(tabs)` or nested folders – Expo Router picks them up automatically.
- When introducing animations beyond basics, consider reintroducing `react-native-reanimated` (currently replaced with core Animated for stability).

Happy building! 💼📱
