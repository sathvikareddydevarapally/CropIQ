import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  Sprout,
  TestTube2,
  Brain,
  Users
} from "lucide-react";

const quickActions = [
  {
    title: "Analyze Soil",
    description: "Take a photo of your soil for instant AI analysis",
    icon: TestTube2,
    color: "from-amber-500 to-orange-500",
    link: createPageUrl("SoilAnalysis")
  },
  {
    title: "Add New Crop",
    description: "Register a new crop in your farm management system",
    icon: Sprout,
    color: "from-green-500 to-emerald-500",
    link: createPageUrl("MyFarm")
  },
  {
    title: "Get AI Predictions",
    description: "Receive yield forecasts and farming recommendations",
    icon: Brain,
    color: "from-purple-500 to-indigo-500",
    link: createPageUrl("AIPredictions")
  },
  {
    title: "Join Community",
    description: "Connect with other farmers and share experiences",
    icon: Users,
    color: "from-blue-500 to-sky-500",
    link: createPageUrl("Community")
  }
];

export default function QuickActions() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickActions.map((action, index) => (
          <Link key={index} to={action.link}>
            <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer border-none shadow-md">
              <CardContent className="p-6">
                <div className={`w-12 h-12 bg-gradient-to-r ${action.color} rounded-xl flex items-center justify-center mb-4 shadow-lg`}>
                  <action.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{action.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {action.description}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}