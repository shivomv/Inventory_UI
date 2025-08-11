import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { apiService } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const PurchaseOrderForm = ({ isOpen, onClose, order, onSave }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    date: '',
    sheet: '',
    item: '',
    gsm: '',
    size: '',
    totalWeight: '',
    qty: '',
    unit: '',
    remark: '',
    supplier: '',
    invoiceNumber: '',
    invoiceDate: '',
    receivedBy: '',
    status: '',
    purchasePrice: '',
    totalAmount: '',
    warehouse: '',
    expectedDeliveryDate: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [units, setUnits] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [loadingDropdowns, setLoadingDropdowns] = useState(false);
  const [error, setError] = useState(null);

  // Fetch dropdown data
  const fetchDropdownData = async () => {
    try {
      setLoadingDropdowns(true);
      const [productsData, unitsData, suppliersData, warehousesData] = await Promise.all([
        apiService.getProducts(),
        apiService.getUnits(),
        apiService.getSuppliers?.() || Promise.resolve([]),
        apiService.getWarehouses?.() || Promise.resolve([])
      ]);
      
      setProducts(productsData || []);
      setUnits(unitsData || []);
      setSuppliers(suppliersData || []);
      setWarehouses(warehousesData || []);
    } catch (err) {
      console.error('Dropdown Data Fetch Error:', err);
    } finally {
      setLoadingDropdowns(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchDropdownData();
      
      if (order) {
        // Edit mode - populate form with existing order data
        setFormData({
          date: order.date ? order.date.split('T')[0] : '',
          sheet: order.sheet || '',
          item: order.purchaseItem || '',
          gsm: order.gsm || '',
          size: order.size || '',
          totalWeight: order.totalWeight || '',
          qty: order.qty || '',
          unit: order.unit || '',
          remark: order.remark || '',
          supplier: order.supplier || '',
          invoiceNumber: order.invoiceNumber || '',
          invoiceDate: order.invoiceDate ? order.invoiceDate.split('T')[0] : '',
          receivedBy: order.receivedBy || '',
          status: order.status || '',
          purchasePrice: order.purchasePrice || '',
          totalAmount: order.totalAmount || '',
          warehouse: order.warehouse || '',
          expectedDeliveryDate: order.expectedDeliveryDate ? order.expectedDeliveryDate.split('T')[0] : ''
        });
      } else {
        // Create mode - reset form
        const today = new Date().toISOString().split('T')[0];
        
        setFormData({
          date: today,
          sheet: generateReference(),
          item: '',
          gsm: '',
          size: '',
          totalWeight: '',
          qty: '',
          unit: '',
          remark: '',
          supplier: '',
          invoiceNumber: '',
          invoiceDate: '',
          receivedBy: '',
          status: 'Pending',
          purchasePrice: '',
          totalAmount: '',
          warehouse: '',
          expectedDeliveryDate: ''
        });
      }
      setError(null);
    }
  }, [order, isOpen]);

  const generateReference = () => {
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `PO-${date}-${random}`;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = {
        ...prev,
        [name]: value
      };
      
      // Auto-calculate total amount
      if (name === 'purchasePrice' || name === 'qty') {
        const price = name === 'purchasePrice' ? Number(value) || 0 : Number(prev.purchasePrice) || 0;
        const quantity = name === 'qty' ? Number(value) || 0 : Number(prev.qty) || 0;
        newData.totalAmount = price * quantity;
      }
      
      return newData;
    });
  };

  const handleProductChange = (e) => {
    const productName = e.target.value;
    setFormData(prev => ({
      ...prev,
      item: productName
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const apiData = {
        date: formData.date ? new Date(formData.date).toISOString() : new Date().toISOString(),
        sheet: formData.sheet,
        purchaseItem: formData.item,
        gsm: Number(formData.gsm) || 0,
        size: formData.size,
        totalWeight: Number(formData.totalWeight) || 0,
        qty: Number(formData.qty) || 0,
        unit: formData.unit,
        remark: formData.remark,
        supplier: formData.supplier,
        invoiceNumber: formData.invoiceNumber,
        invoiceDate: formData.invoiceDate ? new Date(formData.invoiceDate).toISOString() : null,
        receivedBy: formData.receivedBy,
        status: formData.status,
        purchasePrice: Number(formData.purchasePrice) || 0,
        totalAmount: Number(formData.totalAmount) || 0,
        warehouse: formData.warehouse,
        expectedDeliveryDate: formData.expectedDeliveryDate ? new Date(formData.expectedDeliveryDate).toISOString() : null,
        createdBy: user?.username || 'admin',
        creationDate: new Date().toISOString()
      };

      let response;
      if (order) {
        response = await apiService.updatePurchase(order.id, apiData);
      } else {
        response = await apiService.createPurchase(apiData);
      }

      if (onSave) {
        onSave(response);
      }
      
      onClose();
    } catch (error) {
      console.error('Failed to save purchase order:', error);
      
      let errorMessage = 'Failed to save purchase order. Please try again.';
      
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-200">
        <form onSubmit={handleSubmit}>
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                {order ? 'Edit' : 'Create'} Purchase Order
              </h2>
              <p className="text-xs text-gray-600 mt-1">
                {order ? 'Update purchase order information' : 'Create a new purchase order'}
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
              <div className="mb-3">
                <h3 className="font-semibold text-sm">Order Information</h3>
                <p className="text-xs text-gray-500">Enter purchase order details</p>
              </div>

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
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Purchase Item <span className="text-red-500">*</span>
                </label>
                <select
                  name="item"
                  value={formData.item}
                  onChange={handleProductChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  disabled={loadingDropdowns}
                >
                  <option value="">
                    {loadingDropdowns ? 'Loading products...' : 'Select a product'}
                  </option>
                  {products.map((product) => (
                    <option key={product.id} value={product.name}>
                      {product.name} ({product.type})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mt-3">
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    disabled={loadingDropdowns}
                  >
                    <option value="">
                      {loadingDropdowns ? 'Loading units...' : 'Select a unit'}
                    </option>
                    {units.map((unit) => (
                      <option key={unit.id} value={unit.unitName}>
                        {unit.unitName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Remark
                </label>
                <textarea
                  name="remark"
                  value={formData.remark}
                  onChange={handleInputChange}
                  placeholder="Additional remarks..."
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Purchase Details */}
            <div className="bg-white border rounded-lg p-3">
              <div className="mb-3">
                <h3 className="font-semibold text-sm">Purchase Details</h3>
                <p className="text-xs text-gray-500">Additional purchase order information</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Supplier
                  </label>
                  <select
                    name="supplier"
                    value={formData.supplier}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={loadingDropdowns}
                  >
                    <option value="">
                      {loadingDropdowns ? 'Loading suppliers...' : 'Select a supplier'}
                    </option>
                    {suppliers.map((supplier) => (
                      <option key={supplier.supplierId} value={supplier.supplierName}>
                        {supplier.supplierName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Warehouse
                  </label>
                  <select
                    name="warehouse"
                    value={formData.warehouse}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={loadingDropdowns}
                  >
                    <option value="">
                      {loadingDropdowns ? 'Loading warehouses...' : 'Select a warehouse'}
                    </option>
                    {warehouses.map((warehouse) => (
                      <option key={warehouse.locationId} value={warehouse.locationName}>
                        {warehouse.locationName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Invoice Number
                  </label>
                  <Input
                    name="invoiceNumber"
                    value={formData.invoiceNumber}
                    onChange={handleInputChange}
                    placeholder="Invoice number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Invoice Date
                  </label>
                  <Input
                    type="date"
                    name="invoiceDate"
                    value={formData.invoiceDate}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Purchase Price
                  </label>
                  <Input
                    type="number"
                    name="purchasePrice"
                    value={formData.purchasePrice}
                    onChange={handleInputChange}
                    placeholder="Price per unit"
                    min="0"
                    step="0.01"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Total Amount
                  </label>
                  <Input
                    type="number"
                    name="totalAmount"
                    value={formData.totalAmount}
                    onChange={handleInputChange}
                    placeholder="Total amount"
                    min="0"
                    step="0.01"
                    readOnly
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expected Delivery Date
                  </label>
                  <Input
                    type="date"
                    name="expectedDeliveryDate"
                    value={formData.expectedDeliveryDate}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Received By
                </label>
                <Input
                  name="receivedBy"
                  value={formData.receivedBy}
                  onChange={handleInputChange}
                  placeholder="Person who received the order"
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-2 px-4 py-2 border-t bg-gray-50">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
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

export default PurchaseOrderForm;