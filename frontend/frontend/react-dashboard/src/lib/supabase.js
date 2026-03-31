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
  async loginUser(emailOrUsername, password) {
    // Search by email first
    let { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', emailOrUsername)
      .single();

    if (!data && !error) {
      // Try searching by username if email not found
      const result = await supabase
        .from('users')
        .select('*')
        .eq('username', emailOrUsername)
        .single();
      data = result.data;
      error = result.error;
    }

    if (error || !data) {
      console.error('User lookup error:', error);
      throw new Error('User not found');
    }

    // In production, use bcrypt. For now, simple comparison
    if (data.password !== password) {
      throw new Error('Invalid password');
    }

    // Get the related patient/doctor/admin record ID based on role
    let entityId = data.id; // Default to user ID
    if (data.role?.toUpperCase() === 'PATIENT') {
      const { data: patientData } = await supabase
        .from('patients')
        .select('id')
        .eq('user_id', data.id)
        .single();
      entityId = patientData?.id || data.id;
    } else if (data.role?.toUpperCase() === 'DOCTOR') {
      const { data: doctorData } = await supabase
        .from('doctors')
        .select('id')
        .eq('user_id', data.id)
        .single();
      entityId = doctorData?.id || data.id;
    }

    console.log('Login successful:', { id: data.id, email: data.email, role: data.role, entityId });

    return {
      id: data.id,
      email: data.email,
      name: data.name,
      role: data.role?.toUpperCase() || 'PATIENT',
      entity_id: entityId,
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

  // Register new user
  async registerUser(userData) {
    // First create the user record
    const { data: user, error: userError } = await supabase
      .from('users')
      .insert([{
        email: userData.email,
        username: userData.username,
        password: userData.password,
        name: userData.full_name,
        role: userData.role,
      }])
      .select();
    
    if (userError) throw userError;

    const userId = user[0].id;

    // Then create patient or doctor record based on role
    if (userData.role?.toUpperCase() === 'PATIENT') {
      await supabase
        .from('patients')
        .insert([{
          user_id: userId,
          full_name: userData.full_name,
          date_of_birth: userData.date_of_birth,
          gender: userData.gender,
          phone: userData.phone,
          address: userData.address,
          hospital_id: userData.hospital_id,
        }]);
    } else if (userData.role?.toUpperCase() === 'DOCTOR') {
      await supabase
        .from('doctors')
        .insert([{
          user_id: userId,
          full_name: userData.full_name,
          hospital_id: userData.hospital_id,
          specialization: userData.specialization,
          license_number: userData.license_number,
        }]);
    }

    return user[0];
  },

  // Admin operations
  async getSystemOverview() {
    // Return a basic overview
    const [patientCount, doctorCount, hospitalCount] = await Promise.all([
      supabase.from('patients').select('id'),
      supabase.from('doctors').select('id'),
      supabase.from('hospitals').select('id'),
    ]);
    return {
      totalPatients: patientCount.data?.length || 0,
      totalDoctors: doctorCount.data?.length || 0,
      totalHospitals: hospitalCount.data?.length || 0,
    };
  },

  async getAdminHospitals() {
    const { data, error } = await supabase
      .from('hospitals')
      .select('*')
      .order('name');
    return data || [];
  },

  async getAdminDoctors() {
    const { data, error } = await supabase
      .from('doctors')
      .select('*')
      .order('name');
    return data || [];
  },

  async getAdminAlerts() {
    const { data, error } = await supabase
      .from('complaints')
      .select('*')
      .order('created_at', { ascending: false });
    return data || [];
  },

  async getAdminComplaints() {
    const { data, error } = await supabase
      .from('complaints')
      .select('*')
      .order('created_at', { ascending: false });
    return data || [];
  },

  async getAdminAnalytics() {
    const appointments = await supabase
      .from('appointments')
      .select('created_at');
    return {
      totalAppointments: appointments.data?.length || 0,
    };
  },

  async getAdminPatients() {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .order('name');
    return data || [];
  },

  async getAllAppointments() {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .order('created_at', { ascending: false });
    return data || [];
  },

  // Admin mutation operations
  async resolveAlert(id) {
    const { data, error } = await supabase
      .from('complaints')
      .update({ status: 'RESOLVED' })
      .eq('id', id);
    if (error) throw error;
    return data;
  },

  async resolveComplaint(id) {
    const { data, error } = await supabase
      .from('complaints')
      .update({ status: 'RESOLVED' })
      .eq('id', id);
    if (error) throw error;
    return data;
  },

  async approveDoctor(id) {
    const { data, error } = await supabase
      .from('doctors')
      .update({ approved: true })
      .eq('id', id);
    if (error) throw error;
    return data;
  },

  async approveHospital(id) {
    const { data, error } = await supabase
      .from('hospitals')
      .update({ approved: true })
      .eq('id', id);
    if (error) throw error;
    return data;
  },

  async createPatient(patientData) {
    // First create user record
    const userData = {
      email: patientData.email,
      username: patientData.username,
      password: patientData.password,
      name: patientData.fullName,
      role: 'PATIENT',
    };
    
    const { data: user, error: userError } = await supabase
      .from('users')
      .insert([userData])
      .select();
    
    if (userError) throw userError;

    // Then create patient record
    const { data, error } = await supabase
      .from('patients')
      .insert([{
        user_id: user[0].id,
        full_name: patientData.fullName,
        date_of_birth: patientData.dateOfBirth,
        gender: patientData.gender,
        phone: patientData.phone,
        hospital_id: patientData.hospitalId,
      }])
      .select();
    
    if (error) throw error;
    return data[0];
  },

  async deletePatient(id) {
    // First get the patient to find user_id
    const { data: patient, error: patientError } = await supabase
      .from('patients')
      .select('user_id')
      .eq('id', id)
      .single();
    
    if (patientError) throw patientError;

    // Delete patient record
    const { error: deleteError } = await supabase
      .from('patients')
      .delete()
      .eq('id', id);
    
    if (deleteError) throw deleteError;

    // Delete user record if it exists
    if (patient?.user_id) {
      await supabase
        .from('users')
        .delete()
        .eq('id', patient.user_id);
    }

    return true;
  },

  // Doctor operations
  async getDoctorDashboard(doctorId) {
    const { data: doctor, error } = await supabase
      .from('doctors')
      .select('*')
      .eq('id', doctorId)
      .single();
    return doctor || {};
  },

  async getDoctorAppointments(doctorId) {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('doctor_id', doctorId)
      .order('appointment_date', { ascending: true });
    return data || [];
  },

  async getDoctorTreatedToday(doctorId) {
    // Get appointments treated today
    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('doctor_id', doctorId)
      .eq('appointment_date', today)
      .eq('status', 'COMPLETED')
      .order('appointment_date');
    return data || [];
  },

  async getDoctorEligibleConsultations(doctorId) {
    // Get consultations where diagnosis hasn't been set/completed
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('doctor_id', doctorId)
      .eq('status', 'COMPLETED')
      .is('diagnosis', null)
      .order('appointment_date', { ascending: false });
    return data || [];
  },

  async getPatientDetailsForDoctor(patientId) {
    const { data, error } = await supabase
      .from('patients')
      .select('*, appointments(*)')
      .eq('id', patientId)
      .single();
    return data || {};
  },

  async markAppointmentTreated(appointmentId) {
    // First mark appointment as completed
    const { data: appointment, error } = await supabase
      .from('appointments')
      .update({ status: 'COMPLETED' })
      .eq('id', appointmentId)
      .select();
    
    if (error) throw error;

    // Create consultation record if needed
    const { data: consultation, error: consultError } = await supabase
      .from('consultations')
      .insert([{
        appointment_id: appointmentId,
        doctor_id: appointment[0]?.doctor_id,
        patient_id: appointment[0]?.patient_id,
      }])
      .select();
    
    if (consultError) console.warn('Could not create consultation:', consultError);

    return {
      appointmentId,
      consultationId: consultation?.[0]?.id,
    };
  },

  async updateAppointmentStatus(appointmentId, status) {
    const { data, error } = await supabase
      .from('appointments')
      .update({ status })
      .eq('id', appointmentId)
      .select();
    
    if (error) throw error;
    return data[0];
  },

  async submitDiagnosis(consultationId, diagnosis, notes) {
    const { data, error } = await supabase
      .from('consultations')
      .update({ diagnosis, notes })
      .eq('id', consultationId)
      .select();
    
    if (error) throw error;
    return data[0];
  },

  async submitPrescription(consultationId, medicineIds, notes) {
    const medicines = medicineIds.map((medicineId) => ({
      consultation_id: consultationId,
      medicine_id: medicineId,
      notes,
    }));

    const { data, error } = await supabase
      .from('prescriptions')
      .insert(medicines)
      .select();
    
    if (error) throw error;
    return data;
  },

  async submitLabTest(consultationId, testName, instructions) {
    const { data, error } = await supabase
      .from('lab_tests')
      .insert([{
        consultation_id: consultationId,
        test_name: testName,
        instructions,
        status: 'PENDING',
      }])
      .select();
    
    if (error) throw error;
    return data[0];
  },

  async getConsultationLabTests(doctorId, consultationId) {
    const { data, error } = await supabase
      .from('lab_tests')
      .select('*')
      .eq('consultation_id', consultationId)
      .order('created_at', { ascending: false });
    return data || [];
  },

  // Chatbot and messaging
  async sendChatbotMessage(message, userRole, context) {
    // Store message in database for history
    const { data, error } = await supabase
      .from('chatbot_messages')
      .insert([{
        message,
        user_role: userRole,
        context,
        timestamp: new Date().toISOString(),
      }])
      .select();

    if (error) console.warn('Failed to store message:', error);

    // For now, return a simple mock response
    // In production, you could call an actual chatbot API here
    const mockResponses = {
      'greeting': 'Hello! How can I assist you with your health today?',
      'appointment': 'To book an appointment, go to the patient dashboard and select your preferred doctor and time slot.',
      'prescription': 'You can view your prescriptions in the patient dashboard under the prescriptions tab.',
      'lab': 'Lab tests can be ordered by your doctor. Check your dashboard for pending lab tests.',
      'default': 'Thank you for your question. Please contact your healthcare provider for more specific medical advice.',
    };

    let reply = mockResponses.default;
    const messageLower = message.toLowerCase();
    if (messageLower.includes('hello') || messageLower.includes('hi')) reply = mockResponses.greeting;
    else if (messageLower.includes('appointment')) reply = mockResponses.appointment;
    else if (messageLower.includes('prescription')) reply = mockResponses.prescription;
    else if (messageLower.includes('lab')) reply = mockResponses.lab;

    return { reply };
  },

  // File uploads for lab tests
  async uploadLabTestReport(labTestId, file) {
    if (!file) throw new Error('No file provided');

    // Generate unique filename
    const timestamp = Date.now();
    const filename = `lab-test-${labTestId}-${timestamp}-${file.name}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('lab-test-reports')
      .upload(filename, file);

    if (error) throw error;

    // Update lab test record with file path
    const { error: updateError } = await supabase
      .from('lab_tests')
      .update({ 
        report_file: filename,
        status: 'COMPLETED',
        completed_at: new Date().toISOString(),
      })
      .eq('id', labTestId);

    if (updateError) throw updateError;

    return { filename, path: data.path };
  },
};

export default supabase;
