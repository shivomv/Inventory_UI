import React, { useState, useMemo } from "react";
import UserForm from "./UserForm";
import Modal from "../ui/Modal";
import { Table } from "../ui/Table";
// Removed AdvancedFilter import

const mockUsers = [
  { id: 1, username: "admin", email: "admin@example.com", roles: ["Admin"] },
  { id: 2, username: "johndoe", email: "john@example.com", roles: ["User"] },
];

const UserList = () => {
  const [users, setUsers] = useState(mockUsers);
  const [showForm, setShowForm] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [deleteUser, setDeleteUser] = useState(null);

  const handleEdit = (user) => {
    setEditUser(user);
    setShowForm(true);
  };

  const handleDelete = (user) => {
    setDeleteUser(user);
  };

  const confirmDelete = () => {
    setUsers(users.filter((u) => u.id !== deleteUser.id));
    setDeleteUser(null);
  };

  const cancelDelete = () => {
    setDeleteUser(null);
  };

  const handleAdd = () => {
    setEditUser(null);
    setShowForm(true);
  };

  const handleSave = (form) => {
    if (editUser) {
      setUsers(users.map((u) => (u.id === editUser.id ? { ...u, ...form } : u)));
    } else {
      const newUser = {
        ...form,
        id: users.length ? Math.max(...users.map((u) => u.id)) + 1 : 1,
      };
      setUsers([...users, newUser]);
    }
    setShowForm(false);
    setEditUser(null);
  };

  const handleClose = () => {
    setShowForm(false);
    setEditUser(null);
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
        accessorKey: 'username',
        header: 'Username',
        cell: ({ getValue }) => <span className="font-medium">{getValue()}</span>,
      },
      {
        accessorKey: 'email',
        header: 'Email',
        cell: ({ getValue }) => <span className="text-gray-600">{getValue()}</span>,
      },
      {
        accessorKey: 'roles',
        header: 'Roles',
        cell: ({ getValue }) => (
          <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
            {getValue().join(', ')}
          </span>
        ),
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
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Users</h2>
          <p className="text-gray-600 text-sm">Manage user accounts and their access</p>
        </div>
        <button
          onClick={handleAdd}
          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 shadow-lg shadow-blue-500/25"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add User
        </button>
      </div>
      {/* Removed AdvancedFilter UI */}
      <Table
        data={users}
        columns={columns}
        enableSorting={true}
        enableFiltering={true}
        enablePagination={true}
        pageSize={10}
        pageSizeOptions={[5, 10, 25, 50]}
      />
      {showForm && (
        <Modal isOpen={showForm} onClose={handleClose}>
          <UserForm user={editUser} onSave={handleSave} onClose={handleClose} />
        </Modal>
      )}
      {deleteUser && (
        <Modal isOpen={!!deleteUser} onClose={cancelDelete}>
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p>Are you sure you want to delete user <span className="font-bold">{deleteUser.username}</span>?</p>
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

export default UserList; 