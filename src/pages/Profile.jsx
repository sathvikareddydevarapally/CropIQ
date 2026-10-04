import React, { useState, useEffect } from "react";
import { User } from "@/entities/User";
import { Crop } from "@/entities/Crop";
import { SoilAnalysis } from "@/entities/SoilAnalysis";
import { CommunityPost } from "@/entities/CommunityPost";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import BackButton from "../components/shared/BackButton";
import {
  User as UserIcon,
  Sprout,
  TestTube2,
  MessageCircle,
  Settings,
  Save,
  Bell,
  Edit,
  CheckCircle,
  MapPin,
  Loader2
} from "lucide-react";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [stats, setStats] = useState({
    crops: 0,
    soilAnalyses: 0,
    communityPosts: 0
  });
  const [formData, setFormData] = useState({
    full_name: "",
    farm_name: "",
    phone: "",
    preferred_language: "english",
    farm_size_acres: "",
    experience_years: "",
    primary_crops: [],
    location: {
      address: "",
      region: "",
      country: ""
    },
    notification_preferences: {
      weather_alerts: true,
      pest_disease_alerts: true,
      harvest_reminders: true,
      market_updates: true
    }
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState("");

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    setIsLoading(true);
    try {
      const userData = await User.me();
      setUser(userData);
      
      // Set form data with user data
      setFormData({
        full_name: userData.full_name || "",
        farm_name: userData.farm_name || "",
        phone: userData.phone || "",
        preferred_language: userData.preferred_language || "english",
        farm_size_acres: userData.farm_size_acres || "",
        experience_years: userData.experience_years || "",
        primary_crops: userData.primary_crops || [],
        location: userData.location || {
          address: "",
          region: "",
          country: ""
        },
        notification_preferences: userData.notification_preferences || {
          weather_alerts: true,
          pest_disease_alerts: true,
          harvest_reminders: true,
          market_updates: true
        }
      });

      // Load user stats
      const [cropsData, soilData, postsData] = await Promise.all([
        Crop.filter({ created_by: userData.email }),
        SoilAnalysis.filter({ created_by: userData.email }),
        CommunityPost.filter({ created_by: userData.email })
      ]);

      setStats({
        crops: cropsData.length,
        soilAnalyses: soilData.length,
        communityPosts: postsData.length
      });
    } catch (error) {
      console.error("Error loading user data:", error);
    }
    setIsLoading(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updateData = {
        ...formData,
        farm_size_acres: formData.farm_size_acres ? parseFloat(formData.farm_size_acres) : null,
        experience_years: formData.experience_years ? parseInt(formData.experience_years) : null
      };

      await User.updateMyUserData(updateData);
      setUser(prev => ({ ...prev, ...updateData }));
      setIsEditing(false);
      setSuccessMessage("Profile updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
    setIsSaving(false);
  };

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Location is not supported on this device.");
      return;
    }
    setIsLocating(true);
    setLocationError("");
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();
          const addr = data.address || {};
          setFormData(prev => ({
            ...prev,
            location: {
              ...prev.location,
              address: data.display_name || "",
              region: addr.state || addr.region || addr.county || "",
              country: addr.country || ""
            }
          }));
        } catch (error) {
          console.error("Reverse geocoding failed:", error);
          setLocationError("Couldn't get your address. Please enter it manually.");
        }
        setIsLocating(false);
      },
      (error) => {
        console.error("Geolocation error:", error);
        setLocationError("Location access was denied or unavailable. Please allow location access and try again.");
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const addPrimaryCrop = (crop) => {
    if (crop && !formData.primary_crops.includes(crop)) {
      setFormData(prev => ({
        ...prev,
        primary_crops: [...prev.primary_crops, crop]
      }));
    }
  };

  const removePrimaryCrop = (crop) => {
    setFormData(prev => ({
      ...prev,
      primary_crops: prev.primary_crops.filter(c => c !== crop)
    }));
  };

  const commonCrops = [
    "Corn", "Wheat", "Rice", "Soybean", "Tomato", "Potato", 
    "Beans", "Cotton", "Sugarcane", "Barley", "Oats", "Peanut"
  ];

  const languages = [
    { value: "english", label: "English" },
    { value: "spanish", label: "Español" },
    { value: "french", label: "Français" },
    { value: "portuguese", label: "Português" },
    { value: "hindi", label: "हिन्दी" },
    { value: "swahili", label: "Kiswahili" }
  ];

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-48"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Array(3).fill(0).map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 min-h-screen">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <BackButton />
            <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
            <p className="text-gray-600 mt-1">Manage your account and farming preferences</p>
          </div>
          <div className="flex gap-3">
            {isEditing ? (
              <>
                <Button 
                  variant="outline" 
                  onClick={() => setIsEditing(false)}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSave}
                  disabled={isSaving}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                  <Save className="w-4 h-4 ml-2" />
                </Button>
              </>
            ) : (
              <Button 
                onClick={() => setIsEditing(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            )}
          </div>
        </div>

        {successMessage && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">{successMessage}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Overview */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <Card className="shadow-lg border-none">
              <CardHeader className="text-center pb-4">
                <div className="w-24 h-24 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl font-bold">
                    {user?.full_name?.[0] || 'U'}
                  </span>
                </div>
                <CardTitle className="text-xl">{user?.full_name || 'Farmer'}</CardTitle>
                <p className="text-gray-600">{user?.email}</p>
                {user?.farm_name && (
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <Sprout className="w-4 h-4 text-green-600" />
                    <span className="text-green-700 font-medium">{user.farm_name}</span>
                  </div>
                )}
              </CardHeader>
            </Card>

            {/* Stats Card */}
            <Card className="shadow-lg border-none">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Activity Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sprout className="w-4 h-4 text-green-600" />
                    <span className="text-sm">Crops Managed</span>
                  </div>
                  <Badge variant="outline">{stats.crops}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TestTube2 className="w-4 h-4 text-amber-600" />
                    <span className="text-sm">Soil Analyses</span>
                  </div>
                  <Badge variant="outline">{stats.soilAnalyses}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-blue-600" />
                    <span className="text-sm">Community Posts</span>
                  </div>
                  <Badge variant="outline">{stats.communityPosts}</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profile Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <Card className="shadow-lg border-none">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserIcon className="w-5 h-5" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="full_name">Full Name</Label>
                    <Input
                      id="full_name"
                      value={formData.full_name}
                      onChange={(e) => handleInputChange("full_name", e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="farm_name">Farm Name</Label>
                    <Input
                      id="farm_name"
                      value={formData.farm_name}
                      onChange={(e) => handleInputChange("farm_name", e.target.value)}
                      disabled={!isEditing}
                      placeholder="Your farm name"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      disabled={!isEditing}
                      placeholder="+1 234 567 8900"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="language">Preferred Language</Label>
                    <Select 
                      value={formData.preferred_language} 
                      onValueChange={(value) => handleInputChange("preferred_language", value)}
                      disabled={!isEditing}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {languages.map((lang) => (
                          <SelectItem key={lang.value} value={lang.value}>
                            {lang.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="address">Farm Address</Label>
                    {isEditing && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleUseMyLocation}
                        disabled={isLocating}
                        className="text-green-700 border-green-300 hover:bg-green-50"
                      >
                        {isLocating ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <MapPin className="w-4 h-4 mr-2" />
                        )}
                        {isLocating ? "Locating..." : "Use my location"}
                      </Button>
                    )}
                  </div>
                  <Input
                    id="address"
                    value={formData.location.address}
                    onChange={(e) => handleInputChange("location.address", e.target.value)}
                    disabled={!isEditing}
                    placeholder="Farm address"
                  />
                  {locationError && (
                    <p className="text-sm text-red-600">{locationError}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="region">Region/State</Label>
                    <Input
                      id="region"
                      value={formData.location.region}
                      onChange={(e) => handleInputChange("location.region", e.target.value)}
                      disabled={!isEditing}
                      placeholder="Region or state"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      value={formData.location.country}
                      onChange={(e) => handleInputChange("location.country", e.target.value)}
                      disabled={!isEditing}
                      placeholder="Country"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Farm Information */}
            <Card className="shadow-lg border-none">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sprout className="w-5 h-5" />
                  Farm Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="farm_size">Farm Size (acres)</Label>
                    <Input
                      id="farm_size"
                      type="number"
                      step="0.1"
                      value={formData.farm_size_acres}
                      onChange={(e) => handleInputChange("farm_size_acres", e.target.value)}
                      disabled={!isEditing}
                      placeholder="e.g., 5.2"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="experience">Experience (years)</Label>
                    <Input
                      id="experience"
                      type="number"
                      value={formData.experience_years}
                      onChange={(e) => handleInputChange("experience_years", e.target.value)}
                      disabled={!isEditing}
                      placeholder="e.g., 8"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Primary Crops</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.primary_crops.map((crop, index) => (
                      <Badge 
                        key={index} 
                        variant="secondary"
                        className="cursor-pointer"
                        onClick={() => isEditing && removePrimaryCrop(crop)}
                      >
                        {crop}
                        {isEditing && <span className="ml-1">×</span>}
                      </Badge>
                    ))}
                  </div>
                  {isEditing && (
                    <Select onValueChange={addPrimaryCrop}>
                      <SelectTrigger>
                        <SelectValue placeholder="Add a crop" />
                      </SelectTrigger>
                      <SelectContent>
                        {commonCrops.filter(crop => !formData.primary_crops.includes(crop)).map((crop) => (
                          <SelectItem key={crop} value={crop}>
                            {crop}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Notification Preferences */}
            <Card className="shadow-lg border-none">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Notification Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Weather Alerts</div>
                    <div className="text-sm text-gray-600">Get notified about weather changes</div>
                  </div>
                  <Switch
                    checked={formData.notification_preferences.weather_alerts}
                    onCheckedChange={(checked) => 
                      handleInputChange("notification_preferences.weather_alerts", checked)
                    }
                    disabled={!isEditing}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Pest & Disease Alerts</div>
                    <div className="text-sm text-gray-600">Early warnings for crop threats</div>
                  </div>
                  <Switch
                    checked={formData.notification_preferences.pest_disease_alerts}
                    onCheckedChange={(checked) => 
                      handleInputChange("notification_preferences.pest_disease_alerts", checked)
                    }
                    disabled={!isEditing}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Harvest Reminders</div>
                    <div className="text-sm text-gray-600">Reminders for harvest timing</div>
                  </div>
                  <Switch
                    checked={formData.notification_preferences.harvest_reminders}
                    onCheckedChange={(checked) => 
                      handleInputChange("notification_preferences.harvest_reminders", checked)
                    }
                    disabled={!isEditing}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Market Updates</div>
                    <div className="text-sm text-gray-600">Price updates and market trends</div>
                  </div>
                  <Switch
                    checked={formData.notification_preferences.market_updates}
                    onCheckedChange={(checked) => 
                      handleInputChange("notification_preferences.market_updates", checked)
                    }
                    disabled={!isEditing}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}