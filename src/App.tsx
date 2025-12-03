import React, { Suspense, lazy, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore, useThemeStore } from '@/store';
import { AuthProvider } from '@/context/AuthProvider';
import { NotificationProvider } from '@/context/NotificationContext';
import { TourProvider } from '@/context/TourContext';
import { MainLayout } from '@/components/Layout';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Toaster } from 'sonner';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { PWAInstallPrompt } from '@/components/pwa/PWAInstallPrompt';
import { PWAUpdateToast } from '@/components/pwa/PWAUpdateToast';
import { DiagnosticsService } from '@/api/services';
import { EnvCheck } from '@/components/EnvCheck';

// Lazy load pages
const HomePage = lazy(() => import('@/pages/Home').then(module => ({ default: module.HomePage })));
const LandingPage = lazy(() => import('@/pages/Landing').then(module => ({ default: module.LandingPage })));
const LoginPage = lazy(() => import('@/pages/Login').then(module => ({ default: module.LoginPage })));
const ForgotPasswordPage = lazy(() => import('@/pages/AuthPages').then(module => ({ default: module.ForgotPasswordPage })));
const ForceChangePasswordPage = lazy(() => import('@/pages/ForceChangePassword').then(module => ({ default: module.ForceChangePasswordPage })));
const DashboardPage = lazy(() => import('@/pages/Dashboard').then(module => ({ default: module.DashboardPage })));
const InventoryPage = lazy(() => import('@/pages/Inventory').then(module => ({ default: module.InventoryPage })));
const AssetsPage = lazy(() => import('@/pages/Assets').then(module => ({ default: module.AssetsPage })));
const AssetDetailsPage = lazy(() => import('@/pages/AssetDetails').then(module => ({ default: module.AssetDetailsPage })));
const MovementHistoryPage = lazy(() => import('@/pages/Movements').then(module => ({ default: module.MovementHistoryPage })));
const PurchasePage = lazy(() => import('@/pages/Purchases').then(module => ({ default: module.PurchasePage })));
const CheckoutsPage = lazy(() => import('@/pages/Checkouts').then(module => ({ default: module.CheckoutsPage })));
const AdminPage = lazy(() => import('@/pages/Admin').then(module => ({ default: module.AdminPage })));
const ReportsPage = lazy(() => import('@/pages/Reports').then(module => ({ default: module.ReportsPage })));
const LocationsPage = lazy(() => import('@/pages/Locations').then(module => ({ default: module.LocationsPage })));
const MaintenanceBoardPage = lazy(() => import('@/pages/MaintenanceBoard').then(module => ({ default: module.MaintenanceBoardPage })));
const AdminToolsPage = lazy(() => import('@/pages/AdminTools').then(module => ({ default: module.AdminToolsPage })));
const BulkPrintPage = lazy(() => import('@/pages/BulkPrint').then(module => ({ default: module.BulkPrintPage })));
const ProfilePage = lazy(() => import('@/pages/Profile').then(module => ({ default: module.ProfilePage })));

const NotFoundPage = lazy(() => import('@/pages/ErrorPages').then(module => ({ default: module.NotFoundPage })));
const UnauthorizedPage = lazy(() => import('@/pages/ErrorPages').then(module => ({ default: module.UnauthorizedPage })));

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.must_change_password) {
    return <Navigate to="/force-change-password" replace />;
  }

  return <>{children}</>;
};

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) {
    return <Navigate to="/app/dashboard" replace />;
  }

  return <>{children}</>;
};

const LoadingFallback = () => (
  <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-davus-primary"></div>
  </div>
);

const App: React.FC = () => {
  const { initTheme, setTheme } = useThemeStore();

  useEffect(() => {
    initTheme();

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem('theme')) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [initTheme, setTheme]);

  useEffect(() => {
    const prefetch = () => {
      import('@/pages/Dashboard');
      import('@/pages/Assets');
      import('@/pages/Inventory');
      import('@/pages/Locations');
    };
    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(prefetch, { timeout: 2000 });
    } else {
      setTimeout(prefetch, 1500);
    }
  }, []);

  useEffect(() => {
    const check = async () => {
      const res = await DiagnosticsService.ping();
      if (!res.ok) {
        const msg = res.details ? `Banco indisponível: ${res.details}` : 'Banco indisponível';
        // No need to block UI; just inform
        // Using toaster for user feedback
        // Avoid spamming: only once on startup
        // Sonner already mounted
        // eslint-disable-next-line
        // @ts-ignore
        import('sonner').then(({ toast }) => toast.error(msg));
      }
    };
    check();
  }, []);

  return (
    <ErrorBoundary>
      <EnvCheck />
      <QueryClientProvider client={queryClient}>
        <HashRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <NotificationProvider>
            <TourProvider>
              <AuthProvider>
                <Toaster position="top-right" richColors />
                <PWAUpdateToast />
                <PWAInstallPrompt />
                <Suspense fallback={<LoadingFallback />}>
                  <Routes>
                    <Route path="/login" element={
                      <PublicRoute>
                        <LoginPage />
                      </PublicRoute>
                    } />
                    <Route path="/forgot-password" element={
                      <PublicRoute>
                        <ForgotPasswordPage />
                      </PublicRoute>
                    } />
                    <Route path="/" element={
                      <PublicRoute>
                        <LandingPage />
                      </PublicRoute>
                    } />
                    <Route path="/force-change-password" element={<ForceChangePasswordPage />} />

                    <Route path="/app" element={
                      <ProtectedRoute>
                        <MainLayout />
                      </ProtectedRoute>
                    }>
                      <Route index element={<Navigate to="/app/home" replace />} />
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


                      <Route path="locations" element={<LocationsPage />} />
                      <Route path="maintenance-board" element={<MaintenanceBoardPage />} />
                      <Route path="admin-tools" element={<AdminToolsPage />} />
                      <Route path="bulk-print" element={<BulkPrintPage />} />

                      <Route path="unauthorized" element={<UnauthorizedPage />} />
                      <Route path="*" element={<NotFoundPage />} />
                    </Route>
                  </Routes>
                </Suspense>
              </AuthProvider>
            </TourProvider>
          </NotificationProvider>
        </HashRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
