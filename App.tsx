import React, { Suspense, lazy } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store';
import { NotificationProvider } from './context/NotificationContext';
import { TourProvider } from './context/TourContext';
import { MainLayout } from './components/Layout';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Toaster } from 'sonner';

// Lazy load pages
const HomePage = lazy(() => import('./pages/Home').then(module => ({ default: module.HomePage })));
const LoginPage = lazy(() => import('./pages/Login').then(module => ({ default: module.LoginPage })));
const ForgotPasswordPage = lazy(() => import('./pages/AuthPages').then(module => ({ default: module.ForgotPasswordPage })));
const DashboardPage = lazy(() => import('./pages/Dashboard').then(module => ({ default: module.DashboardPage })));
const InventoryPage = lazy(() => import('./pages/Inventory').then(module => ({ default: module.InventoryPage })));
const AssetsPage = lazy(() => import('./pages/Assets').then(module => ({ default: module.AssetsPage })));
const AssetDetailsPage = lazy(() => import('./pages/AssetDetails').then(module => ({ default: module.AssetDetailsPage })));
const MovementHistoryPage = lazy(() => import('./pages/Movements').then(module => ({ default: module.MovementHistoryPage })));
const PurchasePage = lazy(() => import('./pages/Purchases').then(module => ({ default: module.PurchasePage })));
const CheckoutsPage = lazy(() => import('./pages/Checkouts').then(module => ({ default: module.CheckoutsPage })));
const AdminPage = lazy(() => import('./pages/Admin').then(module => ({ default: module.AdminPage })));
const ReportsPage = lazy(() => import('./pages/Reports').then(module => ({ default: module.ReportsPage })));
const LocationsPage = lazy(() => import('./pages/Locations').then(module => ({ default: module.LocationsPage })));
const MaintenanceBoardPage = lazy(() => import('./pages/MaintenanceBoard').then(module => ({ default: module.MaintenanceBoardPage })));
const AdminToolsPage = lazy(() => import('./pages/AdminTools').then(module => ({ default: module.AdminToolsPage })));
const BulkPrintPage = lazy(() => import('./pages/BulkPrint').then(module => ({ default: module.BulkPrintPage })));
const ProfilePage = lazy(() => import('./pages/Profile').then(module => ({ default: module.ProfilePage })));
const AIInsightsPage = lazy(() => import('./pages/AIInsights').then(module => ({ default: module.AIInsightsPage })));
const NotFoundPage = lazy(() => import('./pages/ErrorPages').then(module => ({ default: module.NotFoundPage })));
const UnauthorizedPage = lazy(() => import('./pages/ErrorPages').then(module => ({ default: module.UnauthorizedPage })));

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const LoadingFallback = () => (
  <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-davus-primary"></div>
  </div>
);

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <HashRouter>
          <NotificationProvider>
            <TourProvider>
              <Toaster position="top-right" richColors />
              <Suspense fallback={<LoadingFallback />}>
                <Routes>
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/forgot-password" element={<ForgotPasswordPage />} />

                  <Route path="/" element={
                    <ProtectedRoute>
                      <MainLayout />
                    </ProtectedRoute>
                  }>
                    <Route index element={<Navigate to="/home" replace />} />
                    <Route path="home" element={<HomePage />} />
                    <Route path="dashboard" element={<DashboardPage />} />
                    <Route path="profile" element={<ProfilePage />} />

                    <Route path="inventory" element={<InventoryPage />} />
                    <Route path="movements" element={<MovementHistoryPage />} />
                    <Route path="purchases" element={<PurchasePage />} />

                    <Route path="assets" element={<AssetsPage />} />
                    <Route path="assets/:id" element={<AssetDetailsPage />} />

                    <Route path="checkouts" element={<CheckoutsPage />} />
                    <Route path="admin" element={<AdminPage />} />
                    <Route path="reports" element={<ReportsPage />} />
                    <Route path="ai-insights" element={<AIInsightsPage />} />

                    <Route path="locations" element={<LocationsPage />} />
                    <Route path="maintenance-board" element={<MaintenanceBoardPage />} />
                    <Route path="admin-tools" element={<AdminToolsPage />} />
                    <Route path="bulk-print" element={<BulkPrintPage />} />

                    <Route path="unauthorized" element={<UnauthorizedPage />} />
                    <Route path="*" element={<NotFoundPage />} />
                  </Route>
                </Routes>
              </Suspense>
            </TourProvider>
          </NotificationProvider>
        </HashRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;