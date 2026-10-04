import React, { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Camera,
  Upload,
  MapPin,
  Smartphone
} from "lucide-react";

export default function SoilUploadZone({ onPhotoUpload }) {
  const [showCameraDialog, setShowCameraDialog] = useState(false);
  const [location, setLocation] = useState({
    latitude: null,
    longitude: null,
    field_name: ""
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);
  
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [isMobile] = React.useState(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0 && files[0].type.startsWith('image/')) {
      setSelectedFile(files[0]);
      getCurrentLocation();
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setSelectedFile(files[0]);
      getCurrentLocation();
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation(prev => ({
            ...prev,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          }));
        },
        (error) => {
          console.log("Location access denied:", error);
        }
      );
    }
  };

  const startCamera = React.useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: isMobile ? 'environment' : 'user' },
        audio: false
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsCameraReady(true);
    } catch (err) {
      console.error("Error accessing camera:", err);
    }
  }, [isMobile]);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraReady(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current || !isCameraReady) return;

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0);

    canvas.toBlob((blob) => {
      const file = new File([blob], `soil-${Date.now()}.jpg`, { type: 'image/jpeg' });
      setSelectedFile(file);
      setShowCameraDialog(false);
      getCurrentLocation();
    }, 'image/jpeg', 0.8);
  };

  const handleSubmit = async () => {
    if (selectedFile) {
      await onPhotoUpload(selectedFile, location);
      setSelectedFile(null);
      setLocation({
        latitude: null,
        longitude: null,
        field_name: ""
      });
    }
  };

  React.useEffect(() => {
    if (showCameraDialog) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [showCameraDialog, startCamera]);

  return (
    <>
      <Card className="border-none shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-amber-600" />
            Soil Photo Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {!selectedFile ? (
            <div className="grid md:grid-cols-2 gap-6">
              {/* Drag & Drop Upload */}
              <div
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 cursor-pointer ${
                  dragActive
                    ? "border-amber-400 bg-amber-50"
                    : "border-gray-300 hover:border-amber-300 hover:bg-amber-50"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-8 h-8 text-amber-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Upload Photo</h3>
                <p className="text-gray-600 text-sm">
                  Drag & drop your soil photo or click to browse
                </p>
              </div>

              {/* Camera Capture */}
              <div
                className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-amber-300 hover:bg-amber-50 transition-all duration-200 cursor-pointer"
                onClick={() => {
                  setShowCameraDialog(true);
                  getCurrentLocation();
                }}
              >
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  {isMobile ? (
                    <Smartphone className="w-8 h-8 text-amber-600" />
                  ) : (
                    <Camera className="w-8 h-8 text-amber-600" />
                  )}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Take Photo</h3>
                <p className="text-gray-600 text-sm">
                  {isMobile ? 'Use your phone camera' : 'Use your webcam'}
                </p>
              </div>
            </div>
          ) : (
            /* Photo Preview & Location */
            <div className="space-y-6">
              <div className="relative">
                <img
                  src={URL.createObjectURL(selectedFile)}
                  alt="Soil sample"
                  className="w-full max-h-64 object-cover rounded-lg"
                />
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setSelectedFile(null)}
                  className="absolute top-2 right-2"
                >
                  Change Photo
                </Button>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="field_name">Field Name (optional)</Label>
                  <Input
                    id="field_name"
                    placeholder="e.g., North Field, Plot A"
                    value={location.field_name}
                    onChange={(e) => setLocation(prev => ({...prev, field_name: e.target.value}))}
                  />
                </div>

                {location.latitude && location.longitude && (
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <MapPin className="w-4 h-4" />
                    <span>Location captured</span>
                  </div>
                )}

                <Button
                  onClick={handleSubmit}
                  className="w-full bg-amber-600 hover:bg-amber-700"
                  size="lg"
                >
                  <Camera className="w-5 h-5 mr-2" />
                  Analyze Soil Photo
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Camera Dialog */}
      <Dialog open={showCameraDialog} onOpenChange={setShowCameraDialog}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Camera className="w-5 h-5" />
              Take Soil Photo
            </DialogTitle>
          </DialogHeader>
          <div className="relative aspect-[4/3] bg-black rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="absolute inset-0 w-full h-full object-cover"
            />
            {!isCameraReady && (
              <div className="absolute inset-0 flex items-center justify-center text-white">
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white" />
                  Loading camera...
                </div>
              </div>
            )}
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <Button
              variant="outline"
              onClick={() => setShowCameraDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={capturePhoto}
              disabled={!isCameraReady}
              className="bg-amber-600 hover:bg-amber-700"
            >
              <Camera className="w-4 h-4 mr-2" />
              Capture Photo
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}