import React from 'react';
import {
  Package,
  Warehouse,
  ShoppingCart,
  Building,
  Wrench,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  Users,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  MapPin,
  FileText,
  Target,
  Zap,
  Plus,
  ArrowRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import PropTypes from 'prop-types';

const DashboardWidgets = ({ onNavigate }) => {
  // Mock data adapted for a paper printing company
  const paperInventory = {
    totalPaperTypes: 12,
    activeTypes: 11,
    lowStockTypes: 2,
    outOfStockTypes: 1,
    recentlyReceived: 3,
    totalInventorySheets: 320000,
    totalInventoryValue: 132450.75,
    categories: [
      { name: 'Coated - Gloss', count: 120000, percentage: 37 },
      { name: 'Uncoated', count: 80000, percentage: 25 },
      { name: 'Recycled', count: 50000, percentage: 16 },
      { name: 'Specialty', count: 40000, percentage: 12 },
      { name: 'Cardstock', count: 30000, percentage: 9 }
    ]
  };

  const inventoryOverview = {
    totalInventoryItems: 5, // categories
    totalSheets: paperInventory.totalInventorySheets,
    totalValue: paperInventory.totalInventoryValue,
    lowStockItems: 2,
    wasteTodaySheets: 120,
    pendingTransfers: 4,
    adjustmentsToday: 5,
    locations: [
      { name: 'Main Warehouse', items: 180000, percentage: 56 },
      { name: 'Prepress Area', items: 80000, percentage: 25 },
      { name: 'Printing Floor', items: 40000, percentage: 12 },
      { name: 'Shipping', items: 20000, percentage: 7 }
    ]
  };

  const ordersData = {
    totalOrders: 78,
    pendingOrders: 14,
    completedOrders: 50,
    cancelledOrders: 14,
    totalValue: 158000.0,
    monthlyGrowth: 9.8,
    salesOrders: 55,
    purchaseOrders: 23,
    recentOrders: [
      { reference: 'SO-2025-101', type: 'Sales', amount: 8400.00, status: 'Pending' },
      { reference: 'PO-2025-033', type: 'Purchase', amount: 12500.00, status: 'Received' },
      { reference: 'SO-2025-099', type: 'Sales', amount: 6400.50, status: 'Complete' }
    ]
  };

  const printJobs = {
    totalJobs: 42,
    pendingJobs: 9,
    inProgress: 7,
    completedJobs: 22,
    rejectedJobs: 4,
    totalSheetsPlanned: 540000,
    completionRate: 82.3,
    recentJobs: [
      { reference: 'PJ-2025-001', jobName: 'Brochure Run', sheets: 20000, status: 'In Progress' },
      { reference: 'PJ-2025-002', jobName: 'Annual Report', sheets: 50000, status: 'Complete' },
      { reference: 'PJ-2025-003', jobName: 'Flyer Batch', sheets: 15000, status: 'Pending' }
    ]
  };

  const clientsSuppliers = {
    totalEntities: 38,
    suppliers: 22,
    clients: 16,
    activeSuppliers: 20,
    activeClients: 14,
    topSuppliers: [
      { name: 'PaperSource Ltd', orders: 18, value: 45200.00 },
      { name: 'Global Inks', orders: 12, value: 21840.75 },
      { name: 'Packaging Pro', orders: 9, value: 13250.00 }
    ],
    topClients: [
      { name: 'Marketing Co', orders: 14, value: 37500.00 },
      { name: 'Event Planners Inc', orders: 11, value: 29400.25 },
      { name: 'EduPrint', orders: 7, value: 18900.50 }
    ]
  };

  const recentActivity = [
    {
      type: 'inventory_adjustment',
      message: 'Inventory adjusted for Coated - Gloss',
      user: 'Ravi Kumar',
      time: '5 minutes ago',
      icon: Package,
      color: 'text-blue-600'
    },
    {
      type: 'job_complete',
      message: 'Print job PJ-2025-002 completed',
      user: 'Sonal Mehta',
      time: '30 minutes ago',
      icon: CheckCircle,
      color: 'text-green-600'
    },
    {
      type: 'order_received',
      message: 'Purchase order PO-2025-033 received',
      user: 'Anil Sharma',
      time: '1 hour ago',
      icon: ShoppingCart,
      color: 'text-purple-600'
    },
    {
      type: 'new_client',
      message: 'New client onboarded: EduPrint',
      user: 'Priya Singh',
      time: '2 hours ago',
      icon: Plus,
      color: 'text-orange-600'
    },
    {
      type: 'waste_report',
      message: 'Quality check failed on Flyer Batch (waste reported)',
      user: 'Deepak Verma',
      time: '3 hours ago',
      icon: AlertTriangle,
      color: 'text-red-600'
    }
  ];

  return (
    <div className="space-y-4">
      {/* Quick Stats Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
        <Card className="cursor-pointer hover:shadow transition-shadow border rounded-md" onClick={() => onNavigate('/inventory')}>
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Total Paper Types</p>
                <p className="text-lg font-semibold text-gray-900">{paperInventory.totalPaperTypes}</p>
                <p className="text-[10px] text-green-600 flex items-center mt-0.5">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {paperInventory.recentlyReceived} received this week
                </p>
              </div>
              <Package className="w-6 h-6 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow transition-shadow border rounded-md" onClick={() => onNavigate('/inventory-overview')}>
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Inventory Sheets</p>
                <p className="text-lg font-semibold text-gray-900">{inventoryOverview.totalSheets.toLocaleString()}</p>
                <p className="text-[10px] text-red-600 flex items-center mt-0.5">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  {inventoryOverview.lowStockItems} low stock types
                </p>
              </div>
              <Warehouse className="w-6 h-6 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow transition-shadow border rounded-md" onClick={() => onNavigate('/orders')}>
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Orders</p>
                <p className="text-lg font-semibold text-gray-900">{ordersData.totalOrders}</p>
                <p className="text-[10px] text-yellow-600 flex items-center mt-0.5">
                  <Clock className="w-3 h-3 mr-1" />
                  {ordersData.pendingOrders} pending
                </p>
              </div>
              <ShoppingCart className="w-6 h-6 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow transition-shadow border rounded-md" onClick={() => onNavigate('/print-jobs')}>
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Print Jobs</p>
                <p className="text-lg font-semibold text-gray-900">{printJobs.totalJobs}</p>
                <p className="text-[10px] text-blue-600 flex items-center mt-0.5">
                  <Activity className="w-3 h-3 mr-1" />
                  {printJobs.inProgress} in progress
                </p>
              </div>
              <Wrench className="w-6 h-6 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow transition-shadow border rounded-md" onClick={() => onNavigate('/clients')}>
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Clients & Suppliers</p>
                <p className="text-lg font-semibold text-gray-900">{clientsSuppliers.totalEntities}</p>
                <p className="text-[10px] text-gray-600 flex items-center mt-0.5">
                  <Users className="w-3 h-3 mr-1" />
                  {clientsSuppliers.clients} clients
                </p>
              </div>
              <Building className="w-6 h-6 text-indigo-500" />
            </div>
          </CardContent>
        </Card>
      </div>

     

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* Recent Activity */}
        <Card className="border rounded-md">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-base font-semibold">
              <Activity className="w-4 h-4 mr-1.5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center bg-gray-100 ${activity.color}`}>
                    <activity.icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-900">{activity.message}</p>
                    <p className="text-[10px] text-gray-400">by {activity.user} • {activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t">
              <Button variant="outline" size="xs" className="w-full text-xs py-1">
                View All Activity
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Inventory Overview */}
        <Card className="border rounded-md">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-base font-semibold">
              <Warehouse className="w-4 h-4 mr-1.5" />
              Inventory Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div className="text-center p-2 bg-blue-50 rounded">
                  <div className="text-base font-bold text-blue-600">{inventoryOverview.totalSheets.toLocaleString()}</div>
                  <div className="text-xs text-gray-500">Total Sheets</div>
                </div>
                <div className="text-center p-2 bg-green-50 rounded">
                  <div className="text-base font-bold text-green-600">${inventoryOverview.totalValue.toLocaleString()}</div>
                  <div className="text-xs text-gray-500">Inventory Value</div>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>Low Stock Types</span>
                  <span className="text-red-600">{inventoryOverview.lowStockItems}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Pending Transfers</span>
                  <span className="text-yellow-600">{inventoryOverview.pendingTransfers}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Waste Today</span>
                  <span className="text-blue-600">{inventoryOverview.wasteTodaySheets} sheets</span>
                </div>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t">
              <Button variant="outline" size="xs" className="w-full text-xs py-1" onClick={() => onNavigate('/inventory-overview')}>
                Manage Inventory
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Paper Categories */}
        <Card className="border rounded-md">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-base font-semibold">
              <Package className="w-4 h-4 mr-1.5" />
              Paper by Type
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              {paperInventory.categories.map((category, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-1.5">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: `hsl(${index * 60}, 70%, 50%)` }}></div>
                    <span className="text-xs font-medium">{category.name}</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <span className="text-xs text-gray-600">{category.count.toLocaleString()}</span>
                    <span className="text-[10px] text-gray-400">({category.percentage}%)</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t">
              <Button variant="outline" size="xs" className="w-full text-xs py-1" onClick={() => onNavigate('/inventory')}>
                View All Paper Types
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Orders and Print Jobs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* Recent Orders */}
        <Card className="border rounded-md">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between text-base font-semibold">
              <div className="flex items-center">
                <ShoppingCart className="w-4 h-4 mr-1.5" />
                Recent Orders
              </div>
              <Button variant="outline" size="xs" className="text-xs py-1 px-2" onClick={() => onNavigate('/orders')}>
                View All
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2 bg-blue-50 rounded">
                  <div className="text-base font-bold text-blue-600">{ordersData.pendingOrders}</div>
                  <div className="text-xs text-gray-500">Pending</div>
                </div>
                <div className="p-2 bg-green-50 rounded">
                  <div className="text-base font-bold text-green-600">{ordersData.completedOrders}</div>
                  <div className="text-xs text-gray-500">Completed</div>
                </div>
                <div className="p-2 bg-purple-50 rounded">
                  <div className="text-base font-bold text-purple-600">${ordersData.totalValue.toLocaleString()}</div>
                  <div className="text-xs text-gray-500">Total Value</div>
                </div>
              </div>
              <div className="space-y-1">
                {ordersData.recentOrders.map((order, index) => (
                  <div key={index} className="flex items-center justify-between p-1.5 bg-gray-50 rounded">
                    <div>
                      <div className="font-medium text-xs">{order.reference}</div>
                      <div className="text-[10px] text-gray-500">{order.type}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-xs">${order.amount.toLocaleString()}</div>
                      <div className={`text-[10px] px-1.5 py-0.5 rounded ${
                        order.status === 'Complete' ? 'bg-green-100 text-green-800' :
                        order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {order.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Print Jobs Status */}
        <Card className="border rounded-md">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between text-base font-semibold">
              <div className="flex items-center">
                <Wrench className="w-4 h-4 mr-1.5" />
                Print Jobs
              </div>
              <Button variant="outline" size="xs" className="text-xs py-1 px-2" onClick={() => onNavigate('/print-jobs')}>
                View All
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2 bg-yellow-50 rounded">
                  <div className="text-base font-bold text-yellow-600">{printJobs.pendingJobs}</div>
                  <div className="text-xs text-gray-500">Pending</div>
                </div>
                <div className="p-2 bg-blue-50 rounded">
                  <div className="text-base font-bold text-blue-600">{printJobs.inProgress}</div>
                  <div className="text-xs text-gray-500">In Progress</div>
                </div>
                <div className="p-2 bg-green-50 rounded">
                  <div className="text-base font-bold text-green-600">{printJobs.completedJobs}</div>
                  <div className="text-xs text-gray-500">Completed</div>
                </div>
              </div>
              <div className="space-y-1">
                {printJobs.recentJobs.map((job, index) => (
                  <div key={index} className="flex items-center justify-between p-1.5 bg-gray-50 rounded">
                    <div>
                      <div className="font-medium text-xs">{job.reference}</div>
                      <div className="text-[10px] text-gray-500">{job.jobName}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-xs">{job.sheets.toLocaleString()} sheets</div>
                      <div className={`text-[10px] px-1.5 py-0.5 rounded ${
                        job.status === 'Complete' ? 'bg-green-100 text-green-800' :
                        job.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {job.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

DashboardWidgets.propTypes = {
  onNavigate: PropTypes.func.isRequired,
};

export default DashboardWidgets;
