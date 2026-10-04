import React, { useState, useEffect } from "react";
import { SoilAnalysis } from "@/entities/SoilAnalysis";
import { UploadFile, InvokeLLM } from "@/integrations/Core";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertCircle,
  Brain
} from "lucide-react";

import SoilUploadZone from "../components/soil/SoilUploadZone";
import AnalysisResults from "../components/soil/AnalysisResults";
import AnalysisHistory from "../components/soil/AnalysisHistory";
import BackButton from "../components/shared/BackButton";

export default function SoilAnalysisPage() {
  const [analyses, setAnalyses] = useState([]);
  const [currentAnalysis, setCurrentAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAnalyses();
  }, []);

  const loadAnalyses = async () => {
    setIsLoading(true);
    try {
      const data = await SoilAnalysis.list("-created_date");
      setAnalyses(data);
    } catch (error) {
      console.error("Error loading analyses:", error);
    }
    setIsLoading(false);
  };

  const handlePhotoUpload = async (file, location) => {
    setIsAnalyzing(true);
    setError(null);
    setAnalysisProgress(0);
    
    try {
      // Progress simulation
      const progressInterval = setInterval(() => {
        setAnalysisProgress(prev => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            return 95;
          }
          return prev + 5;
        });
      }, 200);

      // Upload photo
      const { file_url } = await UploadFile({ file });
      setAnalysisProgress(30);

      // Analyze soil using AI
      const analysisResult = await InvokeLLM({
        prompt: `Analyze this soil photo and provide a COMPLETE agricultural soil assessment.

Carefully examine the image and evaluate:
1. PHYSICAL PROPERTIES: soil texture (clay/loam/sand/silt proportions), soil structure, color (and what it indicates about organic matter/drainage), visible moisture level, signs of compaction or crusting, drainage quality.
2. CHEMICAL PROPERTIES: estimated pH level, estimated nitrogen (N), phosphorus (P), potassium (K) levels in ppm, organic matter percentage.
3. HEALTH ISSUES: any visible problems like erosion, cracking, waterlogging, weeds, residue, salinity signs, or nutrient deficiency indicators.
4. COMPREHENSIVE RECOMMENDATIONS: provide 5-8 detailed, actionable recommendations covering fertilization (with specific nutrients and amounts), pH amendment (lime/gypsum if needed), organic matter improvement, tillage practices, irrigation/drainage management, cover crops, and crop rotation suggestions. Each with priority level.
5. SUITABLE CROPS: list crops best suited to this soil type.
6. A written explanation summarizing overall soil health.

Be specific, practical and farmer-friendly in all recommendations.`,
        file_urls: [file_url],
        response_json_schema: {
          type: "object",
          properties: {
            soil_texture: {
              type: "string",
              enum: ["clay", "loam", "sand", "silt", "clay_loam", "sandy_loam", "silty_loam"]
            },
            soil_color: { type: "string" },
            ph_estimate: { type: "number" },
            organic_matter_percent: { type: "number" },
            nitrogen_ppm: { type: "number" },
            phosphorus_ppm: { type: "number" },
            potassium_ppm: { type: "number" },
            moisture_assessment: { type: "string" },
            drainage_assessment: { type: "string" },
            compaction_risk: { type: "string" },
            visible_issues: { type: "array", items: { type: "string" } },
            suitable_crops: { type: "array", items: { type: "string" } },
            soil_health_score: { type: "number" },
            recommendations: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  category: { type: "string" },
                  recommendation: { type: "string" },
                  priority: { type: "string", enum: ["high", "medium", "low"] }
                }
              }
            },
            confidence_score: { type: "number" },
            explanation: { type: "string" }
          }
        }
      });

      clearInterval(progressInterval);
      setAnalysisProgress(100);

      // Create analysis record
      const analysisData = {
        photo_url: file_url,
        location: location,
        analysis_results: {
          soil_texture: analysisResult.soil_texture,
          soil_color: analysisResult.soil_color,
          ph_level: analysisResult.ph_estimate,
          organic_matter_percent: analysisResult.organic_matter_percent,
          nitrogen_ppm: analysisResult.nitrogen_ppm,
          phosphorus_ppm: analysisResult.phosphorus_ppm,
          potassium_ppm: analysisResult.potassium_ppm,
          moisture_content: analysisResult.moisture_assessment,
          drainage_assessment: analysisResult.drainage_assessment,
          compaction_risk: analysisResult.compaction_risk,
          visible_issues: analysisResult.visible_issues || [],
          suitable_crops: analysisResult.suitable_crops || [],
          soil_health_score: analysisResult.soil_health_score
        },
        recommendations: analysisResult.recommendations || [],
        confidence_score: analysisResult.confidence_score || 85,
        explanation: analysisResult.explanation
      };

      const savedAnalysis = await SoilAnalysis.create(analysisData);
      setCurrentAnalysis(savedAnalysis);
      loadAnalyses();

    } catch (error) {
      console.error("Error analyzing soil:", error);
      if (error.message && error.message.includes("429")) {
        setError("Rate limit exceeded. Please wait a moment before analyzing another photo.");
      } else {
        setError("Failed to analyze soil photo. Please try again.");
      }
    }
    
    setIsAnalyzing(false);
    setAnalysisProgress(0);
  };

  const handleDeleteAnalysis = async (analysisId) => {
    try {
      await SoilAnalysis.delete(analysisId);
      setAnalyses(prev => prev.filter(a => a.id !== analysisId));
      if (currentAnalysis?.id === analysisId) {
        setCurrentAnalysis(null);
      }
    } catch (error) {
      console.error("Error deleting analysis:", error);
      setError("Failed to delete analysis");
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-64"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 h-96 bg-gray-200 rounded-xl"></div>
              <div className="h-96 bg-gray-200 rounded-xl"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <BackButton />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Soil Analysis</h1>
          <p className="text-gray-600">
            Upload soil photos for instant AI-powered analysis and recommendations
          </p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upload and Analysis Section */}
          <div className="lg:col-span-2 space-y-6">
            {!currentAnalysis && !isAnalyzing && (
              <SoilUploadZone onPhotoUpload={handlePhotoUpload} />
            )}

            {isAnalyzing && (
              <Card className="border-none shadow-lg">
                <CardContent className="p-8">
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto">
                      <Brain className="w-8 h-8 text-amber-600 animate-pulse" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">
                      Analyzing Your Soil...
                    </h3>
                    <p className="text-gray-600">
                      Our AI is examining your soil photo and generating recommendations
                    </p>
                    <div className="w-full max-w-md mx-auto">
                      <Progress value={analysisProgress} className="h-2" />
                      <p className="text-sm text-gray-500 mt-2">
                        {analysisProgress}% complete
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {currentAnalysis && (
              <AnalysisResults 
                analysis={currentAnalysis} 
                onNewAnalysis={() => setCurrentAnalysis(null)}
              />
            )}
          </div>

          {/* Analysis History */}
          <div>
            <AnalysisHistory 
              analyses={analyses}
              currentAnalysis={currentAnalysis}
              onSelectAnalysis={setCurrentAnalysis}
              onDeleteAnalysis={handleDeleteAnalysis}
            />
          </div>
        </div>
      </div>
    </div>
  );
}