import React, { useState, useEffect } from 'react';
import { Input } from '../../ui/Input';
import { Button } from '../../ui/Button';

const SupplierMasterForm = ({ isOpen, onClose, onSave, editing }) => {
  const [supplierName, setSupplierName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [gstNumber, setGstNumber] = useState('');
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (editing) {
      setSupplierName(editing.supplierName || '');
      setContactPerson(editing.contactPerson || '');
      setEmail(editing.email || '');
      setPhone(editing.phone || '');
      setAddress(editing.address || '');
      setCity(editing.city || '');
      setState(editing.state || '');
      setCountry(editing.country || '');
      setPostalCode(editing.postalCode || '');
      setGstNumber(editing.gstNumber || '');
      setIsActive(editing.isActive !== undefined ? editing.isActive : true);
    } else {
      setSupplierName('');
      setContactPerson('');
      setEmail('');
      setPhone('');
      setAddress('');
      setCity('');
      setState('');
      setCountry('');
      setPostalCode('');
      setGstNumber('');
      setIsActive(true);
    }
  }, [editing]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!supplierName.trim() || !contactPerson.trim() || !email.trim() || !phone.trim()) {
      alert('Please fill in all required fields');
      return;
    }
    
    const supplierData = {
      supplierName: supplierName.trim(),
      contactPerson: contactPerson.trim(),
      email: email.trim(),
      phone: phone.trim(),
      address: address.trim(),
      city: city.trim(),
      state: state.trim(),
      country: country.trim(),
      postalCode: postalCode.trim(),
      gstNumber: gstNumber.trim(),
      isActive
    };
    
    onSave(supplierData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 ">
      <div className="relative bg-white border border-gray-200 rounded-xl shadow-2xl p-6 w-full max-w-[600px] mx-4 animate-fade-in max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300 rounded-full p-1 transition-colors"
          aria-label="Close"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="text-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900 tracking-tight">
            {editing ? 'Edit' : 'Add'} Supplier
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            {editing ? 'Update supplier information' : 'Enter supplier details to add a new supplier'}
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Basic Information Section */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-800 border-b border-gray-200 pb-1">Basic Information</h4>
            
            <div className="space-y-2">
              <label htmlFor="supplierName" className="block text-xs font-medium text-gray-700">
                Supplier Name <span className="text-red-500">*</span>
              </label>
              <Input
                id="supplierName"
                value={supplierName}
                onChange={e => setSupplierName(e.target.value)}
                autoFocus
                required
                className="h-9 text-sm px-3 border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-md shadow-sm"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="contactPerson" className="block text-xs font-medium text-gray-700">
                Contact Person <span className="text-red-500">*</span>
              </label>
              <Input
                id="contactPerson"
                value={contactPerson}
                onChange={e => setContactPerson(e.target.value)}
                required
                className="h-9 text-sm px-3 border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-md shadow-sm"
              />
            </div>
          </div>

          {/* Contact Information Section */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-800 border-b border-gray-200 pb-1">Contact Information</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-2">
                <label htmlFor="email" className="block text-xs font-medium text-gray-700">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="h-9 text-sm px-3 border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-md shadow-sm"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="phone" className="block text-xs font-medium text-gray-700">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  required
                  className="h-9 text-sm px-3 border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-md shadow-sm"
                />
              </div>
            </div>
          </div>

          {/* Address Information Section */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-800 border-b border-gray-200 pb-1">Address Information</h4>
            
            <div className="space-y-2">
              <label htmlFor="address" className="block text-xs font-medium text-gray-700">
                Street Address
              </label>
              <Input
                id="address"
                value={address}
                onChange={e => setAddress(e.target.value)}
                className="h-9 text-sm px-3 border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-md shadow-sm"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-2">
                <label htmlFor="city" className="block text-xs font-medium text-gray-700">
                  City
                </label>
                <Input
                  id="city"
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  className="h-9 text-sm px-3 border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-md shadow-sm"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="state" className="block text-xs font-medium text-gray-700">
                  State/Province
                </label>
                <Input
                  id="state"
                  value={state}
                  onChange={e => setState(e.target.value)}
                  className="h-9 text-sm px-3 border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-md shadow-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-2">
                <label htmlFor="country" className="block text-xs font-medium text-gray-700">
                  Country
                </label>
                <Input
                  id="country"
                  value={country}
                  onChange={e => setCountry(e.target.value)}
                  className="h-9 text-sm px-3 border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-md shadow-sm"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="postalCode" className="block text-xs font-medium text-gray-700">
                  Postal Code
                </label>
                <Input
                  id="postalCode"
                  value={postalCode}
                  onChange={e => setPostalCode(e.target.value)}
                  className="h-9 text-sm px-3 border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-md shadow-sm"
                />
              </div>
            </div>
          </div>

          {/* Business Information Section */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-800 border-b border-gray-200 pb-1">Business Information</h4>
            
            <div className="space-y-2">
              <label htmlFor="gstNumber" className="block text-xs font-medium text-gray-700">
                GST Number
              </label>
              <Input
                id="gstNumber"
                value={gstNumber}
                onChange={e => setGstNumber(e.target.value)}
                className="h-9 text-sm px-3 border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-md shadow-sm"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <input
                type="checkbox"
                id="isActive"
                checked={isActive}
                onChange={e => setIsActive(e.target.checked)}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
              />
              <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                Active Supplier
              </label>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 mt-6">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose} 
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="default" 
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {editing ? 'Update' : 'Save'} Supplier
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SupplierMasterForm;
