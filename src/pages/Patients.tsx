import React, { useState, useEffect } from 'react';
import SearchBar from '../components/SearchBar';
import { Patient } from '../types';
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

const today = new Date();
const todayFormatted = today.toISOString().split('T')[0];
const fourteenDaysLater = new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

const Patients = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
    const [formData, setFormData] = useState<Partial<Patient>>({
        name: '',
        ref: '',
        age: '',
        gender: 'Male',
        contact: '',
        blood_group: 'O+',
        address: '',
        consultationcharge: 300,
        from_visit: todayFormatted,
        to_visit: fourteenDaysLater,
        first_visit: todayFormatted,
        second_visit: ''
    });
    const [patients, setPatients] = useState<Patient[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [patientToDelete, setPatientToDelete] = useState<number | null>(null);

    useEffect(() => {
        // Mock data for initial load (replace with API call)
        const initialData: Patient[] = [
            {
                id: 1,
                name: "Alice Johnson",
                ref: "Dr. Smith",
                age: 30,
                gender: "Female",
                contact: "1234567890",
                blood_group: "A+",
                address: "123 Main St",
                consultationcharge: 300,
                from_visit: todayFormatted,
                to_visit: fourteenDaysLater,
                first_visit: todayFormatted,
                second_visit: ''
            },
            {
                id: 2,
                name: "Bob Smith",
                ref: "Dr. Davis",
                age: 35,
                gender: "Male",
                contact: "9876543210",
                blood_group: "O-",
                address: "456 Elm St",
                consultationcharge: 300,
                from_visit: todayFormatted,
                to_visit: fourteenDaysLater,
                first_visit: todayFormatted,
                second_visit: ''
            }
        ];
        setPatients(initialData);
    }, []);

    const filteredPatients = patients.filter(patient =>
        patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.contact.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            let result;
            if (selectedPatient) {
                // Simulate API update call
                result = await mockApiCall({ ...selectedPatient, ...formData });
            } else {
                // Simulate API create call
                result = await mockApiCall(formData);
            }

            if (result && result.success) {
                setMessage({ type: 'success', text: `Patient ${selectedPatient ? 'updated' : 'added'} successfully!` });

                setPatients(prevPatients => {
                    if (selectedPatient) {
                        // Update existing patient
                        return prevPatients.map(patient => patient.id === selectedPatient.id ? { ...patient, ...formData } : patient);
                    } else {
                        // Add new patient
                        return [...prevPatients, { ...(formData as Patient), id: result.data.id }]; // Mock ID from API
                    }
                });

                setShowForm(false);
                setSelectedPatient(null);
                setFormData({
                    name: '',
                    ref: '',
                    age: 0,
                    gender: 'Male',
                    contact: '',
                    blood_group: 'O+',
                    address: '',
                    consultationcharge: 300,
                    from_visit: todayFormatted,
                    to_visit: fourteenDaysLater,
                    first_visit: todayFormatted,
                    second_visit: ''
                });
            } else {
                setMessage({ type: 'error', text: 'Failed to save patient. Please try again.' });
            }
        } catch (error: any) {
            console.error("Error saving patient:", error);
            setMessage({ type: 'error', text: error.message || 'An unexpected error occurred.' });
        } finally {
            setIsLoading(false);
        }
    };

    const confirmDelete = (id: number) => {
        setPatientToDelete(id);
        setShowConfirmationModal(true);
    };

    const handleDelete = async () => {
        setShowConfirmationModal(false);
        if (patientToDelete === null) return;

        setIsLoading(true);
        try {
            // Simulate API delete call
            const result = await mockApiCall({ id: patientToDelete });

            if (result && result.success) {
                setMessage({ type: 'success', text: 'Patient deleted successfully!' });
                setPatients(prevPatients => prevPatients.filter(patient => patient.id !== patientToDelete));
            } else {
                setMessage({ type: 'error', text: 'Failed to delete patient. Please try again.' });
            }
        } catch (error: any) {
            console.error("Error deleting patient:", error);
            setMessage({ type: 'error', text: error.message || 'An unexpected error occurred.' });
        } finally {
            setIsLoading(false);
            setPatientToDelete(null);
        }
    };

    const closeModal = () => {
        setShowForm(false);
        setSelectedPatient(null);
        setFormData({
            name: '',
            ref: '',
            age: 0,
            gender: 'Male',
            contact: '',
            blood_group: 'O+',
            address: '',
            consultationcharge: 300,
            from_visit: todayFormatted,
            to_visit: fourteenDaysLater,
            first_visit: todayFormatted,
            second_visit: ''
        });
    };

    const handleFromVisitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newFromVisit = e.target.value;
        // Calculate new 'to_visit' date (14 days after 'from_visit')
        const newToVisitDate = new Date(new Date(newFromVisit).getTime() + 14 * 24 * 60 * 60 * 1000);
        const newToVisit = newToVisitDate.toISOString().split('T')[0];

        setFormData(prevFormData => {
            const newSecondVisit = (prevFormData.second_visit && (newFromVisit > prevFormData.second_visit || prevFormData.second_visit > newToVisit)) ? '' : prevFormData.second_visit;

            return {
                ...prevFormData,
                from_visit: newFromVisit,
                to_visit: newToVisit,
                first_visit: newFromVisit,
                second_visit: newSecondVisit
            };
        });
    };
    const handleToVisitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newToVisit = e.target.value;
        setFormData(prevFormData => {
            const newSecondVisit = (prevFormData.second_visit && (newToVisit < prevFormData.second_visit || prevFormData.from_visit > prevFormData.second_visit)) ? '' : prevFormData.second_visit;

            return {
                ...prevFormData,
                to_visit: newToVisit,
                second_visit: newSecondVisit
            };
        });
    };
    const handleSecondVisitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newSecondVisit = e.target.value;
        setFormData(prevFormData => ({
            ...prevFormData,
            second_visit: newSecondVisit
        }));
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
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Patients</h1>
                <button
                    onClick={() => setShowForm(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    Add New Patient
                </button>
            </div>

            {/* Message Modal positioned here */}
            {message && (
                <div className={`p-4 rounded-md ${message.type === 'success' ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' : message.type === 'error' ? 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100' : 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100'} flex items-center gap-2`}>
                    {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : message.type === 'error' ? <XCircle className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                    {message.text}
                </div>
            )}

            {/* Smaller Search Bar */}
            <div className="max-w-md">
                <SearchBar
                    value={searchQuery}
                    onChange={setSearchQuery}
                    placeholder="Search by patient name or test..." />
            </div>

            <div className="overflow-x-auto rounded-lg">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Ref</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Age/Gender</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Contact</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Blood Group</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Address</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Consultation</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">From Visit</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">To Visit</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Second Visit</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {filteredPatients.map(patient => (
                            <tr key={patient.id} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{patient.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{patient.ref}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{patient.age} / {patient.gender}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{patient.contact}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{patient.blood_group}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{patient.address}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{patient.consultationcharge}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{patient.from_visit}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{patient.to_visit}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{patient.second_visit}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                    <button
                                        onClick={() => {
                                            setSelectedPatient(patient);
                                            setFormData({ ...patient });
                                            setShowForm(true);
                                        }}
                                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mr-2"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => confirmDelete(patient.id)}
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

            {isLoading && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="text-white">Loading...</div>
                </div>
            )}

            {showForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full">
                        <h2 className="text-xl font-bold mb-4">{selectedPatient ? 'Edit Patient' : 'New Patient'}</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Name</label>
                                    <input
                                        type="text"
                                        value={formData.name || ''}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Referral</label>
                                    <input
                                        type="text"
                                        value={formData.ref || ''}
                                        onChange={(e) => setFormData({ ...formData, ref: e.target.value })}
                                        className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Age</label>
                                    <input
                                        type="number"
                                        value={formData.age || ''}
                                        onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) })}
                                        className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Gender</label>
                                    <select
                                        value={formData.gender || 'Male'}
                                        onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'Male' | 'Female' })}
                                        className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                                        required
                                    >
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Contact</label>
                                    <input
                                        type="text"
                                        value={formData.contact || ''}
                                        onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                                        className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Blood Group</label>
                                    <select
                                        value={formData.blood_group || 'O+'}
                                        onChange={(e) => setFormData({ ...formData, blood_group: e.target.value as 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-' })}
                                        className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                                        required
                                    >
                                        <option value="A+">A+</option>
                                        <option value="A-">A-</option>
                                        <option value="B+">B+</option>
                                        <option value="B-">B-</option>
                                        <option value="AB+">AB+</option>
                                        <option value="AB-">AB-</option>
                                        <option value="O+">O+</option>
                                        <option value="O-">O-</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Address</label>
                                    <input
                                        type="text"
                                        value={formData.address || ''}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Consultation Charge</label>
                                    <input
                                        type="number"
                                        value={formData.consultationcharge || 300}
                                        onChange={(e) => setFormData({ ...formData, consultationcharge: parseInt(e.target.value) })}
                                        className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">From Visit</label>
                                    <input
                                        type="date"
                                        value={formData.from_visit || todayFormatted}
                                        onChange={handleFromVisitChange}
                                        className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">To Visit</label>
                                    <input
                                        type="date"
                                        value={formData.to_visit || fourteenDaysLater}
                                        onChange={handleToVisitChange}
                                        className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                                        required
                                        min={formData.from_visit || todayFormatted}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">First Visit</label>
                                    <input
                                        type="date"
                                        value={formData.first_visit || todayFormatted}
                                        className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                                        readOnly
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Second Visit</label>
                                    <input
                                        type="date"
                                        value={formData.second_visit || ''}
                                        onChange={handleSecondVisitChange}
                                        className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                                        min={formData.from_visit || todayFormatted}
                                        max={formData.to_visit || fourteenDaysLater}
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end space-x-4">
                                <button type="button" className="px-4 py-2 text-gray-500 bg-gray-200 rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors" onClick={closeModal}>
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Saving...' : 'Save'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {showConfirmationModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
                        <h2 className="text-lg font-bold mb-4">Confirmation</h2>
                        <p>Are you sure you want to delete this patient?</p>
                        <div className="flex justify-end space-x-4 mt-6">
                            <button onClick={() => setShowConfirmationModal(false)} className="px-4 py-2 text-gray-500 bg-gray-200 rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors">
                                Cancel
                            </button>
                            <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Patients;
