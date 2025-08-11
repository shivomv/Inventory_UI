import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import { Upload, Download, X, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { useToast } from '../../contexts/ToastContext';

const SimpleStockImport = ({ isOpen, onClose, onImport }) => {
  const { showSuccess: showToastSuccess } = useToast();
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const [validData, setValidData] = useState([]);
  const [showResults, setShowResults] = useState(false);

  if (!isOpen) return null;

  // Required columns for C# Stockitem model
  const requiredColumns = ['Date', 'ItemCode', 'ItemName', 'Unit'];

  const handleFileUpload = (event) => {
    const uploadedFile = event.target.files[0];
    if (!uploadedFile) return;

    setFile(uploadedFile);
    setErrors([]);
    setValidData([]);
    setShowResults(false);
    
    parseFile(uploadedFile);
  };

  const parseFile = (file) => {
    setIsLoading(true);
    
    const fileExtension = file.name.split('.').pop().toLowerCase();
    
    if (fileExtension === 'csv') {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          processData(results.data);
          setIsLoading(false);
        },
        error: (error) => {
          setErrors([`CSV parsing error: ${error.message}`]);
          setIsLoading(false);
        }
      });
    } else if (['xlsx', 'xls'].includes(fileExtension)) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          
          processData(jsonData);
          setIsLoading(false);
        } catch (error) {
          setErrors([`Excel parsing error: ${error.message}`]);
          setIsLoading(false);
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      setErrors(['Please upload Excel (.xlsx, .xls) or CSV files only.']);
      setIsLoading(false);
    }
  };

  const processData = (data) => {
    if (!data || data.length === 0) {
      setErrors(['No data found in the file.']);
      return;
    }

    const newErrors = [];
    const newValidData = [];
    const seenRecords = new Set(); // Track duplicates within the file
    let duplicateCount = 0;
    
    // Check for required columns
    const fileColumns = Object.keys(data[0]);
    const missingColumns = requiredColumns.filter(col => !fileColumns.includes(col));
    
    if (missingColumns.length > 0) {
      newErrors.push(`Missing required columns: ${missingColumns.join(', ')}`);
      newErrors.push(`Found columns: ${fileColumns.join(', ')}`);
    }

    // Validate each row
    data.forEach((row, index) => {
      const rowNumber = index + 1;
      const rowErrors = [];
      const processedRow = { ...row };

      // Check required fields
      requiredColumns.forEach(col => {
        if (!row[col] || row[col].toString().trim() === '') {
          rowErrors.push(`Row ${rowNumber}: ${col} is required`);
        }
      });

      // Validate Date
      if (row.Date) {
        const date = new Date(row.Date);
        if (isNaN(date.getTime())) {
          rowErrors.push(`Row ${rowNumber}: Invalid date format`);
        } else {
          processedRow.Date = date.toISOString();
        }
      }

      // Validate Unit
      const validUnits = ['ream', 'sheet', 'kg'];
      if (row.Unit && !validUnits.includes(row.Unit.toLowerCase())) {
        rowErrors.push(`Row ${rowNumber}: Unit must be: ream, sheet, or kg`);
      } else if (row.Unit) {
        processedRow.Unit = row.Unit.toLowerCase();
      }

      // Validate numeric fields
      const numericFields = ['GSM', 'OpeningStock', 'StockIn', 'StockOut'];
      numericFields.forEach(field => {
        if (row[field] !== undefined && row[field] !== '') {
          const value = parseInt(row[field]);
          if (isNaN(value) || value < 0) {
            rowErrors.push(`Row ${rowNumber}: ${field} must be a positive number`);
          } else {
            processedRow[field] = value;
          }
        } else {
          processedRow[field] = 0;
        }
      });

      // Calculate ClosingStock
      const openingStock = parseInt(processedRow.OpeningStock) || 0;
      const stockIn = parseInt(processedRow.StockIn) || 0;
      const stockOut = parseInt(processedRow.StockOut) || 0;
      processedRow.ClosingStock = openingStock + stockIn - stockOut;

      // Clean string fields
      const stringFields = ['ItemCode', 'ItemName', 'Description', 'Size', 'Brand', 'Color', 'Remark'];
      stringFields.forEach(field => {
        if (row[field]) {
          processedRow[field] = row[field].toString().trim();
        } else {
          processedRow[field] = '';
        }
      });

      // Check for duplicates within the file (ItemCode + Date combination)
      if (rowErrors.length === 0) {
        // Create a normalized date string for comparison (YYYY-MM-DD format)
        let normalizedDate = '';
        if (processedRow.Date) {
          try {
            const dateObj = new Date(processedRow.Date);
            normalizedDate = dateObj.toISOString().split('T')[0]; // Get YYYY-MM-DD part
          } catch (e) {
            normalizedDate = processedRow.Date;
          }
        }
        
        const duplicateKey = `${processedRow.ItemCode || ''}_${normalizedDate}`;
        
        if (seenRecords.has(duplicateKey)) {
          duplicateCount++;
          const dateDisplay = normalizedDate || 'Invalid Date';
          newErrors.push(`Row ${rowNumber}: Duplicate record (ItemCode: ${processedRow.ItemCode}, Date: ${dateDisplay}) - skipped`);
          console.log(`Duplicate found: ${duplicateKey}`);
        } else {
          seenRecords.add(duplicateKey);
          newValidData.push(processedRow);
          console.log(`Added unique record: ${duplicateKey}`);
        }
      } else {
        newErrors.push(...rowErrors);
      }
    });

    // Add summary message about duplicates if any were found
    if (duplicateCount > 0) {
      newErrors.unshift(`Found ${duplicateCount} duplicate record(s) that were skipped. Duplicates are identified by ItemCode + Date combination.`);
    }

    setErrors(newErrors);
    setValidData(newValidData);
    setShowResults(true);
  };

  const handleImport = async () => {
    if (validData.length === 0) return;

    setIsLoading(true);
    try {
      await onImport(validData);
      showToastSuccess(`Successfully imported ${validData.length} stock items!`, 4000);
      handleClose();
    } catch (error) {
      setErrors([`Import failed: ${error.message}`]);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadTemplate = () => {
    const templateData = [
      {
        Date: '2024-01-15',
        ItemCode: 'PAPER001',
        ItemName: 'A4 Copy Paper',
        Description: 'High quality copy paper',
        GSM: 80,
        Size: 'A4',
        Brand: 'JK Paper',
        Color: 'White',
        Unit: 'ream',
        OpeningStock: 100,
        StockIn: 50,
        StockOut: 20,
        Remark: 'Initial stock'
      },
      {
        Date: '2024-01-16',
        ItemCode: 'PAPER002',
        ItemName: 'A3 Art Paper',
        Description: 'Premium art paper',
        GSM: 120,
        Size: 'A3',
        Brand: 'Century',
        Color: 'Cream',
        Unit: 'sheet',
        OpeningStock: 200,
        StockIn: 100,
        StockOut: 30,
        Remark: 'Art supplies'
      }
    ];

    const ws = XLSX.utils.json_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Stock Template');
    XLSX.writeFile(wb, 'Stock_Import_Template.xlsx');
  };

  const handleClose = () => {
    setFile(null);
    setErrors([]);
    setValidData([]);
    setShowResults(false);
    setIsLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            Import Stock Items
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {!showResults && !isLoading && (
            <div className="space-y-6">
              {/* Download Template */}
              <div className="text-center">
                <Button
                  onClick={downloadTemplate}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Excel Template
                </Button>
                <p className="text-sm text-gray-600 mt-2">
                  Download template with sample data and correct format
                </p>
              </div>

              {/* File Upload */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Upload Excel or CSV File
                </h3>
                <input
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="inline-flex items-center px-6 py-3 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
                >
                  Choose File
                </label>
                {file && (
                  <p className="mt-3 text-sm text-gray-600">
                    Selected: {file.name}
                  </p>
                )}
              </div>

              {/* Requirements */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">
                  Required Columns:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {requiredColumns.map(col => (
                    <span
                      key={col}
                      className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded"
                    >
                      {col}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  • Date format: YYYY-MM-DD (e.g., 2024-01-15)<br/>
                  • Unit must be: ream, sheet, or kg<br/>
                  • Numbers should be positive integers<br/>
                  • Duplicate records (same ItemCode + Date) will be automatically skipped
                </p>
              </div>
            </div>
          )}

          {isLoading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Processing file...</p>
            </div>
          )}

          {showResults && !isLoading && (
            <div className="space-y-4">
              {/* Results Summary */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <CheckCircle className="w-6 h-6 text-green-600 mr-2" />
                    <div>
                      <p className="text-sm font-medium text-green-900">Valid Records</p>
                      <p className="text-xl font-bold text-green-600">{validData.length}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <AlertCircle className="w-6 h-6 text-red-600 mr-2" />
                    <div>
                      <p className="text-sm font-medium text-red-900">Errors</p>
                      <p className="text-xl font-bold text-red-600">{errors.length}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Errors */}
              {errors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-red-900 mb-2">
                    Validation Errors:
                  </h4>
                  <div className="max-h-32 overflow-y-auto">
                    {errors.slice(0, 10).map((error, index) => (
                      <p key={index} className="text-sm text-red-700">
                        • {error}
                      </p>
                    ))}
                    {errors.length > 10 && (
                      <p className="text-sm text-red-600 mt-2">
                        ... and {errors.length - 10} more errors
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t bg-gray-50">
          <div>
            {showResults && validData.length > 0 && (
              <p className="text-sm text-gray-600">
                Ready to import {validData.length} valid records
              </p>
            )}
          </div>
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            {showResults && validData.length > 0 && (
              <Button
                onClick={handleImport}
                disabled={isLoading}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {isLoading ? 'Importing...' : `Import ${validData.length} Items`}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleStockImport;