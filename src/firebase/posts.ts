import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  arrayUnion, 
  arrayRemove,
  onSnapshot,
  serverTimestamp
} from 'firebase/firestore';
import { db } from './config';

// Collection names
const POSTS_COLLECTION = 'posts';
const LIKES_COLLECTION = 'post_likes';
const COMMENTS_COLLECTION = 'post_comments';

// Interfaces
export interface FirestoreComment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  text: string;
  timestamp: any;
}

export interface FirestorePost {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  imageUrl: string;
  caption: string;
  timestamp: string;
}

export interface PostLikes {
  postId: string;
  likes: string[]; // Array of user IDs who liked the post
  likeCount: number;
}

export interface PostComments {
  postId: string;
  comments: FirestoreComment[];
  commentCount: number;
}

// Initialize post data in Firestore (for mock posts)
export const initializePost = async (post: FirestorePost): Promise<void> => {
  try {
    const postRef = doc(db, POSTS_COLLECTION, post.id);
    await setDoc(postRef, post, { merge: true });
    
    // Initialize likes document
    const likesRef = doc(db, LIKES_COLLECTION, post.id);
    const likesDoc = await getDoc(likesRef);
    if (!likesDoc.exists()) {
      await setDoc(likesRef, {
        postId: post.id,
        likes: [],
        likeCount: 0,
        lastUpdated: serverTimestamp()
      });
    }
    
    // Initialize comments document
    const commentsRef = doc(db, COMMENTS_COLLECTION, post.id);
    const commentsDoc = await getDoc(commentsRef);
    if (!commentsDoc.exists()) {
      await setDoc(commentsRef, {
        postId: post.id,
        comments: [],
        commentCount: 0,
        lastUpdated: serverTimestamp()
      });
    }
    
    console.log('Post initialized in Firestore:', post.id);
  } catch (error) {
    console.error('Error initializing post:', error);
    throw error;
  }
};

// Toggle like for a post
export const togglePostLike = async (postId: string, userId: string): Promise<{ isLiked: boolean; likeCount: number }> => {
  try {
    const likesRef = doc(db, LIKES_COLLECTION, postId);
    const likesDoc = await getDoc(likesRef);
    
    if (!likesDoc.exists()) {
      // Create new likes document
      await setDoc(likesRef, {
        postId,
        likes: [userId],
        likeCount: 1,
        lastUpdated: serverTimestamp()
      });
      return { isLiked: true, likeCount: 1 };
    }
    
    const currentLikes = likesDoc.data().likes || [];
    const isCurrentlyLiked = currentLikes.includes(userId);
    
    if (isCurrentlyLiked) {
      // Remove like
      await updateDoc(likesRef, {
        likes: arrayRemove(userId),
        likeCount: Math.max(0, currentLikes.length - 1),
        lastUpdated: serverTimestamp()
      });
      return { isLiked: false, likeCount: Math.max(0, currentLikes.length - 1) };
    } else {
      // Add like
      await updateDoc(likesRef, {
        likes: arrayUnion(userId),
        likeCount: currentLikes.length + 1,
        lastUpdated: serverTimestamp()
      });
      return { isLiked: true, likeCount: currentLikes.length + 1 };
    }
  } catch (error) {
    console.error('Error toggling like:', error);
    throw error;
  }
};

// Add comment to a post
export const addPostComment = async (
  postId: string, 
  userId: string, 
  userName: string, 
  userAvatar: string, 
  text: string
): Promise<FirestoreComment> => {
  try {
    // Use a regular timestamp for comments since serverTimestamp() doesn't work in arrays
    const now = new Date();
    const newComment: FirestoreComment = {
      id: `c${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      userName,
      userAvatar,
      text: text.trim(),
      timestamp: now // Use regular Date object instead of serverTimestamp()
    };
    
    const commentsRef = doc(db, COMMENTS_COLLECTION, postId);
    const commentsDoc = await getDoc(commentsRef);
    
    if (!commentsDoc.exists()) {
      // Create new comments document
      await setDoc(commentsRef, {
        postId,
        comments: [newComment],
        commentCount: 1,
        lastUpdated: serverTimestamp()
      });
    } else {
      // Update existing comments
      const currentComments = commentsDoc.data().comments || [];
      await updateDoc(commentsRef, {
        comments: [...currentComments, newComment],
        commentCount: currentComments.length + 1,
        lastUpdated: serverTimestamp()
      });
    }
    
    console.log('Comment added:', newComment);
    return newComment;
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
};

// Get likes for a post
export const getPostLikes = async (postId: string): Promise<PostLikes> => {
  try {
    const likesRef = doc(db, LIKES_COLLECTION, postId);
    const likesDoc = await getDoc(likesRef);
    
    if (likesDoc.exists()) {
      return likesDoc.data() as PostLikes;
    } else {
      return {
        postId,
        likes: [],
        likeCount: 0
      };
    }
  } catch (error) {
    console.error('Error getting likes:', error);
    throw error;
  }
};

// Get comments for a post
export const getPostComments = async (postId: string): Promise<PostComments> => {
  try {
    const commentsRef = doc(db, COMMENTS_COLLECTION, postId);
    const commentsDoc = await getDoc(commentsRef);
    
    if (commentsDoc.exists()) {
      return commentsDoc.data() as PostComments;
    } else {
      return {
        postId,
        comments: [],
        commentCount: 0
      };
    }
  } catch (error) {
    console.error('Error getting comments:', error);
    throw error;
  }
};

// Subscribe to real-time updates for post likes
export const subscribeToPostLikes = (postId: string, callback: (likes: PostLikes) => void) => {
  const likesRef = doc(db, LIKES_COLLECTION, postId);
  
  return onSnapshot(likesRef, (doc) => {
    if (doc.exists()) {
      callback(doc.data() as PostLikes);
    } else {
      callback({
        postId,
        likes: [],
        likeCount: 0
      });
    }
  }, (error) => {
    console.error('Error in likes subscription:', error);
  });
};

// Subscribe to real-time updates for post comments
export const subscribeToPostComments = (postId: string, callback: (comments: PostComments) => void) => {
  const commentsRef = doc(db, COMMENTS_COLLECTION, postId);
  
  return onSnapshot(commentsRef, (doc) => {
    if (doc.exists()) {
      callback(doc.data() as PostComments);
    } else {
      callback({
        postId,
        comments: [],
        commentCount: 0
      });
    }
  }, (error) => {
    console.error('Error in comments subscription:', error);
  });
}; 