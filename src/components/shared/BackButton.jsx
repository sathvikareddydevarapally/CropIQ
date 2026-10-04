import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BackButton({ to = "/", label = "Dashboard" }) {
  return (
    <Button
      asChild
      variant="ghost"
      size="sm"
      className="text-gray-600 hover:text-green-700 hover:bg-green-50 -ml-2"
    >
      <Link to={to} className="flex items-center gap-1">
        <ArrowLeft className="w-4 h-4" />
        <span className="hidden sm:inline">{label}</span>
      </Link>
    </Button>
  );
}