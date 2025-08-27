# Sociogram

A modern social media feed built with React, TypeScript, Tailwind CSS, and Firebase Firestore. Features real-time global synchronization, mobile-first design.

## ✨ Features

- 📱 **Mobile-First Design** - Responsive layout optimized for mobile
- ❤️ **Real-time Likes** - Global like synchronization across all users and sessions
- 💬 **Real-time Comments** - Live comment updates that sync instantly
- 🔥 **Firebase Firestore** - Cloud database with real-time listeners
- ⚡ **Skeleton Loading** - Professional loading states with smooth animations
- 🌙 **Dark Mode** - Beautiful dark/light theme toggle with system preference detection
- 🎭 **Multi-User System** - 10 unique users with session-based assignment
- 🌐 **Cross-Session Sync** - Changes appear instantly in all open browser windows
- 💾 **Cloud Persistence** - Data stored securely in Firebase

## 🚀 Quick Start

### Prerequisites

- Node.js 20.19+ or 22.12+
- Firebase project with Firestore enabled

### Setup

```bash
# Clone the repository
git clone <your-repo-url>
cd assignment-tracker

# Install dependencies
npm install

# Configure Firebase (see Firebase Setup section below)

# Start development server
npm run dev

# Build for production
npm run build
```

### Firebase Setup

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Firestore Database in "test mode"
3. Get your config from Project Settings > General > Your apps
4. Copy `src/firebase/credentials.example.ts` to `src/firebase/credentials.ts`
5. Update `credentials.ts` with your actual Firebase credentials
6. Set Firestore rules to allow read/write access:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true; // For development only
    }
  }
}
```

## 📱 How to Use

1. **Browse Posts** - Scroll through the feed of 5 sample posts
2. **Like Posts** - Click the ❤️ icon to like/unlike (syncs globally in real-time)
3. **View Comments** - Click "View all X comments" to expand comment threads
4. **Add Comments** - Click comment icon, type, and press Enter
5. **Toggle Dark Mode** - Click the 🌙/☀️ button in the header to switch themes
6. **Test Multi-User Experience** - Open multiple browser windows(incognito) to simulate different users!

### Multi-User Session System 🎭

- **10 Fun Users**: Each browser session gets assigned a unique user from a pool of creative usernames:
  - CoffeeLover42 ☕ | PixelNinja 🥷 | SunflowerDream 🌻 | MidnightCoder 🌙 | BubbleWrap99 💭
  - WanderlustSoul 🌍 | NeonVibez 💫 | CloudHopper ☁️ | StarGazer21 ⭐ | RetroWave88 🌊
- **Session-Based**: Each browser window/tab gets a different user automatically
- **Real-time Sync**: Likes and comments from different "users" appear instantly across all windows
- **Unique Avatars**: Each user has their own profile picture and personality
- **Perfect for Testing**: Simulate a real social media experience with multiple users

## 🏗️ Tech Stack

- **React 19** - UI library with hooks
- **TypeScript** - Type safety and better developer experience
- **Tailwind CSS** - Utility-first styling framework
- **Vite** - Fast build tool and development server
- **Firebase Firestore** - NoSQL cloud database with real-time listeners
- **Firebase SDK** - Authentication and database operations

## 📁 Project Structure

```
src/
├── components/
│   ├── Feed.tsx          # Main feed container with skeleton loading
│   ├── PostCard.tsx      # Individual post component
│   ├── PostSkeleton.tsx  # Loading skeleton components
│   ├── DarkModeToggle.tsx # Dark/light mode toggle button
│   └── index.ts          # Component exports
├── context/
│   ├── PostsContext.tsx  # Global state management with Firestore
│   └── ThemeContext.tsx  # Dark mode theme management
├── firebase/
│   ├── config.ts         # Firebase configuration
│   ├── posts.ts          # Firestore operations for posts, likes, comments
│   └── credentials.ts    # Firebase credentials (gitignored)
├── utils/
│   └── userManager.ts    # Multi-user session management
├── App.tsx               # Root component
├── main.tsx              # React entry point
└── index.css             # Global styles with Tailwind
```

## 🎯 Current Features

- ✅ **5 Sample Posts** - Realistic content stored in Firestore
- ✅ **Multi-User System** - 10 unique users with automatic session assignment
- ✅ **Real-time Synchronization** - Instant updates across all browser sessions
- ✅ **Global Likes** - Like counts sync globally via Firestore
- ✅ **Global Comments** - Comments appear instantly for all users
- ✅ **Dark/Light Mode** - Theme toggle with smooth animations and persistence
- ✅ **Skeleton Loading** - Professional loading states while fetching data
- ✅ **Optimistic Updates** - Immediate UI feedback with error handling
- ✅ **Clean UI** - Instagram-inspired mobile-first design
- ✅ **Error Handling** - Graceful fallbacks for network issues

## 🔧 Architecture

### State Management

- **React Context** - Global posts state with Firestore integration
- **useState** - Local component state and optimistic updates
- **Firestore Real-time Listeners** - Live data synchronization across sessions

### Database Structure

- **`posts`** - Basic post information (author, caption, image, timestamp)
- **`post_likes`** - Like data for each post (user IDs, like count)
- **`post_comments`** - Comments for each post (user data, text, timestamps)

### Styling

- **Tailwind CSS** - Utility classes for rapid development
- **Responsive Design** - Mobile-first with clean typography
- **Skeleton Loading** - Smooth loading animations with `animate-pulse`
- **Modern UI** - Instagram-inspired card-based layout

## 🌐 Real-time Features

### Cross-Session Synchronization

- Open multiple browser windows/tabs
- Like a post in one window → instantly appears in all others
- Add a comment in one window → immediately visible everywhere
- Perfect for testing real-time collaborative features

### Optimistic Updates

- UI updates immediately when you interact
- Data syncs to Firestore in the background
- Reverts changes if network request fails
- Provides responsive user experience

## 📊 Bundle Size

- **Total**: ~300 KB (includes Firebase SDK)
- **CSS**: ~10 KB (gzipped: ~3 KB)
- **Main Dependencies**: React, TypeScript, Tailwind, Firebase

---
