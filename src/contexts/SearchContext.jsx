import React, { createContext, useContext, useState } from 'react';

const SearchContext = createContext(undefined);

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};

export const SearchProvider = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const performSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    
    try {
      // Mock search results - in a real app, this would call your API
      const mockResults = [
        // Parts
        {
          id: '1',
          type: 'part',
          title: 'Arduino Uno R3',
          subtitle: 'ARD-UNO-R3',
          description: 'Microcontroller board based on the ATmega328P',
          url: '/parts',
          metadata: { category: 'Microcontrollers', inStock: 25 }
        },
        {
          id: '2',
          type: 'part',
          title: 'Resistor 10kΩ',
          subtitle: 'RES-10K-0.25W',
          description: '10k Ohm resistor, 1/4W, 5% tolerance',
          url: '/parts',
          metadata: { category: 'Resistors', inStock: 450 }
        },
        // Stock Items
        {
          id: '3',
          type: 'stock',
          title: 'Arduino Uno R3 Stock',
          subtitle: 'Electronics Storage - Shelf A1',
          description: '15 units available, batch B2024-001',
          url: '/stock',
          metadata: { quantity: 15, location: 'Electronics Storage - Shelf A1' }
        },
        // Orders
        {
          id: '4',
          type: 'order',
          title: 'PO-2024-001',
          subtitle: 'Digikey Electronics',
          description: 'Arduino boards and sensors for prototype project',
          url: '/orders',
          metadata: { type: 'purchase', status: 'Pending', total: '$1,234.56' }
        },
        {
          id: '5',
          type: 'order',
          title: 'SO-2024-001',
          subtitle: 'ABC Manufacturing Corp',
          description: 'Custom sensor modules for production line',
          url: '/orders',
          metadata: { type: 'sales', status: 'Pending', total: '$2,456.78' }
        },
        // Companies
        {
          id: '6',
          type: 'company',
          title: 'Digikey Electronics',
          subtitle: 'Supplier',
          description: 'Electronic components and semiconductors distributor',
          url: '/companies',
          metadata: { type: 'supplier', active: true }
        },
        // Build Orders
        {
          id: '7',
          type: 'build',
          title: 'BO-2024-001',
          subtitle: 'Arduino Sensor Module Assembly',
          description: 'Complete sensor module with Arduino Uno and sensors',
          url: '/build',
          metadata: { status: 'Production', progress: '3/10' }
        },
      ];

      // Filter results based on search query
      const filteredResults = mockResults.filter(result =>
        result.title.toLowerCase().includes(query.toLowerCase()) ||
        result.subtitle.toLowerCase().includes(query.toLowerCase()) ||
        result.description.toLowerCase().includes(query.toLowerCase())
      );

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setSearchResults(filteredResults);
    } catch (error) {
      console.error('Search failed:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSearchResults([]);
  };

  const value = {
    searchTerm,
    setSearchTerm,
    searchResults,
    isSearching,
    performSearch,
    clearSearch,
  };

  return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>;
};
