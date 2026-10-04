import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sprout } from "lucide-react";

const growthStages = [
  { value: "seedling", label: "Seedling" },
  { value: "vegetative", label: "Vegetative" },
  { value: "flowering", label: "Flowering" },
  { value: "fruiting", label: "Fruiting" },
  { value: "maturity", label: "Maturity" },
  { value: "harvest", label: "Ready for Harvest" }
];

const healthStatuses = [
  { value: "excellent", label: "Excellent" },
  { value: "good", label: "Good" },
  { value: "fair", label: "Fair" },
  { value: "poor", label: "Poor" }
];

export default function AddCropModal({ isOpen, onClose, onAdd }) {
  const [formData, setFormData] = useState({
    name: "",
    variety: "",
    planting_date: "",
    expected_harvest_date: "",
    field_size_acres: "",
    growth_stage: "seedling",
    current_health: "good",
    estimated_yield_kg_per_acre: "",
    notes: "",
    photo_url: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const cropData = {
        ...formData,
        field_size_acres: formData.field_size_acres ? parseFloat(formData.field_size_acres) : null,
        estimated_yield_kg_per_acre: formData.estimated_yield_kg_per_acre ? parseFloat(formData.estimated_yield_kg_per_acre) : null
      };
      
      await onAdd(cropData);
      
      // Reset form
      setFormData({
        name: "",
        variety: "",
        planting_date: "",
        expected_harvest_date: "",
        field_size_acres: "",
        growth_stage: "seedling",
        current_health: "good",
        estimated_yield_kg_per_acre: "",
        notes: "",
        photo_url: ""
      });
    } catch (error) {
      console.error("Error adding crop:", error);
    }
    
    setIsSubmitting(false);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sprout className="w-5 h-5 text-green-600" />
            Add New Crop
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Crop Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="e.g., Corn, Wheat, Tomato"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="variety">Variety</Label>
              <Input
                id="variety"
                value={formData.variety}
                onChange={(e) => handleChange("variety", e.target.value)}
                placeholder="e.g., Golden Bantam"
              />
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="planting_date">Planting Date *</Label>
              <Input
                id="planting_date"
                type="date"
                value={formData.planting_date}
                onChange={(e) => handleChange("planting_date", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expected_harvest_date">Expected Harvest Date</Label>
              <Input
                id="expected_harvest_date"
                type="date"
                value={formData.expected_harvest_date}
                onChange={(e) => handleChange("expected_harvest_date", e.target.value)}
              />
            </div>
          </div>

          {/* Field Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="field_size_acres">Field Size (acres)</Label>
              <Input
                id="field_size_acres"
                type="number"
                step="0.1"
                value={formData.field_size_acres}
                onChange={(e) => handleChange("field_size_acres", e.target.value)}
                placeholder="e.g., 2.5"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="estimated_yield_kg_per_acre">Est. Yield (kg/acre)</Label>
              <Input
                id="estimated_yield_kg_per_acre"
                type="number"
                step="1"
                value={formData.estimated_yield_kg_per_acre}
                onChange={(e) => handleChange("estimated_yield_kg_per_acre", e.target.value)}
                placeholder="e.g., 1500"
              />
            </div>
          </div>

          {/* Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Growth Stage</Label>
              <Select value={formData.growth_stage} onValueChange={(value) => handleChange("growth_stage", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {growthStages.map((stage) => (
                    <SelectItem key={stage.value} value={stage.value}>
                      {stage.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Current Health</Label>
              <Select value={formData.current_health} onValueChange={(value) => handleChange("current_health", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {healthStatuses.map((health) => (
                    <SelectItem key={health.value} value={health.value}>
                      {health.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Photo URL */}
          <div className="space-y-2">
            <Label htmlFor="photo_url">Photo URL (optional)</Label>
            <Input
              id="photo_url"
              type="url"
              value={formData.photo_url}
              onChange={(e) => handleChange("photo_url", e.target.value)}
              placeholder="https://example.com/crop-photo.jpg"
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              placeholder="Any additional notes about this crop..."
              rows={3}
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-green-600 hover:bg-green-700"
            >
              {isSubmitting ? "Adding..." : "Add Crop"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}