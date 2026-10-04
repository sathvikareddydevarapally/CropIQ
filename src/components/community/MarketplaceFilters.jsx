import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter } from "lucide-react";

export default function MarketplaceFilters({ filters, setFilters }) {
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="flex flex-wrap gap-4">
      <div className="flex items-center gap-2">
        <Filter className="w-4 h-4 text-gray-500" />
        <Select 
          value={filters.category} 
          onValueChange={(value) => handleFilterChange("category", value)}
        >
          <SelectTrigger className="w-40 bg-white shadow-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="marketplace_sell">Selling</SelectItem>
            <SelectItem value="marketplace_buy">Buying</SelectItem>
            <SelectItem value="group_purchase">Group Purchase</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Select 
        value={filters.crop} 
        onValueChange={(value) => handleFilterChange("crop", value)}
      >
        <SelectTrigger className="w-32 bg-white shadow-sm">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Crops</SelectItem>
          <SelectItem value="corn">Corn</SelectItem>
          <SelectItem value="wheat">Wheat</SelectItem>
          <SelectItem value="rice">Rice</SelectItem>
          <SelectItem value="tomato">Tomato</SelectItem>
          <SelectItem value="soybean">Soybean</SelectItem>
        </SelectContent>
      </Select>

      <Select 
        value={filters.location} 
        onValueChange={(value) => handleFilterChange("location", value)}
      >
        <SelectTrigger className="w-32 bg-white shadow-sm">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Locations</SelectItem>
          <SelectItem value="local">Local Area</SelectItem>
          <SelectItem value="state">Same State</SelectItem>
          <SelectItem value="country">Same Country</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}