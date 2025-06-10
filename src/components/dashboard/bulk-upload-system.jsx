import React, { useState } from 'react';
import { Upload, FileSpreadsheet, Download, Save, X, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';
import * as XLSX from 'xlsx';

const BulkUploadSystem = () => {
  const [bulkTasks, setBulkTasks] = useState([]);
  const [fileName, setFileName] = useState('');
  const [validationErrors, setValidationErrors] = useState([]);
  const [isValidated, setIsValidated] = useState(false);
  const [editingCell, setEditingCell] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Required columns mapping
  const requiredColumns = {
    'title': ['title', 'task title', 'task name', 'name'],
    'state': ['state', 'province', 'region'],
    'city': ['city', 'town', 'location'],
    'employeeType': ['employee type', 'type', 'role', 'job type'],
    'assignedTo': ['assigned to', 'assignee', 'employee', 'worker'],
    'priority': ['priority', 'importance', 'urgency'],
    'description': ['description', 'details', 'info', 'notes']
  };

  const priorityValues = ['low', 'medium', 'high', 'critical'];

  const downloadTemplate = () => {
    const templateData = [
      {
        'Title': 'Sample Task 1',
        'State': 'California',
        'City': 'San Francisco',
        'Employee Type': 'Software Engineer',
        'Assigned To': 'John Doe',
        'Priority': 'high',
        'Description': 'Sample task description'
      },
      {
        'Title': 'Sample Task 2',
        'State': 'New York',
        'City': 'New York City',
        'Employee Type': 'Project Manager',
        'Assigned To': 'Jane Smith',
        'Priority': 'medium',
        'Description': 'Another sample task'
      }
    ];

    const ws = XLSX.utils.json_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Tasks Template');
    XLSX.writeFile(wb, 'task_upload_template.xlsx');
  };

  const mapColumnName = (columnName) => {
    const normalizedColumn = columnName.toLowerCase().trim();
    
    for (const [requiredField, alternatives] of Object.entries(requiredColumns)) {
      if (alternatives.includes(normalizedColumn)) {
        return requiredField;
      }
    }
    return null;
  };

  const validateData = (data) => {
    const errors = [];
    const validatedTasks = [];

    data.forEach((row, index) => {
      const rowNumber = index + 2; // +2 because Excel starts from 1 and we skip header
      const task = {
        id: `bulk-${Date.now()}-${index}`,
        serialNumber: `TSK-${String(index + 1).padStart(3, '0')}`,
        status: 'pending',
        acceptedBy: null,
        poc: 'System Admin'
      };

      // Map and validate each required field
      Object.keys(requiredColumns).forEach(field => {
        const value = row[field];
        
        if (!value || value.toString().trim() === '') {
          if (field !== 'description') { // description is optional
            errors.push(`Row ${rowNumber}: Missing ${field}`);
          }
          task[field] = field === 'description' ? '' : '';
        } else {
          task[field] = value.toString().trim();
        }
      });

      // Validate priority
      if (task.priority && !priorityValues.includes(task.priority.toLowerCase())) {
        errors.push(`Row ${rowNumber}: Priority must be one of: ${priorityValues.join(', ')}`);
        task.priority = 'medium'; // default value
      } else if (task.priority) {
        task.priority = task.priority.toLowerCase();
      }

      // Add address (can be generated from city and state)
      task.address = `${task.city}, ${task.state}`;

      validatedTasks.push(task);
    });

    return { errors, validatedTasks };
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsProcessing(true);
    setFileName(file.name);
    setValidationErrors([]);
    setIsValidated(false);
    setBulkTasks([]);

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      if (jsonData.length === 0) {
        setValidationErrors(['The Excel file appears to be empty or has no data rows.']);
        setIsProcessing(false);
        return;
      }

      // Map column headers to our required fields
      const headers = Object.keys(jsonData[0]);
      const mappedData = jsonData.map(row => {
        const mappedRow = {};
        headers.forEach(header => {
          const mappedField = mapColumnName(header);
          if (mappedField) {
            mappedRow[mappedField] = row[header];
          }
        });
        return mappedRow;
      });

      // Check if we have the minimum required columns
      const foundFields = Object.keys(requiredColumns).filter(field => 
        mappedData.some(row => row[field] !== undefined)
      );

      const missingFields = Object.keys(requiredColumns).filter(field => 
        field !== 'description' && !foundFields.includes(field)
      );

      if (missingFields.length > 0) {
        const suggestions = missingFields.map(field => 
          `${field}: try columns like ${requiredColumns[field].join(', ')}`
        );
        setValidationErrors([
          'Missing required columns in your Excel file:',
          ...suggestions,
          '',
          'Please ensure your Excel file has the required columns or download our template.'
        ]);
        setIsProcessing(false);
        return;
      }

      // Validate the data
      const { errors, validatedTasks } = validateData(mappedData);
      
      if (errors.length > 0) {
        setValidationErrors(errors);
      } else {
        setIsValidated(true);
      }

      setBulkTasks(validatedTasks);
    } catch (error) {
      setValidationErrors(['Error reading Excel file. Please ensure it\'s a valid .xlsx or .xls file.']);
    }

    setIsProcessing(false);
  };

  const startEditing = (taskId, field, value) => {
    setEditingCell(`${taskId}-${field}`);
    setEditValue(value);
  };

  const saveEdit = (taskId, field) => {
    setBulkTasks(tasks => 
      tasks.map(task => 
        task.id === taskId 
          ? { ...task, [field]: editValue }
          : task
      )
    );
    setEditingCell(null);
    setEditValue('');
  };

  const removeBulkTask = (taskId) => {
    setBulkTasks(tasks => tasks.filter(task => task.id !== taskId));
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-blue-100 text-blue-800',
      high: 'bg-orange-100 text-orange-800',
      critical: 'bg-red-100 text-red-800'
    };
    return colors[priority] || 'bg-gray-100 text-gray-800';
  };

  const uploadBulkTasks = () => {
    // Here you would typically send the data to your backend
    console.log('Uploading tasks:', bulkTasks);
    alert(`Successfully uploaded ${bulkTasks.length} tasks!`);
    setBulkTasks([]);
    setFileName('');
    setValidationErrors([]);
    setIsValidated(false);
  };

  const resetUpload = () => {
    setBulkTasks([]);
    setFileName('');
    setValidationErrors([]);
    setIsValidated(false);
    setIsProcessing(false);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Upload Section */}
      <div className="bg-white border border-gray-200 shadow-lg rounded-lg">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold flex items-center">
            <Upload className="h-5 w-5 mr-2" />
            Upload Tasks in Bulk
          </h2>
          <p className="text-gray-600 mt-1">
            Choose an Excel file to upload multiple tasks at once
          </p>
        </div>
        <div className="p-6">
          <div className="flex items-center space-x-4">
            <label className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition-colors">
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              {fileName ? 'Choose Different File' : 'Choose Excel File'}
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
            <button
              onClick={downloadTemplate}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Download className="h-4 w-4 mr-2" />
              Download Template
            </button>
            {fileName && (
              <button
                onClick={resetUpload}
                className="flex items-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset
              </button>
            )}
          </div>
          {fileName && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Selected file:</strong> {fileName}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Processing Indicator */}
      {isProcessing && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <RefreshCw className="h-5 w-5 text-blue-600 animate-spin mr-2" />
            <span className="text-blue-800">Processing Excel file...</span>
          </div>
        </div>
      )}

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 mr-2 flex-shrink-0" />
            <div>
              <h3 className="text-red-800 font-medium">Validation Issues Found</h3>
              <ul className="mt-2 text-sm text-red-700 space-y-1">
                {validationErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Success Message */}
      {isValidated && validationErrors.length === 0 && bulkTasks.length > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
            <span className="text-green-800">
              Excel file validated successfully! {bulkTasks.length} tasks ready for upload.
            </span>
          </div>
        </div>
      )}

      {/* Preview Table */}
      {bulkTasks.length > 0 && (
        <div className="bg-white border border-gray-200 shadow-lg rounded-lg">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold">Preview Uploaded Tasks</h3>
            <p className="text-gray-600 mt-1">
              Review and edit the tasks before uploading. Click on any cell to edit.
            </p>
          </div>
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-200 rounded-lg">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S.No</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">State</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">City</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee Type</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned To</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {bulkTasks.map((task, index) => (
                    <tr key={task.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">{task.serialNumber}</td>
                      <td className="px-4 py-3 text-sm">
                        {editingCell === `${task.id}-title` ? (
                          <div className="flex items-center space-x-2">
                            <input
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              className="h-8 px-2 border border-gray-300 rounded"
                            />
                            <button
                              onClick={() => saveEdit(task.id, 'title')}
                              className="h-8 w-8 p-0 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                              <Save className="h-4 w-4 mx-auto" />
                            </button>
                          </div>
                        ) : (
                          <span
                            className="cursor-pointer hover:bg-blue-50 px-2 py-1 rounded"
                            onClick={() => startEditing(task.id, 'title', task.title)}
                          >
                            {task.title || 'Click to edit'}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {editingCell === `${task.id}-state` ? (
                          <div className="flex items-center space-x-2">
                            <input
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              className="h-8 px-2 border border-gray-300 rounded"
                            />
                            <button
                              onClick={() => saveEdit(task.id, 'state')}
                              className="h-8 w-8 p-0 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                              <Save className="h-4 w-4 mx-auto" />
                            </button>
                          </div>
                        ) : (
                          <span
                            className="cursor-pointer hover:bg-blue-50 px-2 py-1 rounded"
                            onClick={() => startEditing(task.id, 'state', task.state)}
                          >
                            {task.state || 'Click to edit'}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {editingCell === `${task.id}-city` ? (
                          <div className="flex items-center space-x-2">
                            <input
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              className="h-8 px-2 border border-gray-300 rounded"
                            />
                            <button
                              onClick={() => saveEdit(task.id, 'city')}
                              className="h-8 w-8 p-0 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                              <Save className="h-4 w-4 mx-auto" />
                            </button>
                          </div>
                        ) : (
                          <span
                            className="cursor-pointer hover:bg-blue-50 px-2 py-1 rounded"
                            onClick={() => startEditing(task.id, 'city', task.city)}
                          >
                            {task.city || 'Click to edit'}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">{task.employeeType}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{task.assignedTo}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => removeBulkTask(task.id)}
                          className="h-8 w-8 hover:bg-red-100 rounded"
                        >
                          <X className="h-4 w-4 text-red-600 mx-auto" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Action Buttons */}
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={resetUpload}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              {isValidated && validationErrors.length === 0 && (
                <button
                  onClick={uploadBulkTasks}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                  Upload {bulkTasks.length} Tasks
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BulkUploadSystem;