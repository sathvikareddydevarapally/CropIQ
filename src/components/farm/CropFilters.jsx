import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter } from "lucide-react";

export default function CropFilters({ filters, setFilters }) {
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="flex gap-3">
      <div className="flex items-center gap-2">
        <Filter className="w-4 h-4 text-gray-500" />
        <Select 
          value={filters.stage} 
          onValueChange={(value) => handleFilterChange("stage", value)}
        >
          <SelectTrigger className="w-40 bg-white shadow-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Stages</SelectItem>
            <SelectItem value="seedling">Seedling</SelectItem>
            <SelectItem value="vegetative">Vegetative</SelectItem>
            <SelectItem value="flowering">Flowering</SelectItem>
            <SelectItem value="fruiting">Fruiting</SelectItem>
            <SelectItem value="maturity">Maturity</SelectItem>
            <SelectItem value="harvest">Harvest</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Select 
        value={filters.health} 
        onValueChange={(value) => handleFilterChange("health", value)}
      >
        <SelectTrigger className="w-36 bg-white shadow-sm">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Health</SelectItem>
          <SelectItem value="excellent">Excellent</SelectItem>
          <SelectItem value="good">Good</SelectItem>
          <SelectItem value="fair">Fair</SelectItem>
          <SelectItem value="poor">Poor</SelectItem>
        </SelectContent>
      </Select>

      <Select 
        value={filters.sortBy} 
        onValueChange={(value) => handleFilterChange("sortBy", value)}
      >
        <SelectTrigger className="w-36 bg-white shadow-sm">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="recent">Most Recent</SelectItem>
          <SelectItem value="name">Name A-Z</SelectItem>
          <SelectItem value="planting_date">Planting Date</SelectItem>
          <SelectItem value="harvest_date">Harvest Date</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}