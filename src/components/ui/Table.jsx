import React from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from '@tanstack/react-table';
import { ChevronUp, ChevronDown, Filter, Search } from 'lucide-react';
import { Button } from './Button'; // Adjust path as needed

export const Table = ({
  data,
  columns,
  enableSorting = true,
  enableFiltering = true,
  enablePagination = true,
  enableColumnVisibility = true,
  enablePageSizeControl = true,
  pageSizeOptions = [5, 10, 25, 50],
  pageSize = 10,
  isLoading = false,
  className = '',
}) => {
  const [sorting, setSorting] = React.useState([]);
  const [globalFilter, setGlobalFilter] = React.useState('');
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [debouncedFilter, setDebouncedFilter] = React.useState('');
  const [showColumnMenu, setShowColumnMenu] = React.useState(false);

  React.useEffect(() => {
    const timeout = setTimeout(() => setGlobalFilter(debouncedFilter), 300);
    return () => clearTimeout(timeout);
  }, [debouncedFilter]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
      columnVisibility,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      pagination: {
        pageSize,
      },
    },
  });

  // Optional: Close column menu on outside click
  const menuRef = React.useRef(null);
  React.useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowColumnMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`space-y-4 ${className}`}>
      {enableFiltering && (
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="relative flex-2 max-w-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              value={debouncedFilter}
              onChange={(e) => setDebouncedFilter(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm placeholder-gray-500"
              placeholder="Search all columns..."
            />
          </div>

          {enableColumnVisibility && (
            <div className="relative" ref={menuRef}>
              <button
                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                onClick={() => setShowColumnMenu((prev) => !prev)}
              >
                <Filter className="w-4 h-4 mr-2" />
                
              </button>

              {showColumnMenu && (
                <div className="absolute right-0 mt-2 w-52 bg-white border border-gray-200 rounded-md shadow-lg z-20">
                  <div className="p-2 space-y-1 max-h-60 overflow-y-auto">
                    {table.getAllLeafColumns().map((column) => (
                      <label
                        key={column.id}
                        className="flex items-center gap-2 text-sm cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={column.getIsVisible()}
                          onChange={column.getToggleVisibilityHandler()}
                        />
                        {column.columnDef.header?.toString()}
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <div className="overflow-x-auto ">
        <table className="min-w-full text-sm text-gray-990">
          <thead className="bg-gray-500 sticky top-0 z-10">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-3 border text-left text-xs uppercase font-semibold tracking-wide"
                  >
                    {header.isPlaceholder ? null : (
                      <div
                        className={`flex items-center gap-2 ${
                          header.column.getCanSort() && enableSorting
                            ? 'cursor-pointer select-none'
                            : ''
                        }`}
                        onClick={
                          header.column.getCanSort() && enableSorting
                            ? header.column.getToggleSortingHandler()
                            : undefined
                        }
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {enableSorting && header.column.getCanSort() && (
                          <span className="flex flex-col">
                            <ChevronUp
                              size={12}
                              className={`${
                                header.column.getIsSorted() === 'asc'
                                  ? 'text-blue-600'
                                  : 'text-gray-400'
                              }`}
                            />
                            <ChevronDown
                              size={12}
                              className={`-mt-1 ${
                                header.column.getIsSorted() === 'desc'
                                  ? 'text-blue-600'
                                  : 'text-gray-400'
                              }`}
                            />
                          </span>
                        )}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-6 text-center text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-6 text-center text-gray-500">
                  No data available.
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row, index) => (
                <tr
                  key={row.id}
                  className={`${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                  } hover:bg-gray-100 transition`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-2 border">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {enablePagination && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">
              Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
            </span>
            <span className="text-sm text-gray-700">
              ({table.getFilteredRowModel().rows.length} filtered rows)
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {enablePageSizeControl && (
              <select
                className="border px-6 py-1 rounded text-sm"
                value={table.getState().pagination.pageSize}
                onChange={(e) => table.setPageSize(Number(e.target.value))}
              >
                {pageSizeOptions.map((size) => (
                  <option key={size} value={size}>
                    Show {size}
                  </option>
                ))}
              </select>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Table;
