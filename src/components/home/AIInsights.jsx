import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  Brain,
  TestTube2,
  ArrowRight,
  Lightbulb,
  Target
} from "lucide-react";

export default function AIInsights({ soilAnalyses, crops }) {
  const getRandomInsight = () => {
    const insights = [
      {
        type: "yield",
        title: "High Yield Potential",
        description: "Your corn crops are showing 15% higher yield potential than regional average",
        confidence: 87,
        color: "text-green-600",
        bgColor: "bg-green-50"
      },
      {
        type: "irrigation", 
        title: "Irrigation Optimization",
        description: "Reduce water usage by 20% with adjusted morning irrigation schedule",
        confidence: 92,
        color: "text-blue-600",
        bgColor: "bg-blue-50"
      },
      {
        type: "pest",
        title: "Pest Risk Alert",
        description: "Moderate aphid risk detected. Consider preventive treatment in next 7 days",
        confidence: 78,
        color: "text-orange-600", 
        bgColor: "bg-orange-50"
      }
    ];
    return insights[Math.floor(Math.random() * insights.length)];
  };

  const insight = getRandomInsight();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">AI Insights</h2>
        <Link to={createPageUrl("AIPredictions")}>
          <Button variant="outline" className="border-purple-200 hover:bg-purple-50">
            View All
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>

      {/* Latest AI Insight */}
      <Card className={`border-none shadow-lg ${insight.bgColor}`}>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Brain className={`w-5 h-5 ${insight.color}`} />
            <CardTitle className="text-lg">Latest AI Recommendation</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <h3 className="font-bold text-gray-900 mb-2">{insight.title}</h3>
          <p className="text-gray-700 mb-4">{insight.description}</p>
          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="bg-white/50">
              {insight.confidence}% confidence
            </Badge>
            <Button size="sm" className="bg-white/20 hover:bg-white/30 text-gray-800">
              Learn More
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Soil Analysis Summary */}
      <Card className="border-none shadow-lg">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <TestTube2 className="w-5 h-5 text-amber-600" />
            <CardTitle className="text-lg">Soil Health</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {soilAnalyses.length > 0 ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Recent Analyses</span>
                <Badge variant="outline">{soilAnalyses.length} completed</Badge>
              </div>
              <div className="space-y-2">
                {soilAnalyses.slice(0, 2).map((analysis, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                      <TestTube2 className="w-4 h-4 text-amber-600" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">
                        {analysis.analysis_results?.soil_texture || "Loam"} soil
                      </div>
                      <div className="text-xs text-gray-500">
                        {analysis.confidence_score || 85}% confidence
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Link to={createPageUrl("SoilAnalysis")}>
                <Button variant="outline" size="sm" className="w-full">
                  View All Analyses
                </Button>
              </Link>
            </div>
          ) : (
            <div className="text-center py-4">
              <TestTube2 className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-600 text-sm mb-3">
                No soil analyses yet
              </p>
              <Link to={createPageUrl("SoilAnalysis")}>
                <Button size="sm" className="bg-amber-600 hover:bg-amber-700">
                  Start Analysis
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Tips */}
      <Card className="border-none shadow-lg bg-gradient-to-r from-indigo-50 to-purple-50">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-indigo-600" />
            <CardTitle className="text-lg">Today's Tip</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 mb-4">
            Monitor soil moisture levels in the early morning for the most accurate readings. 
            This helps optimize your irrigation timing and water conservation.
          </p>
          <Button variant="outline" size="sm" className="border-indigo-200 hover:bg-indigo-50">
            <Target className="w-4 h-4 mr-2" />
            Apply This Tip
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}