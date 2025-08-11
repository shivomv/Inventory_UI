import React, { useState } from 'react';
import { Bell, LogOut, Settings, Menu, Search, X, User as UserIcon } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/Button';
import GlobalSearch from '../search/GlobalSearch';
import PropTypes from 'prop-types';

const Header = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-4 lg:px-6">
      <div className="flex items-center justify-between">
        {/* Left side - Menu button and Logo */}
        <div className="flex items-center space-x-4">
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleSidebar}
            className="lg:hidden"
          >
            <Menu className="w-5 h-5" />
          </Button>
          
         
        </div>

        {/* Search Bar - responsive */}
        <div className="flex-1 max-w-md mx-4 hidden md:block">
          <GlobalSearch />
        </div>

        {/* Mobile search toggle */}
        <div className="md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
          >
            {isSearchOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
          </Button>
        </div>

        {/* Right side actions */}
        <div className={`flex items-center space-x-2 ${isSearchOpen ? 'hidden sm:flex' : 'flex'}`}>
          {/* Notifications */}
          <Button variant="ghost" size="icon" className="hidden sm:flex">
            <Bell className="w-5 h-5" />
          </Button>

          {/* User Profile Dropdown */}
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsProfileOpen((open) => !open)}
              aria-label="User menu"
            >
              <UserIcon className="w-6 h-6" />
            </Button>
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
                  <div className="font-medium">{user?.first_name} {user?.last_name}</div>
                  <div className="text-xs text-gray-500">{user?.email}</div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile search bar */}
      {isSearchOpen && (
        <div className="mt-4 md:hidden">
          <GlobalSearch />
        </div>
      )}
    </header>
  );
};

Header.propTypes = {
  onToggleSidebar: PropTypes.func.isRequired,
};

export default Header;
