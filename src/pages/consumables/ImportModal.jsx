import React from 'react';
import { X, Upload, FileText, Download, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useImport } from './useImport';
import { CSV_FORMAT_REQUIREMENTS } from './importUtils';

const ImportModal = ({ isOpen, onClose, onImportSuccess }) => {
  const {
    importFile,
    importPreview,
    importLoading,
    importErrors,
    fileInputRef,
    handleFileSelect,
    handleImport,
    resetFileSelection,
    resetImport,
    handleDownloadTemplate,
    hasValidData,
    hasErrors,
    canImport,
  } = useImport(onImportSuccess, onClose);

  const handleModalClose = () => {
    resetImport();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl relative shadow-xl border border-gray-200 max-h-[85vh] overflow-y-auto">
        {/* Import Modal Header */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <Upload className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Import Consumables</h3>
                <p className="text-xs text-gray-500">Upload CSV file to import records</p>
              </div>
            </div>
            <button
              className="w-8 h-8 rounded-full hover:bg-gray-200 transition-colors flex items-center justify-center text-gray-400 hover:text-gray-600"
              onClick={handleModalClose}
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Import Modal Body */}
        <div className="px-6 py-4">
          {!importFile ? (
            <div className="space-y-4">

              
              {/* Template Download & Format Requirements */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Download className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-blue-800 mb-1">CSV Template</h4>
                    <p className="text-xs text-blue-600 mb-2">
                      Download template with correct format
                    </p>
                    <Button
                      variant="outline"
                      onClick={handleDownloadTemplate}
                      className="border-blue-300 text-blue-700 hover:bg-blue-50 text-xs px-3 py-1.5"
                    >
                      <Download size={12} className="mr-1" />
                      Download
                    </Button>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-blue-200">
                  <p className="text-xs text-blue-700">
                    <strong>Format:</strong> Date (YYYY-MM-DD), Sheet, Item, Qty, Unit, Remark
                  </p>
                </div>
              </div>
              {/* File Upload Section */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-400 transition-colors">
                <div className="space-y-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <FileText className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-800 mb-1">Upload CSV File</h4>
                    <p className="text-xs text-gray-500 mb-3">
                      Select a CSV file with consumption data
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".csv"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 text-sm"
                    >
                      <Upload size={14} className="mr-2" />
                      Choose File
                    </Button>
                  </div>
                </div>
              </div>

            </div>
          ) : (
            <div className="space-y-4">
              {/* File Info */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-green-800">{importFile.name}</p>
                    <p className="text-xs text-green-600">
                      {importPreview.length} valid records found
                    </p>
                  </div>
                </div>
              </div>

              {/* Errors Display */}
              {importErrors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-red-800 mb-1">
                        {importErrors.length} Error{importErrors.length > 1 ? 's' : ''}:
                      </p>
                      <div className="max-h-20 overflow-y-auto">
                        {importErrors.slice(0, 3).map((error, index) => (
                          <p key={index} className="text-xs text-red-600">• {error}</p>
                        ))}
                        {importErrors.length > 3 && (
                          <p className="text-xs text-red-500 mt-1">... and {importErrors.length - 3} more</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Preview Table */}
              {importPreview.length > 0 && (
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-3 py-2 border-b border-gray-200">
                    <h4 className="text-sm font-medium text-gray-800">Preview ({Math.min(3, importPreview.length)} of {importPreview.length})</h4>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                          <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">Sheet</th>
                          <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                          <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">Qty</th>
                          <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">Unit</th>
                          <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">Remark</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {importPreview.slice(0, 3).map((row, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-2 py-2 text-xs text-gray-900">{row.consumptionDate}</td>
                            <td className="px-2 py-2 text-xs text-gray-900">{row.sheet}</td>
                            <td className="px-2 py-2 text-xs text-gray-900 truncate max-w-24" title={row.consumptionItem}>{row.consumptionItem}</td>
                            <td className="px-2 py-2 text-xs text-gray-900">{row.qty}</td>
                            <td className="px-2 py-2 text-xs text-gray-900">{row.unit}</td>
                            <td className="px-2 py-2 text-xs text-gray-900 truncate max-w-20" title={row.remark}>{row.remark}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {importPreview.length > 3 && (
                    <div className="bg-gray-50 px-3 py-1 text-xs text-gray-600 text-center">
                      ... and {importPreview.length - 3} more records
                    </div>
                  )}
                </div>
              )}

              {/* Import Actions */}
              <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                <Button
                  variant="outline"
                  onClick={handleModalClose}
                  disabled={importLoading}
                  className="text-sm px-3 py-2"
                >
                  Cancel
                </Button>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={resetFileSelection}
                    disabled={importLoading}
                    className="text-sm px-3 py-2"
                  >
                    Change File
                  </Button>
                  <Button
                    onClick={handleImport}
                    disabled={!canImport}
                    className="bg-green-600 hover:bg-green-700 text-white text-sm px-3 py-2"
                  >
                    {importLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent mr-2"></div>
                        Importing...
                      </>
                    ) : (
                      <>
                        <Upload size={14} className="mr-2" />
                        Import {importPreview.length}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImportModal;