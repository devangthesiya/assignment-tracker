import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { 
  initializePost, 
  togglePostLike, 
  addPostComment, 
  getPostLikes, 
  getPostComments,
  subscribeToPostLikes,
  subscribeToPostComments,
  type FirestorePost
} from '../firebase/posts';

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
  toggleLike: (postId: string) => Promise<void>;
  addComment: (postId: string, text: string) => Promise<void>;
  error: string | null;
  loading: boolean;
}

const PostsContext = createContext<PostsContextType | null>(null);

interface PostsProviderProps {
  children: ReactNode;
}

export const PostsProvider: React.FC<PostsProviderProps> = ({ children }) => {
  const [posts, setPosts] = useState<SimplePost[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  
  // Mock guest user - everyone uses this
  const mockUser = {
    uid: 'u123',
    username: 'Guest User',
    avatar: 'https://images.pexels.com/photos/8721322/pexels-photo-8721322.jpeg'
  };

  useEffect(() => {
    const initializePosts = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Define mock posts (these will be stored in Firestore)
        const mockPosts: FirestorePost[] = [
          {
            id: 'p1',
            authorId: 'sample_user_1',
            authorName: 'Alice Smith',
            authorAvatar: 'https://images.pexels.com/photos/8721322/pexels-photo-8721322.jpeg',
            imageUrl: 'https://images.pexels.com/photos/33498261/pexels-photo-33498261.jpeg',
            caption: 'Beautiful sunset from my balcony! Nature never fails to amaze me 🌅',
            timestamp: '2025-08-15T09:45:00Z'
          },
          {
            id: 'p2',
            authorId: 'sample_user_2',
            authorName: 'Bob Johnson',
            authorAvatar: 'https://images.pexels.com/photos/8721322/pexels-photo-8721322.jpeg',
            imageUrl: 'https://images.pexels.com/photos/33498261/pexels-photo-33498261.jpeg',
            caption: 'Morning coffee and good vibes ☕️ Ready to tackle the day!',
            timestamp: '2025-08-14T08:00:00Z'
          },
          {
            id: 'p3',
            authorId: 'sample_user_3',
            authorName: 'Charlie Davis',
            authorAvatar: 'https://images.pexels.com/photos/8721322/pexels-photo-8721322.jpeg',
            imageUrl: 'https://images.pexels.com/photos/33498261/pexels-photo-33498261.jpeg',
            caption: 'Weekend adventures in the city! 🏙️ Love exploring new places',
            timestamp: '2025-08-13T15:30:00Z'
          },
          {
            id: 'p4',
            authorId: 'sample_user_4',
            authorName: 'Diana Martinez',
            authorAvatar: 'https://images.pexels.com/photos/8721322/pexels-photo-8721322.jpeg',
            imageUrl: 'https://images.pexels.com/photos/33498261/pexels-photo-33498261.jpeg',
            caption: 'Golden hour magic ✨ Sometimes the best moments are unplanned',
            timestamp: '2025-08-12T18:20:00Z'
          },
          {
            id: 'p5',
            authorId: 'sample_user_5',
            authorName: 'Emma Wilson',
            authorAvatar: 'https://images.pexels.com/photos/8721322/pexels-photo-8721322.jpeg',
            imageUrl: 'https://images.pexels.com/photos/33498261/pexels-photo-33498261.jpeg',
            caption: 'Just finished my morning workout! 💪 Feeling energized and ready for the day',
            timestamp: '2025-08-11T07:00:00Z'
          }
        ];

        // Initialize posts in Firestore
        await Promise.all(mockPosts.map(post => initializePost(post)));

        // Load posts with real-time likes and comments from Firestore
        const postsWithData = await Promise.all(
          mockPosts.map(async (post) => {
            const [likesData, commentsData] = await Promise.all([
              getPostLikes(post.id),
              getPostComments(post.id)
            ]);

            return {
              ...post,
              likes: likesData.likes,
              comments: commentsData.comments.map(comment => ({
                id: comment.id,
                userId: comment.userId,
                userName: comment.userName,
                userAvatar: comment.userAvatar,
                text: comment.text,
                timestamp: comment.timestamp?.toDate ? comment.timestamp.toDate().toISOString() : comment.timestamp
              })),
              isLikedByCurrentUser: likesData.likes.includes(mockUser.uid)
            };
          })
        );

        setPosts(postsWithData);

        // Set up real-time listeners for each post
        const unsubscribers: (() => void)[] = [];
        
        mockPosts.forEach((post) => {
          // Listen to likes changes
          const likesUnsubscriber = subscribeToPostLikes(post.id, (likesData) => {
            setPosts(prevPosts => 
              prevPosts.map(p => 
                p.id === post.id 
                  ? { 
                      ...p, 
                      likes: likesData.likes,
                      isLikedByCurrentUser: likesData.likes.includes(mockUser.uid)
                    }
                  : p
              )
            );
          });

          // Listen to comments changes
          const commentsUnsubscriber = subscribeToPostComments(post.id, (commentsData) => {
            setPosts(prevPosts => 
              prevPosts.map(p => 
                p.id === post.id 
                  ? { 
                      ...p, 
                      comments: commentsData.comments.map(comment => ({
                        id: comment.id,
                        userId: comment.userId,
                        userName: comment.userName,
                        userAvatar: comment.userAvatar,
                        text: comment.text,
                        timestamp: comment.timestamp?.toDate ? comment.timestamp.toDate().toISOString() : comment.timestamp
                      }))
                    }
                  : p
              )
            );
          });

          unsubscribers.push(likesUnsubscriber, commentsUnsubscriber);
        });

        // Cleanup function
        return () => {
          unsubscribers.forEach(unsubscribe => unsubscribe());
        };
      } catch (err) {
        console.error('Error initializing posts:', err);
        setError('Failed to load posts: ' + (err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    initializePosts();
  }, []);

  const toggleLike = async (postId: string) => {
    try {
      setError(null);
      
      // Optimistic update - immediately update UI
      setPosts(prevPosts => 
        prevPosts.map(post => {
          if (post.id === postId) {
            const hasLiked = post.likes.includes(mockUser.uid);
            const newLikes = hasLiked 
              ? post.likes.filter(uid => uid !== mockUser.uid)
              : [...post.likes, mockUser.uid];
            
            return {
              ...post,
              likes: newLikes,
              isLikedByCurrentUser: !hasLiked
            };
          }
          return post;
        })
      );

      // Update Firestore (real-time listeners will sync this across all users)
      await togglePostLike(postId, mockUser.uid);
    } catch (err) {
      console.error('Error toggling like:', err);
      setError('Failed to update like: ' + (err as Error).message);
      
      // Revert optimistic update on error
      setPosts(prevPosts => 
        prevPosts.map(post => {
          if (post.id === postId) {
            const hasLiked = post.likes.includes(mockUser.uid);
            const revertedLikes = hasLiked 
              ? post.likes.filter(uid => uid !== mockUser.uid)
              : [...post.likes, mockUser.uid];
            
            return {
              ...post,
              likes: revertedLikes,
              isLikedByCurrentUser: !hasLiked
            };
          }
          return post;
        })
      );
    }
  };

  const addComment = async (postId: string, text: string) => {
    if (!text.trim()) {
      setError('Comment cannot be empty');
      return;
    }

    try {
      setError(null);
      
      const newComment: SimpleComment = {
        id: `c${Date.now()}_temp`, // Temporary ID for optimistic update
        userId: mockUser.uid,
        userName: mockUser.username,
        userAvatar: mockUser.avatar,
        text: text.trim(),
        timestamp: new Date().toISOString()
      };

      // Optimistic update - immediately show comment in UI
      setPosts(prevPosts =>
        prevPosts.map(post => {
          if (post.id === postId) {
            return {
              ...post,
              comments: [...post.comments, newComment]
            };
          }
          return post;
        })
      );

      // Add comment to Firestore (real-time listeners will sync this across all users)
      await addPostComment(
        postId, 
        mockUser.uid, 
        mockUser.username, 
        mockUser.avatar, 
        text.trim()
      );
    } catch (err) {
      console.error('Error adding comment:', err);
      setError('Failed to add comment: ' + (err as Error).message);
      
      // Revert optimistic update on error
      setPosts(prevPosts =>
        prevPosts.map(post => {
          if (post.id === postId) {
            return {
              ...post,
              comments: post.comments.filter(comment => !comment.id.includes('_temp'))
            };
          }
          return post;
        })
      );
    }
  };

  const value: PostsContextType = {
    posts,
    toggleLike,
    addComment,
    error,
    loading
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