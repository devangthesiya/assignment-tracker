import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

interface SimpleComment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  text: string;
  timestamp: string;
}

interface SimplePost {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  imageUrl: string;
  caption: string;
  likes: string[]; // Array of user IDs
  comments: SimpleComment[];
  timestamp: string;
  isLikedByCurrentUser?: boolean;
}

interface PostsContextType {
  posts: SimplePost[];
  toggleLike: (postId: string) => void;
  addComment: (postId: string, text: string) => void;
  error: string | null;
}

const PostsContext = createContext<PostsContextType | null>(null);

interface PostsProviderProps {
  children: ReactNode;
}

export const PostsProvider: React.FC<PostsProviderProps> = ({ children }) => {
  const [posts, setPosts] = useState<SimplePost[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  // Mock guest user - everyone uses this
  const mockUser = {
    uid: 'u123',
    username: 'Guest User',
    avatar: 'https://images.pexels.com/photos/8721322/pexels-photo-8721322.jpeg'
  };

  useEffect(() => {
    // Load mock posts immediately
    const mockPosts: SimplePost[] = [
      {
        id: 'p1',
        authorId: 'sample_user_1',
        authorName: 'Alice Smith',
        authorAvatar: 'https://images.pexels.com/photos/8721322/pexels-photo-8721322.jpeg',
        imageUrl: 'https://images.pexels.com/photos/33498261/pexels-photo-33498261.jpeg',
        caption: 'Beautiful sunset from my balcony! Nature never fails to amaze me 🌅',
        likes: ['u123', 'u789', 'u101'],
        comments: [
          {
            id: 'c1',
            userId: 'u123',
            userName: 'John Doe',
            userAvatar: 'https://images.pexels.com/photos/8721322/pexels-photo-8721322.jpeg',
            text: 'Absolutely stunning! Great shot 📸',
            timestamp: '2025-08-15T10:30:00Z'
          },
          {
            id: 'c2',
            userId: 'u789',
            userName: 'Bob Johnson',
            userAvatar: 'https://images.pexels.com/photos/8721322/pexels-photo-8721322.jpeg',
            text: 'This is gorgeous! Where was this taken?',
            timestamp: '2025-08-15T11:15:00Z'
          }
        ],
        timestamp: '2025-08-15T09:45:00Z'
      },
      {
        id: 'p2',
        authorId: 'sample_user_2',
        authorName: 'Bob Johnson',
        authorAvatar: 'https://images.pexels.com/photos/8721322/pexels-photo-8721322.jpeg',
        imageUrl: 'https://images.pexels.com/photos/33498261/pexels-photo-33498261.jpeg',
        caption: 'Morning coffee and good vibes ☕️ Ready to tackle the day!',
        likes: ['u456', 'u101'],
        comments: [
          {
            id: 'c3',
            userId: 'u456',
            userName: 'Alice Smith',
            userAvatar: 'https://images.pexels.com/photos/8721322/pexels-photo-8721322.jpeg',
            text: 'Coffee goals! ☕️',
            timestamp: '2025-08-14T08:20:00Z'
          }
        ],
        timestamp: '2025-08-14T08:00:00Z'
      },
      {
        id: 'p3',
        authorId: 'sample_user_3',
        authorName: 'Charlie Davis',
        authorAvatar: 'https://images.pexels.com/photos/8721322/pexels-photo-8721322.jpeg',
        imageUrl: 'https://images.pexels.com/photos/33498261/pexels-photo-33498261.jpeg',
        caption: 'Weekend adventures in the city! 🏙️ Love exploring new places',
        likes: ['u123', 'u456'],
        comments: [
          {
            id: 'c4',
            userId: 'u123',
            userName: 'Guest User',
            userAvatar: 'https://images.pexels.com/photos/8721322/pexels-photo-8721322.jpeg',
            text: 'Looks amazing! Which city is this?',
            timestamp: '2025-08-13T15:45:00Z'
          }
        ],
        timestamp: '2025-08-13T15:30:00Z'
      },
      {
        id: 'p4',
        authorId: 'sample_user_4',
        authorName: 'Diana Martinez',
        authorAvatar: 'https://images.pexels.com/photos/8721322/pexels-photo-8721322.jpeg',
        imageUrl: 'https://images.pexels.com/photos/33498261/pexels-photo-33498261.jpeg',
        caption: 'Golden hour magic ✨ Sometimes the best moments are unplanned',
        likes: ['u789', 'u101', 'u456'],
        comments: [],
        timestamp: '2025-08-12T18:20:00Z'
      },
      {
        id: 'p5',
        authorId: 'sample_user_5',
        authorName: 'Emma Wilson',
        authorAvatar: 'https://images.pexels.com/photos/8721322/pexels-photo-8721322.jpeg',
        imageUrl: 'https://images.pexels.com/photos/33498261/pexels-photo-33498261.jpeg',
        caption: 'Just finished my morning workout! 💪 Feeling energized and ready for the day',
        likes: ['u123'],
        comments: [
          {
            id: 'c5',
            userId: 'u789',
            userName: 'Bob Johnson',
            userAvatar: 'https://images.pexels.com/photos/8721322/pexels-photo-8721322.jpeg',
            text: 'Keep it up! 💪',
            timestamp: '2025-08-11T07:15:00Z'
          },
          {
            id: 'c6',
            userId: 'u456',
            userName: 'Alice Smith',
            userAvatar: 'https://images.pexels.com/photos/8721322/pexels-photo-8721322.jpeg',
            text: 'Inspiring! What workout did you do?',
            timestamp: '2025-08-11T07:30:00Z'
          }
        ],
        timestamp: '2025-08-11T07:00:00Z'
      }
    ];

    // Load saved likes and comments from localStorage
    const globalLikes = JSON.parse(localStorage.getItem('globalLikes') || '{}');
    const globalComments = JSON.parse(localStorage.getItem('globalComments') || '{}');

    // Add isLikedByCurrentUser property and apply saved data
    const postsWithLikeStatus = mockPosts.map(post => {
      const savedLikes = globalLikes[post.id] || post.likes;
      const savedComments = globalComments[post.id] || post.comments;
      
      return {
        ...post,
        likes: savedLikes,
        comments: savedComments,
        isLikedByCurrentUser: savedLikes.includes(mockUser.uid)
      };
    });

    setPosts(postsWithLikeStatus);
  }, []);

  const toggleLike = (postId: string) => {
    // Update local state immediately (optimistic update)
    setPosts(prevPosts => 
      prevPosts.map(post => {
        if (post.id === postId) {
          const hasLiked = post.likes.includes(mockUser.uid);
          const newLikes = hasLiked 
            ? post.likes.filter(uid => uid !== mockUser.uid)
            : [...post.likes, mockUser.uid];
          
          // Also save to localStorage for persistence
          const globalLikes = JSON.parse(localStorage.getItem('globalLikes') || '{}');
          globalLikes[postId] = newLikes;
          localStorage.setItem('globalLikes', JSON.stringify(globalLikes));
          
          return {
            ...post,
            likes: newLikes,
            isLikedByCurrentUser: !hasLiked
          };
        }
        return post;
      })
    );
  };

  const addComment = (postId: string, text: string) => {
    if (!text.trim()) {
      setError('Comment cannot be empty');
      return;
    }

    const newComment: SimpleComment = {
      id: `c${Date.now()}`,
      userId: mockUser.uid,
      userName: mockUser.username,
      userAvatar: mockUser.avatar,
      text: text.trim(),
      timestamp: new Date().toISOString()
    };

    setPosts(prevPosts =>
      prevPosts.map(post => {
        if (post.id === postId) {
          const updatedComments = [...post.comments, newComment];
          
          // Save to localStorage for persistence
          const globalComments = JSON.parse(localStorage.getItem('globalComments') || '{}');
          globalComments[postId] = updatedComments;
          localStorage.setItem('globalComments', JSON.stringify(globalComments));
          
          return {
            ...post,
            comments: updatedComments
          };
        }
        return post;
      })
    );

    setError(null);
  };

  const value: PostsContextType = {
    posts,
    toggleLike,
    addComment,
    error
  };

  return (
    <PostsContext.Provider value={value}>
      {children}
    </PostsContext.Provider>
  );
};

export const usePosts = () => {
  const context = useContext(PostsContext);
  if (!context) {
    throw new Error('usePosts must be used within a PostsProvider');
  }
  return context;
}; 