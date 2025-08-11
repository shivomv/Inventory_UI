import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import Modal from '../../../components/ui/Modal';
import { PencilIcon, CrossIcon, TrashIcon } from '../../../components/ui/icons';
import apiService from '../../../services/api';

const LocationMasterPage = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [inlineEditId, setInlineEditId] = useState(null);
  const [inlineEditValue, setInlineEditValue] = useState("");
  const [adding, setAdding] = useState(false);
  const [addValue, setAddValue] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Fetch locations on component mount
  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getLocations();
      // Map API response to match component structure
      const mappedLocations = data.map(location => ({
        id: location.locationId,
        name: location.locationName
      }));
      setLocations(mappedLocations);
    } catch (err) {
      setError(err.detail || 'Failed to fetch locations');
      console.error('Error fetching locations:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (location) => {
    setInlineEditId(location.id);
    setInlineEditValue(location.name);
  };

  const handleInlineEditSave = async (id) => {
    if (inlineEditValue.trim() === "") return;
    
    try {
      await apiService.updateLocation(id, {
        locationId: id,
        locationName: inlineEditValue.trim()
      });
      
      // Update local state
      setLocations(locations.map(l => l.id === id ? { ...l, name: inlineEditValue.trim() } : l));
      setInlineEditId(null);
      setInlineEditValue("");
    } catch (err) {
      setError(err.detail || 'Failed to update location');
      console.error('Error updating location:', err);
    }
  };

  const handleInlineEditCancel = () => {
    setInlineEditId(null);
    setInlineEditValue("");
  };

  const handleDelete = (id) => {
    setDeleteTarget(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await apiService.deleteLocation(deleteTarget);
      
      // Update local state
      setLocations(locations.filter(l => l.id !== deleteTarget));
      setIsDeleteModalOpen(false);
      setDeleteTarget(null);
    } catch (err) {
      setError(err.detail || 'Failed to delete location');
      console.error('Error deleting location:', err);
      setIsDeleteModalOpen(false);
      setDeleteTarget(null);
    }
  };

  const handleAdd = () => {
    setAdding(true);
    setAddValue("");
  };

  const handleAddSave = async () => {
    if (addValue.trim() === "") return;
    
    try {
      const newLocation = await apiService.createLocation({
        locationId: 0, // API will assign the actual ID
        locationName: addValue.trim()
      });
      
      // Add to local state with the returned data
      const mappedLocation = {
        id: newLocation.locationId,
        name: newLocation.locationName
      };
      setLocations([mappedLocation, ...locations]);
      setAdding(false);
      setAddValue("");
    } catch (err) {
      setError(err.detail || 'Failed to create location');
      console.error('Error creating location:', err);
    }
  };

  const handleAddCancel = () => {
    setAdding(false);
    setAddValue("");
  };

  if (loading) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">Loading locations...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      {/* Error message */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
          <button 
            onClick={() => setError(null)} 
            className="ml-2 text-red-500 hover:text-red-700"
          >
            ×
          </button>
        </div>
      )}
      
      {/* Add Location button above the table */}
      <div className="flex flex-row items-center justify-between mb-2">
        <h2 className="text-xl font-semibold">Location Master</h2>
        <Button onClick={handleAdd}>+ Add Location</Button>
      </div>
      {/* Removed Card wrapper, only show table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-200">SN.</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-200">Location</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-200">Actions</th>
            </tr>
          </thead>
          <tbody>
            {adding && (
              <tr className="bg-yellow-50">
                <td className="px-4 py-2 text-gray-400 font-semibold">New</td>
                <td className="px-4 py-2">
                  <Input
                    value={addValue}
                    onChange={e => setAddValue(e.target.value)}
                    className="h-8 text-sm w-64"
                    autoFocus
                    placeholder="Location"
                  />
                </td>
                <td className="px-4 py-2 flex gap-4">
                  <Button
                    variant="default"
                    size="sm"
                    onClick={handleAddSave}
                    aria-label="Save"
                    className="flex items-center justify-center p-2"
                  >
                    Save
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleAddCancel}
                    aria-label="Cancel"
                    className="flex items-center justify-center p-2"
                  >
                    Cancel
                  </Button>
                </td>
              </tr>
            )}
            {locations.length === 0 && !adding && (
              <tr>
                <td colSpan={3} className="p-4 text-center text-gray-400">No Locations found.</td>
              </tr>
            )}
            {locations.map((location, idx) => (
              <tr
                key={location.id}
                className={`hover:bg-blue-50 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} border-b border-gray-200`}
              >
                <td className="px-4 py-2 text-sm text-gray-700">{idx + 1}</td>
                <td className="px-4 py-2 text-sm text-gray-900 font-medium">
                  {inlineEditId === location.id ? (
                    <Input
                      value={inlineEditValue}
                      onChange={e => setInlineEditValue(e.target.value)}
                      className="h-8 text-sm w-64"
                      autoFocus
                      placeholder="Location"
                    />
                  ) : (
                    location.name
                  )}
                </td>
                <td className="px-4 py-2 flex gap-4">
                  {inlineEditId === location.id ? (
                    <>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleInlineEditSave(location.id)}
                        aria-label="Save"
                        className="flex items-center justify-center p-2"
                      >
                        Save
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleInlineEditCancel}
                        aria-label="Cancel"
                        className="flex items-center justify-center p-2"
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="outline" size="sm" onClick={() => handleEdit(location)} aria-label="Edit" className="flex items-center justify-center p-2">
                        <PencilIcon width={18} height={18} className="text-blue-700" />
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(location.id)} aria-label="Delete" className="flex items-center justify-center p-2">
                        <TrashIcon width={18} height={18} className="text-red-800" />
                      </Button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
        <div className="w-full max-w-xs mx-auto">
          <h3 className="text-lg font-semibold mb-4 text-center">Confirm Delete</h3>
          <p className="mb-6 text-center text-gray-700">Are you sure you want to delete this location?</p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default LocationMasterPage;
