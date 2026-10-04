import React, { useState, useEffect, useCallback } from "react";
import { CommunityPost } from "@/entities/CommunityPost";
import { User } from "@/entities/User";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  MessageCircle,
  ShoppingCart,
  TrendingUp,
  Search,
  Plus
} from "lucide-react";

import PostCard from "../components/community/PostCard";
import CreatePostModal from "../components/community/CreatePostModal";
import MarketplaceFilters from "../components/community/MarketplaceFilters";
import BackButton from "../components/shared/BackButton";

export default function CommunityPage() {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("discussions");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filters, setFilters] = useState({
    category: "all",
    crop: "all",
    location: "all"
  });
  const [isLoading, setIsLoading] = useState(true);

  // Memoize filterPosts function using useCallback
  const filterPosts = useCallback(() => {
    let filtered = [...posts];

    // Tab filter
    if (activeTab === "marketplace") {
      filtered = filtered.filter(post => post.is_marketplace === true);
    } else {
      filtered = filtered.filter(post => post.is_marketplace !== true);
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(post => 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (post.crop_related && post.crop_related.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Category filter
    if (filters.category !== "all") {
      filtered = filtered.filter(post => post.category === filters.category);
    }

    // Crop filter
    if (filters.crop !== "all") {
      filtered = filtered.filter(post => post.crop_related === filters.crop);
    }

    setFilteredPosts(filtered);
  }, [posts, searchTerm, activeTab, filters]); // Dependencies for useCallback

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterPosts();
  }, [posts, searchTerm, activeTab, filters, filterPosts]); // Added filterPosts to dependencies

  const loadData = async () => {
    setIsLoading(true);
    try {
      const userData = await User.me();
      setUser(userData);

      const postsData = await CommunityPost.list("-created_date");
      setPosts(postsData);
    } catch (error) {
      console.error("Error loading data:", error);
    }
    setIsLoading(false);
  };

  const handleCreatePost = async (postData) => {
    try {
      await CommunityPost.create(postData);
      setShowCreateModal(false);
      loadData();
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  const handleLikePost = async (postId) => {
    try {
      const post = posts.find(p => p.id === postId);
      await CommunityPost.update(postId, {
        ...post,
        likes_count: (post.likes_count || 0) + 1
      });
      loadData();
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-48"></div>
            <div className="space-y-4">
              {Array(5).fill(0).map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 min-h-screen">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <BackButton />
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Community Hub</h1>
          <p className="text-gray-600">
            Connect with fellow farmers, share knowledge, and grow together
          </p>
        </div>

        {/* Community Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-lg text-center">
            <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">1,247</div>
            <div className="text-gray-600 text-sm">Active Farmers</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-lg text-center">
            <MessageCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{posts.filter(p => !p.is_marketplace).length}</div>
            <div className="text-gray-600 text-sm">Discussions</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-lg text-center">
            <ShoppingCart className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{posts.filter(p => p.is_marketplace).length}</div>
            <div className="text-gray-600 text-sm">Market Posts</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-lg text-center">
            <TrendingUp className="w-8 h-8 text-orange-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">89%</div>
            <div className="text-gray-600 text-sm">Success Rate</div>
          </div>
        </div>

        {/* Search and Create */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search discussions, crops, marketplace..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white shadow-sm"
            />
          </div>
          <Button 
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Post
          </Button>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 bg-white">
            <TabsTrigger value="discussions" className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              Discussions
            </TabsTrigger>
            <TabsTrigger value="marketplace" className="flex items-center gap-2">
              <ShoppingCart className="w-4 h-4" />
              Marketplace
            </TabsTrigger>
          </TabsList>

          <TabsContent value="discussions" className="space-y-6">
            {filteredPosts.length > 0 ? (
              <div className="space-y-4">
                {filteredPosts.map((post) => (
                  <PostCard 
                    key={post.id} 
                    post={post}
                    onLike={handleLikePost}
                    user={user}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No discussions found</h3>
                <p className="text-gray-600 mb-6">
                  Start the conversation by creating your first post
                </p>
                <Button 
                  onClick={() => setShowCreateModal(true)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Create First Post
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="marketplace" className="space-y-6">
            <MarketplaceFilters filters={filters} setFilters={setFilters} />
            
            {filteredPosts.length > 0 ? (
              <div className="space-y-4">
                {filteredPosts.map((post) => (
                  <PostCard 
                    key={post.id} 
                    post={post}
                    onLike={handleLikePost}
                    user={user}
                    isMarketplace={true}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No marketplace posts found</h3>
                <p className="text-gray-600 mb-6">
                  Be the first to buy or sell in the marketplace
                </p>
                <Button 
                  onClick={() => setShowCreateModal(true)}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  Create Marketplace Post
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <CreatePostModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreatePost}
          user={user}
        />
      </div>
    </div>
  );
}