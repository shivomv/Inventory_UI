import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Eye, Edit, Trash2, Calendar, DollarSign, Users, TrendingUp, Search, AlertTriangle } from 'lucide-react';
import { Button } from '../ui/Button';
import { Table } from '../ui/Table';
import Modal from '../ui/Modal';
import { format } from 'date-fns';
import { apiService } from '../../services/api';

const SalesOrdersTab = forwardRef(({ onEditOrder }, ref) => {
  const [salesOrders, setSalesOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingOrder, setDeletingOrder] = useState(null);

  useEffect(() => {
    fetchSalesOrders();
  }, []);

  const fetchSalesOrders = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiService.getSales();
      setSalesOrders(response || []);
    } catch (err) {
      console.error('Fetch Sales Orders Error:', err);
      setError('Failed to load sales orders');
    } finally {
      setIsLoading(false);
    }
  };

  useImperativeHandle(ref, () => ({
    refreshData: fetchSalesOrders
  }));

  // Define columns for the Table component
  const columns = [
    {
      accessorKey: 'id',
      header: 'Sr. No.',
      cell: ({ row, table }) => {
        const pageIndex = table.getState().pagination.pageIndex;
        const pageSize = table.getState().pagination.pageSize;
        return pageIndex * pageSize + row.index + 1;
      },
    },
    {
      accessorKey: 'date',
      header: 'Date',
      cell: ({ row }) => (
        <div className="text-sm text-gray-900">
          {row.original.date ? format(new Date(row.original.date), 'MMM dd, yyyy') : 'N/A'}
        </div>
      ),
    },
    {
      accessorKey: 'sheet',
      header: 'Sheet',
      cell: ({ row }) => (
        <div className="text-sm text-gray-900">
          {row.original.sheet || 'N/A'}
        </div>
      ),
    },
    {
      accessorKey: 'salesItem',
      header: 'Sales Item',
      cell: ({ row }) => (
        <div className="text-sm text-gray-900 max-w-xs truncate" title={row.original.salesItem}>
          {row.original.salesItem || 'N/A'}
        </div>
      ),
    },
    {
      accessorKey: 'customer',
      header: 'Customer',
      cell: ({ row }) => (
        <div className="text-sm text-gray-900">
          {row.original.customer || 'N/A'}
        </div>
      ),
    },
    {
      accessorKey: 'supplier',
      header: 'Supplier',
      cell: ({ row }) => (
        <div className="text-sm text-gray-900">
          {row.original.supplier || 'N/A'}
        </div>
      ),
    },
    {
      accessorKey: 'gsm',
      header: 'GSM',
      cell: ({ row }) => (
        <div className="text-sm text-gray-900">
          {row.original.gsm || 'N/A'}
        </div>
      ),
    },
    {
      accessorKey: 'size',
      header: 'Size',
      cell: ({ row }) => (
        <div className="text-sm text-gray-900">
          {row.original.size || 'N/A'}
        </div>
      ),
    },
    {
      accessorKey: 'totalWeight',
      header: 'Total Weight',
      cell: ({ row }) => (
        <div className="text-sm text-gray-900">
          {row.original.totalWeight || 'N/A'}
        </div>
      ),
    },
    {
      accessorKey: 'qty',
      header: 'Qty',
      cell: ({ row }) => (
        <div className="text-sm text-gray-900">
          {row.original.qty || 0}
        </div>
      ),
    },
    {
      accessorKey: 'unit',
      header: 'Unit',
      cell: ({ row }) => (
        <div className="text-sm text-gray-900">
          {row.original.unit || 'N/A'}
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          row.original.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
          row.original.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
          row.original.status === 'Completed' ? 'bg-green-100 text-green-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {row.original.status || 'N/A'}
        </span>
      ),
    },
    {
      accessorKey: 'orderStatus',
      header: 'Order Status',
      cell: ({ row }) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          row.original.orderStatus === 'New' ? 'bg-green-100 text-green-800' :
          row.original.orderStatus === 'Processing' ? 'bg-blue-100 text-blue-800' :
          row.original.orderStatus === 'Shipped' ? 'bg-purple-100 text-purple-800' :
          row.original.orderStatus === 'Delivered' ? 'bg-gray-100 text-gray-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {row.original.orderStatus || 'N/A'}
        </span>
      ),
    },
    {
      accessorKey: 'startDate',
      header: 'Start Date',
      cell: ({ row }) => (
        <div className="text-sm text-gray-900">
          {row.original.startDate ? format(new Date(row.original.startDate), 'MMM dd, yyyy') : 'N/A'}
        </div>
      ),
    },
    {
      accessorKey: 'targetDate',
      header: 'Target Date',
      cell: ({ row }) => (
        <div className="text-sm text-gray-900">
          {row.original.targetDate ? format(new Date(row.original.targetDate), 'MMM dd, yyyy') : 'N/A'}
        </div>
      ),
    },
    {
      accessorKey: 'responsible',
      header: 'Responsible',
      cell: ({ row }) => (
        <div className="text-sm text-gray-900">
          {row.original.responsible || 'N/A'}
        </div>
      ),
    },
    {
      accessorKey: 'totalPrice',
      header: 'Total Price',
      cell: ({ row }) => (
        <div className="text-sm text-gray-900 font-medium">
          {row.original.totalPrice ? `₹${row.original.totalPrice.toFixed(2)}` : 'N/A'}
        </div>
      ),
    },
    {
      accessorKey: 'remark',
      header: 'Remark',
      cell: ({ row }) => (
        <div className="text-sm text-gray-900 max-w-xs truncate" title={row.original.remark || 'No remarks'}>
          {row.original.remark || 'No remarks'}
        </div>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex items-center justify-center gap-2">
          <Button
            onClick={() => onEditOrder(row.original)}
            variant="outline"
            size="sm"
           
            title="Edit Sales Order"
          >
            <Edit size={14} />
          </Button>
          <Button
            onClick={() => handleDeleteOrder(row.original)}
            variant="outline"
            size="sm"
            
            title="Delete Sales Order"
          >
            <Trash2 size={14} />
          </Button>
        </div>
      ),
    },
  ];

  const handleDeleteOrder = (order) => {
    setDeletingOrder(order);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!deletingOrder) return;
    
    try {
      await apiService.deleteSale(deletingOrder.id);
      fetchSalesOrders();
      setShowDeleteModal(false);
      setDeletingOrder(null);
    } catch (err) {
      console.error('Delete Error:', err);
      alert('Failed to delete sales order');
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setDeletingOrder(null);
  };

  if (isLoading) {
    return (
      <div className="bg-white border rounded-lg p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading sales orders...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white border rounded-lg p-8">
        <div className="flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="w-6 h-6 text-red-600" />
            </div>
            <p className="text-red-600 font-medium">{error}</p>
            <Button
              onClick={fetchSalesOrders}
              className="mt-3 bg-blue-600 hover:bg-blue-700"
            >
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Sales Orders</h2>
        </div>
      </div>

      {/* Sales Orders Table */}
      <Table
        data={salesOrders}
        columns={columns}
        isLoading={isLoading}
        enableSorting={true}
        enableFiltering={true}
        enablePagination={true}
        enableColumnVisibility={true}
        pageSize={25}
        pageSizeOptions={[10, 25, 50, 100]}
       
      />

      {/* Delete Confirmation Modal */}
      <Modal isOpen={showDeleteModal} onClose={cancelDelete}>
        <div className="text-center p-4">
          <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-6 h-6 text-red-800" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Delete Sales Order
          </h3>
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete this sales order?
            {deletingOrder && (
              <span className="block mt-2 font-medium text-gray-800">
                {deletingOrder.sheet} - {deletingOrder.salesItem}
              </span>
            )}
            <span className="block mt-1 text-sm text-red-600">
              This action cannot be undone.
            </span>
          </p>
          <div className="flex gap-3 justify-center">
            <Button
              variant="outline"
              onClick={cancelDelete}
              className="px-6"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              className="px-6 bg-red-600 hover:bg-red-700"
            >
              <Trash2 size={16} className="mr-2" />
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
});

SalesOrdersTab.displayName = 'SalesOrdersTab';

export default SalesOrdersTab;