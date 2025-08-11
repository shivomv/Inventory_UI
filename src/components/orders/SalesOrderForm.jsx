import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { apiService } from '../../services/api';

const SalesOrderForm = ({ isOpen, onClose, order, onSave }) => {
  // Form state
  const [formData, setFormData] = useState({
    date: '',
    sheet: '',
    salesItem: '',
    gsm: '',
    size: '',
    totalWeight: '',
    qty: '',
    unit: '',
    remark: '',
    status: 'Pending', // Default status
    supplier: '',
    customer: '',
    orderStatus: 'New', // Default order status
    startDate: '',
    targetDate: '',
    responsible: '',
    totalPrice: ''
  });

  // UI states
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [units, setUnits] = useState([]);
  const [loadingDropdowns, setLoadingDropdowns] = useState(false);
  const [error, setError] = useState(null);

  // Fetch dropdown data
  const fetchDropdownData = async () => {
    try {
      setLoadingDropdowns(true);
      const [productsData, unitsData] = await Promise.all([
        apiService.getProducts(),
        apiService.getUnits()
      ]);
      
      setProducts(productsData || []);
      setUnits(unitsData || []);
    } catch (err) {
      console.error('Dropdown Data Fetch Error:', err);
      setError('Failed to load form data. Please try again.');
    } finally {
      setLoadingDropdowns(false);
    }
  };

  // Generate unique reference number
  const generateReference = () => {
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `SO-${date}-${random}`;
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const apiData = {
        date: formData.date ? new Date(formData.date).toISOString() : new Date().toISOString(),
        sheet: formData.sheet,
        salesItem: formData.salesItem,
        gsm: Number(formData.gsm) || 0,
        size: formData.size,
        totalWeight: Number(formData.totalWeight) || 0,
        qty: Number(formData.qty) || 0,
        unit: formData.unit,
        remark: formData.remark,
        status: formData.status || 'Pending',
        supplier: formData.supplier,
        customer: formData.customer,
        orderStatus: formData.orderStatus || 'New',
        startDate: formData.startDate ? new Date(formData.startDate).toISOString() : null,
        targetDate: formData.targetDate ? new Date(formData.targetDate).toISOString() : null,
        responsible: formData.responsible,
        totalPrice: Number(formData.totalPrice) || 0,
        createdBy: formData.responsible // Use responsible person as createdBy
      };

      let response;
      if (order) {
        response = await apiService.updateSale(order.id, apiData);
      } else {
        response = await apiService.createSale(apiData);
      }

      if (onSave) {
        onSave(response);
      }
      
      onClose();
    } catch (error) {
      console.error('Failed to save sales order:', error);
      
      let errorMessage = 'Failed to save sales order. Please try again.';
      
      if (error.response?.data) {
        const errorData = error.response.data;
        if (errorData.errors) {
          const validationErrors = Object.entries(errorData.errors)
            .map(([field, messages]) => {
              const messageText = Array.isArray(messages) ? messages.join(', ') : messages;
              return `${field}: ${messageText}`;
            })
            .join('; ');
          errorMessage = `Validation errors: ${validationErrors}`;
        } else if (errorData.detail) {
          errorMessage = errorData.detail;
        } else if (errorData.message) {
          errorMessage = errorData.message;
        }
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize form data when opened
  useEffect(() => {
    if (isOpen) {
      fetchDropdownData();
      
      if (order) {
        // Edit mode - populate form with existing order data
        setFormData({
          date: order.date ? order.date.split('T')[0] : '',
          sheet: order.sheet || '',
          salesItem: order.salesItem || '',
          gsm: order.gsm || '',
          size: order.size || '',
          totalWeight: order.totalWeight || '',
          qty: order.qty || '',
          unit: order.unit || '',
          remark: order.remark || '',
          status: order.status || 'Pending',
          supplier: order.supplier || '',
          customer: order.customer || '',
          orderStatus: order.orderStatus || 'New',
          startDate: order.startDate ? order.startDate.split('T')[0] : '',
          targetDate: order.targetDate ? order.targetDate.split('T')[0] : '',
          responsible: order.responsible || '',
          totalPrice: order.totalPrice || ''
        });
      } else {
        // Create mode - reset form with defaults
        const today = new Date().toISOString().split('T')[0];
        setFormData({
          date: today,
          sheet: generateReference(),
          salesItem: '',
          gsm: '',
          size: '',
          totalWeight: '',
          qty: '',
          unit: '',
          remark: '',
          status: 'Pending',
          supplier: '',
          customer: '',
          orderStatus: 'New',
          startDate: today,
          targetDate: '',
          responsible: '',
          totalPrice: ''
        });
      }
      setError(null);
    }
  }, [order, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-200">
        <form onSubmit={handleSubmit}>
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                {order ? 'Edit' : 'Create'} Sales Order
              </h2>
              <p className="text-xs text-gray-600 mt-1">
                {order ? 'Update sales order information' : 'Create a new sales order'}
              </p>
            </div>
            <Button type="button" variant="ghost" size="icon" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="px-4 py-3 space-y-3">
            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {/* Basic Information */}
            <div className="bg-white border rounded-lg p-3">
              <h3 className="font-semibold text-sm mb-3">Basic Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sheet Reference <span className="text-red-500">*</span>
                  </label>
                  <div className="flex space-x-2">
                    <Input
                      name="sheet"
                      value={formData.sheet}
                      onChange={handleInputChange}
                      placeholder="Sheet reference"
                      required
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setFormData(prev => ({ ...prev, sheet: generateReference() }))}
                    >
                      Generate
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Customer
                  </label>
                  <Input
                    name="customer"
                    value={formData.customer}
                    onChange={handleInputChange}
                    placeholder="Customer name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Supplier
                  </label>
                  <Input
                    name="supplier"
                    value={formData.supplier}
                    onChange={handleInputChange}
                    placeholder="Supplier name"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Product Details */}
            <div className="bg-white border rounded-lg p-3">
              <h3 className="font-semibold text-sm mb-3">Product Details</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sales Item <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="salesItem"
                    value={formData.salesItem}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                    disabled={loadingDropdowns}
                  >
                    <option value="">
                      {loadingDropdowns ? 'Loading products...' : 'Select a product'}
                    </option>
                    {products.map(product => (
                      <option key={product.id} value={product.name}>
                        {product.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      GSM
                    </label>
                    <Input
                      type="number"
                      name="gsm"
                      value={formData.gsm}
                      onChange={handleInputChange}
                      placeholder="GSM value"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Size
                    </label>
                    <Input
                      name="size"
                      value={formData.size}
                      onChange={handleInputChange}
                      placeholder="Size (e.g., A4, A3)"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Total Weight
                    </label>
                    <Input
                      type="number"
                      name="totalWeight"
                      value={formData.totalWeight}
                      onChange={handleInputChange}
                      placeholder="Weight"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Order Details */}
            <div className="bg-white border rounded-lg p-3">
              <h3 className="font-semibold text-sm mb-3">Order Details</h3>
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Quantity <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="number"
                      name="qty"
                      value={formData.qty}
                      onChange={handleInputChange}
                      placeholder="Quantity"
                      min="1"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Unit <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="unit"
                      value={formData.unit}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                      disabled={loadingDropdowns}
                    >
                      <option value="">
                        {loadingDropdowns ? 'Loading units...' : 'Select a unit'}
                      </option>
                      {units.map(unit => (
                        <option key={unit.id} value={unit.unitName}>
                          {unit.unitName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Order Status
                    </label>
                    <select
                      name="orderStatus"
                      value={formData.orderStatus}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="New">New</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date
                    </label>
                    <Input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Target Date
                    </label>
                    <Input
                      type="date"
                      name="targetDate"
                      value={formData.targetDate}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Total Price
                    </label>
                    <Input
                      type="number"
                      name="totalPrice"
                      value={formData.totalPrice}
                      onChange={handleInputChange}
                      placeholder="Total price"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Responsible Person
                  </label>
                  <Input
                    name="responsible"
                    value={formData.responsible}
                    onChange={handleInputChange}
                    placeholder="Person responsible"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Remark
                  </label>
                  <textarea
                    name="remark"
                    value={formData.remark}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Additional remarks..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-2 px-4 py-3 border-t bg-gray-50">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {order ? 'Update Order' : 'Create Order'}
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SalesOrderForm;