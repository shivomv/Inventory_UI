import React, { useState, useEffect } from 'react';
import { Input } from '../../ui/Input';
import { Button } from '../../ui/Button';
import { apiService } from '../../../services/api';

const ProductMasterForm = ({ isOpen, onClose, onSave, editing }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (editing) {
      setName(editing.name || '');
      setType(editing.type || '');
    } else {
      setName('');
      setType('');
    }
    setError(null);
  }, [editing]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation based on C# model constraints
    if (!name.trim()) {
      setError('Product name is required');
      return;
    }
    
    if (name.trim().length > 100) {
      setError('Product name cannot exceed 100 characters');
      return;
    }
    
    if (type && type.length > 50) {
      setError('Product type cannot exceed 50 characters');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const productData = { 
        id: editing ? editing.id : 0,
        name: name.trim(), 
        type: type 
      };
      
      let result;
      if (editing) {
        // Update existing product
        result = await apiService.updateProduct(editing.id, productData);
      } else {
        // Create new product
        result = await apiService.createProduct(productData);
      }
      
      // Ensure we always pass back the correct data structure
      const savedProduct = result || productData;
      
      // Debug: Log the data being passed back
      console.log('API Result:', result);
      console.log('Saved Product:', savedProduct);
      
      // Call the onSave callback with the result
      onSave(savedProduct);
      
      // Reset form if creating new product
      if (!editing) {
        setName('');
        setType('');
      }
    } catch (err) {
      setError(err.detail || 'Failed to save product');
      console.error('Error saving product:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-sm mx-4 shadow-xl">
        <h3 className="text-lg font-semibold mb-4">{editing ? 'Edit' : 'Add'} Product</h3>
        
        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="productName" className="block text-sm font-medium text-gray-700 mb-1">
              Product Name *
            </label>
            <Input
              id="productName"
              placeholder="Enter product name"
              value={name}
              onChange={e => setName(e.target.value)}
              autoFocus
              required
              disabled={loading}
              maxLength={100}
            />
            <div className="text-xs text-gray-500 mt-1 text-right">
              {name.length}/100 characters
            </div>
          </div>
          <div>
            <label htmlFor="productType" className="block text-sm font-medium text-gray-700 mb-1">
              Product Type *
            </label>
            <Input
              id="productType"
              placeholder="Enter product type"
              value={type}
              onChange={e => setType(e.target.value)}
              required
              disabled={loading}
              maxLength={50}
            />
            <div className="text-xs text-gray-500 mt-1 text-right">
              {type.length}/50 characters
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="default"
              disabled={loading || !name.trim()}
            >
              {loading ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductMasterForm;
