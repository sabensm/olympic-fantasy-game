import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import NotFound from "./pages/NotFound";

const SignIn = lazy(() => import("./pages/SignIn"));
const SignUp = lazy(() => import("./pages/SignUp"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const LeagueView = lazy(() => import("./pages/LeagueView"));

const Loading = () => (
  <div className="min-h-screen gradient-alpine flex items-center justify-center">
    <div className="text-muted-foreground">Loading...</div>
  </div>
);

const OlympicsOverBanner = () => (
  <div className="w-full bg-olympic-blue text-white text-center py-2 px-4 text-sm font-medium">
    🏅 Milan Cortina 2026 has concluded. Thanks for playing — see you at LA 2028! 🏅
  </div>
);

const App = () => (
  <TooltipProvider>
    <Toaster />
    <Sonner />
    <BrowserRouter>
      <OlympicsOverBanner />
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/:slug" element={<LeagueView />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  </TooltipProvider>
);

export default App;
