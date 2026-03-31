import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://db.wlrfvjrgkrszbvcwjoqi.supabase.co';
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY || '';

if (!SUPABASE_KEY) {
  console.warn('⚠️ VITE_SUPABASE_KEY is not set. Check your .env file.');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Helper functions for common operations
export const db = {
  // Users
  async loginUser(email, password) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !data) {
      throw new Error('User not found');
    }

    // In production, use bcrypt. For now, simple comparison
    if (data.password !== password) {
      throw new Error('Invalid password');
    }

    return {
      id: data.id,
      email: data.email,
      name: data.name,
      role: data.role,
      entity_id: data.entity_id,
    };
  },

  // Hospitals
  async getHospitals() {
    const { data, error } = await supabase
      .from('hospitals')
      .select('*')
      .order('id');
    return data || [];
  },

  // Patients
  async getPatients() {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .order('id');
    return data || [];
  },

  async getPatient(patientId) {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .eq('id', patientId)
      .single();
    return data;
  },

  async getPatientAppointments(patientId) {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('patient_id', patientId)
      .order('appointment_date', { ascending: false });
    return data || [];
  },

  async getPatientPrescriptions(patientId) {
    const { data, error } = await supabase
      .from('prescriptions')
      .select('*')
      .eq('patient_id', patientId)
      .order('created_at', { ascending: false });
    return data || [];
  },

  async getPatientLabTests(patientId) {
    const { data, error } = await supabase
      .from('lab_tests')
      .select('*')
      .eq('patient_id', patientId)
      .order('created_at', { ascending: false });
    return data || [];
  },

  async getPatientDashboardHistory(patientId) {
    const { data, error } = await supabase
      .from('dashboard_history')
      .select('*')
      .eq('patient_id', patientId)
      .order('created_at', { ascending: false });
    return data || [];
  },

  async createAppointment(appointment) {
    const { data, error } = await supabase
      .from('appointments')
      .insert([appointment])
      .select();
    if (error) throw error;
    return data[0];
  },

  async createComplaint(complaint) {
    const { data, error } = await supabase
      .from('complaints')
      .insert([complaint])
      .select();
    if (error) throw error;
    return data[0];
  },

  // Doctors
  async getDoctorsByHospital(hospitalId) {
    const { data, error } = await supabase
      .from('doctors')
      .select('*')
      .eq('hospital_id', hospitalId)
      .order('name');
    return data || [];
  },

  async getDoctor(doctorId) {
    const { data, error } = await supabase
      .from('doctors')
      .select('*')
      .eq('id', doctorId)
      .single();
    return data;
  },

  // Medicines
  async getMedicines() {
    const { data, error } = await supabase
      .from('medicines')
      .select('*')
      .order('name');
    return data || [];
  },

  // Appointments
  async getAppointmentsByDate(date) {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('appointment_date', date);
    return data || [];
  },
};

export default supabase;
