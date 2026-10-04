import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  TestTube2,
  Camera,
  MapPin,
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  Download,
  Droplets,
  Layers,
  Sprout,
  FileText
} from "lucide-react";

const getPriorityColor = (priority) => {
  const colors = {
    high: "bg-red-100 text-red-800",
    medium: "bg-yellow-100 text-yellow-800",
    low: "bg-green-100 text-green-800"
  };
  return colors[priority] || "bg-gray-100 text-gray-800";
};

const getConfidenceColor = (score) => {
  if (score >= 80) return "text-green-600";
  if (score >= 60) return "text-yellow-600";
  return "text-red-600";
};

const getHealthColor = (score) => {
  if (score >= 75) return "text-green-600";
  if (score >= 50) return "text-yellow-600";
  return "text-red-600";
};

const getNutrientStatus = (type, value) => {
  if (value === undefined || value === null) return null;
  const ranges = {
    nitrogen: { low: 25, high: 50 },
    phosphorus: { low: 15, high: 40 },
    potassium: { low: 120, high: 200 }
  };
  const r = ranges[type];
  if (!r) return null;
  if (value < r.low) return { label: "Low", color: "text-red-600" };
  if (value > r.high) return { label: "High", color: "text-blue-600" };
  return { label: "Optimal", color: "text-green-600" };
};

