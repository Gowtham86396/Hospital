import React, { useState, useEffect } from 'react';
import SearchBar from '../components/SearchBar';
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

// Define a Surgery type
interface Surgery {
  id: number;
  patient_name: string;
  surgery_name: string;
  surgery_date: string; // Date string (YYYY-MM-DD)
  center: string;
  status: string;
  discharge_date: string;
}

const Surgeries = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedSurgery, setSelectedSurgery] = useState<Surgery | null>(null);
  const [formData, setFormData] = useState<Partial<Surgery>>({
    patient_name: '',
    surgery_name: '',
    surgery_date: '',
    center: '',
    status: 'Pending',
    discharge_date: ''
  });
  const [surgeries, setSurgeries] = useState<Surgery[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [surgeryToDelete, setSurgeryToDelete] = useState<number | null>(null);

  useEffect(() => {
    // Mock data for initial load (replace with API call)
    const initialData: Surgery[] = [
      {
        id: 1,
        patient_name: "Alice Johnson",
        surgery_name: "Appendectomy",
        surgery_date: todayFormatted,
        center: "General Hospital",
        status: "Pending",
        discharge_date: ''
      },
      {
        id: 2,
        patient_name: "Bob Smith",
        surgery_name: "Knee Replacement",
        surgery_date: todayFormatted,
        center: "City Medical Center",
        status: "Scheduled",
        discharge_date: ''
      }
    ];
    setSurgeries(initialData);
  }, []);

  const filteredSurgeries = surgeries.filter(surgery =>
    surgery.patient_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    surgery.surgery_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let result;
      if (selectedSurgery) {
        // Simulate API update call
        result = await mockApiCall({ ...selectedSurgery, ...formData });
      } else {
        // Simulate API create call
        result = await mockApiCall(formData);
      }

      if (result && result.success) {
        setMessage({ type: 'success', text: `Surgery ${selectedSurgery ? 'updated' : 'added'} successfully!` });

        setSurgeries(prevSurgeries => {
          if (selectedSurgery) {
            // Update existing surgery
            return prevSurgeries.map(surgery => surgery.id === selectedSurgery.id ? { ...surgery, ...formData } : surgery);
          } else {
            // Add new surgery
            return [...prevSurgeries, { ...(formData as Surgery), id: result.data.id }]; // Mock ID from API
          }
        });

        setShowForm(false);
        setSelectedSurgery(null);
        setFormData({
          patient_name: '',
          surgery_name: '',
          surgery_date: '',
          center: '',
          status: 'Pending',
          discharge_date: ''
        });
      } else {
        setMessage({ type: 'error', text: 'Failed to save surgery. Please try again.' });
      }
    } catch (error: any) {
      console.error("Error saving surgery:", error);
      setMessage({ type: 'error', text: error.message || 'An unexpected error occurred.' });
    } finally {
      setIsLoading(false);
    }
  };

  const confirmDelete = (id: number) => {
    setSurgeryToDelete(id);
    setShowConfirmationModal(true);
  };

  const handleDelete = async () => {
    setShowConfirmationModal(false);
    if (surgeryToDelete === null) return;

    setIsLoading(true);
    try {
      // Simulate API delete call
      const result = await mockApiCall({ id: surgeryToDelete });

      if (result && result.success) {
        setMessage({ type: 'success', text: 'Surgery deleted successfully!' });
        setSurgeries(prevSurgeries => prevSurgeries.filter(surgery => surgery.id !== surgeryToDelete));
      } else {
        setMessage({ type: 'error', text: 'Failed to delete surgery. Please try again.' });
      }
    } catch (error: any) {
      console.error("Error deleting surgery:", error);
      setMessage({ type: 'error', text: error.message || 'An unexpected error occurred.' });
    } finally {
      setIsLoading(false);
      setSurgeryToDelete(null);
    }
  };

  const closeModal = () => {
    setShowForm(false);
    setSelectedSurgery(null);
    setFormData({
      patient_name: '',
      surgery_name: '',
      surgery_date: '',
      center: '',
      status: 'Pending',
      discharge_date: ''
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
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Surgeries</h1>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add New Surgery
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
          placeholder="Search by patient name or surgery name..." />
      </div>

      <div className="overflow-x-auto rounded-lg">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Patient Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Surgery Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Surgery Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Center</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Discharge Date</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {filteredSurgeries.map(surgery => (
              <tr key={surgery.id} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{surgery.patient_name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{surgery.surgery_name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{surgery.surgery_date}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{surgery.center}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{surgery.status}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{surgery.discharge_date}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <button
                    onClick={() => {
                      setSelectedSurgery(surgery);
                      setFormData({ ...surgery });
                      setShowForm(true);
                    }}
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => confirmDelete(surgery.id)}
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
            <h2 className="text-xl font-bold mb-4">{selectedSurgery ? 'Edit Surgery' : 'New Surgery'}</h2>
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
                  <label className="block text-sm font-medium mb-1">Surgery Name</label>
                  <input
                    type="text"
                    value={formData.surgery_name || ''}
                    onChange={(e) => setFormData({ ...formData, surgery_name: e.target.value })}
                    className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Surgery Date</label>
                  <input
                    type="date"
                    value={formData.surgery_date || todayFormatted}
                    onChange={(e) => setFormData({ ...formData, surgery_date: e.target.value })}
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
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Status</label>
                  <select
                    value={formData.status || 'Pending'}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'Pending' | 'Scheduled' | 'Completed' })}
                    className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                    required
                  >
                    <option value="Pending">Pending</option>
                    <option value="Scheduled">Scheduled</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Discharge Date</label>
                  <input
                    type="date"
                    value={formData.discharge_date || ''}
                    onChange={(e) => setFormData({ ...formData, discharge_date: e.target.value })}
                    className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
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
            <p>Are you sure you want to delete this surgery?</p>
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

export default Surgeries;
