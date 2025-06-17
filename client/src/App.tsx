
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import Layout from "./components/Layout/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import HomePage from "./pages/HomePage";
import LoginForm from "./components/Auth/LoginForm";
import RegisterForm from "./components/Auth/RegisterForm";
import ListingDetails from "./components/Listings/ListingDetails";
import ListingForm from "./components/Listings/ListingForm";
import BookingsPage from "./pages/BookingsPage";
import HostListingsPage from "./pages/HostListingsPage";
import ProfilePage from "./pages/ProfilePage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Layout>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginForm />} />
                <Route path="/register" element={<RegisterForm />} />
                <Route path="/listings/:id" element={<ListingDetails />} />
                
                {/* Protected Routes */}
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                } />
                
                <Route path="/bookings" element={
                  <ProtectedRoute>
                    <BookingsPage />
                  </ProtectedRoute>
                } />

                {/* Host Only Routes */}
                <Route path="/host/listings" element={
                  <ProtectedRoute requireRole="host">
                    <HostListingsPage />
                  </ProtectedRoute>
                } />
                
                <Route path="/host/listings/new" element={
                  <ProtectedRoute requireRole="host">
                    <ListingForm />
                  </ProtectedRoute>
                } />
                
                <Route path="/host/listings/:id/edit" element={
                  <ProtectedRoute requireRole="host">
                    <ListingForm />
                  </ProtectedRoute>
                } />

                {/* Catch-all route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
