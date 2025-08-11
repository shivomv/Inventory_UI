import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Plus, ShoppingCart, TrendingUp } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import PurchaseOrdersTab from '../../components/orders/PurchaseOrdersTable';
import SalesOrdersTab from '../../components/orders/SalesOrdersTable';
import OrderForm from '../../components/orders/OrderForm';

const OrdersPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Determine initial tab based on current route
  const getInitialTab = () => {
    if (location.pathname.includes('/orders/sales')) {
      return 'sales';
    } else if (location.pathname.includes('/orders/purchase')) {
      return 'purchase';
    }
    return 'purchase'; // default
  };
  
  const [activeTab, setActiveTab] = useState(getInitialTab());
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  
  // Refs for tab components to call their refresh functions
  const purchaseTabRef = useRef(null);
  const salesTabRef = useRef(null);

  // Update active tab when route changes
  useEffect(() => {
    const newTab = getInitialTab();
    if (newTab !== activeTab) {
      setActiveTab(newTab);
    }
  }, [location.pathname]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    navigate(`/orders/${tab}`);
  };

  const handleCreateOrder = () => {
    setEditingOrder(null);
    setIsFormOpen(true);
  };

  const handleEditOrder = (order) => {
    setEditingOrder(order);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingOrder(null);
  };

  const handleOrderSave = (savedOrder) => {
    // Refresh the appropriate tab data
    if (activeTab === 'purchase' && purchaseTabRef.current) {
      purchaseTabRef.current.refreshData();
    } else if (activeTab === 'sales' && salesTabRef.current) {
      salesTabRef.current.refreshData();
    }
  };



  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Orders Management</h1>
          <p className="text-gray-600 mt-1 sm:mt-2">Manage your purchase and sales orders</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button onClick={handleCreateOrder} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Create {activeTab === 'purchase' ? 'Purchase' : 'Sales'} Order</span>
            <span className="sm:hidden">Create Order</span>
          </Button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-4 sm:space-x-8 overflow-x-auto">
          <button
            onClick={() => handleTabChange('purchase')}
            className={`py-3 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 whitespace-nowrap ${
              activeTab === 'purchase'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">Purchase Orders</span>
            <span className="sm:hidden">Purchase</span>
          </button>
          <button
            onClick={() => handleTabChange('sales')}
            className={`py-3 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 whitespace-nowrap ${
              activeTab === 'sales'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">Sales Orders</span>
            <span className="sm:hidden">Sales</span>
          </button>
        </nav>
      </div>



      {/* Tab Content */}
      {activeTab === 'purchase' ? (
        <PurchaseOrdersTab
          ref={purchaseTabRef}
          onEditOrder={handleEditOrder}
        />
      ) : (
        <SalesOrdersTab
          ref={salesTabRef}
          onEditOrder={handleEditOrder}
        />
      )}

      {/* Order Form Modal */}
      <OrderForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        order={editingOrder}
        orderType={activeTab}
        onSave={handleOrderSave}
      />
    </div>
  );
};

export default OrdersPage;