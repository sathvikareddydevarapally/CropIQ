import React, { useState, useEffect, useCallback } from "react";
import { Crop } from "@/entities/Crop";
import { User } from "@/entities/User";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Search,
  Calendar,
  MapPin,
  TrendingUp,
  Sprout
} from "lucide-react";

import CropCard from "../components/farm/CropCard";
import AddCropModal from "../components/farm/AddCropModal";
import CropFilters from "../components/farm/CropFilters";
import BackButton from "../components/shared/BackButton";

export default function MyFarmPage() {
  const [crops, setCrops] = useState([]);
  const [filteredCrops, setFilteredCrops] = useState([]);
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [filters, setFilters] = useState({
    stage: "all",
    health: "all",
    sortBy: "recent"
  });
  const [isLoading, setIsLoading] = useState(true);

  const filterCrops = useCallback(() => {
    let filtered = [...crops];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(crop => 
        crop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (crop.variety && crop.variety.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Stage filter
    if (filters.stage !== "all") {
      filtered = filtered.filter(crop => crop.growth_stage === filters.stage);
    }

    // Health filter  
    if (filters.health !== "all") {
      filtered = filtered.filter(crop => crop.current_health === filters.health);
    }

    // Sort
    switch (filters.sortBy) {
      case "recent":
        filtered.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
        break;
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "planting_date":
        filtered.sort((a, b) => new Date(b.planting_date) - new Date(a.planting_date));
        break;
      case "harvest_date":
        filtered.sort((a, b) => new Date(a.expected_harvest_date || "9999-12-31") - new Date(b.expected_harvest_date || "9999-12-31"));
        break;
    }

    setFilteredCrops(filtered);
  }, [crops, searchTerm, filters]);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterCrops();
  }, [crops, searchTerm, filters, filterCrops]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const userData = await User.me();
      setUser(userData);
      
      const cropsData = await Crop.filter({ created_by: userData.email }, "-created_date");
      setCrops(cropsData);
    } catch (error) {
      console.error("Error loading data:", error);
    }
    setIsLoading(false);
  };

  const handleAddCrop = async (cropData) => {
    try {
      await Crop.create(cropData);
      setShowAddModal(false);
      loadData(); // Reload crops
    } catch (error) {
      console.error("Error adding crop:", error);
    }
  };

  const getTotalAcres = () => {
    return crops.reduce((total, crop) => total + (crop.field_size_acres || 0), 0);
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-48"></div>
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
    <div className="p-4 md:p-8 bg-gradient-to-br from-green-50 via-blue-50 to-amber-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <BackButton />
            <h1 className="text-3xl font-bold text-gray-900">My Farm</h1>
            <p className="text-gray-600 mt-1">
              Manage your crops and track their progress
            </p>
            {user?.farm_name && (
              <div className="flex items-center gap-2 mt-2">
                <MapPin className="w-4 h-4 text-green-600" />
                <span className="text-green-700 font-medium">{user.farm_name}</span>
              </div>
            )}
          </div>
          <Button 
            onClick={() => setShowAddModal(true)}
            className="bg-green-600 hover:bg-green-700 shadow-lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add New Crop
          </Button>
        </div>

        {/* Farm Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-6 shadow-lg border-none">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Sprout className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{crops.length}</div>
                <div className="text-gray-600">Total Crops</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border-none">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <MapPin className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {getTotalAcres().toFixed(1)}
                </div>
                <div className="text-gray-600">Total Acres</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border-none">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {crops.filter(c => c.growth_stage === "flowering" || c.growth_stage === "fruiting").length}
                </div>
                <div className="text-gray-600">Ready Soon</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border-none">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {crops.reduce((total, crop) => total + (crop.estimated_yield_kg_per_acre || 0), 0).toFixed(0)}
                </div>
                <div className="text-gray-600">Est. Yield (kg)</div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search crops..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white shadow-sm border-gray-200"
              />
            </div>
          </div>
          <CropFilters filters={filters} setFilters={setFilters} />
        </div>

        {/* Crops Grid */}
        {filteredCrops.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCrops.map((crop) => (
              <CropCard key={crop.id} crop={crop} onUpdate={loadData} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Sprout className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {crops.length === 0 ? "No crops yet" : "No crops match your search"}
            </h3>
            <p className="text-gray-600 mb-6">
              {crops.length === 0 
                ? "Start your farming journey by adding your first crop"
                : "Try adjusting your search terms or filters"
              }
            </p>
            {crops.length === 0 && (
              <Button 
                onClick={() => setShowAddModal(true)}
                className="bg-green-600 hover:bg-green-700"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Your First Crop
              </Button>
            )}
          </div>
        )}

        {/* Add Crop Modal */}
        <AddCropModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddCrop}
        />
      </div>
    </div>
  );
}