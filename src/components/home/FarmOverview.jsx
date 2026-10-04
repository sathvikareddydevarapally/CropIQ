import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  Sprout,
  Calendar,
  TrendingUp,
  MapPin,
  ArrowRight,
  Leaf
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

export default function FarmOverview({ crops, user }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Farm Overview</h2>
        <Link to={createPageUrl("MyFarm")}>
          <Button variant="outline" className="border-green-200 hover:bg-green-50">
            View All Crops
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>

      {/* Farm Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-none">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Sprout className="w-8 h-8" />
              <div>
                <div className="text-2xl font-bold">{crops.length}</div>
                <div className="text-green-100">Active Crops</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-blue-500 to-sky-500 text-white border-none">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <MapPin className="w-8 h-8" />
              <div>
                <div className="text-2xl font-bold">
                  {user?.farm_size_acres || '5.2'}
                </div>
                <div className="text-blue-100">Total Acres</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white border-none">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-8 h-8" />
              <div>
                <div className="text-2xl font-bold">
                  {user?.experience_years || '8'}
                </div>
                <div className="text-purple-100">Years Experience</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Crops */}
      <Card className="shadow-lg border-none">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Leaf className="w-5 h-5 text-green-600" />
            Recent Crops
          </CardTitle>
        </CardHeader>
        <CardContent>
          {crops.length > 0 ? (
            <div className="space-y-4">
              {crops.slice(0, 3).map((crop) => (
                <div key={crop.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <img 
                        src={crop.photo_url || "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=100&h=100&fit=crop&crop=center"}
                        alt={crop.name}
                        className="w-8 h-8 rounded-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                      <Sprout className="w-6 h-6 text-green-600 hidden" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{crop.name}</h3>
                      {crop.variety && (
                        <p className="text-sm text-gray-600">{crop.variety}</p>
                      )}
                      <div className="flex items-center gap-2 mt-1">
                        <Calendar className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-500">
                          Planted: {new Date(crop.planting_date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <Badge className={getGrowthStageColor(crop.growth_stage)}>
                      {crop.growth_stage}
                    </Badge>
                    <div>
                      <Badge variant="outline" className={getHealthColor(crop.current_health)}>
                        {crop.current_health}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Sprout className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">No crops yet</h3>
              <p className="text-gray-600 mb-4">
                Start by adding your first crop to begin tracking your farm
              </p>
              <Link to={createPageUrl("MyFarm")}>
                <Button className="bg-green-600 hover:bg-green-700">
                  Add First Crop
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}