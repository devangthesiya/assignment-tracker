import React from 'react';

export const PostSkeleton: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
      {/* Header Skeleton */}
      <div className="px-4 py-3 flex items-center space-x-3">
        {/* Avatar skeleton */}
        <div className="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-full animate-pulse"></div>
        <div className="flex-1">
          {/* Username skeleton */}
          <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded animate-pulse w-24"></div>
          {/* Time skeleton */}
          <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded animate-pulse w-16 mt-1"></div>
        </div>
      </div>

      {/* Image Skeleton */}
      <div className="w-full h-80 bg-gray-200 dark:bg-gray-600 animate-pulse"></div>

      {/* Actions Skeleton */}
      <div className="px-4 py-3">
        <div className="flex items-center space-x-4 mb-2">
          {/* Heart icon skeleton */}
          <div className="w-6 h-6 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
          {/* Comment icon skeleton */}
          <div className="w-6 h-6 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
        </div>
        
        {/* Likes count skeleton */}
        <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded animate-pulse w-20 mb-2"></div>
        
        {/* Caption skeleton */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded animate-pulse w-full"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded animate-pulse w-3/4"></div>
        </div>

        {/* Comments skeleton */}
        <div className="mt-3 space-y-2">
          <div className="flex space-x-2">
            <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded animate-pulse w-16"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded animate-pulse w-32"></div>
          </div>
          <div className="flex space-x-2">
            <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded animate-pulse w-20"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded animate-pulse w-40"></div>
          </div>
        </div>

        {/* Comment input skeleton */}
        <div className="mt-3 flex items-center space-x-3">
          <div className="w-6 h-6 bg-gray-200 dark:bg-gray-600 rounded-full animate-pulse"></div>
          <div className="flex-1 h-8 bg-gray-200 dark:bg-gray-600 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

// Component to show multiple skeleton posts
export const PostSkeletonList: React.FC<{ count?: number }> = ({ count = 3 }) => {
  return (
    <div className="space-y-0">
      {Array.from({ length: count }).map((_, index) => (
        <PostSkeleton key={index} />
      ))}
    </div>
  );
}; 