import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/api';

const StockItemForm = ({ isOpen, onClose, onSave, editingStock }) => {
  const [form, setForm] = useState({
    id: 0,
    date: new Date().toISOString().split('T')[0],
    itemCode: '',
    itemName: '',
    description: '',
    gsm: '',
    size: '',
    brand: '',
    color: '',
    unit: '',
    openingStock: '',
    stockIn: '',
    stockOut: '',
    closingStock: '',
    remark: ''
  });

  const [products, setProducts] = useState([]);
  const [units, setUnits] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const closingStock = Number(form.openingStock || 0) + Number(form.stockIn || 0) - Number(form.stockOut || 0);

  useEffect(() => {
    if (editingStock) {
      setForm({
        id: editingStock.id || 0,
        date: editingStock.date ? editingStock.date.split('T')[0] : new Date().toISOString().split('T')[0],
        itemCode: editingStock.itemCode || '',
        itemName: editingStock.itemName || '',
        description: editingStock.description || '',
        gsm: editingStock.gsm || '',
        size: editingStock.size || '',
        brand: editingStock.brand || '',
        color: editingStock.color || '',
        unit: editingStock.unit || '',
        openingStock: editingStock.openingStock || '',
        stockIn: editingStock.stockIn || '',
        stockOut: editingStock.stockOut || '',
        closingStock: editingStock.closingStock || '',
        remark: editingStock.remark || ''
      });
    } else {
      setForm({
        id: 0,
        date: new Date().toISOString().split('T')[0],
        itemCode: '',
        itemName: '',
        description: '',
        gsm: '',
        size: '',
        brand: '',
        color: '',
        unit: '',
        openingStock: '',
        stockIn: '',
        stockOut: '',
        closingStock: '',
        remark: ''
      });
    }
  }, [editingStock, isOpen]);

  // Fetch product list
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await apiService.get('/Product');
        setProducts(response);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    };

    fetchProducts();
  }, []);

  // Fetch unit list
  useEffect(() => {
    const fetchUnits = async () => {
      try {
        const response = await apiService.get('/Units');
        setUnits(response);
      } catch (error) {
        console.error('Failed to fetch units:', error);
      }
    };

    fetchUnits();
  }, []);

  // Auto-fill description based on selected item name
  useEffect(() => {
    const selected = products.find(p => p.name === form.itemName);
    if (selected) {
      setForm(f => ({ ...f, description: selected.type || '' }));
    }
  }, [form.itemName, products]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (!form.itemName || !form.itemCode || !form.unit) {
        alert('Please fill in all required fields');
        return;
      }

      const stockData = {
        id: form.id,
        date: form.date,
        itemCode: form.itemCode,
        itemName: form.itemName,
        description: form.description,
        gsm: Number(form.gsm) || 0,
        size: form.size,
        brand: form.brand,
        color: form.color,
        unit: form.unit,
        openingStock: Number(form.openingStock) || 0,
        stockIn: Number(form.stockIn) || 0,
        stockOut: Number(form.stockOut) || 0,
        closingStock: closingStock,
        remark: form.remark
      };

      let result;
      if (editingStock) {
        result = await apiService.put(`/Stockitem/${form.id}`, stockData);
      } else {
        result = await apiService.post('/Stockitem', stockData);
      }

      onSave && onSave(result);
    } catch (error) {
      console.error('Error saving stock item:', error);
      alert('Failed to save stock item. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="relative w-full max-w-2xl">
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-xl w-full space-y-4 overflow-y-auto max-h-[90vh] border border-gray-200">
          <button type="button" onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl font-bold focus:outline-none" aria-label="Close">
            &times;
          </button>
          <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">{editingStock ? 'Edit Stock Item' : 'Add Stock Item'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input name="date" type="date" value={form.date} onChange={handleChange} required className="w-full border border-gray-300 rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">GSM</label>
              <input name="gsm" type="number" value={form.gsm} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Item Code</label>
              <input name="itemCode" value={form.itemCode} onChange={handleChange} required className="w-full border border-gray-300 rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
              <select name="itemName" value={form.itemName} onChange={handleChange} required className="w-full border border-gray-300 rounded-lg px-3 py-2">
                <option value="">Select Item</option>
                {products.map(product => (
                  <option key={product.id} value={product.name}>
                    {product.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <input name="description" value={form.description} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
              <input name="color" value={form.color} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
              <select name="unit" value={form.unit} onChange={handleChange} required className="w-full border border-gray-300 rounded-lg px-3 py-2">
                <option value="">Select Unit</option>
                {units.map(u => (
                  <option key={u.id} value={u.unitName}>
                    {u.unitName}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Opening Stock</label>
              <input name="openingStock" type="number" value={form.openingStock} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock In</label>
              <input name="stockIn" type="number" value={form.stockIn} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock Out</label>
              <input name="stockOut" type="number" value={form.stockOut} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Closing Stock <span className="text-xs text-gray-400">(auto)</span></label>
              <input name="closingStock" type="number" value={closingStock} readOnly tabIndex={-1} className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100 text-gray-700 cursor-not-allowed" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Remark</label>
              <textarea name="remark" value={form.remark} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2" rows="2"></textarea>
            </div>
          </div>
          <div className="flex justify-center gap-3 mt-6">
            <button type="button" onClick={onClose} className="px-5 py-2 border border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium" disabled={isLoading}>Cancel</button>
            <button type="submit" className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StockItemForm;
