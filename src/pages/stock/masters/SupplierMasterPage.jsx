
import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import Modal from '../../../components/ui/Modal';
import { PencilIcon, CrossIcon, TrashIcon } from '../../../components/ui/icons';
import SupplierMasterForm from '../../../components/stock/masters/SupplierMasterForm';

const SupplierMasterPage = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [inlineEditId, setInlineEditId] = useState(null);
  const [inlineEditValue, setInlineEditValue] = useState({ 
    supplierName: '', 
    phone: '', 
    email: '', 
    isActive: true, 
    address: '', 
    city: '',
    state: '',
    country: '',
    postalCode: '',
    gstNumber: '', 
    contactPerson: '' 
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // API Functions
  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/Suppliers');
      if (!response.ok) {
        throw new Error('Failed to fetch suppliers');
      }
      const data = await response.json();
      setSuppliers(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching suppliers:', err);
    } finally {
      setLoading(false);
    }
  };

  const createSupplier = async (supplierData) => {
    try {
      const response = await fetch('/api/Suppliers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(supplierData),
      });
      if (!response.ok) {
        throw new Error('Failed to create supplier');
      }
      const newSupplier = await response.json();
      setSuppliers(prev => [newSupplier, ...prev]);
      return newSupplier;
    } catch (err) {
      setError(err.message);
      console.error('Error creating supplier:', err);
      throw err;
    }
  };

  const updateSupplier = async (id, supplierData) => {
    try {
      const response = await fetch(`/api/Suppliers/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...supplierData, supplierId: id }),
      });
      if (!response.ok) {
        throw new Error('Failed to update supplier');
      }
      
      // Check if response has content before parsing JSON
      const contentType = response.headers.get('content-type');
      let updatedSupplier;
      
      if (contentType && contentType.includes('application/json')) {
        const text = await response.text();
        if (text.trim()) {
          updatedSupplier = JSON.parse(text);
        } else {
          // If no content, create updated supplier object from input data
          updatedSupplier = { ...supplierData, supplierId: id };
        }
      } else {
        // If not JSON response, create updated supplier object from input data
        updatedSupplier = { ...supplierData, supplierId: id };
      }
      
      setSuppliers(prev => prev.map(s => s.supplierId === id ? updatedSupplier : s));
      return updatedSupplier;
    } catch (err) {
      setError(err.message);
      console.error('Error updating supplier:', err);
      throw err;
    }
  };

  const deleteSupplier = async (id) => {
    try {
      const response = await fetch(`/api/Suppliers/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete supplier');
      }
      setSuppliers(prev => prev.filter(s => s.supplierId !== id));
    } catch (err) {
      setError(err.message);
      console.error('Error deleting supplier:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleSort = (key) => {
    setSortConfig(prev => {
      if (prev.key === key) {
        return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { key, direction: 'asc' };
    });
  };

  const filteredSuppliers = useMemo(() => {
    if (!search.trim()) return suppliers;
    const lower = search.toLowerCase();
    return suppliers.filter(supplier =>
      Object.values(supplier).some(val =>
        (val || '').toString().toLowerCase().includes(lower)
      )
    );
  }, [suppliers, search]);

  const sortedSuppliers = useMemo(() => {
    if (!sortConfig.key) return filteredSuppliers;
    const sorted = [...filteredSuppliers].sort((a, b) => {
      const aVal = (a[sortConfig.key] || '').toString().toLowerCase();
      const bVal = (b[sortConfig.key] || '').toString().toLowerCase();
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [filteredSuppliers, sortConfig]);

  const handleEdit = (supplier) => {
    setEditingSupplier(supplier);
    setShowAddForm(true);
  };

  const handleInlineEditChange = (field, value) => {
    setInlineEditValue(prev => ({ ...prev, [field]: value }));
  };

  const handleInlineEditSave = async (id) => {
    if (!inlineEditValue.supplierName.trim()) return;
    try {
      await updateSupplier(id, inlineEditValue);
      setInlineEditId(null);
      setInlineEditValue({ 
        supplierName: '', 
        phone: '', 
        email: '', 
        isActive: true, 
        address: '', 
        city: '',
        state: '',
        country: '',
        postalCode: '',
        gstNumber: '', 
        contactPerson: '' 
      });
    } catch (err) {
      // Error is already handled in updateSupplier
    }
  };

  const handleInlineEditCancel = () => {
    setInlineEditId(null);
    setInlineEditValue({ 
      supplierName: '', 
      phone: '', 
      email: '', 
      isActive: true, 
      address: '', 
      city: '',
      state: '',
      country: '',
      postalCode: '',
      gstNumber: '', 
      contactPerson: '' 
    });
  };

  const handleDelete = (id) => {
    setDeleteTarget(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteSupplier(deleteTarget);
      setIsDeleteModalOpen(false);
      setDeleteTarget(null);
    } catch (err) {
      // Error is already handled in deleteSupplier
    }
  };

  const handleAdd = () => {
    setEditingSupplier(null);
    setShowAddForm(true);
  };

  const handleFormSave = async (supplierData) => {
    try {
      if (editingSupplier) {
        await updateSupplier(editingSupplier.supplierId, supplierData);
      } else {
        await createSupplier(supplierData);
      }
      setShowAddForm(false);
      setEditingSupplier(null);
    } catch (err) {
      // Error is already handled in create/update functions
    }
  };

  const handleFormCancel = () => {
    setShowAddForm(false);
    setEditingSupplier(null);
  };

  return (
    <div className="p-2 sm:p-4 max-w-full md:max-w-6xl mx-auto">
      <div className="flex flex-col items-center w-full">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 w-full mb-4">
          <div className="flex-1"><span className="text-lg sm:text-2xl font-bold">Supplier Master</span></div>
          <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto items-center">
            <Input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search suppliers..."
              className="w-full md:w-64 h-8 text-xs px-2 border-gray-300 focus:border-blue-500"
            />
            {!showAddForm && (
              <Button onClick={handleAdd} className="w-full md:w-auto">+ Add Supplier</Button>
            )}
          </div>
        </div>
        {loading && (
          <div className="text-center py-4">Loading suppliers...</div>
        )}
        {error && (
          <div className="text-center py-4 text-red-600">Error: {error}</div>
        )}
        <div className="w-full overflow-x-auto">
          <table className="min-w-[700px] w-full border border-gray-300 text-xs sm:text-sm bg-white" style={{ borderCollapse: 'collapse' }}>
            <thead className="bg-gray-200">
              <tr>
                {["SN.", "Supplier Name", "Phone", "Email", "Status", "Address", "GST No.", "Contact Person", "City", "Actions"].map((label, i) => (
                  <th key={label} className="px-2 sm:px-4 py-2 sm:py-3 text-left font-bold text-gray-700 uppercase tracking-wider border border-gray-300 whitespace-nowrap cursor-pointer select-none text-xs sm:text-sm">
                    {label}
                    {sortConfig.key === [
                      'sn', 'supplierName', 'phone', 'email', 'isActive', 'address', 'gstNumber', 'contactPerson', 'city', 'actions'][i] && (
                      <span className="ml-1">{sortConfig.direction === 'asc' ? '▲' : '▼'}</span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {!loading && sortedSuppliers.length === 0 && (
                <tr>
                  <td colSpan={10} className="p-4 text-center text-gray-400 border border-gray-300">No Suppliers found.</td>
                </tr>
              )}
              {sortedSuppliers.map((supplier, idx) => (
                <tr
                  key={supplier.supplierId}
                  className="border border-gray-300 transition-colors hover:bg-blue-50"
                >
                  <td className="px-2 sm:px-4 py-2 sm:py-3 align-middle text-gray-700 border border-gray-300 whitespace-nowrap">{idx + 1}</td>
                  <td className="px-2 sm:px-4 py-2 sm:py-3 align-middle text-gray-900 font-semibold border border-gray-300 whitespace-nowrap">
                    {supplier.supplierName}
                  </td>
                  <td className="px-2 sm:px-4 py-2 sm:py-3 align-middle border border-gray-300 whitespace-nowrap">
                    {supplier.phone}
                  </td>
                  <td className="px-2 sm:px-4 py-2 sm:py-3 align-middle border border-gray-300 whitespace-nowrap">
                    {supplier.email}
                  </td>
                  <td className="px-2 sm:px-4 py-2 sm:py-3 align-middle border border-gray-300 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${supplier.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {supplier.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-2 sm:px-4 py-2 sm:py-3 align-middle border border-gray-300 whitespace-nowrap">
                    {supplier.address}
                  </td>
                  <td className="px-2 sm:px-4 py-2 sm:py-3 align-middle border border-gray-300 whitespace-nowrap">
                    {supplier.gstNumber}
                  </td>
                  <td className="px-2 sm:px-4 py-2 sm:py-3 align-middle border border-gray-300 whitespace-nowrap">
                    {supplier.contactPerson}
                  </td>
                  <td className="px-2 sm:px-4 py-2 sm:py-3 align-middle border border-gray-300 whitespace-nowrap">
                    {supplier.city}
                  </td>
                  <td className="px-2 sm:px-4 py-2 sm:py-3 align-middle border border-gray-300 whitespace-nowrap">
                    <div className="flex gap-1 flex-wrap">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(supplier)} aria-label="Edit" className="flex items-center justify-center p-2">
                        <PencilIcon width={18} height={18} className="text-blue-700" />
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(supplier.supplierId)} aria-label="Delete" className="flex items-center justify-center p-2">
                        <TrashIcon width={18} height={18} className="text-red-800" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Supplier Form Modal */}
      <SupplierMasterForm
        isOpen={showAddForm}
        onClose={handleFormCancel}
        onSave={handleFormSave}
        editing={editingSupplier}
      />
      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
        <div>
          <h3 className="text-lg font-semibold mb-4 text-center">Confirm Delete</h3>
          <p className="mb-6 text-center text-gray-700">Are you sure you want to delete this supplier?</p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default SupplierMasterPage;
