import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import Modal from '../../../components/ui/Modal';
import { PencilIcon, CrossIcon, TrashIcon } from '../../../components/ui/icons';
import { apiService } from '../../../services/api';
import ProductMasterForm from '../../../components/stock/masters/ProductMaster';


const ProductMasterPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Load products on component mount
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getProducts();
      setProducts(data);
    } catch (err) {
      setError(err.detail || 'Failed to load products');
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleAdd = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingProduct(null);
  };

  const handleFormSave = (savedProduct) => {
    if (editingProduct) {
      // Update existing product
      setProducts(products.map(p => p.id === editingProduct.id ? savedProduct : p));
    } else {
      // Add new product
      setProducts([savedProduct, ...products]);
    }
    setIsFormOpen(false);
    setEditingProduct(null);
  };

  const handleDelete = (id) => {
    setDeleteTarget(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      setActionLoading(true);
      await apiService.deleteProduct(deleteTarget);
      setProducts(products.filter(p => p.id !== deleteTarget));
      setIsDeleteModalOpen(false);
      setDeleteTarget(null);
    } catch (err) {
      setError(err.detail || 'Failed to delete product');
      console.error('Error deleting product:', err);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-2 sm:p-6 max-w-full md:max-w-2xl mx-auto">
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">Loading products...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-2 sm:p-6 max-w-full md:max-w-2xl mx-auto">
      {/* Error message */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded flex justify-between items-center">
          <span>{error}</span>
          <div className="flex gap-2">
            <button 
              onClick={loadProducts} 
              className="text-red-600 hover:text-red-800 underline text-sm"
            >
              Retry
            </button>
            <button 
              onClick={() => setError(null)} 
              className="text-red-500 hover:text-red-700 text-lg"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Heading and Add Product button above the table */}
      <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between gap-2 mb-2">
        <h2 className="text-base sm:text-lg font-semibold">Product Master</h2>
        <Button 
          onClick={handleAdd} 
          disabled={actionLoading}
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold px-4 py-2 rounded shadow-sm focus:outline-none disabled:opacity-50"
        >
          + Add Product
        </Button>
      </div>
      <div className="overflow-x-auto w-full p-0">
        <table className="min-w-[500px] sm:min-w-[600px] w-full border border-gray-200 rounded-lg text-xs sm:text-sm mx-auto shadow-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-200">SN.</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-200">Product Name</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-200">Type</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-200">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-4 text-center text-gray-400">No Products found.</td>
                </tr>
              )}
              {products.map((product, idx) => (
                <tr
                  key={product.id}
                  className={`hover:bg-blue-50 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} border-b border-gray-200`}
                >
                  <td className="px-4 py-2 text-sm text-gray-700">{idx + 1}</td>
                  <td className="px-4 py-2 text-xs sm:text-sm text-gray-900 font-medium">
                    {product.name}
                  </td>
                  <td className="px-4 py-2 text-xs sm:text-sm text-gray-700">
                    {product.type}
                  </td>
                  <td className="px-4 py-2 flex gap-4">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleEdit(product)} 
                      disabled={actionLoading}
                      aria-label="Edit" 
                      className="flex items-center justify-center p-2 disabled:opacity-50"
                    >
                      <PencilIcon width={18} height={18} className="text-blue-700" />
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      onClick={() => handleDelete(product.id)} 
                      disabled={actionLoading}
                      aria-label="Delete" 
                      className="flex items-center justify-center p-2 disabled:opacity-50"
                    >
                      <TrashIcon width={18} height={18} className="text-red-800" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => !actionLoading && setIsDeleteModalOpen(false)}>
        <div className="w-full max-w-xs mx-auto p-4">
          <h3 className="text-base font-semibold mb-3 text-center text-gray-800">Confirm Delete</h3>
          <p className="mb-4 text-center text-gray-700 text-xs sm:text-sm">Are you sure you want to delete this product?</p>
          <div className="flex justify-end gap-2">
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteModalOpen(false)} 
              disabled={actionLoading}
              className="rounded px-3 py-1.5 text-xs sm:text-sm disabled:opacity-50"
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmDelete} 
              disabled={actionLoading}
              className="rounded px-3 py-1.5 text-xs sm:text-sm disabled:opacity-50"
            >
              {actionLoading ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Product Master Form */}
      <ProductMasterForm
        isOpen={isFormOpen}
        onClose={handleFormClose}
        onSave={handleFormSave}
        editing={editingProduct}
      />
    </div>
  );
};

export default ProductMasterPage;
