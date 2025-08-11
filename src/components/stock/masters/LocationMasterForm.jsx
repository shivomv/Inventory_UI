import React, { useState, useEffect } from 'react';
import { Input } from '../../ui/Input';
import { Button } from '../../ui/Button';

const LocationMasterForm = ({ isOpen, onClose, onSave, editing }) => {
  const [name, setName] = useState('');

  useEffect(() => {
    if (editing) setName(editing.locationName || editing.name || '');
    else setName('');
  }, [editing]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({ 
      locationId: editing ? editing.locationId : 0,
      locationName: name.trim() 
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-sm mx-4 shadow-xl">
        <h3 className="text-lg font-semibold mb-4">{editing ? 'Edit' : 'Add'} Location</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Location Name"
            value={name}
            onChange={e => setName(e.target.value)}
            autoFocus
            required
          />
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="default">
              Save
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LocationMasterForm;
