import React, { useState, useEffect } from "react";
import type { FirestorePost } from "../firebase/posts";
import {
  togglePostLike,
  addPostComment,
  subscribeToPostLikes,
  subscribeToPostComments,
  type PostLikes,
  type PostComments,
} from "../firebase/posts";
import { getCurrentUser } from "../utils/userManager";

interface PostCardProps {
  post: FirestorePost;
}

const formatTimestamp = (timestamp: string): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInDays > 0) {
    return `${diffInDays}d`;
  } else if (diffInHours > 0) {
    return `${diffInHours}h`;
  } else {
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    return diffInMinutes > 0 ? `${diffInMinutes}m` : "now";
  }
};

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const [likes, setLikes] = useState<PostLikes>({
    postId: post.id,
    likes: [],
    likeCount: 0,
  });
  const [comments, setComments] = useState<PostComments>({
    postId: post.id,
    comments: [],
    commentCount: 0,
  });
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentUser = getCurrentUser();
  const isLiked = likes.likes.includes(currentUser.id);

  useEffect(() => {
    const unsubscribeLikes = subscribeToPostLikes(post.id, setLikes);
    const unsubscribeComments = subscribeToPostComments(post.id, setComments);

    return () => {
      unsubscribeLikes();
      unsubscribeComments();
    };
  }, [post.id]);

  const handleLike = async () => {
    try {
      await togglePostLike(post.id, currentUser.id);
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await addPostComment(
        post.id,
        currentUser.id,
        currentUser.username,
        currentUser.avatar,
        newComment
      );
      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white border-b border-gray-200">
      {/* Post Header */}
      <div className="flex items-center p-4">
        <img
          src={post.authorAvatar}
          alt={post.authorName}
          className="w-8 h-8 rounded-full object-cover"
        />
        <div className="ml-3 flex-1">
          <p className="font-semibold text-sm text-gray-900">
            {post.authorName}
          </p>
          <p className="text-xs text-gray-500">
            {formatTimestamp(post.timestamp)}
          </p>
        </div>
        <button className="p-1">
          <svg
            className="w-6 h-6 text-gray-400"
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
      <div className="flex items-center p-4 space-x-4">
        <button onClick={handleLike} className="flex items-center space-x-2">
          <svg
            className={`w-6 h-6 ${
              isLiked ? "text-red-500 fill-current" : "text-gray-900"
            }`}
            fill="none"
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

        <button className="flex items-center space-x-2">
          <svg
            className="w-6 h-6 text-gray-900"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </button>

        <button className="flex items-center space-x-2">
          <svg
            className="w-6 h-6 text-gray-900"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
            />
          </svg>
        </button>

        <div className="flex-1"></div>

        <button className="flex items-center space-x-2">
          <svg
            className="w-6 h-6 text-gray-900"
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

      {/* Likes and Caption */}
      <div className="px-4 pb-2">
        {likes.likeCount > 0 && (
          <p className="font-semibold text-sm text-gray-900 mb-2">
            {likes.likeCount} {likes.likeCount === 1 ? "like" : "likes"}
          </p>
        )}

        <div className="space-y-1">
          <span className="font-semibold text-sm text-gray-900 mr-2">
            {post.authorName}
          </span>
          <span className="text-sm text-gray-900">{post.caption}</span>
        </div>
      </div>

      {/* Comments */}
      <div className="px-4 pb-4">
        {comments.commentCount > 0 && (
          <button
            className="text-sm text-gray-500 mb-2 block"
            onClick={() => {
              // Could implement "View all comments" functionality here
            }}
          >
            {comments.commentCount > 3
              ? `View all ${comments.commentCount} comments`
              : `View ${comments.commentCount === 1 ? "comment" : "comments"}`}
          </button>
        )}

        {/* Show last few comments */}
        <div className="space-y-1">
          {comments.comments.slice(-3).map((comment) => (
            <div key={comment.id} className="flex space-x-2 items-center">
              <span className="font-semibold text-sm text-gray-900 mr-2">
                {comment.userName}
              </span>
              <span className="text-sm text-gray-900 break-words">
                {comment.text}
              </span>
              <span className="text-xs text-gray-500">
                {formatTimestamp(
                  comment.timestamp?.toDate?.() || comment.timestamp
                )}
              </span>
            </div>
          ))}
        </div>

        {/* Add Comment */}
        <div className="flex items-center space-x-2 mt-3 pt-3 border-t border-gray-100">
          <img
            src={currentUser.avatar}
            alt={currentUser.username}
            className="w-6 h-6 rounded-full object-cover flex-shrink-0"
          />
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 text-sm bg-transparent border-none outline-none placeholder-gray-500 text-gray-900"
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleAddComment();
              }
            }}
          />
          {newComment.trim() && (
            <button
              onClick={handleAddComment}
              disabled={isSubmitting}
              className="text-sm font-semibold text-blue-500 disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              Post
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
