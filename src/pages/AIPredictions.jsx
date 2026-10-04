import React, { useState, useEffect } from "react";
import { Prediction } from "@/entities/Prediction";
import { Crop } from "@/entities/Crop";
import { User } from "@/entities/User";
import { SoilAnalysis } from "@/entities/SoilAnalysis";
import { InvokeLLM } from "@/integrations/Core";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Brain,
  TrendingUp,
  Calendar,
  Droplets,
  Bug,
  Leaf,
  Target,
  AlertCircle // Added AlertCircle icon
} from "lucide-react";

import PredictionCard from "../components/predictions/PredictionCard";
import GeneratePredictionModal from "../components/predictions/GeneratePredictionModal";
import BackButton from "../components/shared/BackButton";

export default function AIPredictionsPage() {
  const [predictions, setPredictions] = useState([]);
  const [crops, setCrops] = useState([]);
  const [user, setUser] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState(null); // New state for API errors

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const userData = await User.me();
      setUser(userData);

      const cropsData = await Crop.filter({ created_by: userData.email }, "-created_date");
      setCrops(cropsData);

      const predictionsData = await Prediction.filter({ created_by: userData.email }, "-created_date");
      setPredictions(predictionsData);
    } catch (error) {
      console.error("Error loading data:", error);
      // Optionally handle loading errors here if needed
    }
    setIsLoading(false);
  };

  const generatePrediction = async (cropId, predictionType) => {
    setIsGenerating(true);
    setApiError(null); // Clear any previous API errors
    try {
      const crop = crops.find(c => c.id === cropId);
      const soilAnalyses = await SoilAnalysis.filter({ created_by: user.email }, "-created_date", 3);
      
      let prompt = `Generate ${predictionType} predictions for ${crop.name} crop. `;
      
      switch (predictionType) {
        case "yield":
          prompt += `Current growth stage: ${crop.growth_stage}. Field size: ${crop.field_size_acres} acres. Provide yield prediction in kg per acre with confidence score and recommendations.`;
          break;
        case "harvest_timing":
          prompt += `Planting date: ${crop.planting_date}. Growth stage: ${crop.growth_stage}. Predict optimal harvest timing and provide preparation recommendations.`;
          break;
        case "fertilizer":
          prompt += `Soil condition and crop growth stage analysis. Recommend specific fertilizers, quantities, and application timing.`;
          break;
        case "irrigation":
          prompt += `Crop water needs analysis based on growth stage and environmental conditions. Provide irrigation schedule and water quantity recommendations.`;
          break;
        case "pest_disease":
          prompt += `Analyze pest and disease risk based on crop type, growth stage, and seasonal patterns. Provide preventive measures and treatment recommendations.`;
          break;
      }

      const aiResponse = await InvokeLLM({
        prompt: prompt,
        response_json_schema: {
          type: "object",
          properties: {
            predictions: { type: "object" },
            confidence_score: { type: "number" },
            recommendations: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  action: { type: "string" },
                  timing: { type: "string" },
                  details: { type: "string" },
                  priority: { type: "string", enum: ["high", "medium", "low"] }
                }
              }
            },
            explanation: { type: "string" }
          }
        }
      });

      const predictionData = {
        crop_id: cropId,
        prediction_type: predictionType,
        predictions: aiResponse.predictions,
        confidence_score: aiResponse.confidence_score,
        recommendations: aiResponse.recommendations,
        data_sources: ["crop_data", "soil_analysis", "weather_data"],
        explanation: aiResponse.explanation
      };

      await Prediction.create(predictionData);
      loadData();
      setShowGenerateModal(false);
    } catch (error) {
      console.error("Error generating prediction:", error);
      // Check for rate-limiting error (HTTP 429)
      // The exact error structure depends on how InvokeLLM handles and re-throws errors.
      // This assumes error.message might contain the status code or a similar identifier.
      if (error.message && error.message.includes("429")) {
        setApiError("You've made too many requests in a short period. Please wait a moment before trying again.");
      } else {
        setApiError("An unexpected error occurred while generating the prediction. Please try again later.");
      }
    }
    setIsGenerating(false);
  };

  const predictionTypes = [
    { type: "yield", title: "Yield Prediction", icon: TrendingUp, color: "green" },
    { type: "harvest_timing", title: "Harvest Timing", icon: Calendar, color: "orange" },
    { type: "fertilizer", title: "Fertilizer Optimization", icon: Leaf, color: "blue" },
    { type: "irrigation", title: "Irrigation Guidance", icon: Droplets, color: "cyan" },
    { type: "pest_disease", title: "Pest & Disease Alerts", icon: Bug, color: "red" }
  ];

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-64"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(6).fill(0).map((_, i) => (
                <div key={i} className="h-64 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <BackButton />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Predictions</h1>
            <p className="text-gray-600">
              Get AI-powered insights for crop yield, harvest timing, and optimization recommendations
            </p>
          </div>
          <Button 
            onClick={() => {
              setApiError(null); // Clear error when opening modal
              setShowGenerateModal(true);
            }}
            disabled={crops.length === 0}
            className="bg-purple-600 hover:bg-purple-700 shadow-lg"
          >
            <Brain className="w-5 h-5 mr-2" />
            Generate New Prediction
          </Button>
        </div>
        
        {/* API Error Display */}
        {apiError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{apiError}</AlertDescription>
          </Alert>
        )}

        {crops.length === 0 && (
          <Alert>
            <Target className="h-4 w-4" />
            <AlertDescription>
              Add crops to your farm first to generate AI predictions.
            </AlertDescription>
          </Alert>
        )}

        {/* Prediction Types Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {predictionTypes.map((predType) => {
            const count = predictions.filter(p => p.prediction_type === predType.type).length;
            return (
              <Card key={predType.type} className="hover:shadow-lg transition-all duration-300 border-none">
                <CardContent className="p-6 text-center">
                  <div className={`w-12 h-12 bg-${predType.color}-100 rounded-full flex items-center justify-center mx-auto mb-3`}>
                    <predType.icon className={`w-6 h-6 text-${predType.color}-600`} />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{predType.title}</h3>
                  <Badge variant="outline" className={`text-${predType.color}-600`}>
                    {count} predictions
                  </Badge>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Recent Predictions */}
        {predictions.length > 0 ? (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Recent Predictions</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {predictions.map((prediction) => (
                <PredictionCard 
                  key={prediction.id} 
                  prediction={prediction} 
                  crop={crops.find(c => c.id === prediction.crop_id)}
                  onRefresh={loadData}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <Brain className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No predictions yet</h3>
            <p className="text-gray-600 mb-6">
              Generate your first AI prediction to get intelligent farming insights
            </p>
            {crops.length > 0 && (
              <Button 
                onClick={() => {
                  setApiError(null); // Clear error when opening modal
                  setShowGenerateModal(true);
                }}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Brain className="w-5 h-5 mr-2" />
                Generate First Prediction
              </Button>
            )}
          </div>
        )}

        <GeneratePredictionModal
          isOpen={showGenerateModal}
          onClose={() => setShowGenerateModal(false)}
          crops={crops}
          onGenerate={generatePrediction}
          isGenerating={isGenerating}
        />
      </div>
    </div>
  );
}