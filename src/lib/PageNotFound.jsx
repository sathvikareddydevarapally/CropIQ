import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function PageNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 p-6">
      <div className="text-center space-y-4">
        <h1 className="text-6xl font-bold text-green-700">404</h1>
        <p className="text-gray-600">This CropIQ page could not be found.</p>
        <Button asChild><Link to="/">Back to CropIQ</Link></Button>
      </div>
    </div>
  );
}
