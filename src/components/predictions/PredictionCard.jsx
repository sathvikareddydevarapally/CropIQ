import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  TrendingUp,
  Calendar,
  Droplets,
  Bug,
  Leaf,
  Target,
  Info,
  ChevronDown,
  ChevronUp
} from "lucide-react";

const predictionIcons = {
  yield: TrendingUp,
  harvest_timing: Calendar,
  fertilizer: Leaf,
  irrigation: Droplets,
  pest_disease: Bug
};

const predictionColors = {
  yield: "green",
  harvest_timing: "orange", 
  fertilizer: "blue",
  irrigation: "cyan",
  pest_disease: "red"
};

const getPriorityColor = (priority) => {
  const colors = {
    high: "bg-red-100 text-red-800",
    medium: "bg-yellow-100 text-yellow-800", 
    low: "bg-green-100 text-green-800"
  };
  return colors[priority] || "bg-gray-100 text-gray-800";
};

export default function PredictionCard({ prediction, crop, onRefresh }) {
  const [expanded, setExpanded] = React.useState(false);
  
  const Icon = predictionIcons[prediction.prediction_type] || Target;
  const color = predictionColors[prediction.prediction_type] || "gray";

  return (
    <Card className="hover:shadow-lg transition-all duration-300 border-none shadow-md">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 bg-${color}-100 rounded-full flex items-center justify-center`}>
              <Icon className={`w-6 h-6 text-${color}-600`} />
            </div>
            <div>
              <CardTitle className="capitalize">
                {prediction.prediction_type.replace('_', ' ')} Prediction
              </CardTitle>
              <p className="text-gray-600">{crop?.name || 'Unknown Crop'}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={`bg-${color}-100 text-${color}-800`}>
              {prediction.confidence_score || 0}% confidence
            </Badge>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Confidence Score */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span>AI Confidence</span>
            <span>{prediction.confidence_score || 0}%</span>
          </div>
          <Progress value={prediction.confidence_score || 0} className="h-2" />
        </div>

        {/* Key Predictions */}
        {prediction.predictions && (
          <div className={`p-4 bg-${color}-50 rounded-lg`}>
            <h4 className="font-semibold mb-2">Key Insights</h4>
            <div className="text-sm space-y-1">
              {Object.entries(prediction.predictions).slice(0, 3).map(([key, value], index) => (
                <div key={index} className="flex justify-between">
                  <span className="capitalize">{key.replace('_', ' ')}:</span>
                  <span className="font-medium">{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {expanded && (
          <div className="space-y-4">
            {/* Explanation */}
            {prediction.explanation && (
              <div>
                <h4 className="font-semibold mb-2">AI Explanation</h4>
                <p className="text-gray-700 text-sm">{prediction.explanation}</p>
              </div>
            )}

            {/* Recommendations */}
            {prediction.recommendations && prediction.recommendations.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Recommendations</h4>
                <div className="space-y-2">
                  {prediction.recommendations.slice(0, 3).map((rec, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                      <Badge className={getPriorityColor(rec.priority)}>
                        {rec.priority}
                      </Badge>
                      <div className="flex-1">
                        <div className="font-medium">{rec.action}</div>
                        <div className="text-sm text-gray-600">{rec.details}</div>
                        {rec.timing && (
                          <div className="text-xs text-gray-500 mt-1">
                            Timing: {rec.timing}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Data Sources */}
            {prediction.data_sources && (
              <div>
                <h4 className="font-semibold mb-2">Data Sources</h4>
                <div className="flex flex-wrap gap-2">
                  {prediction.data_sources.map((source, index) => (
                    <Badge key={index} variant="outline">
                      {source.replace('_', ' ')}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex justify-between text-xs text-gray-500">
          <span>Generated: {new Date(prediction.created_date).toLocaleDateString()}</span>
          <Button variant="link" size="sm" className="h-auto p-0">
            <Info className="w-3 h-3 mr-1" />
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}