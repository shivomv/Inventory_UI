import React, { useState, useEffect } from 'react';
import Modal from '../../ui/Modal';
import { Button } from '../../ui/Button';

const CompanyMasterForm = ({ isOpen, onClose, onSave, editing }) => {
  const [companyName, setCompanyName] = useState('');
  const [description, setDescription] = useState('');
  const [website, setWebsite] = useState('');
  const [active, setActive] = useState(true);

  // Reset form when modal opens/closes or editing changes
  useEffect(() => {
    if (isOpen) {
      if (editing) {
        setCompanyName(editing.companyName || '');
        setDescription(editing.description || '');
        setWebsite(editing.website || '');
        setActive(editing.active !== undefined ? editing.active : true);
      } else {
        setCompanyName('');
        setDescription('');
        setWebsite('');
        setActive(true);
      }
    }
  }, [isOpen, editing]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!companyName.trim()) return;
    
    const formData = { 
      companyName: companyName.trim(), 
      description: description.trim(),
      website: website.trim(),
      active 
    };
    
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="w-full max-w-md mx-auto p-6">
        <h3 className="text-lg font-semibold mb-4 text-center text-gray-800">
          {editing ? 'Edit Company' : 'Add New Company'}
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Company Name */}
          <div>
            <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">
              Company Name *
            </label>
            <input
              type="text"
              id="companyName"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter company name"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter description"
            />
          </div>

          {/* Website */}
          <div>
            <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
              Website
            </label>
            <input
              type="url"
              id="website"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://example.com"
            />
          </div>

          {/* Active Status */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="active"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="active" className="ml-2 block text-sm text-gray-700">
              Active
            </label>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button 
              type="button"
              variant="outline" 
              onClick={onClose}
              className="px-4 py-2 text-sm"
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white"
            >
              {editing ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default CompanyMasterForm;