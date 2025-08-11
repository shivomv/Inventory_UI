import React, { useState } from "react";

const mockPermissions = [
  "manage_users",
  "manage_roles",
  "view_dashboard",
  "edit_inventory",
  "view_reports",
];

const RoleForm = ({ role, onSave, onClose }) => {
  const [form, setForm] = useState({
    name: role?.name || "",
    permissions: role?.permissions || [],
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, name: e.target.value }));
  };

  const handlePermissionChange = (perm) => {
    setForm((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(perm)
        ? prev.permissions.filter((p) => p !== perm)
        : [...prev.permissions, perm],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div >
      <h3 className="text-lg font-semibold mb-4">{role ? "Edit Role" : "Add Role"}</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Role Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Permissions</label>
          <div className="flex gap-4 flex-wrap">
            {mockPermissions.map((perm) => (
              <label key={perm} className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={form.permissions.includes(perm)}
                  onChange={() => handlePermissionChange(perm)}
                  className="accent-blue-600"
                />
                {perm}
              </label>
            ))}
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            {role ? "Update" : "Create"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default RoleForm; 