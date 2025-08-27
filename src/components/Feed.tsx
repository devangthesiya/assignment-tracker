import React from "react";
import { PostCard } from "./PostCard";
import { PostSkeletonList } from "./PostSkeleton";
import { usePosts } from "../context/PostsContext";

export const Feed: React.FC = () => {
  const { posts, error, loading } = usePosts();

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Sociogram</h1>
          </div>
        </div>
      </header>

      {/* Feed Content */}
      <main className="max-w-md mx-auto">
        {loading ? (
          <PostSkeletonList count={5} />
        ) : posts.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No posts yet
              </h3>
              <p className="text-gray-500">
                Posts will appear here when available.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-0">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
