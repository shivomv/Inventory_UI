import React, { useState, useEffect } from 'react';
import { Input } from '../../ui/Input';
import { Button } from '../../ui/Button';

const UnitMasterForm = ({ isOpen, onClose, onSave, editing }) => {
  const [unitName, setUnitName] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editing) setUnitName(editing.unitName);
    else setUnitName('');
  }, [editing]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!unitName.trim()) return;
    
    setLoading(true);
    try {
      await onSave({ id: editing?.id || 0, unitName: unitName.trim() });
      setUnitName('');
    } catch (error) {
      console.error('Error saving unit:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-sm mx-4 shadow-xl">
        <h3 className="text-lg font-semibold mb-4">{editing ? 'Edit' : 'Add'} Unit</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Unit Name"
            value={unitName}
            onChange={e => setUnitName(e.target.value)}
            autoFocus
            required
            disabled={loading}
          />
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" variant="default" disabled={loading || !unitName.trim()}>
              {loading ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UnitMasterForm;
