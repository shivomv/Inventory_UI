import React, { useState } from "react";
import UserList from "./UserList";
import RoleList from "./RoleList";
import PermissionList from "./PermissionList";
import { Users, Shield, Key } from "lucide-react";

const TABS = [
  { label: "Users", value: "users", icon: Users },
  { label: "Roles", value: "roles", icon: Shield },
  { label: "Permissions", value: "permissions", icon: Key },
];

const UserManagement = () => {
  const [tab, setTab] = useState("users");

  return (
    <div>
      {/* Container with proper padding and max width */}
      <div>
        {/* Header Section */}
        <div className="mb-4 lg:mb-5">
          <div className="text-center lg:text-center">
            <h1 className="text-1xl sm:text-4xl lg:text-4xl font-bold text-gray-600 mb-2">
              User Management
            </h1>
            
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8 lg:mb-10">
          <div className="flex justify-center lg:justify-start">
            <nav className="inline-flex ">
              {TABS.map((t, idx) => {
                const IconComponent = t.icon;
                return (
                  <button
                    key={t.value}
                    onClick={() => setTab(t.value)}
                    className={`
                      relative px-6 sm:px-8 py-3 text-sm sm:text-base font-medium 
                      transition-all duration-300 ease-in-out rounded-lg
                     
                      flex items-center gap-5
                      ${tab === t.value
                        ? "bg-gradient-to-r from-blue-300 to-blue-400 text-white shadow-lg shadow-blue-500/25 transform scale-105"
                        : "text-gray-600 hover:text-blue-600 hover:bg-blue-50/50"
                      }
                    `}
                  >
                    <IconComponent className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="relative z-10">{t.label}</span>
                    {tab === t.value && (
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg opacity-10"></div>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Content Section */}
        <div >
          <div className="p-6 sm:p-8 lg:p-10">
            <div className="transition-all duration-500 ease-in-out">
              {tab === "users" && (
                <div className="animate-fadeIn">
                  <UserList />
                </div>
              )}
              {tab === "roles" && (
                <div className="animate-fadeIn">
                  <RoleList />
                </div>
              )}
              {tab === "permissions" && (
                <div className="animate-fadeIn">
                  <PermissionList />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement; 