import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Package, Warehouse, ShoppingCart, Users, Wrench } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSearch } from '../../contexts/SearchContext';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

const GlobalSearch = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [localSearchTerm, setLocalSearchTerm] = useState('');
  const searchRef = useRef(null);
  const inputRef = useRef(null);
  
  const { searchResults, isSearching, performSearch, clearSearch } = useSearch();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (localSearchTerm.trim()) {
        performSearch(localSearchTerm);
      } else {
        clearSearch();
      }
    }, 300);

    return () => clearTimeout(delayedSearch);
  }, [localSearchTerm, performSearch, clearSearch]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setLocalSearchTerm(value);
    setIsOpen(value.length > 0);
  };

  const handleResultClick = (result) => {
    navigate(result.url);
    setIsOpen(false);
    setLocalSearchTerm('');
    clearSearch();
  };

  const handleClear = () => {
    setLocalSearchTerm('');
    clearSearch();
    setIsOpen(false);
    if (inputRef.current) inputRef.current.focus();
  };

  const getResultIcon = (type) => {
    switch (type) {
      case 'part':
        return <Package className="w-4 h-4 text-blue-600" />;
      case 'stock':
        return <Warehouse className="w-4 h-4 text-green-600" />;
      case 'order':
        return <ShoppingCart className="w-4 h-4 text-orange-600" />;
      case 'company':
        return <Users className="w-4 h-4 text-purple-600" />;
      case 'build':
        return <Wrench className="w-4 h-4 text-red-600" />;
      default:
        return <Search className="w-4 h-4 text-gray-600" />;
    }
  };

  const getResultTypeLabel = (type) => {
    switch (type) {
      case 'part':
        return 'Part';
      case 'stock':
        return 'Stock';
      case 'order':
        return 'Order';
      case 'company':
        return 'Company';
      case 'build':
        return 'Build';
      default:
        return 'Item';
    }
  };

  const getResultTypeColor = (type) => {
    switch (type) {
      case 'part':
        return 'text-blue-600 bg-blue-50';
      case 'stock':
        return 'text-green-600 bg-green-50';
      case 'order':
        return 'text-orange-600 bg-orange-50';
      case 'company':
        return 'text-purple-600 bg-purple-50';
      case 'build':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="relative flex-1 max-w-lg mx-8" ref={searchRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search parts, stock, orders..."
          value={localSearchTerm}
          onChange={handleInputChange}
          onFocus={() => localSearchTerm && setIsOpen(true)}
          className="pl-10 pr-10"
        />
        {localSearchTerm && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
            onClick={handleClear}
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {isSearching ? (
            <div className="p-4 text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
              <p className="text-sm text-gray-500 mt-2">Searching...</p>
            </div>
          ) : searchResults.length > 0 ? (
            <div className="py-2">
              {searchResults.map((result) => (
                <button
                  key={result.id}
                  onClick={() => handleResultClick(result)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      {getResultIcon(result.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {result.title}
                        </p>
                        <span className={`px-2 py-1 text-xs rounded-full ${getResultTypeColor(result.type)}`}>
                          {getResultTypeLabel(result.type)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 truncate">{result.subtitle}</p>
                      <p className="text-xs text-gray-500 truncate">{result.description}</p>
                      
                      {/* Metadata */}
                      {result.metadata && (
                        <div className="flex items-center space-x-4 mt-1">
                          {result.type === 'part' && result.metadata.inStock !== undefined && (
                            <span className="text-xs text-gray-500">
                              Stock: {result.metadata.inStock}
                            </span>
                          )}
                          {result.type === 'stock' && result.metadata.quantity !== undefined && (
                            <span className="text-xs text-gray-500">
                              Qty: {result.metadata.quantity}
                            </span>
                          )}
                          {result.type === 'order' && result.metadata.total && (
                            <span className="text-xs text-gray-500">
                              {result.metadata.total}
                            </span>
                          )}
                          {result.type === 'build' && result.metadata.progress && (
                            <span className="text-xs text-gray-500">
                              Progress: {result.metadata.progress}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : localSearchTerm ? (
            <div className="p-4 text-center">
              <Search className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No results found for "{localSearchTerm}"</p>
              <p className="text-xs text-gray-400 mt-1">Try different keywords or check spelling</p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default GlobalSearch;
