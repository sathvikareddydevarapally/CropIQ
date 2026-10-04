import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  TrendingUp,
  MoreVertical,
  Eye
} from "lucide-react";

const getGrowthStageColor = (stage) => {
  const colors = {
    seedling: "bg-green-100 text-green-800",
    vegetative: "bg-blue-100 text-blue-800",
    flowering: "bg-purple-100 text-purple-800", 
    fruiting: "bg-orange-100 text-orange-800",
    maturity: "bg-yellow-100 text-yellow-800",
    harvest: "bg-red-100 text-red-800"
  };
  return colors[stage] || "bg-gray-100 text-gray-800";
};

const getHealthColor = (health) => {
  const colors = {
    excellent: "bg-green-100 text-green-800",
    good: "bg-blue-100 text-blue-800", 
    fair: "bg-yellow-100 text-yellow-800",
    poor: "bg-red-100 text-red-800"
  };
  return colors[health] || "bg-gray-100 text-gray-800";
};

// Array of different crop images
const getCropImage = (cropName) => {
  const cropImages = {
    corn: "https://images.unsplash.com/photo-1551754655-cd27e38ad5d9?w=400&h=300&fit=crop",
    wheat: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400&h=300&fit=crop", 
    rice: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop",
    tomato: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=400&h=300&fit=crop",
    potato: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&h=300&fit=crop",
    beans: "https://images.unsplash.com/photo-1583258292688-d0213dc5a2c8?w=400&h=300&fit=crop",
    soybean: "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=400&h=300&fit=crop",
    cotton: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop"
  };
  
  const cropKey = cropName.toLowerCase();
  return cropImages[cropKey] || "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400&h=300&fit=crop";
};

export default function CropCard({ crop, onUpdate }) {
  const getDaysToHarvest = () => {
    if (!crop.expected_harvest_date) return null;
    const today = new Date();
    const harvest = new Date(crop.expected_harvest_date);
    const diffTime = harvest - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysToHarvest = getDaysToHarvest();

  return (
    <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-none shadow-lg overflow-hidden">
      {/* Crop Image */}
      <div className="h-48 overflow-hidden relative">
        <img 
          src={crop.photo_url || getCropImage(crop.name)}
          alt={crop.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = getCropImage(crop.name);
          }}
        />
        <div className="absolute top-4 right-4">
          <Badge className={getHealthColor(crop.current_health)}>
            {crop.current_health}
          </Badge>
        </div>
      </div>

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg font-bold text-gray-900">
              {crop.name}
            </CardTitle>
            {crop.variety && (
              <p className="text-sm text-gray-600 mt-1">{crop.variety}</p>
            )}
          </div>
          <Button variant="ghost" size="icon">
            <MoreVertical className="w-4 h-4 text-gray-400" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Growth Stage */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Growth Stage</span>
          <Badge className={getGrowthStageColor(crop.growth_stage)}>
            {crop.growth_stage}
          </Badge>
        </div>

        {/* Field Size */}
        {crop.field_size_acres && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Field Size</span>
            <span className="text-sm font-medium">
              {crop.field_size_acres} acres
            </span>
          </div>
        )}

        {/* Planting Date */}
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600">
            Planted: {new Date(crop.planting_date).toLocaleDateString()}
          </span>
        </div>

        {/* Harvest Estimate */}
        {daysToHarvest && (
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="text-sm text-gray-600">
              {daysToHarvest > 0 
                ? `Harvest in ${daysToHarvest} days`
                : `Harvest ${Math.abs(daysToHarvest)} days overdue`
              }
            </span>
          </div>
        )}

        {/* Expected Yield */}
        {crop.estimated_yield_kg_per_acre && (
          <div className="bg-green-50 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-green-800">Expected Yield</span>
              <span className="font-semibold text-green-900">
                {crop.estimated_yield_kg_per_acre} kg/acre
              </span>
            </div>
          </div>
        )}

        {/* Notes */}
        {crop.notes && (
          <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
            {crop.notes.length > 100 
              ? `${crop.notes.substring(0, 100)}...`
              : crop.notes
            }
          </div>
        )}

        {/* Action Button */}
        <Button variant="outline" className="w-full border-green-200 hover:bg-green-50">
          <Eye className="w-4 h-4 mr-2" />
          View Details
        </Button>
      </CardContent>
    </Card>
  );
}