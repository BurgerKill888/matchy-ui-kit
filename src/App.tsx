import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
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
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/listings" element={<Listings mode="listings" />} />
          <Route path="/listings/create" element={<CreateForm mode="listing" />} />
          <Route path="/listings/:id" element={<ListingDetail />} />
          <Route path="/catalog" element={<Listings mode="catalog" />} />
          <Route path="/criteria" element={<Listings mode="criteria" />} />
          <Route path="/criteria/create" element={<CreateForm mode="criteria" />} />
          <Route path="/dataroom" element={<DataRoom />} />
          <Route path="/messaging" element={<Messaging />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/legal" element={<Legal type="cgu" />} />
          <Route path="/privacy" element={<Legal type="privacy" />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
