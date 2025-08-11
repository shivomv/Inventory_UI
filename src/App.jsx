
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { SearchProvider } from './contexts/SearchContext';
import { ToastProvider } from './contexts/ToastContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Layout from './components/layout/Layout';
import Login from './components/auth/Login';
import Dashboard from './components/dashboard/Dashboard';
import OrdersPage from './pages/orders/OrdersPage';
import ReportsPage from './pages/reports/ReportsPage';

import StockRegisterPage from './pages/stock/StockRegisterPage';
import InvoicePage from './pages/invoices/InvoicePage';
import ConsumablesPage from './pages/consumables/ConsumablesPage';
import ScrapPage from './pages/scrap/ScrapPage';
import UserManagement from './components/Usermanagement';
import StockMastersPage from './pages/stock/masters/StockMastersPage';

function App() {
  return (
    <AuthProvider>
      <SearchProvider>
        <ToastProvider>
          <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="dashboard" element={<Dashboard />} />

              {/* Stock Routes */}
              <Route path="stock" element={<StockRegisterPage />} />
              <Route path="stock/register" element={<StockRegisterPage />} />
              <Route path="stock/masters" element={<StockMastersPage />} />

              {/* Orders Routes */}
              <Route path="orders" element={<OrdersPage />} />
              <Route path="orders/purchase" element={<OrdersPage />} />
              <Route path="orders/sales" element={<OrdersPage />} />

              {/* Other Routes */}
              <Route path="consumables" element={<ConsumablesPage />} />
              <Route path="scrap" element={<ScrapPage />} />
              <Route path="invoices" element={<InvoicePage />} />
              <Route path="reports" element={<ReportsPage />} />
           
              <Route path="usermanagement" element={<UserManagement />} />
            </Route>
          </Routes>
          </Router>
        </ToastProvider>
      </SearchProvider>
    </AuthProvider>
  );
}

export default App;
