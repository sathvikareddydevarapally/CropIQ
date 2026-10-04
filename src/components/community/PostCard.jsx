import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Heart,
  MessageCircle,
  Share2,
  MapPin,
  Calendar,
  ShoppingCart,
  Tag
} from "lucide-react";

const getCategoryColor = (category) => {
  const colors = {
    discussion: "bg-blue-100 text-blue-800",
    question: "bg-purple-100 text-purple-800",
    tip: "bg-green-100 text-green-800",
    marketplace_sell: "bg-orange-100 text-orange-800",
    marketplace_buy: "bg-cyan-100 text-cyan-800",
    group_purchase: "bg-pink-100 text-pink-800"
  };
  return colors[category] || "bg-gray-100 text-gray-800";
};

export default function PostCard({ post, onLike, user, isMarketplace = false }) {
  return (
    <Card className="hover:shadow-lg transition-all duration-300 border-none shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                {post.created_by?.[0]?.toUpperCase() || 'F'}
              </span>
            </div>
            <div>
              <div className="font-semibold text-gray-900">{post.created_by}</div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar className="w-3 h-3" />
                <span>{new Date(post.created_date).toLocaleDateString()}</span>
                {post.location && (
                  <>
                    <MapPin className="w-3 h-3" />
                    <span>{post.location}</span>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getCategoryColor(post.category)}>
              {post.category.replace('_', ' ')}
            </Badge>
            {post.crop_related && (
              <Badge variant="outline">
                {post.crop_related}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <h3 className="font-bold text-lg text-gray-900 mb-2">{post.title}</h3>
          <p className="text-gray-700">{post.content}</p>
        </div>

        {/* Marketplace Details */}
        {isMarketplace && post.marketplace_details && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <ShoppingCart className="w-4 h-4 text-amber-600" />
              <span className="font-semibold text-amber-900">Marketplace Details</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {post.marketplace_details.price && (
                <div>
                  <span className="text-gray-600">Price:</span>
                  <span className="font-semibold ml-2">${post.marketplace_details.price}</span>
                </div>
              )}
              {post.marketplace_details.quantity && (
                <div>
                  <span className="text-gray-600">Quantity:</span>
                  <span className="font-semibold ml-2">
                    {post.marketplace_details.quantity} {post.marketplace_details.unit}
                  </span>
                </div>
              )}
              {post.marketplace_details.contact_info && (
                <div className="col-span-2">
                  <span className="text-gray-600">Contact:</span>
                  <span className="font-semibold ml-2">{post.marketplace_details.contact_info}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Images */}
        {post.images && post.images.length > 0 && (
          <div className="grid grid-cols-2 gap-2">
            {post.images.slice(0, 4).map((image, index) => (
              <img
                key={index}
                src={image}
                alt="Post image"
                className="w-full h-32 object-cover rounded-lg"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            ))}
          </div>
        )}

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                <Tag className="w-3 h-3 mr-1" />
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onLike(post.id)}
              className="text-gray-600 hover:text-red-600"
            >
              <Heart className="w-4 h-4 mr-1" />
              {post.likes_count || 0}
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-600">
              <MessageCircle className="w-4 h-4 mr-1" />
              {post.comments_count || 0}
            </Button>
          </div>
          <Button variant="ghost" size="sm" className="text-gray-600">
            <Share2 className="w-4 h-4 mr-1" />
            Share
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}