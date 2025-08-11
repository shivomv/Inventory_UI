import React, { useState, useEffect } from 'react';
import { 
  Plus, Edit, Trash2, AlertTriangle, Download, Upload
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Table } from '../../components/ui/Table';
import StockItemForm from '../../components/stock/StockItemForm';
import SimpleStockImport from '../../components/stock/SimpleStockImport';
import { apiService } from '../../services/api';

const StockRegisterPage = () => {
  const [stockItems, setStockItems] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState([]);

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);
  const [editingStock, setEditingStock] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [stockToDelete, setStockToDelete] = useState(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  
  // Define table columns
  const columns = [
    {
      accessorKey: 'date',
      header: 'Date',
      cell: ({ getValue }) => {
        const date = getValue();
        return date ? new Date(date).toLocaleDateString() : 'N/A';
      },
    },
    {
      accessorKey: 'itemCode',
      header: 'Item Code',
      cell: ({ getValue }) => getValue() || 'N/A',
    },
    {
      accessorKey: 'itemName',
      header: 'Item Name',
      cell: ({ getValue }) => (
        <div className="max-w-[150px] truncate" title={getValue()}>
          {getValue() || 'N/A'}
        </div>
      ),
    },
    {
      accessorKey: 'description',
      header: 'Description',
      cell: ({ getValue }) => (
        <div className="max-w-[120px] truncate" title={getValue()}>
          {getValue() || 'N/A'}
        </div>
      ),
    },
    {
      accessorKey: 'gsm',
      header: 'GSM',
      cell: ({ getValue }) => getValue() || 0,
    },
    {
      accessorKey: 'size',
      header: 'Size',
      cell: ({ getValue }) => getValue() || 'N/A',
    },
    {
      accessorKey: 'brand',
      header: 'Brand',
      cell: ({ getValue }) => getValue() || 'N/A',
    },
    {
      accessorKey: 'color',
      header: 'Color',
      cell: ({ getValue }) => getValue() || 'N/A',
    },
    {
      accessorKey: 'unit',
      header: 'Unit',
      cell: ({ getValue }) => getValue() || 'N/A',
    },
    {
      accessorKey: 'openingStock',
      header: 'Opening Stock',
      cell: ({ getValue }) => getValue() || 0,
    },
    {
      accessorKey: 'stockIn',
      header: 'Stock In',
      cell: ({ getValue }) => (
        <span className="text-green-600 font-medium">+{getValue() || 0}</span>
      ),
    },
    {
      accessorKey: 'stockOut',
      header: 'Stock Out',
      cell: ({ getValue }) => (
        <span className="text-red-600 font-medium">-{getValue() || 0}</span>
      ),
    },
    {
      accessorKey: 'closingStock',
      header: 'Closing Stock',
      cell: ({ getValue }) => (
        <span className="text-blue-600 font-bold">{getValue() || 0}</span>
      ),
    },
    {
      accessorKey: 'remark',
      header: 'Remark',
      cell: ({ getValue }) => (
        <div className="max-w-[100px] truncate" title={getValue()}>
          {getValue() || 'N/A'}
        </div>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex items-center justify-end space-x-1">
          <Button variant="ghost" size="sm" onClick={() => handleEditStock(row.original)} title="Edit">
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDeleteStock(row.original)}
            title="Delete"
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];
  
  // Function to handle creating a new stock item
  const handleCreateStock = () => {
    setEditingStock(null);
    setIsFormOpen(true);
  };
  
  // Function to handle editing an existing stock item
  const handleEditStock = (item) => {
    setEditingStock(item);
    setIsFormOpen(true);
  };
  
  // Function to handle saving a stock item (new or edited)
  const handleSaveStock = (savedItem) => {
    fetchData(); // Refresh the data after saving
    setIsFormOpen(false);
    setEditingStock(null);
  };
  
  // Function to handle deleting a stock item
  const handleDeleteStock = (item) => {
    setStockToDelete(item);
    setDeleteModalOpen(true);
  };
  
  // Function to cancel the delete operation
  const cancelDeleteStock = () => {
    setDeleteModalOpen(false);
    setStockToDelete(null);
  };
  
  // Function to confirm and execute the delete operation
  const confirmDeleteStock = async () => {
    try {
      await apiService.delete(`/Stockitem/${stockToDelete.id}`);
      fetchData(); // Refresh the data after deleting
      setDeleteModalOpen(false);
      setStockToDelete(null);
    } catch (error) {
      console.error('Failed to delete stock item:', error);
      alert('Failed to delete stock item. Please try again.');
    }
  };

  // Function to handle bulk import - matches C# Stockitem model
  const handleImport = async (importData) => {
    try {
      // Process each item to ensure it matches C# model structure
      const processedData = importData.map(item => ({
        // Id will be auto-generated by the database
        date: item.Date, // DateTime in C#
        itemCode: item.ItemCode, // string in C#
        itemName: item.ItemName, // string in C#
        description: item.Description || '', // string in C# (can be empty)
        gsm: parseInt(item.GSM) || 0, // int in C#
        size: item.Size || '', // string in C# (can be empty)
        brand: item.Brand || '', // string in C# (can be empty)
        color: item.Color || '', // string in C# (can be empty)
        unit: item.Unit, // string in C#
        openingStock: parseInt(item.OpeningStock) || 0, // int in C#
        stockIn: parseInt(item.StockIn) || 0, // int in C#
        stockOut: parseInt(item.StockOut) || 0, // int in C#
        closingStock: parseInt(item.ClosingStock) || 0, // int in C# (calculated)
        remark: item.Remark || '' // string in C# (can be empty)
      }));

      // Send each item to the API
      const importPromises = processedData.map(item => 
        apiService.post('/Stockitem', item)
      );
      
      await Promise.all(importPromises);
      
      // Refresh the data after import
      await fetchData();
      
      // Close the import modal
      setIsImportModalOpen(false);
      
      alert(`Successfully imported ${importData.length} stock items!`);
    } catch (error) {
      console.error('Failed to import stock items:', error);
      throw new Error('Failed to import stock items. Please check the data format and try again.');
    }
  };
  
  // Function to export stock data as CSV
  const handleExport = () => {
    if (stockItems.length === 0) {
      alert('No data to export');
      return;
    }

    // Define headers matching C# model
    const headers = [
      'Date', 'ItemCode', 'ItemName', 'Description', 'GSM', 
      'Size', 'Brand', 'Color', 'Unit', 'OpeningStock', 
      'StockIn', 'StockOut', 'ClosingStock', 'Remark'
    ];

    // Convert data to CSV format
    const csvData = stockItems.map(item => [
      item.date ? new Date(item.date).toLocaleDateString() : '',
      item.itemCode || '',
      item.itemName || '',
      item.description || '',
      item.gsm || 0,
      item.size || '',
      item.brand || '',
      item.color || '',
      item.unit || '',
      item.openingStock || 0,
      item.stockIn || 0,
      item.stockOut || 0,
      item.closingStock || 0,
      item.remark || ''
    ]);

    // Add headers to the beginning
    csvData.unshift(headers);

    // Convert to CSV string
    const csvContent = csvData.map(row => 
      row.map(field => `"${field}"`).join(',')
    ).join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `stock_items_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      
      // Initialize with empty arrays
      let companies = [];
      let realStockItems = [];
      
      // Fetch companies from API
      try {
        const companiesData = await apiService.get('/Companies');
        companies = companiesData || [];
      } catch (companyError) {
        console.error('Failed to fetch companies:', companyError);
        // Fallback to old endpoint if new one fails
        try {
          const companiesDataFallback = await apiService.get('/CompanyControllers');
          companies = companiesDataFallback || [];
        } catch (fallbackError) {
          console.error('Failed to fetch companies from fallback endpoint:', fallbackError);
        }
      }
      
      // Fetch real stock items from API
      try {
        const stockItemsData = await apiService.get('/Stockitem');
        realStockItems = stockItemsData || [];
      } catch (stockError) {
        console.error('Failed to fetch stock items:', stockError);
      }
      
      setCompanies(companies);
      setStockItems(realStockItems);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Mock stock items data - will be replaced with real API data later
  // This mock data has been removed as we're now using real API data from fetchData()
  
  // Statistics - removed paperTypes since it's not in the C# model
  


  return (
    <div className="container mx-auto px-2 sm:px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Stock Register</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          
          <Button size="sm" onClick={handleCreateStock}>
            <Plus className="w-4 h-4 mr-1" />
            Add Stock Item
          </Button>
          <Button variant="outline" size="sm" onClick={() => setIsImportModalOpen(true)}>
            <Upload className="w-4 h-4 text-green-600"/>
            Import 
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="w-4 h-4 mr-1" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Stock Items Table */}
      <Table
        data={stockItems}
        columns={columns}
        isLoading={isLoading}
        enableSorting={true}
        enableFiltering={true}
        enablePagination={true}
        enableColumnVisibility={true}
        pageSize={25}
        pageSizeOptions={[10, 25, 50, 100]}
       
      />

      {/* Modals */}
      <StockItemForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingStock(null);
        }}
        onSave={handleSaveStock}
        editingStock={editingStock}
        companies={companies}
      />

      {/* Simple Stock Import */}
      <SimpleStockImport
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImport={handleImport}
      />

      {/* Delete Confirmation Modal - Mobile friendly */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
          <Card className="w-full max-w-xs sm:max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="w-5 h-5" />
                Confirm Delete
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4 text-sm">
                Are you sure you want to delete <strong>{stockToDelete?.itemName}</strong>? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={cancelDeleteStock}>Cancel</Button>
                <Button onClick={confirmDeleteStock} className="bg-red-600 hover:bg-red-700 text-white">Delete</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default StockRegisterPage;