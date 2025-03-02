import React, { useState, useEffect } from 'react';
import SearchBar from '../components/SearchBar';
import { LabTest } from '../types';
import { Plus, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

// Mock API call function (adjust as needed)
const mockApiCall = (data: any) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Simulate success or failure randomly
            //const success = Math.random() > 0.2;
            //if (success) {
            resolve({ success: true, data: { ...data, id: Math.floor(Math.random() * 1000) } }); // Mock ID generation
            //} else {
            //reject({ success: false, message: 'API call failed' });
            //}
        }, 500); // Simulate network latency
    });
};

const LabTests = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [selectedTest, setSelectedTest] = useState<LabTest | null>(null);
    const [formData, setFormData] = useState<Partial<LabTest>>({
        patient_name: '',
        test_name: '',
        test_date: '',
        center: '',
        status: 'Pending'
    });
    const [reportFile, setReportFile] = useState<File | null>(null);
    const [labTests, setLabTests] = useState<LabTest[]>([]); // State to hold lab tests
    const [isLoading, setIsLoading] = useState(false); // Loading state
    const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [testToDelete, setTestToDelete] = useState<number | null>(null);
    const [reportUrl, setReportUrl] = useState<string | null>(null);

    // Load initial data (replace with your actual API call)
    useEffect(() => {
        // Mock data for initial load
        const initialData: LabTest[] = [
            {
                id: 1,
                patient_name: "John Doe",
                test_name: "Blood Test",
                test_date: "2024-03-15",
                center: "Central Lab",
                status: "Pending",
                report_url: null, // Changed
                report_name: "blood_test_report.pdf",
                report_file: null,

            },
            {
                id: 2,
                patient_name: "Jane Smith",
                test_name: "X-Ray",
                test_date: "2024-03-16",
                center: "Imaging Center",
                status: "Completed",
                report_url: null, // Changed
                report_name: "xray_report.pdf",
                report_file: null,
            }
        ];
        setLabTests(initialData);
    }, []);

    const filteredTests = labTests.filter(test =>
        test.patient_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        test.test_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Create a FormData object to send the file
        const formDataToSend = new FormData();
        for (const key in formData) {
            if (formData.hasOwnProperty(key) && formData[key]) {
                formDataToSend.append(key, formData[key] as string);
            }
        }
        if (reportFile) {
            formDataToSend.append('report', reportFile);
            formDataToSend.append('report_name', reportFile.name); //Store Report Name
        }

        try {
            let result;
            if (selectedTest) {
                // Simulate API update call
                result = await mockApiCall({ ...selectedTest, ...formData, report_file: reportFile });
            } else {
                // Simulate API create call
                result = await mockApiCall(formDataToSend); // Send FormData
            }

            if (result && result.success) {
                setMessage({ type: 'success', text: `Lab test ${selectedTest ? 'updated' : 'added'} successfully!` });

                setLabTests(prevTests => {
                    if (selectedTest) {
                        // Update existing test
                        return prevTests.map(test => test.id === selectedTest.id ? { ...test, ...formData, report_file: reportFile, report_name: reportFile?.name } : test);
                    } else {
                        // Add new test
                        return [...prevTests, { ...(formData as LabTest), id: result.data.id, report_file: reportFile, report_name: reportFile?.name }]; // Mock ID from API
                    }
                });

                setShowForm(false);
                setSelectedTest(null);
                setFormData({ patient_name: '', test_name: '', test_date: '', center: '', status: 'Pending' });
                setReportFile(null);
                setReportUrl(null);

            } else {
                setMessage({ type: 'error', text: 'Failed to save lab test. Please try again.' });
            }
        } catch (error: any) {
            console.error("Error saving lab test:", error);
            setMessage({ type: 'error', text: error.message || 'An unexpected error occurred.' });
        } finally {
            setIsLoading(false);
        }
    };

    const confirmDelete = (id: number) => {
        setTestToDelete(id);
        setShowConfirmationModal(true);
    };

    const handleDelete = async () => {
        setShowConfirmationModal(false);
        if (testToDelete === null) return;

        setIsLoading(true);
        try {
            // Simulate API delete call
            const result = await mockApiCall({ id: testToDelete });

            if (result && result.success) {
                setMessage({ type: 'success', text: 'Lab test deleted successfully!' });
                setLabTests(prevTests => prevTests.filter(test => test.id !== testToDelete));
            } else {
                setMessage({ type: 'error', text: 'Failed to delete lab test. Please try again.' });
            }
        } catch (error: any) {
            console.error("Error deleting lab test:", error);
            setMessage({ type: 'error', text: error.message || 'An unexpected error occurred.' });
        } finally {
            setIsLoading(false);
            setTestToDelete(null);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setReportFile(file);

            // Generate a local URL for preview (optional)
            const objectUrl = URL.createObjectURL(file);
            setReportUrl(objectUrl);

        } else {
            setReportFile(null);
            setReportUrl(null);
        }
    };

    const closeModal = () => {
        setShowForm(false);
        setSelectedTest(null);
        setFormData({ patient_name: '', test_name: '', test_date: '', center: '', status: 'Pending' });
        setReportFile(null);
        setReportUrl(null);
    };

    // Function to clear the message after a certain time
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                setMessage(null);
            }, 5000); // Clear message after 5 seconds
            return () => clearTimeout(timer); // Cleanup on unmount or message change
        }
    }, [message]);

    const handleViewReport = (test: LabTest) => {
        if (test.report_file) {
            // If report_file is already a File object, create a URL directly
            setReportUrl(URL.createObjectURL(test.report_file));
        }
        else if (test.report_name && !test.report_file) {
            setMessage({ type: 'error', text: 'File Not Available' });
            setReportUrl(null);
        }
        else if (reportUrl) {
            setReportUrl(reportUrl);
        }
        else {
            console.log('Report file not available');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Lab Tests</h1>
                <button
                    onClick={() => setShowForm(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    Add New Lab Test
                </button>
            </div>

            {/* Message display */}
            {message && (
                <div className={`p-4 rounded-md ${message.type === 'success' ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' : message.type === 'error' ? 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100' : 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100'} flex items-center gap-2`}>
                    {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : message.type === 'error' ? <XCircle className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                    {message.text}
                </div>
            )}

            {showForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full">
                        <h2 className="text-xl font-bold mb-4">{selectedTest ? 'Edit Lab Test' : 'New Lab Test'}</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Patient Name</label>
                                    <input
                                        type="text"
                                        value={formData.patient_name || ''}
                                        onChange={(e) => setFormData({ ...formData, patient_name: e.target.value })}
                                        className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Test Name</label>
                                    <input
                                        type="text"
                                        value={formData.test_name || ''}
                                        onChange={(e) => setFormData({ ...formData, test_name: e.target.value })}
                                        className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Test Date</label>
                                    <input
                                        type="date"
                                        value={formData.test_date || ''}
                                        onChange={(e) => setFormData({ ...formData, test_date: e.target.value })}
                                        className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Center</label>
                                    <input
                                        type="text"
                                        value={formData.center || ''}
                                        onChange={(e) => setFormData({ ...formData, center: e.target.value })}
                                        className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Status</label>
                                    <select
                                        value={formData.status || 'Pending'}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value as 'Pending' | 'Completed' })}
                                        className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                                        required
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="Completed">Completed</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Report File</label>
                                    <input
                                        type="file"
                                        onChange={handleFileChange}
                                        className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                                    />
                                    {reportFile && (
                                        <p className="text-sm text-gray-500 mt-1">
                                            Selected file: {reportFile.name}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className="flex justify-end gap-2 mt-4">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-4 py-2 text-gray-600 bg-gray-100 rounded hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Saving...' : (selectedTest ? 'Update Lab Test' : 'Add Lab Test')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Confirmation Modal */}
            {showConfirmationModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
                        <h2 className="text-lg font-bold mb-4">Confirm Delete</h2>
                        <p>Are you sure you want to delete this lab test?</p>
                        <div className="flex justify-end gap-2 mt-4">
                            <button
                                type="button"
                                onClick={() => setShowConfirmationModal(false)}
                                className="px-4 py-2 text-gray-600 bg-gray-100 rounded hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleDelete}
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Report Preview Modal */}
            {reportUrl && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-4xl w-full">
                        <h2 className="text-lg font-bold mb-4">Report Preview</h2>
                        {reportUrl ? (
                            <iframe src={reportUrl} title="Report Preview" width="100%" height="600px"></iframe>
                        ) : (
                            <p>Report preview is not available.</p>
                        )}
                        <div className="flex justify-end mt-4">
                            <button
                                type="button"
                                onClick={() => setReportUrl(null)}
                                className="px-4 py-2 text-gray-600 bg-gray-100 rounded hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="max-w-md">
                <SearchBar
                    value={searchQuery}
                    onChange={setSearchQuery}
                    placeholder="Search by patient name or test..."
                />
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Patient</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Test</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Center</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {filteredTests.map((test) => (
                            <tr key={test.id} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{test.patient_name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{test.test_name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{test.test_date}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{test.center}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 py-1 text-xs rounded-full ${test.status === 'Completed'
                                        ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'
                                        }`}>
                                        {test.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                                    <button
                                        onClick={() => {
                                            setSelectedTest(test);
                                            setFormData(test);
                                            setShowForm(true);
                                            setReportFile(test.report_file || null); // Load existing file for edit
                                        }}
                                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => confirmDelete(test.id)}
                                        className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                                    >
                                        Delete
                                    </button>
                                    {test.report_file || test.report_name ? (
                                        <button
                                            onClick={() => handleViewReport(test)}
                                            className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                                        >
                                            View Report
                                        </button>
                                    ) : null}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default LabTests;

