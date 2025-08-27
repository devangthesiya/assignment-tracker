# Sociogram

A clean, modern social media feed built with React, TypeScript, and Tailwind CSS. Mobile-first design with Instagram-like UI for posts, likes, and comments.

## ✨ Features

- 📱 **Mobile-First Design** - Responsive layout optimized for mobile
- ❤️ **Like Posts** - Click heart to like/unlike with live count updates
- 💬 **Add Comments** - Expandable comment threads with instant updates
- 💾 **Data Persistence** - Everything saves to localStorage automatically

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 📱 How to Use

1. **Browse Posts** - Scroll through the feed
2. **Like Posts** - Click the ❤️ icon to like/unlike
3. **View Comments** - Click "View all X comments" to expand
4. **Add Comments** - Click comment icon, type, and press Enter

## 🏗️ Tech Stack

- **React 19** - UI library with hooks
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **Vite** - Fast build tool
- **LocalStorage** - Data persistence

## 📁 Project Structure

```
src/
├── components/
│   ├── Feed.tsx          # Main feed container
│   ├── PostCard.tsx      # Individual post component
│   └── index.ts          # Component exports
├── context/
│   └── PostsContext.tsx  # Global state management
├── App.tsx               # Root component
├── main.tsx              # React entry point
└── index.css             # Global styles
```

## 🎯 Current Features

- ✅ **5 Sample Posts** - With realistic content and timestamps
- ✅ **Guest User System** - Everyone uses mock user `u123`
- ✅ **Real-time Updates** - Likes and comments update instantly
- ✅ **Clean UI** - Instagram-inspired design
- ✅ **No Dead Code** - Minimal, optimized codebase

## 🔧 Architecture

### State Management

- **React Context** - Global posts state
- **useState** - Local component state
- **localStorage** - Data persistence across sessions

### Styling

- **Tailwind CSS** - Utility classes for rapid development
- **Responsive Design** - Mobile-first with clean typography
- **Modern UI** - Card-based layout with proper spacing

## 📊 Bundle Size

- **Total**: ~198 KB (gzipped: ~62 KB)
- **CSS**: ~10 KB (gzipped: ~3 KB)
- **Zero Dependencies** - Only React, TypeScript, and Tailwind

---
