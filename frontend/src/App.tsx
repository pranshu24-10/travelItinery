import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { ProtectedRoute } from './components/common/ProtectedRoute';

// Pages
import { LandingPage } from './pages/LandingPage';
import { DestinationsPage } from './pages/DestinationsPage';
import { PackagesPage } from './pages/PackagesPage';
import { PlanTripPage } from './pages/PlanTripPage';
import { ItineraryDetailsPage } from './pages/ItineraryDetailsPage';
import { BookingsPage } from './pages/BookingsPage';
import { DashboardPage } from './pages/DashboardPage';
import { ProfilePage } from './pages/ProfilePage';
import { SharedTripPage } from './pages/SharedTripPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-[#fcfbfa]">
          <Navbar />
          <main className="flex-1 pt-20">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/destinations" element={<DestinationsPage />} />
              <Route path="/package" element={<PackagesPage />} />
              <Route path="/plan-trip" element={<PlanTripPage />} />
              <Route path="/itinerary/:id" element={<ItineraryDetailsPage />} />
              <Route path="/booking" element={<BookingsPage />} />
              <Route path="/share/:shareToken" element={<SharedTripPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Protected Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />

              {/* Catch-all redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
