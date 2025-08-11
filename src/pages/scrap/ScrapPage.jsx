import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Trash2, Pencil } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import { Table } from '../../components/ui/Table';
import { apiService } from '../../services/api';

const ScrapPage = () => {
  const [scraps, setScraps] = useState([]);
  const [formData, setFormData] = useState({
    date: '',
    sheet: '',
    scrapItem: '',
    gsm: '',
    size: '',
    weight: '',
    qty: '',
    unit: '',
    reason: '',
    remark: ''
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const fetchScraps = async () => {
    try {
      const res = await apiService.getScrapItems();
      setScraps(res || []);
    } catch (err) {
      console.error('Failed to fetch scraps:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await apiService.updateScrapItem(editId, formData);
      } else {
        await apiService.createScrapItem(formData);
      }
      setIsModalOpen(false);
      setEditId(null);
      resetForm();
      fetchScraps();
    } catch (err) {
      console.error('Error submitting scrap:', err);
    }
  };

  const handleDelete = (id) => {
    setDeleteId(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await apiService.deleteScrapItem(deleteId);
      fetchScraps();
      setDeleteModalOpen(false);
      setDeleteId(null);
    } catch (err) {
      console.error('Error deleting scrap:', err);
    }
  };

  const handleEdit = (scrap) => {
    setFormData({ ...scrap });
    setEditId(scrap.id);
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      date: '',
      sheet: '',
      scrapItem: '',
      gsm: '',
      size: '',
      weight: '',
      qty: '',
      unit: '',
      reason: '',
      remark: ''
    });
  };

  // Define columns for TanStack Table
  const columns = useMemo(
    () => [
      {
        accessorKey: 'date',
        header: 'Date',
        cell: ({ row }) => row.getValue('date'),
      },
      {
        accessorKey: 'sheet',
        header: 'Sheet',
        cell: ({ row }) => row.getValue('sheet'),
      },
      {
        accessorKey: 'scrapItem',
        header: 'Scrap Item',
        cell: ({ row }) => row.getValue('scrapItem'),
      },
      {
        accessorKey: 'gsm',
        header: 'GSM',
        cell: ({ row }) => row.getValue('gsm'),
      },
      {
        accessorKey: 'size',
        header: 'Size',
        cell: ({ row }) => row.getValue('size'),
      },
      {
        accessorKey: 'weight',
        header: 'Weight',
        cell: ({ row }) => row.getValue('weight'),
      },
      {
        accessorKey: 'qty',
        header: 'Qty',
        cell: ({ row }) => row.getValue('qty'),
      },
      {
        accessorKey: 'unit',
        header: 'Unit',
        cell: ({ row }) => row.getValue('unit'),
      },
      {
        accessorKey: 'reason',
        header: 'Reason',
        cell: ({ row }) => row.getValue('reason'),
      },
      {
        accessorKey: 'remark',
        header: 'Remark',
        cell: ({ row }) => row.getValue('remark'),
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
          const scrap = row.original;
          return (
            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => handleEdit(scrap)}>
                <Pencil size={16} />
              </Button>
              <Button variant="ghost" onClick={() => handleDelete(scrap.id)}>
                <Trash2 size={16} />
              </Button>
            </div>
          );
        },
        enableSorting: false,
        enableGlobalFilter: false,
      },
    ],
    [handleEdit, handleDelete]
  );

  useEffect(() => {
    fetchScraps();
  }, []);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Scrap Records</h2>
        <Button
          onClick={() => {
            resetForm();
            setEditId(null);
            setIsModalOpen(true);
          }}
          className="flex gap-1 items-center"
        >
          <Plus size={16} /> Add Scrap
        </Button>
      </div>

      <Table
        data={scraps}
        columns={columns}
        enableSorting={true}
        enableFiltering={true}
        enablePagination={true}
        pageSize={10}
      />

      {/* Modal for Add/Edit */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          resetForm();
          setEditId(null);
        }}
        title={editId ? 'Edit Scrap Item' : 'Add Scrap Item'}
      >
        <div className="w-full max-w-2xl mx-auto px-4 py-2 overflow-y-auto max-h-[80vh]">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Date</label>
                <Input type="date" name="date" value={formData.date} onChange={handleChange} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Sheet</label>
                <Input name="sheet" value={formData.sheet} onChange={handleChange} placeholder="Enter sheet name" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Scrap Item</label>
                <Input name="scrapItem" value={formData.scrapItem} onChange={handleChange} placeholder="Enter scrap item" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">GSM</label>
                <Input type="number" name="gsm" value={formData.gsm} onChange={handleChange} placeholder="Enter GSM value" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Size</label>
                <Input name="size" value={formData.size} onChange={handleChange} placeholder="Enter size (e.g., A4)" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Weight</label>
                <Input type="number" name="weight" value={formData.weight} onChange={handleChange} placeholder="Enter weight in kg" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Quantity</label>
                <Input type="number" name="qty" value={formData.qty} onChange={handleChange} placeholder="Enter quantity" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Unit</label>
                <Input name="unit" value={formData.unit} onChange={handleChange} placeholder="Enter unit" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium mb-1">Reason</label>
                <Input name="reason" value={formData.reason} onChange={handleChange} placeholder="Enter reason" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium mb-1">Remark</label>
                <Input name="remark" value={formData.remark} onChange={handleChange} placeholder="Enter remark" />
              </div>
            </div>

            <div className="flex justify-end pt-4 gap-3">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">{editId ? 'Update' : 'Save'}</Button>
            </div>
          </form>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setDeleteId(null);
        }}
        title="Confirm Delete"
      >
        <div className="w-full max-w-md mx-auto px-4 py-2">
          <p className="text-gray-700 mb-6">
            Are you sure you want to delete this scrap item? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setDeleteModalOpen(false);
                setDeleteId(null);
              }}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={confirmDelete}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ScrapPage;
