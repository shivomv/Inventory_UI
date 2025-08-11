import React, { useState, useEffect } from 'react';
import { Plus, X, Pencil, Trash2, Download, Upload, AlertTriangle } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Table } from '../../components/ui/Table';
import Modal from '../../components/ui/Modal';
import { apiService } from '../../services/api';
import ImportModal from './ImportModal';

const ConsumablesPage = () => {
  const [consumables, setConsumables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deletingItem, setDeletingItem] = useState(null);
  const [products, setProducts] = useState([]);
  const [units, setUnits] = useState([]);
  const [loadingDropdowns, setLoadingDropdowns] = useState(false);

  const [form, setForm] = useState({
    consumptionDate: '',
    sheet: '',
    consumptionItem: '',
    qty: '',
    unit: '',
    remark: '',
  });

  // Define columns for the Table component
  const columns = [
    {
      accessorKey: 'date',
      header: 'Date',
      cell: ({ row }) => (
        <div className="text-sm font-medium text-gray-900">
          {row.original.date || 'N/A'}
        </div>
      ),
    },
    {
      accessorKey: 'sheet',
      header: 'Sheet',
      cell: ({ row }) => (
        <div className="text-sm text-gray-700 font-medium">
          {row.original.sheet || 'N/A'}
        </div>
      ),
    },
    {
      accessorKey: 'item',
      header: 'Item',
      cell: ({ row }) => (
        <div className="text-sm text-gray-900 font-medium max-w-xs truncate" title={row.original.item}>
          {row.original.item || 'N/A'}
        </div>
      ),
    },
    {
      accessorKey: 'qty',
      header: 'Qty',
      cell: ({ row }) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {row.original.qty || 0}
        </span>
      ),
    },
    {
      accessorKey: 'unit',
      header: 'Unit',
      cell: ({ row }) => (
        <div className="text-sm text-gray-600 font-medium">
          {row.original.unit || 'N/A'}
        </div>
      ),
    },
    {
      accessorKey: 'remark',
      header: 'Remark',
      cell: ({ row }) => (
        <div className="text-sm text-gray-600 max-w-xs truncate" title={row.original.remark}>
          {row.original.remark || <span className="text-gray-400 italic">No remark</span>}
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
            onClick={() => handleEdit(row.original)}
            className="hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700"
          >
            <Pencil size={14} />
          </Button>
          <Button 
            size="sm" 
            variant="destructive" 
            onClick={() => handleDelete(row.original)}
            className="hover:bg-red-50 hover:border-red-300 hover:text-red-700"
          >
            <Trash2 size={14} />
          </Button>
        </div>
      ),
    },
  ];

  useEffect(() => {
    fetchConsumables();
    fetchDropdownData();
  }, []);

  const fetchConsumables = async () => {
    try {
      setLoading(true);
      const response = await apiService.getConsumptions();
      const mappedData = response?.map(mapApiToUI);
      setConsumables(mappedData || []);
    } catch (err) {
      console.error('Fetch Error:', err);
      setError('Failed to load consumables');
    } finally {
      setLoading(false);
    }
  };

  const fetchDropdownData = async () => {
    try {
      setLoadingDropdowns(true);
      console.log('Fetching dropdown data...');
      
      const [productsResponse, unitsResponse] = await Promise.all([
        apiService.getProducts(),
        apiService.getUnits()
      ]);
      
      console.log('Products Response:', productsResponse);
      console.log('Units Response:', unitsResponse);
      
      setProducts(productsResponse || []);
      setUnits(unitsResponse || []);
      
      console.log('Products set:', productsResponse?.length || 0);
      console.log('Units set:', unitsResponse?.length || 0);
    } catch (err) {
      console.error('Dropdown Data Fetch Error:', err);
      console.error('Error details:', err.response?.data || err.message);
      // Don't show error for dropdown data, just log it
    } finally {
      setLoadingDropdowns(false);
    }
  };

  const mapApiToUI = (item) => ({
    id: item?.id,
    date: item?.consumptionDate?.slice(0, 10),
    sheet: item?.sheet,
    item: item?.consumptionItem,
    qty: item?.qty,
    unit: item?.unit,
    remark: item?.remark,
  });

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await apiService.updateConsumption(editingId, form);
      } else {
        await apiService.createConsumption(form);
      }
      resetForm();
      fetchConsumables();
    } catch (err) {
      console.error('Submit Error:', err);
      alert('Failed to save consumption');
    }
  };

  const handleEdit = (item) => {
    setForm({
      consumptionDate: item.date,
      sheet: item.sheet,
      consumptionItem: item.item,
      qty: item.qty,
      unit: item.unit,
      remark: item.remark,
    });
    setEditingId(item.id);
    setShowModal(true);
  };

  const handleDelete = (item) => {
    setDeletingItem(item);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!deletingItem) return;
    
    try {
      await apiService.deleteConsumption(deletingItem.id);
      fetchConsumables();
      setShowDeleteModal(false);
      setDeletingItem(null);
    } catch (err) {
      console.error('Delete Error:', err);
      alert('Failed to delete entry');
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setDeletingItem(null);
  };

  const resetForm = () => {
    setForm({
      consumptionDate: '',
      sheet: '',
      consumptionItem: '',
      qty: '',
      unit: '',
      remark: '',
    });
    setEditingId(null);
    setShowModal(false);
  };

  const exportToCSV = () => {
    const csv = [
      ['Date', 'Sheet', 'Item', 'Qty', 'Unit', 'Remark'],
      ...consumables.map((row) => [row.date, row.sheet, row.item, row.qty, row.unit, row.remark]),
    ]
      .map((e) => e.join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'consumables.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Consumables</h1>
        <div className="flex gap-2">
          <Button onClick={() => setShowModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus size={16} className="mr-1" /> Add New Consumable
          </Button>
          <Button variant="outline" onClick={exportToCSV}>
            <Download size={16} className="mr-1" /> Export
          </Button>
          <Button variant="outline" onClick={() => setShowImportModal(true)} className="border-green-300 text-green-700 hover:bg-green-50">
            <Upload size={16} className="mr-1" /> Import
          </Button>
        </div>
      </div>

      {/* Consumables Table */}
      <Table
        data={consumables}
        columns={columns}
        isLoading={loading}
        enableSorting={true}
        enableFiltering={true}
        enablePagination={true}
        enableColumnVisibility={true}
        pageSize={25}
        pageSizeOptions={[10, 25, 50, 100]}
       
      />

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl relative shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-8 py-6 border-b border-gray-200 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    {editingId ? (
                      <Pencil className="w-5 h-5 text-blue-600" />
                    ) : (
                      <Plus className="w-5 h-5 text-blue-600" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">
                      {editingId ? 'Edit' : 'Add'} Consumption
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {editingId ? 'Update the consumption details below' : 'Fill in the consumption details below'}
                    </p>
                  </div>
                </div>
                <button
                  className="w-10 h-10 rounded-full bg-white shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                  onClick={resetForm}
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="px-8 py-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Date Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Date <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="date"
                    name="consumptionDate"
                    value={form.consumptionDate}
                    onChange={handleInputChange}
                    required
                    className="w-full border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  />
                </div>

                {/* Sheet Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Sheet</label>
                  <Input 
                    name="sheet" 
                    value={form.sheet} 
                    onChange={handleInputChange}
                    placeholder="Enter sheet reference"
                    className="w-full border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  />
                </div>

                {/* Consumption Item Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Consumption Item <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="consumptionItem"
                    value={form.consumptionItem}
                    onChange={handleInputChange}
                    className="w-full border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 px-3 py-2"
                    required
                    disabled={loadingDropdowns}
                  >
                    <option value="">
                      {loadingDropdowns ? 'Loading products...' : `Select a product (${products.length} available)`}
                    </option>
                    {products.map((product) => (
                      <option key={product.id} value={product.name}>
                        {product.name} ({product.type})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Quantity and Unit Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Quantity</label>
                    <Input 
                      name="qty" 
                      type="number" 
                      value={form.qty} 
                      onChange={handleInputChange}
                      placeholder="0"
                      min="0"
                      step="0.01"
                      className="w-full border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Unit <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="unit"
                      value={form.unit}
                      onChange={handleInputChange}
                      className="w-full border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 px-3 py-2"
                      required
                      disabled={loadingDropdowns}
                    >
                      <option value="">
                        {loadingDropdowns ? 'Loading units...' : `Select a unit (${units.length} available)`}
                      </option>
                      {units.map((unit) => (
                        <option key={unit.id} value={unit.unitName}>
                          {unit.unitName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Remark Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Remark</label>
                  <Input 
                    name="remark" 
                    value={form.remark} 
                    onChange={handleInputChange}
                    placeholder="Optional notes or comments"
                    className="w-full border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  />
                </div>

                {/* Modal Footer */}
                <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={resetForm}
                    className="px-6 py-2.5 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 rounded-lg font-medium"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200 rounded-lg font-medium shadow-lg hover:shadow-xl"
                  >
                    {editingId ? 'Update Consumption' : 'Save Consumption'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Import Modal */}
      <ImportModal 
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onImportSuccess={fetchConsumables}
      />

      {/* Delete Confirmation Modal */}
      <Modal isOpen={showDeleteModal} onClose={cancelDelete}>
        <div className="text-center p-4">
          <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-6 h-6 text-red-800" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Delete Consumption Entry
          </h3>
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete this consumption entry?
            {deletingItem && (
              <span className="block mt-2 font-medium text-gray-800">
                {deletingItem.item} - {deletingItem.qty} {deletingItem.unit}
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
};

export default ConsumablesPage;
