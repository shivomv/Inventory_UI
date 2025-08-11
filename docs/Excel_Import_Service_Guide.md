# Excel Import Service for C# Stockitem Model

## Overview
This comprehensive Excel Import Service is specifically designed to work with your C# `Stockitem` model, providing seamless data import with full validation and error handling.

## C# Model Structure
```csharp
namespace InventoryManagement.Models
{
    public class Stockitem
    {
        public int Id { get; set; }                // Auto-generated
        public DateTime Date { get; set; }         // Required
        public string ItemCode { get; set; }       // Required
        public string ItemName { get; set; }       // Required
        public string Description { get; set; }    // Optional
        public int GSM { get; set; }              // Optional (default: 0)
        public string Size { get; set; }          // Optional
        public string Brand { get; set; }         // Optional
        public string Color { get; set; }         // Optional
        public string Unit { get; set; }          // Required (ream/sheet/kg)
        public int OpeningStock { get; set; }     // Optional (default: 0)
        public int StockIn { get; set; }          // Optional (default: 0)
        public int StockOut { get; set; }         // Optional (default: 0)
        public int ClosingStock { get; set; }     // Auto-calculated
        public string Remark { get; set; }        // Optional
    }
}
```

## Features

### 🎯 **Perfect C# Model Alignment**
- **Exact Field Mapping**: All 15 properties from your C# model
- **Data Type Validation**: Proper validation for `DateTime`, `int`, and `string` types
- **Required Field Enforcement**: Validates all required fields
- **Auto-Calculation**: ClosingStock = OpeningStock + StockIn - StockOut
- **String Length Validation**: Respects C# model constraints

### 📊 **Advanced Excel Processing**
- **Multi-Format Support**: Excel (.xlsx, .xls) and CSV files
- **Intelligent Parsing**: Handles various date formats and number formats
- **Error Recovery**: Continues processing even with some invalid rows
- **Preview System**: Shows first 5 rows before import

### 🔍 **Comprehensive Validation**
- **Field-Level Validation**: Each field validated according to C# type
- **Business Rule Validation**: Unit must be 'ream', 'sheet', or 'kg'
- **Data Integrity**: Ensures all imported data matches model constraints
- **Detailed Error Reporting**: Specific error messages with row numbers

### 📋 **Professional Templates**
- **Multi-Sheet Excel Template**: 
  - Data sheet with sample records
  - Instructions sheet with field specifications
  - C# Model reference sheet
- **CSV Template**: Simple CSV format for basic imports
- **Sample Data**: Realistic examples for each field type

## Import Process

### Step 1: Access Import Service
1. Navigate to Stock Register page
2. Click "Import Excel/CSV" button
3. Import service modal opens

### Step 2: Download Template
1. Choose between Excel or CSV template
2. Excel template includes:
   - Sample data (3 realistic records)
   - Field instructions and validation rules
   - C# model reference
3. CSV template provides simple format

### Step 3: Prepare Your Data
1. Open the downloaded template
2. Replace sample data with your actual data
3. Follow the validation rules:
   - **Date**: YYYY-MM-DD format (e.g., 2024-01-15)
   - **ItemCode**: Unique text identifier (max 50 chars)
   - **ItemName**: Item display name (max 100 chars)
   - **Unit**: Must be exactly 'ream', 'sheet', or 'kg'
   - **Numbers**: Positive integers only
   - **Strings**: Respect maximum length limits

### Step 4: Upload and Validate
1. Upload your prepared file
2. System performs comprehensive validation:
   - Column structure validation
   - Data type validation
   - Business rule validation
   - Field length validation
3. View validation results:
   - Total rows processed
   - Valid records count
   - Error count with details

### Step 5: Review and Import
1. Review validation summary
2. Check data preview (first 5 rows)
3. Fix any errors if needed
4. Click "Import X Items" to proceed
5. System imports valid records to database

## Validation Rules

### Required Fields
| Field | Type | Validation | Example |
|-------|------|------------|---------|
| Date | DateTime | Valid date format | 2024-01-15 |
| ItemCode | string | Non-empty, max 50 chars | PAPER001 |
| ItemName | string | Non-empty, max 100 chars | A4 Copy Paper |
| Unit | string | Must be: ream/sheet/kg | ream |

### Optional Fields
| Field | Type | Default | Validation | Example |
|-------|------|---------|------------|---------|
| Description | string | null | Max 500 chars | High quality paper |
| GSM | int | 0 | Positive integer | 80 |
| Size | string | null | Max 50 chars | A4 |
| Brand | string | null | Max 50 chars | JK Paper |
| Color | string | null | Max 30 chars | White |
| OpeningStock | int | 0 | Positive integer | 100 |
| StockIn | int | 0 | Positive integer | 50 |
| StockOut | int | 0 | Positive integer | 20 |
| Remark | string | null | Max 200 chars | Initial stock |

