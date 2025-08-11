import React, { useState, useMemo } from "react";
import PermissionForm from "./PermissionForm";
import Modal from "../ui/Modal";
import { Table } from "../ui/Table";

const mockPermissions = [
  { id: 1, name: "manage_users", description: "Can manage users" },
  { id: 2, name: "manage_roles", description: "Can manage roles" },
  { id: 3, name: "view_dashboard", description: "Can view dashboard" },
];

const PermissionList = () => {
  const [permissions, setPermissions] = useState(mockPermissions);
  const [showForm, setShowForm] = useState(false);
  const [editPermission, setEditPermission] = useState(null);
  const [deletePermission, setDeletePermission] = useState(null);

  const handleEdit = (permission) => {
    setEditPermission(permission);
    setShowForm(true);
  };

  const handleDelete = (permission) => {
    setDeletePermission(permission);
  };

  const confirmDelete = () => {
    setPermissions(permissions.filter((p) => p.id !== deletePermission.id));
    setDeletePermission(null);
  };

  const cancelDelete = () => {
    setDeletePermission(null);
  };

  const handleAdd = () => {
    setEditPermission(null);
    setShowForm(true);
  };

  const handleSave = (form) => {
    if (editPermission) {
      setPermissions(permissions.map((p) => (p.id === editPermission.id ? { ...p, ...form } : p)));
    } else {
      const newPermission = {
        ...form,
        id: permissions.length ? Math.max(...permissions.map((p) => p.id)) + 1 : 1,
      };
      setPermissions([...permissions, newPermission]);
    }
    setShowForm(false);
    setEditPermission(null);
  };

  const handleClose = () => {
    setShowForm(false);
    setEditPermission(null);
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: 'sn',
        header: 'Sn.',
        cell: ({ row }) => <span className="font-medium text-gray-500">{row.index + 1}</span>,
        size: 60,
      },
      {
        accessorKey: 'name',
        header: 'Permission Name',
        cell: ({ getValue }) => (
          <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
            {getValue()}
          </span>
        ),
      },
      {
        accessorKey: 'description',
        header: 'Description',
        cell: ({ getValue }) => <span className="text-gray-600">{getValue()}</span>,
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <div className="flex gap-2">
            <button
              onClick={() => handleEdit(row.original)}
              className="inline-flex items-center px-3 py-1.5 bg-amber-500 text-white text-xs font-medium rounded-md hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all duration-200"
            >
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit
            </button>
            <button
              onClick={() => handleDelete(row.original)}
              className="inline-flex items-center px-3 py-1.5 bg-red-500 text-white text-xs font-medium rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all duration-200"
            >
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete
            </button>
          </div>
        ),
      },
    ],
    []
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Permissions</h2>
          <p className="text-gray-600 text-sm">Manage system permissions and access controls</p>
        </div>
        <button
          onClick={handleAdd}
           className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 shadow-lg shadow-blue-500/25"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Permission
        </button>
      </div>
      <Table
        data={permissions}
        columns={columns}
        enableSorting={true}
        enableFiltering={true}
        enablePagination={true}
        pageSize={10}
        pageSizeOptions={[5, 10, 25, 50]}
      />
      {showForm && (
        <Modal isOpen={showForm} onClose={handleClose}>
          <PermissionForm permission={editPermission} onSave={handleSave} onClose={handleClose} />
        </Modal>
      )}
      {deletePermission && (
        <Modal isOpen={!!deletePermission} onClose={cancelDelete}>
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p>Are you sure you want to delete permission <span className="font-bold">{deletePermission.name}</span>?</p>
            <div className="flex gap-2 mt-6 justify-end">
              <button
                onClick={confirmDelete}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
              >
                Delete
              </button>
              <button
                onClick={cancelDelete}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default PermissionList; 