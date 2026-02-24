import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { UserSpaceProvider } from "@/contexts/UserSpaceContext";
import Dashboard from "./pages/Dashboard";
import Discovery from "./pages/Discovery";
import Matches from "./pages/Matches";
import Listings from "./pages/Listings";
import CriteriaPage from "./pages/Criteria";
import CatalogPage from "./pages/Catalog";
import AcquereurDataRoom from "./pages/AcquereurDataRoom";
import ListingDetail from "./pages/ListingDetail";
import CreateForm from "./pages/CreateForm";
import DataRoom from "./pages/DataRoom";
// Messaging merged into Matches
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Legal from "./pages/Legal";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <UserSpaceProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/discovery" element={<Discovery />} />
            <Route path="/matches" element={<Matches />} />
            <Route path="/listings" element={<Listings mode="listings" />} />
            <Route path="/listings/create" element={<CreateForm mode="listing" />} />
            <Route path="/listings/:id" element={<ListingDetail />} />
            <Route path="/catalog" element={<CatalogPage />} />
            <Route path="/criteria" element={<CriteriaPage />} />
            <Route path="/criteria/create" element={<CreateForm mode="criteria" />} />
            <Route path="/acquereur-dataroom" element={<AcquereurDataRoom />} />
            <Route path="/dataroom" element={<DataRoom />} />
            <Route path="/dataroom/:id" element={<DataRoom />} />
            <Route path="/messaging" element={<Navigate to="/matches" replace />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/legal" element={<Legal type="cgu" />} />
            <Route path="/privacy" element={<Legal type="privacy" />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </UserSpaceProvider>
  </QueryClientProvider>
);

export default App;
