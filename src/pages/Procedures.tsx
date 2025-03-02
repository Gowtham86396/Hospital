import React, { useState, useEffect } from 'react';
import SearchBar from '../components/SearchBar';
import { Procedure } from '../types';
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

const procedureCharges = {
    "Nose Cleaning": 300,
    "DNE": 500,
    "Both Ear Cleaning": 500,
    "One Ear Cleaning": 300,
    "VLS": 500,
    "MINOR SURGICAL PROCEDURE": 5000,
    "GROMMET INSERTION FOR ONE EAR": 7500,
    "GROMMET INSERTION FOR TWO EARS": 16000,
    "None": 0
};

const Procedures = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [selectedProcedure, setSelectedProcedure] = useState<Procedure | null>(null);
    const [formData, setFormData] = useState<Partial<Procedure>>({
        patient_name: '',
        procedure_name: '',
        procedure_date: '',
        doctor_name: '',
        status: 'Scheduled',
        charge: 0
    });
    const [procedures, setProcedures] = useState<Procedure[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [procedureToDelete, setProcedureToDelete] = useState<number | null>(null);

    useEffect(() => {
        // Mock data for initial load (replace with API call)
        const initialData: Procedure[] = [
            {
                id: 1,
                patient_name: "Alice Johnson",
                procedure_name: "Colonoscopy",
                procedure_date: "2024-03-22",
                doctor_name: "Dr. Williams",
                status: "Completed",
                notes: "Procedure was successful with no complications.",
                charge: 2000
            },
            {
                id: 2,
                patient_name: "Bob Smith",
                procedure_name: "Echocardiogram",
                procedure_date: "2024-03-25",
                doctor_name: "Dr. Davis",
                status: "Scheduled",
                notes: "Patient to arrive 30 minutes early for preparation.",
                charge: 1500
            }
        ];
        setProcedures(initialData);
    }, []);

    const filteredProcedures = procedures.filter(procedure =>
        procedure.patient_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        procedure.procedure_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            let result;
            if (selectedProcedure) {
                // Simulate API update call
                result = await mockApiCall({ ...selectedProcedure, ...formData });
            } else {
                // Simulate API create call
                result = await mockApiCall(formData);
            }

            if (result && result.success) {
                setMessage({ type: 'success', text: `Procedure ${selectedProcedure ? 'updated' : 'added'} successfully!` });

                setProcedures(prevProcedures => {
                    if (selectedProcedure) {
                        // Update existing procedure
                        return prevProcedures.map(procedure => procedure.id === selectedProcedure.id ? { ...procedure, ...formData } : procedure);
                    } else {
                        // Add new procedure
                        return [...prevProcedures, { ...(formData as Procedure), id: result.data.id }]; // Mock ID from API
                    }
                });

                setShowForm(false);
                setSelectedProcedure(null);
                setFormData({ patient_name: '', procedure_name: '', procedure_date: '', doctor_name: '', status: 'Scheduled', charge: 0 });
            } else {
                setMessage({ type: 'error', text: 'Failed to save procedure. Please try again.' });
            }
        } catch (error: any) {
            console.error("Error saving procedure:", error);
            setMessage({ type: 'error', text: error.message || 'An unexpected error occurred.' });
        } finally {
            setIsLoading(false);
        }
    };

    const confirmDelete = (id: number) => {
        setProcedureToDelete(id);
        setShowConfirmationModal(true);
    };

    const handleDelete = async () => {
        setShowConfirmationModal(false);
        if (procedureToDelete === null) return;

        setIsLoading(true);
        try {
            // Simulate API delete call
            const result = await mockApiCall({ id: procedureToDelete });

            if (result && result.success) {
                setMessage({ type: 'success', text: 'Procedure deleted successfully!' });
                setProcedures(prevProcedures => prevProcedures.filter(procedure => procedure.id !== procedureToDelete));
            } else {
                setMessage({ type: 'error', text: 'Failed to delete procedure. Please try again.' });
            }
        } catch (error: any) {
            console.error("Error deleting procedure:", error);
            setMessage({ type: 'error', text: error.message || 'An unexpected error occurred.' });
        } finally {
            setIsLoading(false);
            setProcedureToDelete(null);
        }
    };

    const closeModal = () => {
        setShowForm(false);
        setSelectedProcedure(null);
        setFormData({ patient_name: '', procedure_name: '', procedure_date: '', doctor_name: '', status: 'Scheduled', charge: 0 });
    };
    const handleProcedureChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedProcedureName = e.target.value;
        const charge = procedureCharges[selectedProcedureName] || 0; // Default to 0 if not found

        setFormData({
            ...formData,
            procedure_name: selectedProcedureName,
            charge: charge
        });
    };

    const handleChargeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const chargeValue = parseFloat(e.target.value);
        setFormData({
            ...formData,
            charge: chargeValue
        });
    };

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                setMessage(null);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Procedures</h1>
                <button
                    onClick={() => setShowForm(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    Add New Procedure
                </button>
            </div>

            {message && (
                <div className={`p-4 rounded-md ${message.type === 'success' ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' : message.type === 'error' ? 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100' : 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100'} flex items-center gap-2`}>
                    {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : message.type === 'error' ? <XCircle className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                    {message.text}
                </div>
            )}

            {showForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full">
                        <h2 className="text-xl font-bold mb-4">{selectedProcedure ? 'Edit Procedure' : 'New Procedure'}</h2>
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
                                    <label className="block text-sm font-medium mb-1">Procedure Name</label>
                                    <select
                                        value={formData.procedure_name || ''}
                                        onChange={handleProcedureChange}
                                        className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                                        required
                                    >
                                        <option value="">Select Procedure</option>
                                        {Object.keys(procedureCharges).map(procedureName => (
                                            <option key={procedureName} value={procedureName}>{procedureName}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Procedure Date</label>
                                    <input
                                        type="date"
                                        value={formData.procedure_date || ''}
                                        onChange={(e) => setFormData({ ...formData, procedure_date: e.target.value })}
                                        className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Doctor Name</label>
                                    <input
                                        type="text"
                                        value={formData.doctor_name || ''}
                                        onChange={(e) => setFormData({ ...formData, doctor_name: e.target.value })}
                                        className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Status</label>
                                    <select
                                        value={formData.status || 'Scheduled'}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value as 'Scheduled' | 'Completed' | 'Cancelled' })}
                                        className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                                        required
                                    >
                                        <option value="Scheduled">Scheduled</option>
                                        <option value="Completed">Completed</option>
                                        <option value="Cancelled">Cancelled</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Charge</label>
                                    <input
                                        type="number"
                                        value={formData.charge || 0}
                                        onChange={handleChargeChange}
                                        className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Notes</label>
                                    <textarea
                                        value={formData.notes || ''}
                                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                        className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                                        rows={3}
                                    />
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
                                    {isLoading ? 'Saving...' : (selectedProcedure ? 'Update Procedure' : 'Add Procedure')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showConfirmationModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
                        <h2 className="text-lg font-bold mb-4">Confirm Delete</h2>
                        <p>Are you sure you want to delete this procedure?</p>
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

            <div className="max-w-md">
                <SearchBar
                    value={searchQuery}
                    onChange={setSearchQuery}
                    placeholder="Search by patient name or procedure..."
                />
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Patient</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Procedure</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Doctor</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Charge</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {filteredProcedures.map((procedure) => (
                            <tr key={procedure.id} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{procedure.patient_name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{procedure.procedure_name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{procedure.procedure_date}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{procedure.doctor_name}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 py-1 text-xs rounded-full ${procedure.status === 'Completed'
                                        ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                                        : procedure.status === 'Scheduled'
                                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'
                                            : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                                        }`}>
                                        {procedure.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{procedure.charge}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                                    <button
                                        onClick={() => {
                                            setSelectedProcedure(procedure);
                                            setFormData(procedure);
                                            setShowForm(true);
                                        }}
                                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => confirmDelete(procedure.id)}
                                        className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Procedures;