export default function AnalysisResults({ analysis, onNewAnalysis }) {
  if (!analysis) return null;

  const results = analysis.analysis_results || {};
  const recommendations = analysis.recommendations || [];
  const confidence = analysis.confidence_score || 0;
  const healthScore = results.soil_health_score || 0;
  const visibleIssues = results.visible_issues || [];
  const suitableCrops = results.suitable_crops || [];

  return (
    <div className="space-y-6">
      {/* Analysis Header */}
      <Card className="border-none shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                <TestTube2 className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <CardTitle>Soil Analysis Results</CardTitle>
                <p className="text-gray-600">
                  Analyzed on {new Date(analysis.created_date).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge className={`${getConfidenceColor(confidence)} border-current`}>
                {confidence}% confidence
              </Badge>
              <Button
                variant="outline" 
                size="sm"
                onClick={onNewAnalysis}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                New Analysis
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Soil Photo */}
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <Camera className="w-4 h-4" />
                Analyzed Photo
              </h3>
              <img
                src={analysis.photo_url}
                alt="Soil sample"
                className="w-full h-48 object-cover rounded-lg border"
              />
              {analysis.location?.field_name && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-3 h-3" />
                  <span>{analysis.location.field_name}</span>
                </div>
              )}
            </div>

            {/* Soil Health Score + Key Findings */}
            <div className="space-y-4">
              {healthScore > 0 && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">Overall Soil Health</span>
                    <span className={`text-2xl font-bold ${getHealthColor(healthScore)}`}>
                      {healthScore}/100
                    </span>
                  </div>
                  <Progress value={healthScore} className="h-2" />
                </div>
              )}
              <h3 className="font-semibold">Key Findings</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-xs text-gray-500 uppercase tracking-wide">Soil Texture</div>
                  <div className="font-semibold capitalize">
                    {results.soil_texture?.replace("_", " ") || "Not detected"}
                  </div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-xs text-gray-500 uppercase tracking-wide">Color</div>
                  <div className="font-semibold">
                    {results.soil_color || "Not analyzed"}
                  </div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-xs text-gray-500 uppercase tracking-wide">pH Level</div>
                  <div className="font-semibold">
                    {results.ph_level != null ? `${results.ph_level.toFixed(1)}` : "N/A"}
                  </div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-xs text-gray-500 uppercase tracking-wide">Moisture</div>
                  <div className="font-semibold">
                    {results.moisture_content || "Not assessed"}
                  </div>
                </div>
                {results.drainage_assessment && (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-xs text-gray-500 uppercase tracking-wide flex items-center gap-1">
                      <Droplets className="w-3 h-3" /> Drainage
                    </div>
                    <div className="font-semibold">{results.drainage_assessment}</div>
                  </div>
                )}
                {results.compaction_risk && (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-xs text-gray-500 uppercase tracking-wide flex items-center gap-1">
                      <Layers className="w-3 h-3" /> Compaction Risk
                    </div>
                    <div className="font-semibold">{results.compaction_risk}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Analysis */}
      <Card className="border-none shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            Detailed Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {results.organic_matter_percent != null && (
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div>
                <div className="font-medium">Organic Matter Content</div>
                <div className="text-sm text-gray-600">
                  Indicates soil fertility and health
                </div>
              </div>
              <div className="text-2xl font-bold text-green-700">
                {results.organic_matter_percent.toFixed(1)}%
              </div>
            </div>
          )}

          {/* NPK Nutrients */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg text-center">
              <div className="text-2xl font-bold text-blue-700">
                {results.nitrogen_ppm ?? "—"}
              </div>
              <div className="text-sm text-blue-600 font-medium">Nitrogen (ppm)</div>
              {getNutrientStatus("nitrogen", results.nitrogen_ppm) && (
                <Badge variant="outline" className={`mt-1 ${getNutrientStatus("nitrogen", results.nitrogen_ppm).color}`}>
                  {getNutrientStatus("nitrogen", results.nitrogen_ppm).label}
                </Badge>
              )}
            </div>
            <div className="p-4 bg-purple-50 rounded-lg text-center">
              <div className="text-2xl font-bold text-purple-700">
                {results.phosphorus_ppm ?? "—"}
              </div>
              <div className="text-sm text-purple-600 font-medium">Phosphorus (ppm)</div>
              {getNutrientStatus("phosphorus", results.phosphorus_ppm) && (
                <Badge variant="outline" className={`mt-1 ${getNutrientStatus("phosphorus", results.phosphorus_ppm).color}`}>
                  {getNutrientStatus("phosphorus", results.phosphorus_ppm).label}
                </Badge>
              )}
            </div>
            <div className="p-4 bg-orange-50 rounded-lg text-center">
              <div className="text-2xl font-bold text-orange-700">
                {results.potassium_ppm ?? "—"}
              </div>
              <div className="text-sm text-orange-600 font-medium">Potassium (ppm)</div>
              {getNutrientStatus("potassium", results.potassium_ppm) && (
                <Badge variant="outline" className={`mt-1 ${getNutrientStatus("potassium", results.potassium_ppm).color}`}>
                  {getNutrientStatus("potassium", results.potassium_ppm).label}
                </Badge>
              )}
            </div>
          </div>

          {/* Visible Issues */}
          {visibleIssues.length > 0 && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-lg">
              <h4 className="font-semibold text-red-800 flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4" />
                Visible Issues Detected
              </h4>
              <ul className="space-y-1">
                {visibleIssues.map((issue, index) => (
                  <li key={index} className="text-sm text-red-700 flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 bg-red-400 rounded-full shrink-0"></span>
                    {issue}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Suitable Crops */}
          {suitableCrops.length > 0 && (
            <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-lg">
              <h4 className="font-semibold text-emerald-800 flex items-center gap-2 mb-2">
                <Sprout className="w-4 h-4" />
                Suitable Crops for This Soil
              </h4>
              <div className="flex flex-wrap gap-2">
                {suitableCrops.map((crop, index) => (
                  <Badge key={index} className="bg-emerald-100 text-emerald-800 border-emerald-200">
                    {crop}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* AI Explanation */}
          {analysis.explanation && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4 text-gray-600" />
                AI Summary
              </h4>
              <p className="text-gray-700 text-sm leading-relaxed">{analysis.explanation}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* AI Recommendations */}
      {recommendations.length > 0 && (
        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-600" />
              AI Recommendations
              <Badge variant="secondary" className="ml-2">{recommendations.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recommendations.map((rec, index) => (
                <div key={index} className="flex items-start gap-4 p-4 border rounded-lg">
                  <div className={`p-2 rounded-full ${getPriorityColor(rec.priority)}`}>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold capitalize">{rec.category}</span>
                      <Badge className={getPriorityColor(rec.priority)}>
                        {rec.priority} priority
                      </Badge>
                    </div>
                    <p className="text-gray-700">{rec.recommendation}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <Separator className="my-6" />
            
            <div className="flex justify-end gap-3">
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Download Report
              </Button>
              <Button className="bg-green-600 hover:bg-green-700">
                Apply Recommendations
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}