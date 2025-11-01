import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { authService } from './services/authService';

// Pages
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProductsPage from './pages/ProductsPage';
import MovementsPage from './pages/MovementsPage';
import AssetsPage from './pages/AssetsPage';

// Layout
import Layout from './components/layout/Layout';

function PrivateRoute({ children }) {
  return authService.isAuthenticated() ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="movements" element={<MovementsPage />} />
          <Route path="assets" element={<AssetsPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
