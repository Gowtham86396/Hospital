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

// Define a Bill type
interface Bill {
  id: number;
  patient_name: string;
  bill_number: string;
  bill_date: string;
  total_amount: number;
  discount: number;
  paid_amount: number;
  payment_method: string;
  bill_status: string;
  consultation_charge: number;
  procedure_charge: number;
  // NEW FIELDS
  age: number;
  gender: string;
  contact: string;
  address: string;
  ref_by: string;
  visit_date_from: string;
  visit_date_to: string;
  first_visit_date: string;
  second_visit_date: string;
  op_charges: number;
  procedures: string;
}

const Bills = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [formData, setFormData] = useState<Partial<Bill>>({
    patient_name: '',
    bill_number: '',
    bill_date: todayFormatted,
    total_amount: 0,
    discount: 0,
    paid_amount: 0,
    payment_method: 'Cash',
    bill_status: 'Unpaid',
    consultation_charge: 0,
    procedure_charge: 0,
    // NEW FIELDS
    age: 0,
    gender: '',
    contact: '',
    address: '',
    ref_by: '',
    visit_date_from: todayFormatted,
    visit_date_to: todayFormatted,
    first_visit_date: todayFormatted,
    second_visit_date: 'N/A',
    op_charges: 0,
    procedures: 'None',
  });
  const [bills, setBills] = useState<Bill[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [billToDelete, setBillToDelete] = useState<number | null>(null);

  // NEW STATE VARIABLES
  const [patientSearchQuery, setPatientSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<any | null>(null);
  const [billNumber, setBillNumber] = useState('');
  const [billStatus, setBillStatus] = useState('Unpaid'); // Options: Paid, Unpaid, Partial
  const [consultationCharge, setConsultationCharge] = useState(0);
  const [procedureCharge, setProcedureCharge] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('Cash'); // Options: Cash, UPI, Partial, Card
  const [messageText, setMessageText] = useState('');

  useEffect(() => {
    // Mock data for initial load (replace with API call)
    const initialData: Bill[] = [
      {
        id: 1,
        patient_name: "K. POORINMA",
        bill_number: "BILL-2025-001",
        bill_date: todayFormatted,
        total_amount: 300.00,
        discount: 0.00,
        paid_amount: 300.00,
        payment_method: "Cash",
        bill_status: "Paid",
        consultation_charge: 0,
        procedure_charge: 0,
        //NEW FIELDS
        age: 25,
        gender: "Female",
        contact: "9533690695",
        address: "UNDRAJAVARAM",
        ref_by: "VENKATESH RMP",
        visit_date_from: "2025-02-25",
        visit_date_to: "2025-03-11",
        first_visit_date: "2025-02-25",
        second_visit_date: "N/A",
        op_charges: 300,
        procedures: "None",
      },
      {
        id: 2,
        patient_name: "Bob Smith",
        bill_number: "BILL-2025-002",
        bill_date: todayFormatted,
        total_amount: 500.00,
        discount: 0.00,
        paid_amount: 500.00,
        payment_method: "Cash",
        bill_status: "Unpaid",
        consultation_charge: 200,
        procedure_charge: 300,
        //NEW FIELDS
        age: 30,
        gender: "Male",
        contact: "9876543210",
        address: "Some Other Address",
        ref_by: "Dr. Sample",
        visit_date_from: "2025-02-20",
        visit_date_to: "2025-03-15",
        first_visit_date: "2025-02-20",
        second_visit_date: "N/A",
        op_charges: 250,
        procedures: "Checkup",
      }
    ];
    setBills(initialData);
  }, []);

  const filteredBills = bills.filter(bill =>
    bill.patient_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    bill.bill_number.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Construct the data to send to the API
    const billData = {
      ...formData,
      bill_number: billNumber,
      bill_status: billStatus,
      consultation_charge: consultationCharge,
      procedure_charge: procedureCharge,
      payment_method: paymentMethod,
      patient_id: selectedPatient?.id, // Assuming your API needs patient ID
      //NEW FIELDS
      age: formData.age,
      gender: formData.gender,
      contact: formData.contact,
      address: formData.address,
      ref_by: formData.ref_by,
      visit_date_from: formData.visit_date_from,
      visit_date_to: formData.visit_date_to,
      first_visit_date: formData.first_visit_date,
      second_visit_date: formData.second_visit_date,
      op_charges: formData.op_charges,
      procedures: formData.procedures,
    };

    try {
      let result;
      if (selectedBill) {
        // Simulate API update call
        result = await mockApiCall({ ...selectedBill, ...billData });
      } else {
        // Simulate API create call
        result = await mockApiCall(billData);
      }

      if (result && result.success) {
        setMessage({ type: 'success', text: `Bill ${selectedBill ? 'updated' : 'added'} successfully!` });

        // Update the bills state (assuming the API returns the updated bill data)
        setBills(prevBills => {
          if (selectedBill) {
            return prevBills.map(bill => bill.id === selectedBill.id ? result.data : bill);
          } else {
            return [...prevBills, result.data];
          }
        });

        closeModal(); // Call closeModal to reset form
      } else {
        setMessage({ type: 'error', text: 'Failed to save bill. Please try again.' });
      }
    } catch (error: any) {
      console.error("Error saving bill:", error);
      setMessage({ type: 'error', text: error.message || 'An unexpected error occurred.' });
    } finally {
      setIsLoading(false);
    }
  };

  const confirmDelete = (id: number) => {
    setBillToDelete(id);
    setShowConfirmationModal(true);
  };

  const handleDelete = async () => {
    setShowConfirmationModal(false);
    if (billToDelete === null) return;

    setIsLoading(true);
    try {
      // Simulate API delete call
      const result = await mockApiCall({ id: billToDelete });

      if (result && result.success) {
        setMessage({ type: 'success', text: 'Bill deleted successfully!' });
        setBills(prevBills => prevBills.filter(bill => bill.id !== billToDelete));
      } else {
        setMessage({ type: 'error', text: 'Failed to delete bill. Please try again.' });
      }
    } catch (error: any) {
      console.error("Error deleting bill:", error);
      setMessage({ type: 'error', text: error.message || 'An unexpected error occurred.' });
    } finally {
      setIsLoading(false);
      setBillToDelete(null);
    }
  };

  const closeModal = () => {
    setShowForm(false);
    setSelectedBill(null);
    setFormData({
      patient_name: '',
      bill_number: '',
      bill_date: todayFormatted,
      total_amount: 0,
      discount: 0,
      paid_amount: 0,
      payment_method: 'Cash',
      bill_status: 'Unpaid',
      consultation_charge: 0,
      procedure_charge: 0,
      //NEW FIELDS
      age: 0,
      gender: '',
      contact: '',
      address: '',
      ref_by: '',
      visit_date_from: todayFormatted,
      visit_date_to: todayFormatted,
      first_visit_date: todayFormatted,
      second_visit_date: 'N/A',
      op_charges: 0,
      procedures: 'None',
    });
    setSearchResults([]);
    setSelectedPatient(null);
    setBillStatus('Unpaid');
    setConsultationCharge(0);
    setProcedureCharge(0);
    setPaymentMethod('Cash');
    setMessageText('');
    setPatientSearchQuery('');
  };

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Patient Search Handlers
  const handlePatientSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setPatientSearchQuery(query);

    if (query) {
      try {
        //  REPLACE THIS WITH YOUR API ENDPOINT
        const response = await fetch(`/api/patients?search=${query}`);
        const data = await response.json();
        setSearchResults(data);
      } catch (error) {
        console.error("Error fetching patient data:", error);
        setMessage({ type: 'error', text: 'Failed to fetch patient data.' });
        setSearchResults([]);
      }
    } else {
      setSearchResults([]);
    }
  };

  const handlePatientSelect = (patient: any) => {
    setSelectedPatient(patient);
    setFormData({
      ...formData,
      patient_name: patient.patient_name,
      //Set other patient details here as necessary
      age: patient.age,
      gender: patient.gender,
      contact: patient.contact,
      address: patient.address,
      ref_by: patient.ref_by,
      visit_date_from: patient.visit_date_from,
      visit_date_to: patient.visit_date_to,
      first_visit_date: patient.first_visit_date,
      second_visit_date: patient.second_visit_date,
      op_charges: patient.op_charges,
      procedures: patient.procedures,
    });
    setConsultationCharge(patient.consultation_charge || 0);
    setProcedureCharge(patient.procedure_charge || 0);
    setSearchResults([]);
    // Optionally, calculate the initial total here, or defer to the total calculation function
    calculateTotal(patient.consultation_charge || 0, patient.procedure_charge || 0);
  };

  // Bill Number Auto-Increment
  const openAddBillModal = async () => {
    try {
      // REPLACE '/api/new_bill_number' WITH YOUR ACTUAL ENDPOINT
      const response = await fetch('/api/new_bill_number');
      const data = await response.json();
      setBillNumber(data.bill_number); // Assuming the API returns { bill_number: '...' }
    } catch (error) {
      console.error("Error fetching new bill number:", error);
      setMessage({ type: 'error', text: 'Failed to fetch bill number.' });
      setBillNumber('ERROR'); // Or some default value
    }
    setShowForm(true);
  };

  const generateMessage = () => {
    let message = "Patient has paid a sum amount for ";
    const services = [];

    if (consultationCharge > 0) {
      services.push("consultation charge");
    }
    if (procedureCharge > 0) {
      services.push("procedure");
    }

    if (services.length === 0) {
      message = "No services selected.";
    } else {
      message += services.join(" and ") + ".";
    }
    setMessageText(message);
  };

  const calculateTotal = (consultation: number, procedure: number) => {
    const total = consultation + procedure;
    setFormData({ ...formData, total_amount: total });
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Bills</h1>
        <button
          onClick={() => openAddBillModal()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add New Bill
        </button>
      </div>

      {/* Smaller Search Bar */}
      <div className="max-w-md">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search by patient name or bill number..." />
      </div>

      {/* Message Modal positioned here */}
      {message && (
        <div className={`p-4 rounded-md ${message.type === 'success' ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' : message.type === 'error' ? 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100' : 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100'} flex items-center gap-2`}>
          {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : message.type === 'error' ? <XCircle className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
          {message.text}
        </div>
      )}
      <div className="overflow-x-auto rounded-lg">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Patient Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Bill Number</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Bill Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Total Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Discount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Paid Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Payment Method</th>
              {/* NEW TABLE HEADERS */}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Age</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Gender</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Contact</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Address</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Ref By</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Visit Date From</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Visit Date To</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">1st Visit Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">2nd Visit Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">OP Charges</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Procedures</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {filteredBills.map(bill => (
              <tr key={bill.id} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{bill.patient_name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{bill.bill_number}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{bill.bill_date}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{bill.total_amount}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{bill.discount}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{bill.paid_amount}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{bill.payment_method}</td>
                {/* NEW TABLE DATA */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{bill.age}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{bill.gender}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{bill.contact}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{bill.address}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{bill.ref_by}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{bill.visit_date_from}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{bill.visit_date_to}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{bill.first_visit_date}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{bill.second_visit_date}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{bill.op_charges}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{bill.procedures}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <button
                    onClick={() => {
                      setSelectedBill(bill);
                      setFormData({ ...bill });
                      setShowForm(true);
                    }}
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => confirmDelete(bill.id)}
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

      {/* Confirmation Modal */}
      {showConfirmationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
            <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Confirm Delete</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">Are you sure you want to delete this bill?</p>
            <div className="flex justify-end">
              <button onClick={() => setShowConfirmationModal(false)} className="px-4 py-2 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors mr-2">
                Cancel
              </button>
              <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading Spinner */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="text-white">Loading...</div>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full">
            <h2 className="text-xl font-bold mb-4">{selectedBill ? 'Edit Bill' : 'New Bill'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">

                {/* Patient Name Search */}
                <div>
                  <label className="block text-sm font-medium mb-1">Patient Name</label>
                  <input
                    type="text"
                    value={patientSearchQuery}
                    onChange={handlePatientSearch}
                    className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                    required
                  />
                  {searchResults.length > 0 && (
                    <ul className="border rounded dark:bg-gray-700 dark:border-gray-600">
                      {searchResults.map(patient => (
                        <li
                          key={patient.id}
                          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
                          onClick={() => handlePatientSelect(patient)}
                        >
                          {patient.patient_name}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Bill Number</label>
                  <input
                    type="text"
                    value={billNumber}
                    onChange={(e) => setBillNumber(e.target.value)}
                    className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                    required
                  />
                </div>

                {/* NEW FIELDS - ADD THESE TO YOUR FORM */}
                <div>
                  <label className="block text-sm font-medium mb-1">Age</label>
                  <input
                    type="number"
                    value={formData.age || ''}
                    onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value || '0', 10) })}
                    className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Gender</label>
                  <input
                    type="text"
                    value={formData.gender || ''}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Contact</label>
                  <input
                    type="text"
                    value={formData.contact || ''}
                    onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                    className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                  />
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
                  <label className="block text-sm font-medium mb-1">Referred By</label>
                  <input
                    type="text"
                    value={formData.ref_by || ''}
                    onChange={(e) => setFormData({ ...formData, ref_by: e.target.value })}
                    className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Visit Date From</label>
                  <input
                    type="date"
                    value={formData.visit_date_from || ''}
                    onChange={(e) => setFormData({ ...formData, visit_date_from: e.target.value })}
                    className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Visit Date To</label>
                  <input
                    type="date"
                    value={formData.visit_date_to || ''}
                    onChange={(e) => setFormData({ ...formData, visit_date_to: e.target.value })}
                    className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">First Visit Date</label>
                  <input
                    type="date"
                    value={formData.first_visit_date || ''}
                    onChange={(e) => setFormData({ ...formData, first_visit_date: e.target.value })}
                    className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Second Visit Date</label>
                  <input
                    type="text"
                    value={formData.second_visit_date || ''}
                    onChange={(e) => setFormData({ ...formData, second_visit_date: e.target.value })}
                    className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">OP Charges</label>
                  <input
                    type="number"
                    value={formData.op_charges || ''}
                    onChange={(e) => setFormData({ ...formData, op_charges: parseInt(e.target.value || '0', 10) })}
                    className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Procedures</label>
                  <input
                    type="text"
                    value={formData.procedures || ''}
                    onChange={(e) => setFormData({ ...formData, procedures: e.target.value })}
                    className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Total Amount</label>
                  <input
                    type="number"
                    value={formData.total_amount || ''}
                    readOnly // Assuming you calculate this
                    className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>

              </div>

              <div className="flex justify-end">
                <button type="button" onClick={closeModal} className="px-4 py-2 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors mr-2">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors" disabled={isLoading}>
                  {isLoading ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bills;
