import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import {
  Brain,
  TrendingUp,
  Calendar,
  Droplets,
  Bug,
  Leaf,
  Loader2
} from "lucide-react";

const predictionTypes = [
  {
    type: "yield",
    title: "Yield Prediction",
    description: "Predict expected crop yield based on current conditions",
    icon: TrendingUp,
    color: "green"
  },
  {
    type: "harvest_timing",
    title: "Harvest Timing",
    description: "Optimal harvest timing recommendations",
    icon: Calendar,
    color: "orange"
  },
  {
    type: "fertilizer",
    title: "Fertilizer Optimization", 
    description: "Personalized fertilizer recommendations",
    icon: Leaf,
    color: "blue"
  },
  {
    type: "irrigation",
    title: "Irrigation Guidance",
    description: "Water requirements and timing optimization",
    icon: Droplets,
    color: "cyan"
  },
  {
    type: "pest_disease",
    title: "Pest & Disease Risk",
    description: "Early warning and prevention strategies",
    icon: Bug,
    color: "red"
  }
];

export default function GeneratePredictionModal({ 
  isOpen, 
  onClose, 
  crops, 
  onGenerate, 
  isGenerating 
}) {
  const [selectedCrop, setSelectedCrop] = useState("");
  const [selectedType, setSelectedType] = useState("");

  const handleSubmit = () => {
    if (selectedCrop && selectedType) {
      onGenerate(selectedCrop, selectedType);
      setSelectedCrop("");
      setSelectedType("");
    }
  };

  const selectedPredictionType = predictionTypes.find(type => type.type === selectedType);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-600" />
            Generate AI Prediction
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Crop Selection */}
          <div className="space-y-2">
            <Label htmlFor="crop">Select Crop</Label>
            <Select value={selectedCrop} onValueChange={setSelectedCrop}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a crop from your farm" />
              </SelectTrigger>
              <SelectContent>
                {crops.map((crop) => (
                  <SelectItem key={crop.id} value={crop.id}>
                    {crop.name} {crop.variety && `- ${crop.variety}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Prediction Type Selection */}
          <div className="space-y-2">
            <Label>Prediction Type</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {predictionTypes.map((type) => (
                <Card
                  key={type.type}
                  className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                    selectedType === type.type
                      ? `border-${type.color}-300 bg-${type.color}-50`
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setSelectedType(type.type)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 bg-${type.color}-100 rounded-full flex items-center justify-center`}>
                        <type.icon className={`w-5 h-5 text-${type.color}-600`} />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-sm">{type.title}</div>
                        <div className="text-xs text-gray-600">{type.description}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Selected Type Details */}
          {selectedPredictionType && (
            <div className={`p-4 bg-${selectedPredictionType.color}-50 rounded-lg border border-${selectedPredictionType.color}-200`}>
              <div className="flex items-center gap-2 mb-2">
                <selectedPredictionType.icon className={`w-5 h-5 text-${selectedPredictionType.color}-600`} />
                <span className="font-semibold">{selectedPredictionType.title}</span>
              </div>
              <p className="text-sm text-gray-700">{selectedPredictionType.description}</p>
              <div className="mt-2 text-xs text-gray-600">
                This prediction will analyze your crop data, soil conditions, weather patterns, and historical data to provide actionable insights.
              </div>
            </div>
          )}

          {/* Generate Button */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isGenerating}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!selectedCrop || !selectedType || isGenerating}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Brain className="w-4 h-4 mr-2" />
                  Generate Prediction
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}