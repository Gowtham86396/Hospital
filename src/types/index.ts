export interface Patient {
  id: number;
  name: string;
  ref: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  contact: string;
  from_visit: string;
  to_visit: string;
  first_visit: string;
  second_visit: string;
  blood_group: 'A+' | 'A-' | 'B+' | 'B-' | 'O+' | 'O-' | 'AB+' | 'AB-';
  address: string;
}

export interface Procedure {
  id: number;
  patient_name: string;
  procedures: string;
  procedureDate: string;
  status: 'Completed' | 'Pending';
}

export interface LabTest {
  id: number;
  patient_name: string;
  test_name: string;
  test_date: string;
  center: string;
  status: 'Pending' | 'Completed';
  report_url?: string;
  report_name?: string;
}

export interface Surgery {
  id: number;
  patient_name: string;
  surgery_name: string;
  surgery_date: string;
  center: string;
  status: 'Pending' | 'Completed';
  discharge_date?: string;
}

export interface Bill {
  id: number;
  patient_name: string;
  bill_date: string;
  consultant_charge: number;
  procedure_charges: number;
  surgery_charges: number;
  lab_test_charges: number;
  total_amount: number;
  payment_mode: 'Cash' | 'UPI' | 'Partial';
  cash_amount?: number;
  upi_amount?: number;
  payment_status: 'Paid' | 'Pending';
}

export type PaymentMode = 'Cash' | 'UPI' | 'Partial';