import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  TestTube2,
  Calendar,
  MapPin,
  Trash2,
  History
} from "lucide-react";

const getConfidenceColor = (score) => {
  if (score >= 80) return "bg-green-100 text-green-800";
  if (score >= 60) return "bg-yellow-100 text-yellow-800";
  return "bg-red-100 text-red-800";
};

export default function AnalysisHistory({ 
  analyses, 
  currentAnalysis,
  onSelectAnalysis,
  onDeleteAnalysis 
}) {
  return (
    <Card className="border-none shadow-lg sticky top-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="w-5 h-5 text-amber-600" />
          Analysis History
        </CardTitle>
      </CardHeader>
      <CardContent>
        {analyses.length > 0 ? (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {analyses.map((analysis) => (
              <div
                key={analysis.id}
                className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                  currentAnalysis?.id === analysis.id
                    ? "border-amber-300 bg-amber-50"
                    : "border-gray-200 hover:border-amber-200 hover:bg-amber-50"
                }`}
                onClick={() => onSelectAnalysis(analysis)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <TestTube2 className="w-4 h-4 text-amber-600" />
                    <span className="text-sm font-medium">
                      {analysis.analysis_results?.soil_texture || "Analysis"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 hover:bg-red-100 hover:text-red-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteAnalysis(analysis.id);
                      }}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(analysis.created_date).toLocaleDateString()}</span>
                  </div>

                  {analysis.location?.field_name && (
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <MapPin className="w-3 h-3" />
                      <span>{analysis.location.field_name}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <Badge className={getConfidenceColor(analysis.confidence_score || 0)}>
                      {analysis.confidence_score || 0}% confidence
                    </Badge>
                    {analysis.recommendations && (
                      <span className="text-xs text-gray-500">
                        {analysis.recommendations.length} recommendations
                      </span>
                    )}
                  </div>
                </div>

                {/* Analysis Preview */}
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <img
                    src={analysis.photo_url}
                    alt="Soil sample"
                    className="w-full h-16 object-cover rounded"
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <TestTube2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-900 mb-2">No analyses yet</h3>
            <p className="text-gray-600 text-sm">
              Upload your first soil photo to get started with AI-powered analysis
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}