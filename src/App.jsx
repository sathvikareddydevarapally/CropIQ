import { Toaster } from "@/components/ui/toaster";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClientInstance } from "@/lib/query-client";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import PageNotFound from "./lib/PageNotFound";
import { AuthProvider } from "@/lib/AuthContext";
import ScrollToTop from "./components/ScrollToTop";
import Layout from "./Layout";
import Home from "./pages/Home";
import MyFarm from "./pages/MyFarm";
import SoilAnalysis from "./pages/SoilAnalysis";
import AIPredictions from "./pages/AIPredictions";
import Community from "./pages/Community";
import Profile from "./pages/Profile";

const pages = [
  ["/", Home],
  ["/Home", Home],
  ["/MyFarm", MyFarm],
  ["/SoilAnalysis", SoilAnalysis],
  ["/AIPredictions", AIPredictions],
  ["/Community", Community],
  ["/Profile", Profile],
];

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <ScrollToTop />
          <Layout>
            <Routes>
              {pages.map(([path, Component]) => (
                <Route key={path} path={path} element={<Component />} />
              ))}
              <Route path="*" element={<PageNotFound />} />
            </Routes>
          </Layout>
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;
