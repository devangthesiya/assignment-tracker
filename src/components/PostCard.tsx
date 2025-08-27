import React, { useState } from "react";
import { usePosts } from "../context/PostsContext";

interface SimplePost {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  imageUrl: string;
  caption: string;
  likes: string[];
  comments: Array<{
    id: string;
    userId: string;
    userName: string;
    userAvatar: string;
    text: string;
    timestamp: string;
  }>;
  timestamp: string;
  isLikedByCurrentUser?: boolean;
}

interface PostCardProps {
  post: SimplePost;
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const { toggleLike, addComment } = usePosts();
  const [showComments, setShowComments] = useState(false);
  const [showAddComment, setShowAddComment] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatTimestamp = (timestamp: any) => {
    if (!timestamp) return "Just now";

    // Handle Firestore Timestamp
    const date = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d`;
  };

  const handleLike = () => {
    toggleLike(post.id);
  };

  const handleComment = () => {
    setShowAddComment(!showAddComment);
  };

  const handleSubmitComment = async () => {
    if (!commentText.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await addComment(post.id, commentText);
      setCommentText("");
      setShowAddComment(false);
      setShowComments(true); // Show comments after adding one
    } catch (error) {
      console.error("Error adding comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
      {/* Post Header */}
      <div className="flex items-center p-4">
        <img
          src={post.authorAvatar}
          alt={post.authorName}
          className="w-8 h-8 rounded-full object-cover"
        />
        <div className="ml-3 flex-1">
          <p className="font-semibold text-sm text-gray-900 dark:text-white">
            {post.authorName}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {formatTimestamp(post.timestamp)}
          </p>
        </div>
        <button className="p-1">
          <svg
            className="w-6 h-6 text-gray-400 dark:text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
            />
          </svg>
        </button>
      </div>

      {/* Post Image */}
      <div className="relative">
        <img
          src={post.imageUrl}
          alt="Post content"
          className="w-full h-80 object-cover"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-4">
          <button onClick={handleLike} className="focus:outline-none">
            <svg
              className={`w-6 h-6 ${
                post.isLikedByCurrentUser
                  ? "text-red-500 fill-current"
                  : "text-gray-900 dark:text-gray-100"
              }`}
              fill={post.isLikedByCurrentUser ? "currentColor" : "none"}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>

          <button onClick={handleComment} className="focus:outline-none">
            <svg
              className="w-6 h-6 text-gray-900 dark:text-gray-100"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a9.863 9.863 0 01-4.906-1.294l-3.823 1.024a.75.75 0 01-.939-.939l1.024-3.823A9.863 9.863 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z"
              />
            </svg>
          </button>

          <button className="focus:outline-none">
            <svg
              className="w-6 h-6 text-gray-900 dark:text-gray-100"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
              />
            </svg>
          </button>
        </div>

        <button className="focus:outline-none">
          <svg
            className="w-6 h-6 text-gray-900 dark:text-gray-100"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
            />
          </svg>
        </button>
      </div>

      {/* Post Content */}
      <div className="px-4 pb-4">
        {/* Like Count */}
        {post.likes.length > 0 && (
          <p className="font-semibold text-sm text-gray-900 dark:text-white mb-2">
            {post.likes.length} {post.likes.length === 1 ? "like" : "likes"}
          </p>
        )}

        {/* Caption */}
        <div className="mb-2">
          <span className="font-semibold text-sm text-gray-900 dark:text-white mr-2">
            {post.authorName}
          </span>
          <span className="text-sm text-gray-900 dark:text-gray-200">{post.caption}</span>
        </div>

        {/* Comments Preview */}
        {post.comments.length > 0 && (
          <button
            onClick={() => setShowComments(!showComments)}
            className="text-sm text-gray-500 dark:text-gray-400 mb-2 block"
          >
            {showComments
              ? "Hide comments"
              : `View all ${post.comments.length} comments`}
          </button>
        )}

        {/* Comments List */}
        {showComments && (
          <div className="space-y-2 mb-3">
            {post.comments.map((comment) => (
              <div key={comment.id} className="flex items-start space-x-2">
                <img
                  src={comment.userAvatar}
                  alt={comment.userName}
                  className="w-6 h-6 rounded-full object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-baseline">
                    <span className="font-semibold text-sm text-gray-900 dark:text-white mr-2">
                      {comment.userName}
                    </span>
                    <span className="text-sm text-gray-900 dark:text-gray-200 break-words">
                      {comment.text}
                    </span>
                  </div>
                  <div className="flex items-center mt-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {formatTimestamp(comment.timestamp)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Comment */}
        {showAddComment && (
          <div className="flex items-center space-x-2 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
            <img
              src="https://images.pexels.com/photos/8721322/pexels-photo-8721322.jpeg"
              alt="Your avatar"
              className="w-6 h-6 rounded-full object-cover"
            />
            <div className="flex-1 flex items-center space-x-2">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 text-sm bg-transparent border-none outline-none placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleSubmitComment();
                  }
                }}
              />
              <button
                onClick={handleSubmitComment}
                disabled={!commentText.trim() || isSubmitting}
                className="text-sm font-semibold text-blue-500 dark:text-blue-400 disabled:text-gray-400 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Posting..." : "Post"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