### Auto-Generated/Calculated Fields
- **Id**: Auto-generated by database (don't include in import)
- **ClosingStock**: Auto-calculated as OpeningStock + StockIn - StockOut

## Error Handling

### Common Validation Errors
1. **Missing Required Columns**: Template columns not found
2. **Empty Required Fields**: Required fields left blank
3. **Invalid Data Types**: Wrong data type for field
4. **Invalid Unit Values**: Unit not in allowed list
5. **Invalid Date Format**: Date not in YYYY-MM-DD format
6. **Negative Numbers**: Stock quantities cannot be negative
7. **String Length Exceeded**: Text fields too long

### Error Resolution Guide
- **Column Errors**: Use exact template column names
- **Required Field Errors**: Fill all required fields
- **Unit Errors**: Use only 'ream', 'sheet', or 'kg' (lowercase)
- **Date Errors**: Use YYYY-MM-DD format
- **Number Errors**: Use positive integers only
- **Length Errors**: Trim text to fit field limits

## Sample Data

### Excel Template Sample
```
Date        | ItemCode | ItemName      | Description           | GSM | Size | Brand     | Color | Unit  | OpeningStock | StockIn | StockOut | Remark
2024-01-15  | PAPER001 | A4 Copy Paper | High quality paper    | 80  | A4   | JK Paper  | White | ream  | 100          | 50      | 20       | Initial stock
2024-01-16  | PAPER002 | A3 Art Paper  | Premium art paper     | 120 | A3   | Century   | Cream | sheet | 200          | 100     | 30       | Art department
2024-01-17  | CARD001  | Business Card | Heavy cardstock       | 300 | 3.5x2| Premium   | White | kg    | 50           | 25      | 10       | Marketing
```

### CSV Format Sample
```csv
Date,ItemCode,ItemName,Description,GSM,Size,Brand,Color,Unit,OpeningStock,StockIn,StockOut,Remark
2024-01-15,PAPER001,A4 Copy Paper,High quality paper,80,A4,JK Paper,White,ream,100,50,20,Initial stock
2024-01-16,PAPER002,A3 Art Paper,Premium art paper,120,A3,Century,Cream,sheet,200,100,30,Art department
```

## Technical Implementation

### Data Processing Flow
1. **File Upload**: Accept Excel/CSV files
2. **Parsing**: Extract data using xlsx/papaparse libraries
3. **Validation**: Validate against C# model structure
4. **Transformation**: Convert data to match API format
5. **Import**: Bulk insert via API calls
6. **Feedback**: Provide detailed results

### API Integration
```javascript
// Data transformation for C# model
const processedData = importData.map(item => ({
  date: item.Date,                    // DateTime
  itemCode: item.ItemCode,            // string
  itemName: item.ItemName,            // string
  description: item.Description || '', // string
  gsm: parseInt(item.GSM) || 0,       // int
  size: item.Size || '',              // string
  brand: item.Brand || '',            // string
  color: item.Color || '',            // string
  unit: item.Unit,                    // string
  openingStock: parseInt(item.OpeningStock) || 0, // int
  stockIn: parseInt(item.StockIn) || 0,           // int
  stockOut: parseInt(item.StockOut) || 0,         // int
  closingStock: parseInt(item.ClosingStock) || 0, // int (calculated)
  remark: item.Remark || ''           // string
}));
```

## Best Practices

### Data Preparation
1. **Use Templates**: Always start with downloaded templates
2. **Validate Data**: Check data before upload
3. **Test Small Batches**: Import small sets first
4. **Backup Data**: Keep original files as backup
5. **Clean Data**: Remove extra spaces and special characters

### Import Strategy
1. **Start Small**: Test with 5-10 records first
2. **Batch Processing**: For large datasets, use multiple smaller imports
3. **Error Resolution**: Fix errors before retrying
4. **Verification**: Check imported data in the table
5. **Documentation**: Keep track of import activities

## Troubleshooting

### File Issues
- **File Not Recognized**: Check file extension (.xlsx, .xls, .csv)
- **Parsing Errors**: Re-save file in correct format
- **Large Files**: Break into smaller batches

### Validation Issues
- **Column Mismatch**: Use exact template column names
- **Data Type Errors**: Check number/date formats
- **Required Field Errors**: Fill all required fields
- **Unit Validation**: Use only allowed unit values

### Import Failures
- **Network Issues**: Check connection and retry
- **Server Errors**: Contact system administrator
- **Permission Issues**: Verify import permissions
- **Duplicate Data**: Check for duplicate ItemCodes

## Support

For technical support:
1. Check this documentation
2. Verify data matches C# model structure
3. Use provided templates
4. Review error messages carefully
5. Contact system administrator if issues persist

---

**Note**: This Excel Import Service is specifically designed for the C# `Stockitem` model and provides comprehensive validation to ensure data integrity and compatibility.