import React, { useState } from 'react';
import { Filter, Settings, Package, Warehouse, ShoppingCart, Building, Wrench, Code, FileText } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';
import AdvancedFilter, { 
  partsFilters, 
  stockFilters, 
  orderFilters, 
  buildOrderFilters 
} from '../../components/filters/AdvancedFilter';

const FiltersPage = () => {
  const [activeFilter, setActiveFilter] = useState('parts');
  const [filterValues, setFilterValues] = useState({});

  const companiesFilters = [
    {
      id: 'name',
      label: 'Company Name',
      type: 'text',
      placeholder: 'Enter company name',
    },
    {
      id: 'type',
      label: 'Company Type',
      type: 'select',
      options: [
        { value: 'supplier', label: 'Supplier' },
        { value: 'customer', label: 'Customer' },
        { value: 'manufacturer', label: 'Manufacturer' },
      ],
    },
    {
      id: 'is_active',
      label: 'Active',
      type: 'boolean',
    },
    {
      id: 'currency',
      label: 'Currency',
      type: 'select',
      options: [
        { value: 'USD', label: 'US Dollar' },
        { value: 'EUR', label: 'Euro' },
        { value: 'GBP', label: 'British Pound' },
        { value: 'JPY', label: 'Japanese Yen' },
      ],
    },
  ];

  const stockTransferFilters = [
    {
      id: 'part',
      label: 'Part',
      type: 'text',
      placeholder: 'Enter part name or IPN',
    },
    {
      id: 'from_location',
      label: 'From Location',
      type: 'select',
      options: [
        { value: '1', label: 'Electronics Storage - Shelf A1' },
        { value: '2', label: 'Components - Drawer B2' },
        { value: '3', label: 'Components - Drawer C1' },
      ],
    },
    {
      id: 'to_location',
      label: 'To Location',
      type: 'select',
      options: [
        { value: '1', label: 'Electronics Storage - Shelf A1' },
        { value: '2', label: 'Components - Drawer B2' },
        { value: '3', label: 'Components - Drawer C1' },
      ],
    },
    {
      id: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { value: 'pending', label: 'Pending' },
        { value: 'completed', label: 'Completed' },
        { value: 'cancelled', label: 'Cancelled' },
      ],
    },
    {
      id: 'date_from',
      label: 'Date From',
      type: 'date',
    },
    {
      id: 'date_to',
      label: 'Date To',
      type: 'date',
    },
  ];

  const stockAdjustmentFilters = [
    {
      id: 'part',
      label: 'Part',
      type: 'text',
      placeholder: 'Enter part name or IPN',
    },
    {
      id: 'location',
      label: 'Location',
      type: 'select',
      options: [
        { value: '1', label: 'Electronics Storage - Shelf A1' },
        { value: '2', label: 'Components - Drawer B2' },
        { value: '3', label: 'Components - Drawer C1' },
      ],
    },
    {
      id: 'adjustment_type',
      label: 'Adjustment Type',
      type: 'select',
      options: [
        { value: 'increase', label: 'Increase' },
        { value: 'decrease', label: 'Decrease' },
        { value: 'set', label: 'Set Quantity' },
      ],
    },
    {
      id: 'reason',
      label: 'Reason',
      type: 'select',
      options: [
        { value: 'damaged', label: 'Damaged' },
        { value: 'lost', label: 'Lost' },
        { value: 'found', label: 'Found' },
        { value: 'returned', label: 'Returned' },
        { value: 'consumed', label: 'Consumed' },
        { value: 'production', label: 'Production' },
        { value: 'correction', label: 'Correction' },
        { value: 'other', label: 'Other' },
      ],
    },
    {
      id: 'date_from',
      label: 'Date From',
      type: 'date',
    },
    {
      id: 'date_to',
      label: 'Date To',
      type: 'date',
    },
  ];

  const filterConfigurations = [
    {
      id: 'parts',
      label: 'Parts Filters',
      description: 'Filter parts by category, stock levels, and properties',
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      filters: partsFilters,
    },
    {
      id: 'stock',
      label: 'Stock Filters',
      description: 'Filter stock items by location, status, and quantities',
      icon: Warehouse,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      filters: stockFilters,
    },
    {
      id: 'orders',
      label: 'Order Filters',
      description: 'Filter orders by status, dates, and amounts',
      icon: ShoppingCart,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      filters: orderFilters,
    },
    {
      id: 'builds',
      label: 'Build Order Filters',
      description: 'Filter build orders by status, dates, and quantities',
      icon: Wrench,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      filters: buildOrderFilters,
    },
    {
      id: 'companies',
      label: 'Company Filters',
      description: 'Filter companies by type, currency, and status',
      icon: Building,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      filters: companiesFilters,
    },
    {
      id: 'transfers',
      label: 'Stock Transfer Filters',
      description: 'Filter stock transfers by location, status, and dates',
      icon: Package,
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-50',
      filters: stockTransferFilters,
    },
    {
      id: 'adjustments',
      label: 'Stock Adjustment Filters',
      description: 'Filter stock adjustments by type, reason, and dates',
      icon: Settings,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
      filters: stockAdjustmentFilters,
    },
  ];

  const activeFilterConfig = filterConfigurations.find(f => f.id === activeFilter);

  const handleFilterChange = (values) => {
    setFilterValues(values);
  };

  const handleFilterApply = () => {
    console.log('Applied filters:', filterValues);
    // Here you would typically send the filters to your API or parent component
  };

  const handleFilterClear = () => {
    setFilterValues({});
  };

  const getFilterCode = (config) => {
    return `// ${config.label} Configuration
const ${config.id}Filters = [
${config.filters.map((filter) => `  {
    id: '${filter.id}',
    label: '${filter.label}',
    type: '${filter.type}',${filter.placeholder ? `
    placeholder: '${filter.placeholder}',` : ''}${filter.options ? `
    options: [
${filter.options.map((option) => `      { value: '${option.value}', label: '${option.label}' }`).join(',\n')}
    ],` : ''}
  }`).join(',\n')}
];

// Usage in component
<AdvancedFilter
  title="${config.label}"
  description="${config.description}"
  filters={${config.id}Filters}
  values={filterValues}
  onChange={handleFilterChange}
  onApply={handleFilterApply}
  onClear={handleFilterClear}
/>`;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Filter Components</h1>
          <p className="text-gray-600 mt-2">Explore and test different filter configurations</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filter Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="w-5 h-5 mr-2" />
              Filter Types
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {filterConfigurations.map((config) => (
                <Button
                  key={config.id}
                  variant={activeFilter === config.id ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setActiveFilter(config.id)}
                >
                  <config.icon className="w-4 h-4 mr-2" />
                  {config.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Filter Configuration */}
        <div className="lg:col-span-3 space-y-6">
          {activeFilterConfig && (
            <>
              {/* Filter Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <div className={`p-2 rounded-lg ${activeFilterConfig.bgColor} mr-3`}>
                      <activeFilterConfig.icon className={`w-5 h-5 ${activeFilterConfig.color}`} />
                    </div>
                    {activeFilterConfig.label}
                  </CardTitle>
                  <CardDescription>{activeFilterConfig.description}</CardDescription>
                </CardHeader>
              </Card>

              {/* Live Filter Demo */}
              <Card>
                <CardHeader>
                  <CardTitle>Live Filter Demo</CardTitle>
                  <CardDescription>
                    Test the {activeFilterConfig.label.toLowerCase()} in action
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 mb-4">
                        Click the filter button to test the component:
                      </p>
                      <AdvancedFilter
                        title={activeFilterConfig.label}
                        description={activeFilterConfig.description}
                        filters={activeFilterConfig.filters}
                        values={filterValues}
                        onChange={handleFilterChange}
                        onApply={handleFilterApply}
                        onClear={handleFilterClear}
                      />
                    </div>
                  </div>
                  
                  {Object.keys(filterValues).length > 0 && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium mb-2">Current Filter Values:</h4>
                      <pre className="text-sm bg-white p-2 rounded border overflow-x-auto">
                        {JSON.stringify(filterValues, null, 2)}
                      </pre>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Filter Configuration */}
              <Card>
                <CardHeader>
                  <CardTitle>Filter Configuration</CardTitle>
                  <CardDescription>
                    Available filter options for {activeFilterConfig.label.toLowerCase()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {activeFilterConfig.filters.map((filter, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{filter.label}</h4>
                          <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                            {filter.type}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600">
                          <p><strong>ID:</strong> {filter.id}</p>
                          {filter.placeholder && <p><strong>Placeholder:</strong> {filter.placeholder}</p>}
                          {filter.options && (
                            <div>
                              <p><strong>Options:</strong></p>
                              <ul className="list-disc list-inside mt-1 ml-4">
                                {filter.options.map((option, optIndex) => (
                                  <li key={optIndex}>{option.label} ({option.value})</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Code Example */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Code className="w-5 h-5 mr-2" />
                    Code Example
                  </CardTitle>
                  <CardDescription>
                    Copy this code to implement {activeFilterConfig.label.toLowerCase()} in your component
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <pre className="text-sm bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                      <code>{getFilterCode(activeFilterConfig)}</code>
                    </pre>
                    <Button
                      variant="outline"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => {
                        navigator.clipboard.writeText(getFilterCode(activeFilterConfig));
                      }}
                    >
                      Copy
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FiltersPage;