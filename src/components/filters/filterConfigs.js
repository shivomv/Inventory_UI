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