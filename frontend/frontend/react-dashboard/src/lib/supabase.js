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
    console.log('🔍 Attempting login with:', emailOrUsername);
    
    // Try multiple search strategies
    let data = null;
    let error = null;

    // Strategy 1: Search by username (skip if column doesn't exist)
    try {
      const result = await supabase
        .from('users')
        .select('*')
        .eq('username', emailOrUsername);
      
      if (result.data && result.data.length > 0) {
        data = result.data[0];
        console.log('✓ Found user by username:', emailOrUsername);
      }
    } catch (err) {
      // Username column might not exist, silently continue
    }

    // Strategy 2: If username search failed, try email
    if (!data) {
      try {
        const result = await supabase
          .from('users')
          .select('*')
          .eq('email', emailOrUsername);
        
        if (result.data && result.data.length > 0) {
          data = result.data[0];
          console.log('✓ Found user by email:', emailOrUsername);
        }
      } catch (err) {
        console.log('Email search failed');
      }
    }

    // Strategy 3: If still not found, try case-insensitive email match
    if (!data) {
      try {
        const result = await supabase
          .from('users')
          .select('*');
        
        // Find user with matching email (case-insensitive)
        const foundUser = result.data?.find(u => 
          u.email?.toLowerCase().includes(emailOrUsername.toLowerCase())
        );
        
        if (foundUser) {
          data = foundUser;
          console.log('✓ Found user by fuzzy email match:', foundUser.email);
        }
      } catch (err) {
        console.log('Fuzzy search failed');
      }
    }

    if (!data) {
      console.error('❌ User not found with any search strategy');
      throw new Error('User not found');
    }

    console.log('✓ Found user:', { id: data.id, email: data.email, username: data.username, role: data.role });

    // In production, use bcrypt. For now, simple comparison
    if (data.password !== password) {
      console.error('❌ Password mismatch');
      throw new Error('Invalid password');
    }

    // Get the related patient/doctor/admin record ID based on role
    let entityId = data.id; // Default to user ID
    console.log('🔍 Looking up entity for role:', data.role, 'user_id:', data.id);
    
    if (data.role?.toUpperCase() === 'PATIENT') {
      try {
        const { data: patientData, error: patientError } = await supabase
          .from('patients')
          .select('id')
          .eq('user_id', data.id);
        
        console.log('Patient query result:', { patientData, patientError });
        
        if (patientData && patientData.length > 0) {
          entityId = patientData[0].id;
          console.log('✓ Found patient ID:', entityId);
        } else {
          console.warn('⚠ No patient record found for user', data.id);
        }
      } catch (err) {
        console.error('❌ Error finding patient:', err);
      }
    } else if (data.role?.toUpperCase() === 'DOCTOR') {
      try {
        const { data: doctorData, error: doctorError } = await supabase
          .from('doctors')
          .select('id')
          .eq('user_id', data.id);
        
        console.log('Doctor query result:', { doctorData, doctorError });
        
        if (doctorData && doctorData.length > 0) {
          entityId = doctorData[0].id;
          console.log('✓ Found doctor ID:', entityId);
        } else {
          console.warn('⚠ No doctor record found for user', data.id);
        }
      } catch (err) {
        console.error('❌ Error finding doctor:', err);
      }
    }

    console.log('✅ Login successful:', { userId: data.id, email: data.email, username: data.username, role: data.role, entityId });

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
      .select(`
        id,
        patient_id,
        doctor_id,
        hospital_id,
        appointment_date,
        appointment_time,
        symptoms_or_disease,
        status,
        created_at,
        doctors:doctor_id (id, full_name),
        hospitals:hospital_id (id, name)
      `)
      .eq('patient_id', patientId)
      .order('appointment_date', { ascending: false });
    
    if (error) {
      console.warn('Error fetching patient appointments:', error);
      return [];
    }
    
    // Transform to match UI expectations
    return (data || []).map(a => ({
      ...a,
      doctorName: a.doctors?.full_name,
      hospitalName: a.hospitals?.name,
      appointmentDateTime: a.appointment_date && a.appointment_time
        ? new Date(`${a.appointment_date}T${a.appointment_time}`).toISOString()
        : null
    }));
  },

  async getPatientPrescriptions(patientId) {
    const { data, error } = await supabase
      .from('prescriptions')
      .select(`
        id,
        date,
        notes,
        total_cost,
        created_at,
        medicine_id,
        medicines:medicine_id (
          id,
          name,
          description,
          dosage
        )
      `)
      .eq('patient_id', patientId)
      .order('date', { ascending: false });
    
    if (error) {
      console.error('❌ Error fetching prescriptions:', error);
      return [];
    }
    
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

  async getPatientDashboard(patientId) {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      // Get upcoming appointments
      const { data: upcomingAppointments } = await supabase
        .from('appointments')
        .select(`
          id,
          appointment_date,
          appointment_time,
          doctors:doctor_id (full_name),
          hospitals:hospital_id (name)
        `)
        .eq('patient_id', patientId)
        .gte('appointment_date', today)
        .order('appointment_date')
        .limit(1);
      
      const nextAppointment = (upcomingAppointments || [])[0] || null;
      
      // Get total consultations
      const { data: consultations } = await supabase
        .from('consultations')
        .select('id, diagnosis')
        .eq('patient_id', patientId);
      
      // Get last prescription
      const { data: prescriptions } = await supabase
        .from('prescriptions')
        .select(`
          id,
          date,
          total_cost,
          medicines:medicine_id (name)
        `)
        .eq('patient_id', patientId)
        .order('date', { ascending: false })
        .limit(1);
      
      const lastPrescription = (prescriptions || [])[0] || null;
      
      // Get pending lab tests
      const { data: labTests } = await supabase
        .from('lab_tests')
        .select('id')
        .eq('patient_id', patientId)
        .eq('status', 'PENDING');
      
      return {
        upcomingAppointment: nextAppointment ? {
          doctorName: nextAppointment.doctors?.full_name,
          hospitalName: nextAppointment.hospitals?.name,
          dateTime: nextAppointment.appointment_date && nextAppointment.appointment_time
            ? new Date(`${nextAppointment.appointment_date}T${nextAppointment.appointment_time}`).toLocaleString()
            : 'N/A'
        } : { doctorName: 'N/A', hospitalName: 'N/A', dateTime: 'N/A' },
        totalConsultations: (consultations || []).length,
        lastPrescription: lastPrescription ? {
          medicines: lastPrescription.medicines?.name,
          cost: lastPrescription.total_cost
        } : null,
        pendingLabTests: (labTests || []).length
      };
    } catch (err) {
      console.error('Error fetching patient dashboard:', err);
      return {};
    }
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
      .order('full_name');
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
      .order('full_name');
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
      .order('full_name');
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
    try {
      console.log('📋 Fetching doctor dashboard for ID:', doctorId);
      const today = new Date().toISOString().split('T')[0];
      
      // Get doctor info
      const { data: doctor } = await supabase
        .from('doctors')
        .select('*')
        .eq('id', doctorId)
        .single();
      
      // Get today's appointments
      const { data: todayAppointments } = await supabase
        .from('appointments')
        .select('id')
        .eq('doctor_id', doctorId)
        .eq('appointment_date', today);
      
      // Get total patients treated (all completed appointments)
      const { data: treatedAppointments } = await supabase
        .from('appointments')
        .select('patient_id')
        .eq('doctor_id', doctorId)
        .eq('status', 'COMPLETED');
      
      // Get recent prescriptions
      const { data: consultations } = await supabase
        .from('consultations')
        .select('id')
        .eq('doctor_id', doctorId)
        .order('created_at', { ascending: false })
        .limit(5);
      
      const consultationIds = (consultations || []).map(c => c.id);
      const { data: recentPrescriptions } = await supabase
        .from('prescriptions')
        .select(`
          id,
          total_cost,
          consultation_id,
          consultations:consultation_id (id, diagnosis, patient_id, patients:patient_id (full_name))
        `)
        .in('consultation_id', consultationIds);
      
      const uniquePatients = new Set((treatedAppointments || []).map(a => a.patient_id));
      
      console.log('✓ Doctor dashboard loaded');
      return {
        ...doctor,
        todaysAppointments: todayAppointments || [],
        totalPatientsTreated: uniquePatients.size,
        recentPrescriptions: (recentPrescriptions || []).map(p => ({
          ...p,
          totalCost: p.total_cost,
          consultation: p.consultations,
          patientName: p.consultations?.patients?.full_name
        }))
      };
    } catch (err) {
      console.error('❌ Exception fetching doctor dashboard:', err);
      return {};
    }
  },

  async getDoctorAppointments(doctorId) {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          id,
          patient_id,
          doctor_id,
          hospital_id,
          appointment_date,
          appointment_time,
          symptoms_or_disease,
          status,
          created_at,
          patients:patient_id (id, full_name),
          hospitals:hospital_id (id, name)
        `)
        .eq('doctor_id', doctorId)
        .order('appointment_date', { ascending: true });
      if (error) {
        console.warn('Error fetching doctor appointments:', error);
        return [];
      }
      
      // Transform data to match UI expectations
      return (data || []).map(a => ({
        ...a,
        patientFullName: a.patients?.full_name,
        hospitalName: a.hospitals?.name,
        appointmentDateTime: a.appointment_date && a.appointment_time 
          ? new Date(`${a.appointment_date}T${a.appointment_time}`).toISOString()
          : null,
        symptomsOrDisease: a.symptoms_or_disease
      }));
    } catch (err) {
      console.warn('Exception fetching doctor appointments:', err);
      return [];
    }
  },

  async getDoctorTreatedToday(doctorId) {
    try {
      const today = new Date().toISOString().split('T')[0];
      const { data: appointments, error: apptError } = await supabase
        .from('appointments')
        .select(`
          id,
          patient_id,
          doctor_id,
          appointment_date,
          appointment_time,
          status,
          patients:patient_id (id, full_name)
        `)
        .eq('doctor_id', doctorId)
        .eq('appointment_date', today)
        .eq('status', 'COMPLETED')
        .order('appointment_date');
      
      if (apptError) {
        console.warn('Error fetching treated today:', apptError);
        return [];
      }

      // Get consultations for these appointments
      if (!appointments || appointments.length === 0) return [];
      
      const appointmentIds = appointments.map(a => a.id);
      const { data: consultations, error: consError } = await supabase
        .from('consultations')
        .select(`
          id,
          appointment_id,
          diagnosis
        `)
        .in('appointment_id', appointmentIds);
      
      if (consError) {
        console.warn('Error fetching consultations:', consError);
      }

      // Get prescriptions to check if they exist
      const { data: prescriptions, error: prescError } = await supabase
        .from('prescriptions')
        .select('id, consultation_id')
        .in('consultation_id', (consultations || []).map(c => c.id));
      
      if (prescError) {
        console.warn('Error fetching prescriptions:', prescError);
      }

      const prescriptionMap = new Set((prescriptions || []).map(p => p.consultation_id));

      // Combine data
      return (consultations || []).map(consultation => {
        const appointment = appointments.find(a => a.id === consultation.appointment_id);
        return {
          appointmentId: appointment?.id,
          consultationId: consultation.id,
          patientName: appointment?.patients?.full_name,
          diagnosis: consultation.diagnosis,
          dateTime: appointment?.appointment_date && appointment?.appointment_time
            ? new Date(`${appointment.appointment_date}T${appointment.appointment_time}`).toISOString()
            : null,
          hasPrescription: prescriptionMap.has(consultation.id)
        };
      });
    } catch (err) {
      console.warn('Exception fetching treated today:', err);
      return [];
    }
  },

  async getDoctorEligibleConsultations(doctorId) {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('doctor_id', doctorId)
        .eq('status', 'COMPLETED')
        .is('diagnosis', null)
        .order('appointment_date', { ascending: false });
      if (error) {
        console.warn('Error fetching eligible consultations:', error);
        return [];
      }
      return data || [];
    } catch (err) {
      console.warn('Exception fetching eligible consultations:', err);
      return [];
    }
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
