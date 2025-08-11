import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Eye, Edit, Trash2, Calendar, DollarSign, Building2, Package, Search, AlertTriangle } from 'lucide-react';
import { Button } from '../ui/Button';
import { Table } from '../ui/Table';
import Modal from '../ui/Modal';
import { format } from 'date-fns';
import { apiService } from '../../services/api';

const PurchaseOrdersTab = forwardRef(({ onEditOrder }, ref) => {
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingOrder, setDeletingOrder] = useState(null);

  useEffect(() => {
    fetchPurchaseOrders();
  }, []);

  const fetchPurchaseOrders = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiService.getPurchases();
      setPurchaseOrders(response || []);
    } catch (err) {
      console.error('Fetch Purchase Orders Error:', err);
      setError('Failed to load purchase orders');
    } finally {
      setIsLoading(false);
    }
  };

  // Expose refresh method to parent component
  useImperativeHandle(ref, () => ({
    refreshData: fetchPurchaseOrders
  }));

  // Define columns for the Table component
  const columns = [
    {
      accessorKey: 'id',
      header: 'Sr.',
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
      accessorKey: 'purchaseItem',
      header: 'Item',
      cell: ({ row }) => (
        <div className="text-sm text-gray-900 max-w-xs truncate" title={row.original.purchaseItem}>
          {row.original.purchaseItem || 'N/A'}
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
      header: 'Weight',
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
      accessorKey: 'purchasePrice',
      header: 'Price',
      cell: ({ row }) => (
        <div className="text-sm text-gray-900">
          ₹{row.original.purchasePrice || 0}
        </div>
      ),
    },
    {
      accessorKey: 'totalAmount',
      header: 'Total',
      cell: ({ row }) => (
        <div className="text-sm text-gray-900 font-medium">
          ₹{row.original.totalAmount || 0}
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
          row.original.status === 'Delivered' ? 'bg-green-100 text-green-800' :
          row.original.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
          row.original.status === 'Confirmed' ? 'bg-yellow-100 text-yellow-800' :
          row.original.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {row.original.status || 'Pending'}
        </span>
      ),
    },
    {
      accessorKey: 'invoiceNumber',
      header: 'Invoice No.',
      cell: ({ row }) => (
        <div className="text-sm text-gray-900">
          {row.original.invoiceNumber || 'N/A'}
        </div>
      ),
    },
    {
      accessorKey: 'invoiceDate',
      header: 'Invoice Date',
      cell: ({ row }) => (
        <div className="text-sm text-gray-900">
          {row.original.invoiceDate ? format(new Date(row.original.invoiceDate), 'dd/MM/yyyy') : 'N/A'}
        </div>
      ),
    },
    {
      accessorKey: 'warehouse',
      header: 'Warehouse',
      cell: ({ row }) => (
        <div className="text-sm text-gray-900">
          {row.original.warehouse || 'N/A'}
        </div>
      ),
    },
    {
      accessorKey: 'receivedBy',
      header: 'Received By',
      cell: ({ row }) => (
        <div className="text-sm text-gray-900">
          {row.original.receivedBy || 'N/A'}
        </div>
      ),
    },
    {
      accessorKey: 'expectedDeliveryDate',
      header: 'Expected Delivery',
      cell: ({ row }) => (
        <div className="text-sm text-gray-900">
          {row.original.expectedDeliveryDate ? format(new Date(row.original.expectedDeliveryDate), 'dd/MM/yyyy') : 'N/A'}
        </div>
      ),
    },
    {
      accessorKey: 'createdBy',
      header: 'Created By',
      cell: ({ row }) => (
        <div className="text-sm text-gray-900">
          {row.original.createdBy || 'N/A'}
        </div>
      ),
    },
    {
      accessorKey: 'creationDate',
      header: 'Creation Date',
      cell: ({ row }) => (
        <div className="text-sm text-gray-900">
          {row.original.creationDate ? format(new Date(row.original.creationDate), 'dd/MM/yyyy') : 'N/A'}
        </div>
      ),
    },
    {
      accessorKey: 'remark',
      header: 'Remark',
      cell: ({ row }) => (
        <div className="text-sm text-gray-900 max-w-xs truncate" title={row.original.remark}>
          {row.original.remark || 'N/A'}
        </div>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex items-center justify-center gap-2">
         
          <Button
            size="sm"
            variant="outline"
            onClick={() => onEditOrder(row.original)}
          
            title="Edit Order"
          >
            <Edit size={14} />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleDeleteOrder(row.original)}
            
            title="Delete Order"
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
      await apiService.deletePurchase(deletingOrder.id);
      fetchPurchaseOrders();
      setShowDeleteModal(false);
      setDeletingOrder(null);
    } catch (err) {
      console.error('Delete Error:', err);
      alert('Failed to delete purchase order');
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setDeletingOrder(null);
  };

  const handleViewOrder = (order) => {
    // Navigate to order detail view
    console.log('View order:', order);
  };

  if (isLoading) {
    return (
      <div className="bg-white border rounded-lg p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading purchase orders...</span>
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
              <Package className="w-6 h-6 text-red-600" />
            </div>
            <p className="text-red-600 font-medium">{error}</p>
            <Button 
              onClick={fetchPurchaseOrders} 
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
          <h2 className="text-xl font-bold text-gray-900">Purchase Orders</h2>
        </div>
      </div>

      {/* Purchase Orders Table */}
      <Table
        data={purchaseOrders}
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
            Delete Purchase Order
          </h3>
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete this purchase order?
            {deletingOrder && (
              <span className="block mt-2 font-medium text-gray-800">
                {deletingOrder.sheet} - {deletingOrder.purchaseItem}
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

PurchaseOrdersTab.displayName = 'PurchaseOrdersTab';

export default PurchaseOrdersTab;