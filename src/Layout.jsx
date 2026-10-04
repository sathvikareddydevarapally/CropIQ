import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { User } from "@/entities/User";
import { 
  Home, 
  Sprout, 
  TestTube2, 
  Brain, 
  Users, 
  Settings,
  MessageCircle,
  Bell,
  Globe
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import AIAssistant from "./components/shared/AIAssistant";

const navigationItems = [
  {
    title: "Home",
    url: createPageUrl("Home"),
    icon: Home,
    color: "text-green-600"
  },
  {
    title: "My Farm",
    url: createPageUrl("MyFarm"),
    icon: Sprout,
    color: "text-emerald-600"
  },
  {
    title: "Soil Analysis",
    url: createPageUrl("SoilAnalysis"),
    icon: TestTube2,
    color: "text-amber-600"
  },
  {
    title: "AI Predictions",
    url: createPageUrl("AIPredictions"),
    icon: Brain,
    color: "text-purple-600"
  },
  {
    title: "Community",
    url: createPageUrl("Community"),
    icon: Users,
    color: "text-blue-600"
  },
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [showAIAssistant, setShowAIAssistant] = useState(false);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await User.me();
      setUser(userData);
    } catch (error) {
      // User not logged in or error
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-green-50 via-blue-50 to-amber-50">
        <Sidebar className="border-r border-green-200 bg-white/80 backdrop-blur-sm">
          <SidebarHeader className="border-b border-green-100 p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                <Sprout className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-xl text-gray-900">CropIQ</h2>
                <p className="text-sm text-green-600 font-medium">Smart Farming AI</p>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="p-4">
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-2">
                  {navigationItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild 
                        className={`hover:bg-green-50 hover:text-green-700 transition-all duration-200 rounded-xl h-12 ${
                          location.pathname === item.url ? 'bg-green-100 text-green-800 shadow-md' : ''
                        }`}
                      >
                        <Link to={item.url} className="flex items-center gap-3 px-4 py-3">
                          <item.icon className={`w-5 h-5 ${item.color}`} />
                          <span className="font-medium">{item.title}</span>
                          {item.title === "Community" && (
                            <Badge variant="secondary" className="ml-auto bg-blue-100 text-blue-800">
                              New
                            </Badge>
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup className="mt-8">
              <SidebarGroupContent>
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl p-4 text-white">
                  <div className="flex items-center gap-2 mb-2">
                    <Brain className="w-5 h-5" />
                    <span className="font-semibold">AI Assistant</span>
                  </div>
                  <p className="text-sm text-green-100 mb-3">
                    Get instant farming advice powered by AI
                  </p>
                  <Button 
                    size="sm" 
                    variant="secondary"
                    className="w-full bg-white/20 hover:bg-white/30 text-white border-white/20"
                    onClick={() => setShowAIAssistant(true)}
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Ask AI
                  </Button>
                </div>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t border-green-100 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {user?.full_name?.[0] || 'U'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 text-sm truncate">
                  {user?.full_name || 'Farmer'}
                </p>
                <div className="flex items-center gap-2">
                  <Globe className="w-3 h-3 text-gray-400" />
                  <p className="text-xs text-gray-500 truncate">
                    {user?.preferred_language || 'English'}
                  </p>
                </div>
              </div>
              <Link to={createPageUrl("Profile")}>
                <Button variant="ghost" size="icon" className="hover:bg-green-50">
                  <Settings className="w-4 h-4 text-gray-500" />
                </Button>
              </Link>
            </div>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col">
          {/* Mobile Header */}
          <header className="bg-white/80 backdrop-blur-sm border-b border-green-200 px-4 py-3 md:hidden">
            <div className="flex items-center justify-between">
              <SidebarTrigger className="hover:bg-green-50 p-2 rounded-lg transition-colors duration-200" />
              <div className="flex items-center gap-2">
                <Sprout className="w-6 h-6 text-green-600" />
                <h1 className="text-lg font-bold text-gray-900">CropIQ</h1>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="hover:bg-green-50">
                  <Bell className="w-5 h-5 text-gray-500" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="hover:bg-green-50"
                  onClick={() => setShowAIAssistant(true)}
                >
                  <MessageCircle className="w-5 h-5 text-green-600" />
                </Button>
              </div>
            </div>
          </header>

          {/* Desktop AI Assistant Button */}
          <div className="hidden md:block fixed top-6 right-6 z-40">
            <Button
              onClick={() => setShowAIAssistant(true)}
              className="w-14 h-14 rounded-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 shadow-lg hover:shadow-xl transition-all duration-300"
              size="icon"
            >
              <MessageCircle className="w-6 h-6 text-white" />
            </Button>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </main>

        {/* AI Assistant Modal */}
        <AIAssistant 
          isOpen={showAIAssistant} 
          onClose={() => setShowAIAssistant(false)} 
        />
      </div>
    </SidebarProvider>
  );
}