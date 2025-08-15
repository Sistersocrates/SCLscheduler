import React, { useState, useRef } from 'react';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { UploadCloud, DownloadCloud, DatabaseZap, FileText, User, AlertTriangle, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const DataManagementView = () => {
  const fileInputRef = useRef(null);
  const [parsedData, setParsedData] = useState(null);
  const [fileName, setFileName] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [importResults, setImportResults] = useState(null);

  const handleImportClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    if (file.type !== 'text/csv') {
      toast.error('Please select a CSV file.');
      return;
    }

    setFileName(file.name);
    setImportResults(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const rows = text.split('\\n').filter(row => row.trim() !== '');
      if (rows.length < 2) {
        toast.error('CSV file must have a header row and at least one data row.');
        return;
      }
      const headers = rows.shift().split(',').map(h => h.trim());
      const data = rows.map(row => {
        const values = row.split(',').map(v => v.trim());
        return headers.reduce((obj, header, i) => {
          obj[header] = values[i];
          return obj;
        }, {});
      });
      setParsedData(data);
    };
    reader.readAsText(file);
  };

  const handleProcessImport = async () => {
    if (!parsedData) {
      toast.error('No data to import.');
      return;
    }
    setIsImporting(true);
    setImportResults(null);
    const toastId = toast.loading(`Importing ${parsedData.length} users...`);

    try {
        const functions = getFunctions();
        const bulkCreateUsers = httpsCallable(functions, 'bulkCreateUsers');
        const result = await bulkCreateUsers({ users: parsedData });

        const responseData = result.data;
        setImportResults(responseData);

        if (responseData.errorCount > 0) {
            toast.error(`Import complete with ${responseData.errorCount} errors.`, { id: toastId });
        } else {
            toast.success(`Import complete! ${responseData.successCount} users created.`, { id: toastId });
        }
    } catch (error) {
        console.error('Error importing users:', error);
        toast.error(error.message || 'Failed to import users.', { id: toastId });
    } finally {
        setIsImporting(false);
    }
  };

  const handleExport = () => console.log("Trigger Export (Placeholder)");
  const handleCleanup = () => console.log("Trigger Cleanup (Placeholder)");

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        <div className="bg-slate-800/60 border-slate-700 text-slate-200 rounded-lg">
            <div className="p-6">
                <h3 className="flex items-center text-xl font-semibold">
                    <DatabaseZap className="mr-3 h-6 w-6 text-yellow-400" />
                    Data Management Tools
                </h3>
            </div>
            <div className="p-6 space-y-6">
                <p className="text-slate-400">Tools for importing, exporting, and managing system data.</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button onClick={handleImportClick} className="bg-sky-500 hover:bg-sky-600 text-white py-6 text-base rounded-md inline-flex items-center justify-center">
                        <UploadCloud className="mr-2 h-5 w-5" /> Select CSV to Import
                    </button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        accept=".csv"
                    />
                    <button onClick={handleExport} className="bg-emerald-500 hover:bg-emerald-600 text-white py-6 text-base rounded-md inline-flex items-center justify-center">
                        <DownloadCloud className="mr-2 h-5 w-5" /> Export Data
                    </button>
                    <button onClick={handleCleanup} className="bg-red-600 hover:bg-red-700 text-white py-6 text-base rounded-md">
                        System Cleanup (Placeholder)
                    </button>
                </div>
            </div>
        </div>

        {parsedData && !importResults && (
            <div className="bg-slate-800/60 border-slate-700 text-slate-200 rounded-lg">
                <div className="p-6">
                    <h3 className="flex items-center text-xl font-semibold">
                        <FileText className="mr-3 h-6 w-6 text-sky-400" />
                        Import Preview
                    </h3>
                </div>
                <div className="p-6">
                    <p className="text-slate-400 mb-4">
                        Found {parsedData.length} records in <span className="font-semibold text-sky-300">{fileName}</span>.
                    </p>
                    <div className="max-h-60 overflow-y-auto bg-slate-900/50 p-4 rounded-md">
                        {parsedData.slice(0, 5).map((user, index) => (
                            <div key={index} className="flex items-center space-x-3 p-2 border-b border-slate-700 last:border-b-0">
                                <User className="h-4 w-4 text-slate-400" />
                                <span className="text-sm text-slate-300 font-mono">{user.email}</span>
                                <span className="text-xs px-2 py-1 bg-slate-700 rounded-full">{user.role}</span>
                            </div>
                        ))}
                        {parsedData.length > 5 && <p className="text-center text-sm text-slate-400 mt-2">...and {parsedData.length - 5} more rows.</p>}
                    </div>
                    <div className="mt-6">
                        <button onClick={handleProcessImport} disabled={isImporting} className="w-full bg-green-600 hover:bg-green-700 text-white py-4 text-base rounded-md inline-flex items-center justify-center disabled:opacity-50">
                            {isImporting ? 'Importing...' : `Process Import of ${parsedData.length} Users`}
                        </button>
                    </div>
                </div>
            </div>
        )}

        {importResults && (
            <div className="bg-slate-800/60 border-slate-700 text-slate-200 rounded-lg">
                <div className="p-6">
                    <h3 className="flex items-center text-xl font-semibold">
                        <CheckCircle className="mr-3 h-6 w-6 text-green-400" />
                        Import Results
                    </h3>
                </div>
                <div className="p-6">
                    <div className="flex space-x-4">
                        <div className="flex-1 text-center p-4 bg-green-900/50 rounded-lg">
                            <p className="text-3xl font-bold text-green-300">{importResults.successCount}</p>
                            <p className="text-sm text-green-400">Users Created</p>
                        </div>
                        <div className="flex-1 text-center p-4 bg-red-900/50 rounded-lg">
                            <p className="text-3xl font-bold text-red-300">{importResults.errorCount}</p>
                            <p className="text-sm text-red-400">Errors</p>
                        </div>
                    </div>
                    {importResults.errors.length > 0 && (
                        <div className="mt-4">
                            <h4 className="font-semibold text-red-300">Error Details:</h4>
                            <div className="max-h-40 overflow-y-auto mt-2 space-y-2 bg-slate-900/50 p-4 rounded-md">
                                {importResults.errors.map((err, index) => (
                                    <div key={index} className="flex items-start space-x-3 text-sm">
                                        <AlertTriangle className="h-4 w-4 text-red-400 flex-shrink-0 mt-0.5" />
                                        <p className="text-slate-300">
                                            Row {err.row}: <span className="font-mono">{err.email}</span> - <span className="text-red-400">{err.error}</span>
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        )}
    </motion.div>
  );
};

export default DataManagementView;
