/**
 * Utility functions for CSV import functionality
 */

/**
 * Validates CSV headers against expected format
 * @param {string[]} headers - Array of header strings from CSV
 * @returns {string[]} - Array of missing headers
 */
export const validateCSVHeaders = (headers) => {
  const expectedHeaders = ['date', 'sheet', 'item', 'qty', 'unit', 'remark'];
  const normalizedHeaders = headers.map(h => h.trim().toLowerCase());
  return expectedHeaders.filter(h => !normalizedHeaders.includes(h));
};

/**
 * Validates a single row of CSV data
 * @param {Object} row - Row data object
 * @param {number} rowNumber - Row number for error reporting
 * @returns {Object} - { isValid: boolean, errors: string[] }
 */
export const validateCSVRow = (row, rowNumber) => {
  const errors = [];

  // Validate required fields
  if (!row.date || !row.item) {
    errors.push(`Row ${rowNumber}: Date and Item are required`);
  }

  // Validate date format
  if (row.date) {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(row.date)) {
      errors.push(`Row ${rowNumber}: Date must be in YYYY-MM-DD format`);
    }
  }

  // Validate quantity is a number
  if (row.qty && isNaN(parseFloat(row.qty))) {
    errors.push(`Row ${rowNumber}: Quantity must be a valid number`);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Parses CSV text content into structured data
 * @param {string} csvText - Raw CSV text content
 * @returns {Object} - { data: Array, errors: Array }
 */
export const parseCSVContent = (csvText) => {
  const lines = csvText.split('\n').filter(line => line.trim());
  
  if (lines.length < 2) {
    return {
      data: [],
      errors: ['CSV file must contain at least a header row and one data row']
    };
  }

  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
  const missingHeaders = validateCSVHeaders(headers);
  
  if (missingHeaders.length > 0) {
    return {
      data: [],
      errors: [`Missing required columns: ${missingHeaders.join(', ')}\nExpected columns: Date, Sheet, Item, Qty, Unit, Remark`]
    };
  }

  const data = [];
  const errors = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim());
    
    if (values.length !== headers.length) {
      errors.push(`Row ${i + 1}: Column count mismatch`);
      continue;
    }

    const row = {};
    headers.forEach((header, index) => {
      row[header] = values[index];
    });

    const validation = validateCSVRow(row, i + 1);
    if (!validation.isValid) {
      errors.push(...validation.errors);
      continue;
    }

    data.push({
      consumptionDate: row.date,
      sheet: row.sheet || '',
      consumptionItem: row.item,
      qty: row.qty ? parseFloat(row.qty) : 0,
      unit: row.unit || '',
      remark: row.remark || '',
      rowNumber: i + 1
    });
  }

  return { data, errors };
};

/**
 * Generates and downloads a CSV template file
 */
export const downloadCSVTemplate = () => {
  const template = [
    ['Date', 'Sheet', 'Item', 'Qty', 'Unit', 'Remark'],
    ['2024-01-15', 'Sheet001', 'Sample Item', '10', 'pcs', 'Sample remark'],
    ['2024-01-16', 'Sheet002', 'Another Item', '5.5', 'kg', ''],
    ['2024-01-17', 'Sheet003', 'Test Item', '2.25', 'liters', 'Optional remark'],
  ]
    .map((row) => row.join(','))
    .join('\n');

  const blob = new Blob([template], { type: 'text/csv;charset=utf-8;' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'consumables_template.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

/**
 * Validates file type and size
 * @param {File} file - File object to validate
 * @returns {Object} - { isValid: boolean, error: string }
 */
export const validateImportFile = (file) => {
  if (!file) {
    return { isValid: false, error: 'No file selected' };
  }

  if (file.type !== 'text/csv') {
    return { isValid: false, error: 'Please select a valid CSV file' };
  }

  // Check file size (limit to 5MB)
  const maxSize = 5 * 1024 * 1024; // 5MB in bytes
  if (file.size > maxSize) {
    return { isValid: false, error: 'File size must be less than 5MB' };
  }

  return { isValid: true, error: null };
};

/**
 * Formats import results for display
 * @param {number} successCount - Number of successful imports
 * @param {number} errorCount - Number of failed imports
 * @returns {string} - Formatted result message
 */
export const formatImportResults = (successCount, errorCount) => {
  const total = successCount + errorCount;
  let message = `Import completed!\n`;
  message += `Total records processed: ${total}\n`;
  message += `Successful: ${successCount}\n`;
  message += `Failed: ${errorCount}`;
  
  if (errorCount > 0) {
    message += `\n\nPlease check the console for detailed error information.`;
  }
  
  return message;
};

/**
 * CSV format requirements for display
 */
export const CSV_FORMAT_REQUIREMENTS = {
  requiredColumns: ['Date', 'Sheet', 'Item', 'Qty', 'Unit', 'Remark'],
  dateFormat: 'YYYY-MM-DD (e.g., 2024-01-15)',
  requiredFields: 'Date and Item are mandatory',
  quantityFormat: 'Must be a valid number (decimals allowed)',
  maxFileSize: '5MB',
  supportedFormats: ['.csv']
};