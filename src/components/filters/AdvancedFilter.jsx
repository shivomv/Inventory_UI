import React, { useState } from 'react';
import { Filter, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import PropTypes from 'prop-types';

const AdvancedFilter = ({
  title,
  description,
  filters,
  values,
  onChange,
  onApply,
  onClear,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleValueChange = (filterId, value) => {
    onChange({
      ...values,
      [filterId]: value,
    });
  };

  const handleClearAll = () => {
    onClear();
    setIsOpen(false);
  };

  const handleApply = () => {
    onApply();
    setIsOpen(false);
  };

  const getActiveFilterCount = () => {
    return Object.values(values).filter(value => 
      value !== '' && value !== null && value !== undefined
    ).length;
  };

  const renderFilterInput = (filter) => {
    const value = values[filter.id] || '';

    switch (filter.type) {
      case 'text':
        return (
          <Input
            type="text"
            placeholder={filter.placeholder || `Enter ${filter.label.toLowerCase()}`}
            value={value}
            onChange={(e) => handleValueChange(filter.id, e.target.value)}
          />
        );

      case 'number':
        return (
          <Input
            type="number"
            placeholder={filter.placeholder || `Enter ${filter.label.toLowerCase()}`}
            value={value}
            onChange={(e) => handleValueChange(filter.id, e.target.value)}
          />
        );

      case 'date':
        return (
          <Input
            type="date"
            value={value}
            onChange={(e) => handleValueChange(filter.id, e.target.value)}
          />
        );

      case 'select':
        return (
          <select
            value={value}
            onChange={(e) => handleValueChange(filter.id, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">All {filter.label}</option>
            {filter.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'boolean':
        return (
          <select
            value={value}
            onChange={(e) => handleValueChange(filter.id, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">All</option>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        );

      default:
        return null;
    }
  };

  const activeFilterCount = getActiveFilterCount();

  return (
    <div className="relative">
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
      >
        <Filter className="w-4 h-4 mr-2" />
        Advanced Filters
        {activeFilterCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {activeFilterCount}
          </span>
        )}
      </Button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-96 z-50">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{title}</CardTitle>
                  {description && (
                    <CardDescription>{description}</CardDescription>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filters.map((filter) => (
                  <div key={filter.id}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {filter.label}
                    </label>
                    {renderFilterInput(filter)}
                  </div>
                ))}

                <div className="flex space-x-2 pt-4 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleClearAll}
                    className="flex-1"
                  >
                    Clear All
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleApply}
                    className="flex-1"
                  >
                    Apply Filters
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

AdvancedFilter.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  filters: PropTypes.array.isRequired,
  values: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onApply: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
};

// Predefined filter configurations for different modules
export const partsFilters = [
  {
    id: 'category',
    label: 'Category',
    type: 'select',
    options: [
      { value: 'microcontrollers', label: 'Microcontrollers' },
      { value: 'resistors', label: 'Resistors' },
      { value: 'capacitors', label: 'Capacitors' },
      { value: 'leds', label: 'LEDs' },
      { value: 'sensors', label: 'Sensors' },
    ],
  },
  {
    id: 'minStock',
    label: 'Minimum Stock',
    type: 'number',
    placeholder: 'Enter minimum stock level',
  },
  {
    id: 'maxStock',
    label: 'Maximum Stock',
    type: 'number',
    placeholder: 'Enter maximum stock level',
  },
  {
    id: 'active',
    label: 'Active',
    type: 'boolean',
  },
  {
    id: 'purchaseable',
    label: 'Purchaseable',
    type: 'boolean',
  },
  {
    id: 'salable',
    label: 'Salable',
    type: 'boolean',
  },
];

export const stockFilters = [
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
    id: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { value: 'ok', label: 'OK' },
      { value: 'damaged', label: 'Damaged' },
      { value: 'lost', label: 'Lost' },
    ],
  },
  {
    id: 'minQuantity',
    label: 'Minimum Quantity',
    type: 'number',
  },
  {
    id: 'maxQuantity',
    label: 'Maximum Quantity',
    type: 'number',
  },
  {
    id: 'batch',
    label: 'Batch',
    type: 'text',
    placeholder: 'Enter batch number',
  },
];

export const orderFilters = [
  {
    id: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { value: 'pending', label: 'Pending' },
      { value: 'placed', label: 'Placed' },
      { value: 'complete', label: 'Complete' },
      { value: 'cancelled', label: 'Cancelled' },
    ],
  },
  {
    id: 'dateFrom',
    label: 'Date From',
    type: 'date',
  },
  {
    id: 'dateTo',
    label: 'Date To',
    type: 'date',
  },
  {
    id: 'minAmount',
    label: 'Minimum Amount',
    type: 'number',
    placeholder: 'Enter minimum amount',
  },
  {
    id: 'maxAmount',
    label: 'Maximum Amount',
    type: 'number',
    placeholder: 'Enter maximum amount',
  },
];

export const buildOrderFilters = [
  {
    id: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { value: '10', label: 'Pending' },
      { value: '20', label: 'Production' },
      { value: '25', label: 'On Hold' },
      { value: '40', label: 'Complete' },
      { value: '50', label: 'Cancelled' },
    ],
  },
  {
    id: 'reference',
    label: 'Reference',
    type: 'text',
    placeholder: 'Enter build order reference',
  },
  {
    id: 'part',
    label: 'Part',
    type: 'text',
    placeholder: 'Enter part name or IPN',
  },
  {
    id: 'creation_date_after',
    label: 'Created After',
    type: 'date',
  },
  {
    id: 'creation_date_before',
    label: 'Created Before',
    type: 'date',
  },
  {
    id: 'target_date_after',
    label: 'Target Date After',
    type: 'date',
  },
  {
    id: 'target_date_before',
    label: 'Target Date Before',
    type: 'date',
  },
  {
    id: 'quantity_min',
    label: 'Min Quantity',
    type: 'number',
    placeholder: 'Minimum quantity',
  },
  {
    id: 'quantity_max',
    label: 'Max Quantity',
    type: 'number',
    placeholder: 'Maximum quantity',
  },
];

export const userFilters = [
  {
    id: 'username',
    label: 'Username',
    type: 'text',
    placeholder: 'Enter username',
  },
  {
    id: 'email',
    label: 'Email',
    type: 'text',
    placeholder: 'Enter email',
  },
  {
    id: 'role',
    label: 'Role',
    type: 'select',
    options: [
      { value: '', label: 'All Roles' },
      { value: 'Admin', label: 'Admin' },
      { value: 'User', label: 'User' },
    ],
  },
];

export default AdvancedFilter;
