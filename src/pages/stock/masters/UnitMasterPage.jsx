
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import Modal from '../../../components/ui/Modal';
import UnitMasterForm from '../../../components/stock/masters/UnitMasterForm';
import { PencilIcon, CrossIcon, TrashIcon } from '../../../components/ui/icons';
import apiService from '../../../services/api';

const UnitMasterPage = () => {
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUnit, setEditingUnit] = useState(null);

  // Fetch units from API
  const fetchUnits = async () => {
    try {
      setLoading(true);
      const data = await apiService.getUnits();
      setUnits(data);
    } catch (error) {
      console.error('Error fetching units:', error);
      alert('Failed to load units. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Load units on component mount
  useEffect(() => {
    fetchUnits();
  }, []);

  const handleAdd = () => {
    setEditingUnit(null);
    setIsFormOpen(true);
  };

  const handleEdit = (unit) => {
    setEditingUnit(unit);
    setIsFormOpen(true);
  };

  const handleFormSave = async (unitData) => {
    try {
      if (editingUnit) {
        // Update existing unit
        await apiService.updateUnit(editingUnit.id, unitData);
      } else {
        // Create new unit
        await apiService.createUnit(unitData);
      }
      
      // Refresh the units list
      await fetchUnits();
      setIsFormOpen(false);
      setEditingUnit(null);
    } catch (error) {
      console.error('Error saving unit:', error);
      alert('Failed to save unit. Please try again.');
      throw error; // Re-throw to handle loading state in form
    }
  };

  const handleDelete = (id) => {
    setDeleteTarget(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await apiService.deleteUnit(deleteTarget);
      
      // Refresh the units list
      await fetchUnits();
      setIsDeleteModalOpen(false);
      setDeleteTarget(null);
    } catch (error) {
      console.error('Error deleting unit:', error);
      alert('Failed to delete unit. Please try again.');
    }
  };

  return (
    <div className="p-2 sm:p-6 max-w-full md:max-w-2xl mx-auto">
      {/* Heading and Add Unit button above the table */}
      <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between gap-2 mb-2">
        <h2 className="text-base sm:text-lg font-semibold">Unit Master</h2>
        <Button onClick={handleAdd} className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold px-4 py-2 rounded shadow-sm focus:outline-none">+ Add Unit</Button>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="text-gray-500">Loading units...</div>
        </div>
      ) : (
        <div className="overflow-x-auto w-full p-0">
          <table className="min-w-[340px] sm:min-w-[400px] w-full border border-gray-200 rounded-lg text-xs sm:text-sm mx-auto shadow-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-200">SN.</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-200">Unit</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-200">Actions</th>
                </tr>
              </thead>
              <tbody>
                {units.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="p-4 text-center text-gray-400">No Units found.</td>
                  </tr>
                ) : (
                  units.map((unit, idx) => (
                    <tr
                      key={unit.id}
                      className={`hover:bg-blue-50 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} border-b border-gray-200`}
                    >
                      <td className="px-4 py-2 text-sm text-gray-700">{idx + 1}</td>
                      <td className="px-4 py-2 text-xs sm:text-sm text-gray-900 font-medium">
                        {unit.unitName}
                      </td>
                      <td className="px-4 py-2 flex gap-4">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(unit)} aria-label="Edit" className="flex items-center justify-center p-2">
                          <PencilIcon width={18} height={18} className="text-blue-700" />
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDelete(unit.id)} aria-label="Delete" className="flex items-center justify-center p-2">
                          <TrashIcon width={18} height={18} className="text-red-800" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
        </div>
      )}

      {/* Unit Form Modal */}
      <UnitMasterForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingUnit(null);
        }}
        onSave={handleFormSave}
        editing={editingUnit}
      />

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
        <div className="w-full max-w-xs mx-auto p-4">
          <h3 className="text-base font-semibold mb-3 text-center text-gray-800">Confirm Delete</h3>
          <p className="mb-4 text-center text-gray-700 text-xs sm:text-sm">Are you sure you want to delete this unit?</p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)} className="rounded px-3 py-1.5 text-xs sm:text-sm">Cancel</Button>
            <Button variant="destructive" onClick={confirmDelete} className="rounded px-3 py-1.5 text-xs sm:text-sm">Delete</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UnitMasterPage;
