import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Discovery from "./pages/Discovery";
import Matches from "./pages/Matches";
import Listings from "./pages/Listings";
import ListingDetail from "./pages/ListingDetail";
import CreateForm from "./pages/CreateForm";
import DataRoom from "./pages/DataRoom";
import Messaging from "./pages/Messaging";
import Profile from "./pages/Profile";
import Legal from "./pages/Legal";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/discovery" element={<ProtectedRoute><Discovery /></ProtectedRoute>} />
            <Route path="/matches" element={<ProtectedRoute><Matches /></ProtectedRoute>} />
            <Route path="/listings" element={<ProtectedRoute><Listings mode="listings" /></ProtectedRoute>} />
            <Route path="/listings/create" element={<ProtectedRoute><CreateForm mode="listing" /></ProtectedRoute>} />
            <Route path="/listings/:id" element={<ProtectedRoute><ListingDetail /></ProtectedRoute>} />
            <Route path="/catalog" element={<ProtectedRoute><Listings mode="catalog" /></ProtectedRoute>} />
            <Route path="/criteria" element={<ProtectedRoute><Listings mode="criteria" /></ProtectedRoute>} />
            <Route path="/criteria/create" element={<ProtectedRoute><CreateForm mode="criteria" /></ProtectedRoute>} />
            <Route path="/dataroom" element={<ProtectedRoute><DataRoom /></ProtectedRoute>} />
            <Route path="/messaging" element={<ProtectedRoute><Messaging /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/legal" element={<Legal type="cgu" />} />
            <Route path="/privacy" element={<Legal type="privacy" />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
