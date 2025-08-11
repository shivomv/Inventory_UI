import { useState, useRef } from 'react';
import { apiService } from '../../services/api';
import { useToast } from '../../contexts/ToastContext';
import { 
  parseCSVContent, 
  validateImportFile, 
  downloadCSVTemplate 
} from './importUtils';

/**
 * Custom hook for handling CSV import functionality
 * @param {Function} onImportSuccess - Callback function called after successful import
 * @param {Function} onModalClose - Callback function to close the modal
 * @returns {Object} - Import state and functions
 */
export const useImport = (onImportSuccess, onModalClose) => {
  const [importFile, setImportFile] = useState(null);
  const [importPreview, setImportPreview] = useState([]);
  const [importLoading, setImportLoading] = useState(false);
  const [importErrors, setImportErrors] = useState([]);
  const fileInputRef = useRef(null);
  const { showSuccess, showError, showInfo } = useToast();

  /**
   * Handles file selection and validation
   */
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    const validation = validateImportFile(file);

    if (!validation.isValid) {
      showError(validation.error);
      if (event.target) {
        event.target.value = '';
      }
      return;
    }

    setImportFile(file);
    parseCSVFile(file);
  };

  /**
   * Parses the selected CSV file
   */
  const parseCSVFile = (file) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const csvText = e.target.result;
      const { data, errors } = parseCSVContent(csvText);
      
      if (errors.length > 0 && data.length === 0) {
        showError(errors[0]); // Show first critical error
        resetFileSelection();
        return;
      }

      setImportPreview(data);
      setImportErrors(errors);
    };

    reader.onerror = () => {
      showError('Error reading file. Please try again.');
      resetFileSelection();
    };

    reader.readAsText(file);
  };

  /**
   * Handles the import process
   */
  const handleImport = async () => {
    if (importPreview.length === 0) {
      showError('No valid data to import');
      return;
    }

    if (importErrors.length > 0) {
      const proceed = window.confirm(
        `There are ${importErrors.length} errors in the file. Do you want to import only the valid rows?`
      );
      if (!proceed) return;
    }

    setImportLoading(true);
    let successCount = 0;
    let errorCount = 0;
    const detailedErrors = [];

    try {
      for (const item of importPreview) {
        try {
          await apiService.createConsumption({
            consumptionDate: item.consumptionDate,
            sheet: item.sheet,
            consumptionItem: item.consumptionItem,
            qty: item.qty,
            unit: item.unit,
            remark: item.remark,
          });
          successCount++;
        } catch (err) {
          console.error(`Failed to import row ${item.rowNumber}:`, err);
          detailedErrors.push({
            row: item.rowNumber,
            item: item.consumptionItem,
            error: err.message || 'Unknown error'
          });
          errorCount++;
        }
      }

      // Log detailed errors for debugging
      if (detailedErrors.length > 0) {
        console.group('Import Errors Details:');
        detailedErrors.forEach(error => {
          console.error(`Row ${error.row} (${error.item}): ${error.error}`);
        });
        console.groupEnd();
      }

      // Show appropriate toast notifications
      if (successCount > 0 && errorCount === 0) {
        showSuccess(`Successfully imported ${successCount} records!`);
      } else if (successCount > 0 && errorCount > 0) {
        showInfo(`Import completed: ${successCount} successful, ${errorCount} failed. Check console for details.`, 6000);
      } else if (errorCount > 0) {
        showError(`Import failed: ${errorCount} records could not be imported. Check console for details.`, 6000);
      }
      
      if (successCount > 0) {
        onImportSuccess?.(); // Refresh the data in parent component
        
        // Close modal after successful import with a small delay to show the toast
        setTimeout(() => {
          resetImport();
          onModalClose?.();
        }, 1500);
      } else {
        resetImport();
      }
    } catch (err) {
      console.error('Import Error:', err);
      showError('Failed to import data. Please try again.');
    } finally {
      setImportLoading(false);
    }
  };

  /**
   * Resets file selection while keeping modal open
   */
  const resetFileSelection = () => {
    setImportFile(null);
    setImportPreview([]);
    setImportErrors([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  /**
   * Resets all import state
   */
  const resetImport = () => {
    resetFileSelection();
  };

  /**
   * Downloads CSV template
   */
  const handleDownloadTemplate = () => {
    downloadCSVTemplate();
  };

  return {
    // State
    importFile,
    importPreview,
    importLoading,
    importErrors,
    fileInputRef,
    
    // Actions
    handleFileSelect,
    handleImport,
    resetFileSelection,
    resetImport,
    handleDownloadTemplate,
    
    // Computed values
    hasValidData: importPreview.length > 0,
    hasErrors: importErrors.length > 0,
    canImport: importPreview.length > 0 && !importLoading,
  };
};