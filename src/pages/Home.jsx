import React, { useState, useEffect } from "react";
import { User } from "@/entities/User";
import { WeatherData } from "@/entities/WeatherData";
import { Crop } from "@/entities/Crop";
import { SoilAnalysis } from "@/entities/SoilAnalysis";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  MapPin,
  ArrowRight,
  MessageCircle,
  Settings
} from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

import WeatherWidget from "../components/home/WeatherWidget";
import QuickActions from "../components/home/QuickActions";
import FarmOverview from "../components/home/FarmOverview";
import AIInsights from "../components/home/AIInsights";

export default function HomePage() {
  const [user, setUser] = useState(null);
  const [weather, setWeather] = useState(null);
  const [crops, setCrops] = useState([]);
  const [soilAnalyses, setSoilAnalyses] = useState([]);
  const [greeting, setGreeting] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
    updateGreeting();
    const interval = setInterval(updateGreeting, 60000); // Update greeting every minute
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const userData = await User.me();
      setUser(userData);
      
      const weatherData = await WeatherData.list(undefined, 1);
      if (weatherData.length > 0) setWeather(weatherData[0]);
      
      const cropsData = await Crop.filter({ created_by: userData.email }, undefined, 5);
      setCrops(cropsData);
      
      const soilData = await SoilAnalysis.filter({ created_by: userData.email }, undefined, 3);
      setSoilAnalyses(soilData);
    } catch (error) {
      console.error("Error loading data:", error);
    }
    setIsLoading(false);
  };

  const updateGreeting = () => {
    const hour = new Date().getHours();
    let timeGreeting = "";
    
    if (hour < 12) {
      timeGreeting = "Good Morning";
    } else if (hour < 17) {
      timeGreeting = "Good Afternoon";
    } else {
      timeGreeting = "Good Evening";
    }
    
    setGreeting(timeGreeting);
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-64"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Array(3).fill(0).map((_, i) => (
                <div key={i} className="h-48 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 bg-gradient-to-br from-green-50 via-blue-50 to-amber-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Welcome Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              {greeting}, {user?.full_name || 'Farmer'}! 🌱
            </h1>
            <p className="text-gray-600 text-lg">
              Welcome to your smart farming dashboard. Let's grow something amazing today!
            </p>
            {user?.farm_name && (
              <div className="flex items-center justify-center md:justify-start gap-2 mt-2">
                <MapPin className="w-4 h-4 text-green-600" />
                <span className="text-green-700 font-medium">{user.farm_name}</span>
                {user?.location?.region && (
                  <span className="text-gray-500">• {user.location.region}</span>
                )}
              </div>
            )}
          </div>
          <Link to={createPageUrl("Profile")} className="shrink-0">
            <div className="w-12 h-12 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 cursor-pointer" title="Profile">
              <span className="text-white font-semibold text-lg">
                {user?.full_name?.[0] || 'U'}
              </span>
            </div>
          </Link>
        </div>

        {/* Weather Widget */}
        <WeatherWidget weather={weather} userLocation={user?.location} />

        {/* Quick Actions */}
        <QuickActions />

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Farm Overview */}
          <div className="lg:col-span-2">
            <FarmOverview crops={crops} user={user} />
          </div>

          {/* AI Insights */}
          <div>
            <AIInsights soilAnalyses={soilAnalyses} crops={crops} />
          </div>
        </div>

        {/* AI Assistant Prompt */}
        <Card className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white border-none shadow-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Need Farming Advice?</h3>
                  <p className="text-purple-100">
                    Ask our AI assistant anything about your crops, soil, or farming techniques
                  </p>
                </div>
              </div>
              <Button 
                variant="secondary" 
                className="bg-white/20 hover:bg-white/30 text-white border-white/20"
              >
                Ask AI Assistant
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}