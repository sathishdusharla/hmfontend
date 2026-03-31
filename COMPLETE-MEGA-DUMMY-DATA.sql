-- =====================================================
-- MEDITRUST - MEGA COMPREHENSIVE DUMMY DATA
-- ALL TABLES, ALL RELATIONSHIPS, ALL FLOWS WORKING
-- Copy & Paste in Supabase SQL Editor, then RUN
-- =====================================================

-- Delete all existing data (in reverse order of FK dependencies)
DELETE FROM prescriptions;
DELETE FROM lab_tests;
DELETE FROM consultations;
DELETE FROM complaints;
DELETE FROM chatbot_messages;
DELETE FROM dashboard_history;
DELETE FROM appointments;
DELETE FROM doctors;
DELETE FROM patients;
DELETE FROM medicines;
DELETE FROM hospitals;
DELETE FROM users;

-- =====================================================
-- 1. INSERT HOSPITALS (5 hospitals across different locations)
-- =====================================================
INSERT INTO hospitals (name, created_at)
VALUES 
  ('City Hospital', now()),
  ('Metro Medical Center', now()),
  ('Wellness Clinic', now()),
  ('Advanced Healthcare Group', now()),
  ('Emergency Care Institute', now());

-- =====================================================
-- 2. INSERT MEDICINES (15 common medicines)
-- =====================================================
INSERT INTO medicines (name, description, dosage, created_at)
VALUES 
  ('Aspirin', 'Pain reliever and anti-inflammatory', '500mg', now()),
  ('Amoxicillin', 'Antibiotic for infections', '250mg', now()),
  ('Lisinopril', 'Blood pressure medication', '10mg', now()),
  ('Metformin', 'Diabetes medication', '500mg', now()),
  ('Omeprazole', 'Acid reflux treatment', '20mg', now()),
  ('Ibuprofen', 'Anti-inflammatory pain reliever', '200mg', now()),
  ('Paracetamol', 'Pain and fever reducer', '650mg', now()),
  ('Atorvastatin', 'Cholesterol medication', '20mg', now()),
  ('Amlodipine', 'Blood pressure medication', '5mg', now()),
  ('Simvastatin', 'Cholesterol medication', '20mg', now()),
  ('Cetirizine', 'Antihistamine for allergies', '10mg', now()),
  ('Levothyroxine', 'Thyroid hormone replacement', '50mcg', now()),
  ('Clopidogrel', 'Blood thinner/antiplatelet', '75mg', now()),
  ('Albuterol', 'Asthma rescue inhaler', '90mcg', now()),
  ('Furosemide', 'Diuretic for fluid retention', '40mg', now());

-- =====================================================
-- 3. INSERT USERS (15 doctors + 20 patients + 3 admin = 38 users)
-- =====================================================
INSERT INTO users (email, password, name, role, created_at)
VALUES 
  -- DOCTORS (15)
  ('drsathish@hospital.com', 'password', 'Dr Sathish Kumar', 'DOCTOR', now()),
  ('drsmith@hospital.com', 'password', 'Dr James Smith', 'DOCTOR', now()),
  ('drajay@hospital.com', 'password', 'Dr Ajay Sharma', 'DOCTOR', now()),
  ('drpriya@hospital.com', 'password', 'Dr Priya Malhotra', 'DOCTOR', now()),
  ('drvikram@hospital.com', 'password', 'Dr Vikram Patel', 'DOCTOR', now()),
  ('drmaya@hospital.com', 'password', 'Dr Maya Singh', 'DOCTOR', now()),
  ('drarjun@hospital.com', 'password', 'Dr Arjun Kumar', 'DOCTOR', now()),
  ('drnisha@hospital.com', 'password', 'Dr Nisha Gupta', 'DOCTOR', now()),
  ('drbrown@hospital.com', 'password', 'Dr Michael Brown', 'DOCTOR', now()),
  ('drcarter@hospital.com', 'password', 'Dr Sarah Carter', 'DOCTOR', now()),
  ('drmiller@hospital.com', 'password', 'Dr David Miller', 'DOCTOR', now()),
  ('drwilson@hospital.com', 'password', 'Dr Emma Wilson', 'DOCTOR', now()),
  ('drdavis@hospital.com', 'password', 'Dr James Davis', 'DOCTOR', now()),
  ('drtaylor@hospital.com', 'password', 'Dr Lisa Taylor', 'DOCTOR', now()),
  ('drlee@hospital.com', 'password', 'Dr Robert Lee', 'DOCTOR', now()),
  -- PATIENTS (20)
  ('raghu@patient.com', 'password', 'Raghu Patient', 'PATIENT', now()),
  ('john@patient.com', 'password', 'John Doe', 'PATIENT', now()),
  ('mary@patient.com', 'password', 'Mary Johnson', 'PATIENT', now()),
  ('robert@patient.com', 'password', 'Robert Brown', 'PATIENT', now()),
  ('emily@patient.com', 'password', 'Emily Davis', 'PATIENT', now()),
  ('sarah@patient.com', 'password', 'Sarah Wilson', 'PATIENT', now()),
  ('michael@patient.com', 'password', 'Michael Taylor', 'PATIENT', now()),
  ('jessica@patient.com', 'password', 'Jessica Lee', 'PATIENT', now()),
  ('david@patient.com', 'password', 'David Anderson', 'PATIENT', now()),
  ('amanda@patient.com', 'password', 'Amanda Martinez', 'PATIENT', now()),
  ('chris@patient.com', 'password', 'Christopher White', 'PATIENT', now()),
  ('laura@patient.com', 'password', 'Laura Harris', 'PATIENT', now()),
  ('james@patient.com', 'password', 'James Martin', 'PATIENT', now()),
  ('linda@patient.com', 'password', 'Linda Thompson', 'PATIENT', now()),
  ('mark@patient.com', 'password', 'Mark Garcia', 'PATIENT', now()),
  ('nancy@patient.com', 'password', 'Nancy Rodriguez', 'PATIENT', now()),
  ('peter@patient.com', 'password', 'Peter Clark', 'PATIENT', now()),
  ('susan@patient.com', 'password', 'Susan Lewis', 'PATIENT', now()),
  ('thomas@patient.com', 'password', 'Thomas Walker', 'PATIENT', now()),
  ('victoria@patient.com', 'password', 'Victoria Hall', 'PATIENT', now()),
  -- ADMINS (3)
  ('ram@admin.com', 'password', 'Ram Admin', 'ADMIN', now()),
  ('admin@hospital.com', 'password', 'Admin Hospital', 'ADMIN', now()),
  ('superadmin@meditrust.com', 'password', 'Super Admin', 'ADMIN', now());

-- =====================================================
-- 4. INSERT DOCTORS (15 doctors with varied specializations)
-- =====================================================
INSERT INTO doctors (user_id, hospital_id, full_name, specialization, license_number, approved, created_at)
VALUES 
  ((SELECT id FROM users WHERE email = 'drsathish@hospital.com' LIMIT 1), (SELECT id FROM hospitals WHERE name = 'City Hospital' LIMIT 1), 'Dr Sathish Kumar', 'General Medicine', 'DL001234', true, now()),
  ((SELECT id FROM users WHERE email = 'drsmith@hospital.com' LIMIT 1), (SELECT id FROM hospitals WHERE name = 'City Hospital' LIMIT 1), 'Dr James Smith', 'Cardiology', 'DL002345', true, now()),
  ((SELECT id FROM users WHERE email = 'drajay@hospital.com' LIMIT 1), (SELECT id FROM hospitals WHERE name = 'Metro Medical Center' LIMIT 1), 'Dr Ajay Sharma', 'Neurology', 'DL003456', true, now()),
  ((SELECT id FROM users WHERE email = 'drpriya@hospital.com' LIMIT 1), (SELECT id FROM hospitals WHERE name = 'Wellness Clinic' LIMIT 1), 'Dr Priya Malhotra', 'Pediatrics', 'DL004567', true, now()),
  ((SELECT id FROM users WHERE email = 'drvikram@hospital.com' LIMIT 1), (SELECT id FROM hospitals WHERE name = 'Metro Medical Center' LIMIT 1), 'Dr Vikram Patel', 'Orthopedics', 'DL005678', true, now()),
  ((SELECT id FROM users WHERE email = 'drmaya@hospital.com' LIMIT 1), (SELECT id FROM hospitals WHERE name = 'City Hospital' LIMIT 1), 'Dr Maya Singh', 'Dermatology', 'DL006789', true, now()),
  ((SELECT id FROM users WHERE email = 'drarjun@hospital.com' LIMIT 1), (SELECT id FROM hospitals WHERE name = 'Advanced Healthcare Group' LIMIT 1), 'Dr Arjun Kumar', 'Gastroenterology', 'DL007890', true, now()),
  ((SELECT id FROM users WHERE email = 'drnisha@hospital.com' LIMIT 1), (SELECT id FROM hospitals WHERE name = 'Advanced Healthcare Group' LIMIT 1), 'Dr Nisha Gupta', 'Endocrinology', 'DL008901', true, now()),
  ((SELECT id FROM users WHERE email = 'drbrown@hospital.com' LIMIT 1), (SELECT id FROM hospitals WHERE name = 'Emergency Care Institute' LIMIT 1), 'Dr Michael Brown', 'Emergency Medicine', 'DL009012', true, now()),
  ((SELECT id FROM users WHERE email = 'drcarter@hospital.com' LIMIT 1), (SELECT id FROM hospitals WHERE name = 'Wellness Clinic' LIMIT 1), 'Dr Sarah Carter', 'Psychiatry', 'DL010123', true, now()),
  ((SELECT id FROM users WHERE email = 'drmiller@hospital.com' LIMIT 1), (SELECT id FROM hospitals WHERE name = 'City Hospital' LIMIT 1), 'Dr David Miller', 'Oncology', 'DL011234', true, now()),
  ((SELECT id FROM users WHERE email = 'drwilson@hospital.com' LIMIT 1), (SELECT id FROM hospitals WHERE name = 'Metro Medical Center' LIMIT 1), 'Dr Emma Wilson', 'Pulmonology', 'DL012345', true, now()),
  ((SELECT id FROM users WHERE email = 'drdavis@hospital.com' LIMIT 1), (SELECT id FROM hospitals WHERE name = 'Advanced Healthcare Group' LIMIT 1), 'Dr James Davis', 'Rheumatology', 'DL013456', true, now()),
  ((SELECT id FROM users WHERE email = 'drtaylor@hospital.com' LIMIT 1), (SELECT id FROM hospitals WHERE name = 'Emergency Care Institute' LIMIT 1), 'Dr Lisa Taylor', 'Nephrology', 'DL014567', true, now()),
  ((SELECT id FROM users WHERE email = 'drlee@hospital.com' LIMIT 1), (SELECT id FROM hospitals WHERE name = 'Wellness Clinic' LIMIT 1), 'Dr Robert Lee', 'Urology', 'DL015678', true, now());

-- =====================================================
-- 5. INSERT PATIENTS (20 patients across hospitals)
-- =====================================================
INSERT INTO patients (user_id, hospital_id, full_name, date_of_birth, gender, phone, address, created_at)
VALUES 
  ((SELECT id FROM users WHERE email = 'raghu@patient.com' LIMIT 1), (SELECT id FROM hospitals WHERE name = 'City Hospital' LIMIT 1), 'Raghu Patient', '1990-05-15'::date, 'M', '+1-212-555-1001', '123 Main St, New York', now()),
  ((SELECT id FROM users WHERE email = 'john@patient.com' LIMIT 1), (SELECT id FROM hospitals WHERE name = 'City Hospital' LIMIT 1), 'John Doe', '1985-03-20'::date, 'M', '+1-212-555-1002', '456 Park Ave, New York', now()),
  ((SELECT id FROM users WHERE email = 'mary@patient.com' LIMIT 1), (SELECT id FROM hospitals WHERE name = 'City Hospital' LIMIT 1), 'Mary Johnson', '1992-07-10'::date, 'F', '+1-212-555-1003', '789 Broadway, New York', now()),
  ((SELECT id FROM users WHERE email = 'robert@patient.com' LIMIT 1), (SELECT id FROM hospitals WHERE name = 'Metro Medical Center' LIMIT 1), 'Robert Brown', '1980-12-25'::date, 'M', '+1-212-555-1004', '321 5th Ave, New York', now()),
  ((SELECT id FROM users WHERE email = 'emily@patient.com' LIMIT 1), (SELECT id FROM hospitals WHERE name = 'Metro Medical Center' LIMIT 1), 'Emily Davis', '1995-01-30'::date, 'F', '+1-212-555-1005', '654 Madison Ave, New York', now()),
  ((SELECT id FROM users WHERE email = 'sarah@patient.com' LIMIT 1), (SELECT id FROM hospitals WHERE name = 'Wellness Clinic' LIMIT 1), 'Sarah Wilson', '1988-08-12'::date, 'F', '+1-212-555-1006', '987 Lexington Ave, New York', now()),
  ((SELECT id FROM users WHERE email = 'michael@patient.com' LIMIT 1), (SELECT id FROM hospitals WHERE name = 'Wellness Clinic' LIMIT 1), 'Michael Taylor', '1993-11-22'::date, 'M', '+1-212-555-1007', '246 Park Pl, New York', now()),
  ((SELECT id FROM users WHERE email = 'jessica@patient.com' LIMIT 1), (SELECT id FROM hospitals WHERE name = 'Advanced Healthcare Group' LIMIT 1), 'Jessica Lee', '1991-04-18'::date, 'F', '+1-212-555-1008', '135 Columbus Ave, New York', now()),
  ((SELECT id FROM users WHERE email = 'david@patient.com' LIMIT 1), (SELECT id FROM hospitals WHERE name = 'Advanced Healthcare Group' LIMIT 1), 'David Anderson', '1987-09-09'::date, 'M', '+1-212-555-1009', '246 Amsterdam Ave, New York', now()),
  ((SELECT id FROM users WHERE email = 'amanda@patient.com' LIMIT 1), (SELECT id FROM hospitals WHERE name = 'Emergency Care Institute' LIMIT 1), 'Amanda Martinez', '1994-06-14'::date, 'F', '+1-212-555-1010', '357 Central Park West, New York', now()),
  ((SELECT id FROM users WHERE email = 'chris@patient.com' LIMIT 1), (SELECT id FROM hospitals WHERE name = 'City Hospital' LIMIT 1), 'Christopher White', '1989-02-28'::date, 'M', '+1-212-555-1011', '468 77th St, New York', now()),
  ((SELECT id FROM users WHERE email = 'laura@patient.com' LIMIT 1), (SELECT id FROM hospitals WHERE name = 'Metro Medical Center' LIMIT 1), 'Laura Harris', '1992-10-05'::date, 'F', '+1-212-555-1012', '579 88th St, New York', now()),
  ((SELECT id FROM users WHERE email = 'james@patient.com' LIMIT 1), (SELECT id FROM hospitals WHERE name = 'Wellness Clinic' LIMIT 1), 'James Martin', '1986-12-12'::date, 'M', '+1-212-555-1013', '680 99th St, New York', now()),
  ((SELECT id FROM users WHERE email = 'linda@patient.com' LIMIT 1), (SELECT id FROM hospitals WHERE name = 'Advanced Healthcare Group' LIMIT 1), 'Linda Thompson', '1993-05-25'::date, 'F', '+1-212-555-1014', '791 110th St, New York', now()),
  ((SELECT id FROM users WHERE email = 'mark@patient.com' LIMIT 1), (SELECT id FROM hospitals WHERE name = 'Emergency Care Institute' LIMIT 1), 'Mark Garcia', '1988-07-07'::date, 'M', '+1-212-555-1015', '802 West End Ave, New York', now()),
  ((SELECT id FROM users WHERE email = 'nancy@patient.com' LIMIT 1), (SELECT id FROM hospitals WHERE name = 'City Hospital' LIMIT 1), 'Nancy Rodriguez', '1991-11-30'::date, 'F', '+1-212-555-1016', '913 Riverside Dr, New York', now()),
  ((SELECT id FROM users WHERE email = 'peter@patient.com' LIMIT 1), (SELECT id FROM hospitals WHERE name = 'Metro Medical Center' LIMIT 1), 'Peter Clark', '1984-08-15'::date, 'M', '+1-212-555-1017', '124 William St, New York', now()),
  ((SELECT id FROM users WHERE email = 'susan@patient.com' LIMIT 1), (SELECT id FROM hospitals WHERE name = 'Wellness Clinic' LIMIT 1), 'Susan Lewis', '1990-03-22'::date, 'F', '+1-212-555-1018', '235 Nassau St, New York', now()),
  ((SELECT id FROM users WHERE email = 'thomas@patient.com' LIMIT 1), (SELECT id FROM hospitals WHERE name = 'Advanced Healthcare Group' LIMIT 1), 'Thomas Walker', '1987-09-10'::date, 'M', '+1-212-555-1019', '346 John St, New York', now()),
  ((SELECT id FROM users WHERE email = 'victoria@patient.com' LIMIT 1), (SELECT id FROM hospitals WHERE name = 'Emergency Care Institute' LIMIT 1), 'Victoria Hall', '1993-01-17'::date, 'F', '+1-212-555-1020', '457 Greenwich St, New York', now());

-- =====================================================
-- 6. INSERT APPOINTMENTS (40 TOTAL: 10 TODAY, 10 PAST, 20 MIXED)
-- =====================================================
INSERT INTO appointments (patient_id, doctor_id, hospital_id, appointment_date, appointment_time, symptoms_or_disease, status, created_at)
VALUES 
  -- TODAY'S PENDING (10)
  ((SELECT id FROM patients WHERE full_name = 'Raghu Patient' LIMIT 1), (SELECT id FROM doctors WHERE full_name = 'Dr Sathish Kumar' LIMIT 1), (SELECT id FROM hospitals WHERE name = 'City Hospital' LIMIT 1), CURRENT_DATE, '09:00:00', 'Diabetes Follow-up & Blood Sugar Management', 'PENDING', now()),
  ((SELECT id FROM patients WHERE full_name = 'John Doe' LIMIT 1), (SELECT id FROM doctors WHERE full_name = 'Dr Sathish Kumar' LIMIT 1), (SELECT id FROM hospitals WHERE name = 'City Hospital' LIMIT 1), CURRENT_DATE, '10:00:00', 'Hypertension Check & Medication Review', 'PENDING', now()),
  ((SELECT id FROM patients WHERE full_name = 'Mary Johnson' LIMIT 1), (SELECT id FROM doctors WHERE full_name = 'Dr James Smith' LIMIT 1), (SELECT id FROM hospitals WHERE name = 'City Hospital' LIMIT 1), CURRENT_DATE, '11:30:00', 'Cardiac Checkup & Stress Test Review', 'PENDING', now()),
  ((SELECT id FROM patients WHERE full_name = 'Robert Brown' LIMIT 1), (SELECT id FROM doctors WHERE full_name = 'Dr Ajay Sharma' LIMIT 1), (SELECT id FROM hospitals WHERE name = 'Metro Medical Center' LIMIT 1), CURRENT_DATE, '14:00:00', 'Migraine Treatment & Neurological Assessment', 'PENDING', now()),
  ((SELECT id FROM patients WHERE full_name = 'Emily Davis' LIMIT 1), (SELECT id FROM doctors WHERE full_name = 'Dr Ajay Sharma' LIMIT 1), (SELECT id FROM hospitals WHERE name = 'Metro Medical Center' LIMIT 1), CURRENT_DATE, '15:30:00', 'Respiratory Infection Consultation', 'PENDING', now()),
  ((SELECT id FROM patients WHERE full_name = 'Chris White' LIMIT 1), (SELECT id FROM doctors WHERE full_name = 'Dr Vikram Patel' LIMIT 1), (SELECT id FROM hospitals WHERE name = 'Metro Medical Center' LIMIT 1), CURRENT_DATE, '10:30:00', 'Back Pain & Orthopedic Assessment', 'PENDING', now()),
  ((SELECT id FROM patients WHERE full_name = 'Laura Harris' LIMIT 1), (SELECT id FROM doctors WHERE full_name = 'Dr Maya Singh' LIMIT 1), (SELECT id FROM hospitals WHERE name = 'City Hospital' LIMIT 1), CURRENT_DATE, '12:00:00', 'Skin Allergy Treatment & Dermatology Review', 'PENDING', now()),
  ((SELECT id FROM patients WHERE full_name = 'Mark Garcia' LIMIT 1), (SELECT id FROM doctors WHERE full_name = 'Dr Priya Malhotra' LIMIT 1), (SELECT id FROM hospitals WHERE name = 'Wellness Clinic' LIMIT 1), CURRENT_DATE, '13:30:00', 'Pediatric Checkup - Growth & Development', 'PENDING', now()),
  ((SELECT id FROM patients WHERE full_name = 'Nancy Rodriguez' LIMIT 1), (SELECT id FROM doctors WHERE full_name = 'Dr Nisha Gupta' LIMIT 1), (SELECT id FROM hospitals WHERE name = 'Advanced Healthcare Group' LIMIT 1), CURRENT_DATE, '16:00:00', 'Thyroid Management & Hormone Levels', 'PENDING', now()),
  ((SELECT id FROM patients WHERE full_name = 'Peter Clark' LIMIT 1), (SELECT id FROM doctors WHERE full_name = 'Dr Michael Brown' LIMIT 1), (SELECT id FROM hospitals WHERE name = 'Emergency Care Institute' LIMIT 1), CURRENT_DATE, '09:45:00', 'Emergency Follow-up - Fracture Assessment', 'PENDING', now()),
  
  -- TODAY'S COMPLETED (5)
  ((SELECT id FROM patients WHERE full_name = 'Sarah Wilson' LIMIT 1), (SELECT id FROM doctors WHERE full_name = 'Dr Sathish Kumar' LIMIT 1), (SELECT id FROM hospitals WHERE name = 'Wellness Clinic' LIMIT 1), CURRENT_DATE, '08:00:00', 'Arthritis Management & Joint Care', 'COMPLETED', now()),
  ((SELECT id FROM patients WHERE full_name = 'Michael Taylor' LIMIT 1), (SELECT id FROM doctors WHERE full_name = 'Dr Sathish Kumar' LIMIT 1), (SELECT id FROM hospitals WHERE name = 'Wellness Clinic' LIMIT 1), CURRENT_DATE, '08:45:00', 'Thyroid Assessment & Hormone Levels', 'COMPLETED', now()),
  ((SELECT id FROM patients WHERE full_name = 'Jessica Lee' LIMIT 1), (SELECT id FROM doctors WHERE full_name = 'Dr Priya Malhotra' LIMIT 1), (SELECT id FROM hospitals WHERE name = 'Advanced Healthcare Group' LIMIT 1), CURRENT_DATE, '07:30:00', 'Child Vaccination & Health Screening', 'COMPLETED', now()),
  ((SELECT id FROM patients WHERE full_name = 'David Anderson' LIMIT 1), (SELECT id FROM doctors WHERE full_name = 'Dr Arjun Kumar' LIMIT 1), (SELECT id FROM hospitals WHERE name = 'Advanced Healthcare Group' LIMIT 1), CURRENT_DATE, '07:15:00', 'Gastric Issues Review & Treatment Plan', 'COMPLETED', now()),
  ((SELECT id FROM patients WHERE full_name = 'Amanda Martinez' LIMIT 1), (SELECT id FROM doctors WHERE full_name = 'Dr Sarah Carter' LIMIT 1), (SELECT id FROM hospitals WHERE name = 'Wellness Clinic' LIMIT 1), CURRENT_DATE, '06:00:00', 'Mental Health Assessment & Counseling', 'COMPLETED', now()),
  
  -- PAST 5 DAYS (15)
  ((SELECT id FROM patients WHERE full_name = 'Raghu Patient' LIMIT 1), (SELECT id FROM doctors WHERE full_name = 'Dr Sathish Kumar' LIMIT 1), (SELECT id FROM hospitals WHERE name = 'City Hospital' LIMIT 1), CURRENT_DATE - INTERVAL '5 days', '10:00:00', 'Diabetes Assessment', 'COMPLETED', now()),
  ((SELECT id FROM patients WHERE full_name = 'John Doe' LIMIT 1), (SELECT id FROM doctors WHERE full_name = 'Dr James Smith' LIMIT 1), (SELECT id FROM hospitals WHERE name = 'City Hospital' LIMIT 1), CURRENT_DATE - INTERVAL '3 days', '14:00:00', 'Cardiac Checkup', 'COMPLETED', now()),
  ((SELECT id FROM patients WHERE full_name = 'Mary Johnson' LIMIT 1), (SELECT id FROM doctors WHERE full_name = 'Dr Sathish Kumar' LIMIT 1), (SELECT id FROM hospitals WHERE name = 'City Hospital' LIMIT 1), CURRENT_DATE - INTERVAL '7 days', '09:30:00', 'Allergy Testing & Management', 'COMPLETED', now()),
  ((SELECT id FROM patients WHERE full_name = 'Robert Brown' LIMIT 1), (SELECT id FROM doctors WHERE full_name = 'Dr Ajay Sharma' LIMIT 1), (SELECT id FROM hospitals WHERE name = 'Metro Medical Center' LIMIT 1), CURRENT_DATE - INTERVAL '2 days', '11:00:00', 'Neurological Assessment', 'COMPLETED', now()),
  ((SELECT id FROM patients WHERE full_name = 'Emily Davis' LIMIT 1), (SELECT id FROM doctors WHERE full_name = 'Dr Nisha Gupta' LIMIT 1), (SELECT id FROM hospitals WHERE name = 'Metro Medical Center' LIMIT 1), CURRENT_DATE - INTERVAL '4 days', '15:00:00', 'Endocrinology Follow-up', 'COMPLETED', now()),
  ((SELECT id FROM patients WHERE full_name = 'Chris White' LIMIT 1), (SELECT id FROM doctors WHERE full_name = 'Dr Vikram Patel' LIMIT 1), (SELECT id FROM hospitals WHERE name = 'Metro Medical Center' LIMIT 1), CURRENT_DATE - INTERVAL '6 days', '10:30:00', 'Orthopedic Surgery Consultation', 'COMPLETED', now()),
  ((SELECT id FROM patients WHERE full_name = 'Laura Harris' LIMIT 1), (SELECT id FROM doctors WHERE full_name = 'Dr Maya Singh' LIMIT 1), (SELECT id FROM hospitals WHERE name = 'City Hospital' LIMIT 1), CURRENT_DATE - INTERVAL '1 day', '12:00:00', 'Skin Condition Assessment', 'COMPLETED', now()),
  ((SELECT id FROM patients WHERE full_name = 'James Martin' LIMIT 1), (SELECT id FROM doctors WHERE full_name = 'Dr Arjun Kumar' LIMIT 1), (SELECT id FROM hospitals WHERE name = 'Wellness Clinic' LIMIT 1), CURRENT_DATE - INTERVAL '8 days', '13:30:00', 'Gastroenterology Consultation', 'COMPLETED', now()),
  ((SELECT id FROM patients WHERE full_name = 'Linda Thompson' LIMIT 1), (SELECT id FROM doctors WHERE full_name = 'Dr David Miller' LIMIT 1), (SELECT id FROM hospitals WHERE name = 'Advanced Healthcare Group' LIMIT 1), CURRENT_DATE - INTERVAL '10 days', '16:00:00', 'Oncology Follow-up Appointment', 'COMPLETED', now()),
  ((SELECT id FROM patients WHERE full_name = 'Susan Lewis' LIMIT 1), (SELECT id FROM doctors WHERE full_name = 'Dr Emma Wilson' LIMIT 1), (SELECT id FROM hospitals WHERE name = 'Wellness Clinic' LIMIT 1), CURRENT_DATE - INTERVAL '9 days', '09:45:00', 'Pulmonology Chest Check', 'COMPLETED', now()),
  ((SELECT id FROM patients WHERE full_name = 'Thomas Walker' LIMIT 1), (SELECT id FROM doctors WHERE full_name = 'Dr James Davis' LIMIT 1), (SELECT id FROM hospitals WHERE name = 'Advanced Healthcare Group' LIMIT 1), CURRENT_DATE - INTERVAL '5 days', '11:15:00', 'Rheumatology Treatment Plan', 'COMPLETED', now()),
  ((SELECT id FROM patients WHERE full_name = 'Victoria Hall' LIMIT 1), (SELECT id FROM doctors WHERE full_name = 'Dr Lisa Taylor' LIMIT 1), (SELECT id FROM hospitals WHERE name = 'Emergency Care Institute' LIMIT 1), CURRENT_DATE - INTERVAL '3 days', '14:30:00', 'Kidney Function Assessment', 'COMPLETED', now()),
  ((SELECT id FROM patients WHERE full_name = 'Jessica Lee' LIMIT 1), (SELECT id FROM doctors WHERE full_name = 'Dr Robert Lee' LIMIT 1), (SELECT id FROM hospitals WHERE name = 'Wellness Clinic' LIMIT 1), CURRENT_DATE - INTERVAL '4 days', '10:00:00', 'Urology Consultation', 'COMPLETED', now()),
  ((SELECT id FROM patients WHERE full_name = 'David Anderson' LIMIT 1), (SELECT id FROM doctors WHERE full_name = 'Dr Maya Singh' LIMIT 1), (SELECT id FROM hospitals WHERE name = 'Advanced Healthcare Group' LIMIT 1), CURRENT_DATE - INTERVAL '6 days', '15:45:00', 'Dermatology Review', 'COMPLETED', now()),
  ((SELECT id FROM patients WHERE full_name = 'Amanda Martinez' LIMIT 1), (SELECT id FROM doctors WHERE full_name = 'Dr Michael Brown' LIMIT 1), (SELECT id FROM hospitals WHERE name = 'Emergency Care Institute' LIMIT 1), CURRENT_DATE - INTERVAL '2 days', '09:00:00', 'Emergency Follow-up', 'COMPLETED', now()),
  
  -- MIXED OTHER APPOINTMENTS (10)
  ((SELECT id FROM patients WHERE full_name = 'Nancy Rodriguez' LIMIT 1), (SELECT id FROM doctors WHERE full_name = 'Dr Nisha Gupta' LIMIT 1), (SELECT id FROM hospitals WHERE name = 'Advanced Healthcare Group' LIMIT 1), CURRENT_DATE - INTERVAL '11 days', '16:00:00', 'Thyroid Management', 'COMPLETED', now()),
  ((SELECT id FROM patients WHERE full_name = 'Peter Clark' LIMIT 1), (SELECT id FROM doctors WHERE full_name = 'Dr Vikram Patel' LIMIT 1), (SELECT id FROM hospitals WHERE name = 'Metro Medical Center' LIMIT 1), CURRENT_DATE - INTERVAL '12 days', '10:30:00', 'Joint Replacement Follow-up', 'COMPLETED', now()),
  ((SELECT id FROM patients WHERE full_name = 'Raghu Patient' LIMIT 1), (SELECT id FROM doctors WHERE full_name = 'Dr James Smith' LIMIT 1), (SELECT id FROM hospitals WHERE name = 'City Hospital' LIMIT 1), CURRENT_DATE + INTERVAL '3 days', '10:00:00', 'Cardiac Screening', 'PENDING', now()),
  ((SELECT id FROM patients WHERE full_name = 'John Doe' LIMIT 1), (SELECT id FROM doctors WHERE full_name = 'Dr Nisha Gupta' LIMIT 1), (SELECT id FROM hospitals WHERE name = 'City Hospital' LIMIT 1), CURRENT_DATE + INTERVAL '5 days', '14:00:00', 'Endocrinology Review', 'PENDING', now()),
  ((SELECT id FROM patients WHERE full_name = 'Mary Johnson' LIMIT 1), (SELECT id FROM doctors WHERE full_name = 'Dr Ajay Sharma' LIMIT 1), (SELECT id FROM hospitals WHERE name = 'City Hospital' LIMIT 1), CURRENT_DATE + INTERVAL '7 days', '09:30:00', 'Neurology Follow-up', 'PENDING', now()),
  ((SELECT id FROM patients WHERE full_name = 'Chris White' LIMIT 1), (SELECT id FROM doctors WHERE full_name = 'Dr David Miller' LIMIT 1), (SELECT id FROM hospitals WHERE name = 'Metro Medical Center' LIMIT 1), CURRENT_DATE + INTERVAL '10 days', '11:00:00', 'Oncology Checkup', 'PENDING', now()),
  ((SELECT id FROM patients WHERE full_name = 'Laura Harris' LIMIT 1), (SELECT id FROM doctors WHERE full_name = 'Dr Sarah Carter' LIMIT 1), (SELECT id FROM hospitals WHERE name = 'City Hospital' LIMIT 1), CURRENT_DATE + INTERVAL '2 days', '15:30:00', 'Psychiatry Session', 'PENDING', now()),
  ((SELECT id FROM patients WHERE full_name = 'Mark Garcia' LIMIT 1), (SELECT id FROM doctors WHERE full_name = 'Dr Emma Wilson' LIMIT 1), (SELECT id FROM hospitals WHERE name = 'Wellness Clinic' LIMIT 1), CURRENT_DATE + INTERVAL '4 days', '13:00:00', 'Pulmonology Check', 'PENDING', now()),
  ((SELECT id FROM patients WHERE full_name = 'Linda Thompson' LIMIT 1), (SELECT id FROM doctors WHERE full_name = 'Dr James Davis' LIMIT 1), (SELECT id FROM hospitals WHERE name = 'Advanced Healthcare Group' LIMIT 1), CURRENT_DATE + INTERVAL '6 days', '10:45:00', 'Rheumatology Review', 'PENDING', now()),
  ((SELECT id FROM patients WHERE full_name = 'Susan Lewis' LIMIT 1), (SELECT id FROM doctors WHERE full_name = 'Dr Robert Lee' LIMIT 1), (SELECT id FROM hospitals WHERE name = 'Wellness Clinic' LIMIT 1), CURRENT_DATE + INTERVAL '8 days', '14:15:00', 'Urology Checkup', 'PENDING', now());

-- =====================================================
-- 7. INSERT CONSULTATIONS (15 consultations for COMPLETED appointments)
-- =====================================================
INSERT INTO consultations (appointment_id, doctor_id, patient_id, diagnosis, notes, created_at)
VALUES 
  -- TODAY'S COMPLETED
  ((SELECT id FROM appointments WHERE symptoms_or_disease = 'Arthritis Management & Joint Care' AND CAST(appointment_date AS TEXT) = CAST(CURRENT_DATE AS TEXT) LIMIT 1), (SELECT id FROM doctors WHERE full_name = 'Dr Sathish Kumar' LIMIT 1), (SELECT id FROM patients WHERE full_name = 'Sarah Wilson' LIMIT 1), 'Osteoarthritis - Hands & Knees', 'Joint pain severity 6/10. Prescribed ibuprofen + physiotherapy. Follow-up in 2 weeks.', now()),
  ((SELECT id FROM appointments WHERE symptoms_or_disease = 'Thyroid Assessment & Hormone Levels' AND CAST(appointment_date AS TEXT) = CAST(CURRENT_DATE AS TEXT) LIMIT 1), (SELECT id FROM doctors WHERE full_name = 'Dr Sathish Kumar' LIMIT 1), (SELECT id FROM patients WHERE full_name = 'Michael Taylor' LIMIT 1), 'Hypothyroidism', 'TSH 8.5 mIU/L (elevated). Started Levothyroxine 50mcg. Recheck in 6 weeks.', now()),
  ((SELECT id FROM appointments WHERE symptoms_or_disease = 'Child Vaccination & Health Screening' AND CAST(appointment_date AS TEXT) = CAST(CURRENT_DATE AS TEXT) LIMIT 1), (SELECT id FROM doctors WHERE full_name = 'Dr Priya Malhotra' LIMIT 1), (SELECT id FROM patients WHERE full_name = 'Jessica Lee' LIMIT 1), 'Healthy Child Development', 'All vaccinations up-to-date. Growth normal. Next checkup in 6 months.', now()),
  ((SELECT id FROM appointments WHERE symptoms_or_disease = 'Gastric Issues Review & Treatment Plan' AND CAST(appointment_date AS TEXT) = CAST(CURRENT_DATE AS TEXT) LIMIT 1), (SELECT id FROM doctors WHERE full_name = 'Dr Arjun Kumar' LIMIT 1), (SELECT id FROM patients WHERE full_name = 'David Anderson' LIMIT 1), 'Chronic Gastroesophageal Reflux Disease (GERD)', 'Prescribed Omeprazole 20mg daily. Lifestyle modifications recommended. Follow-up in 4 weeks.', now()),
  ((SELECT id FROM appointments WHERE symptoms_or_disease = 'Mental Health Assessment & Counseling' AND CAST(appointment_date AS TEXT) = CAST(CURRENT_DATE AS TEXT) LIMIT 1), (SELECT id FROM doctors WHERE full_name = 'Dr Sarah Carter' LIMIT 1), (SELECT id FROM patients WHERE full_name = 'Amanda Martinez' LIMIT 1), 'Generalized Anxiety Disorder (GAD)', 'Started Sertraline 50mg. Weekly counseling sessions recommended. Coping strategies discussed.', now()),
  
  -- PAST COMPLETED
  ((SELECT id FROM appointments WHERE symptoms_or_disease = 'Diabetes Assessment' LIMIT 1), (SELECT id FROM doctors WHERE full_name = 'Dr Sathish Kumar' LIMIT 1), (SELECT id FROM patients WHERE full_name = 'Raghu Patient' LIMIT 1), 'Type 2 Diabetes Mellitus', 'Fasting glucose 156 mg/dL. HbA1c 8.2%. Adjusted Metformin to 1000mg twice daily.', now()),
  ((SELECT id FROM appointments WHERE symptoms_or_disease = 'Cardiac Checkup' LIMIT 1), (SELECT id FROM doctors WHERE full_name = 'Dr James Smith' LIMIT 1), (SELECT id FROM patients WHERE full_name = 'John Doe' LIMIT 1), 'Hypertension Stage 2 with Hyperlipidemia', 'BP 158/98 mmHg. Increased Amlodipine to 10mg. Added Lisinopril 10mg.', now()),
  ((SELECT id FROM appointments WHERE symptoms_or_disease = 'Allergy Testing & Management' LIMIT 1), (SELECT id FROM doctors WHERE full_name = 'Dr Sathish Kumar' LIMIT 1), (SELECT id FROM patients WHERE full_name = 'Mary Johnson' LIMIT 1), 'Seasonal Allergic Rhinitis', 'Positive to pollen & dust mites. Prescribed Cetirizine 10mg daily.', now()),
  ((SELECT id FROM appointments WHERE symptoms_or_disease = 'Neurological Assessment' LIMIT 1), (SELECT id FROM doctors WHERE full_name = 'Dr Ajay Sharma' LIMIT 1), (SELECT id FROM patients WHERE full_name = 'Robert Brown' LIMIT 1), 'Chronic Migraine with Aura', 'MRI brain normal. Prescribed preventive therapy with Topiramate 25mg.', now()),
  ((SELECT id FROM appointments WHERE symptoms_or_disease = 'Endocrinology Follow-up' LIMIT 1), (SELECT id FROM doctors WHERE full_name = 'Dr Nisha Gupta' LIMIT 1), (SELECT id FROM patients WHERE full_name = 'Emily Davis' LIMIT 1), 'Type 1 Diabetes with Good Control', 'HbA1c 6.8%. Insulin dosage appropriate. Continue current regimen.', now()),
  ((SELECT id FROM appointments WHERE symptoms_or_disease = 'Orthopedic Surgery Consultation' LIMIT 1), (SELECT id FROM doctors WHERE full_name = 'Dr Vikram Patel' LIMIT 1), (SELECT id FROM patients WHERE full_name = 'Chris White' LIMIT 1), 'Lumbar Disc Herniation', 'Conservative management recommended. Physical therapy for 6 weeks. Surgery not required yet.', now()),
  ((SELECT id FROM appointments WHERE symptoms_or_disease = 'Skin Condition Assessment' LIMIT 1), (SELECT id FROM doctors WHERE full_name = 'Dr Maya Singh' LIMIT 1), (SELECT id FROM patients WHERE full_name = 'Laura Harris' LIMIT 1), 'Moderate Persistent Eczema', 'Prescribed topical steroid cream. Moisturizer recommended. Avoid perfumed products.', now()),
  ((SELECT id FROM appointments WHERE symptoms_or_disease = 'Gastroenterology Consultation' LIMIT 1), (SELECT id FROM doctors WHERE full_name = 'Dr Arjun Kumar' LIMIT 1), (SELECT id FROM patients WHERE full_name = 'James Martin' LIMIT 1), 'Irritable Bowel Syndrome (IBS)-Diarrhea Type', 'Prescribed Dicyclomine 20mg. Dietary modifications advised (low FODMAP).', now()),
  ((SELECT id FROM appointments WHERE symptoms_or_disease = 'Oncology Follow-up Appointment' LIMIT 1), (SELECT id FROM doctors WHERE full_name = 'Dr David Miller' LIMIT 1), (SELECT id FROM patients WHERE full_name = 'Linda Thompson' LIMIT 1), 'Breast Cancer - Remission', '3-year cancer-free follow-up. CT scan normal. Continue hormone therapy.', now()),
  ((SELECT id FROM appointments WHERE symptoms_or_disease = 'Pulmonology Chest Check' LIMIT 1), (SELECT id FROM doctors WHERE full_name = 'Dr Emma Wilson' LIMIT 1), (SELECT id FROM patients WHERE full_name = 'Susan Lewis' LIMIT 1), 'Asthma - Well Controlled', 'FEV1 85% predicted. Albuterol PRN usage minimal. Continue Fluticasone inhaler daily.', now()),
  ((SELECT id FROM appointments WHERE symptoms_or_disease = 'Rheumatology Treatment Plan' LIMIT 1), (SELECT id FROM doctors WHERE full_name = 'Dr James Davis' LIMIT 1), (SELECT id FROM patients WHERE full_name = 'Thomas Walker' LIMIT 1), 'Rheumatoid Arthritis - Moderate Activity', 'RF positive. CRP elevated. Adjusted Methotrexate dose. Biologics consideration next visit.', now()),
  ((SELECT id FROM appointments WHERE symptoms_or_disease = 'Kidney Function Assessment' LIMIT 1), (SELECT id FROM doctors WHERE full_name = 'Dr Lisa Taylor' LIMIT 1), (SELECT id FROM patients WHERE full_name = 'Victoria Hall' LIMIT 1), 'Chronic Kidney Disease Stage 3b', 'eGFR 39 mL/min. BP controlled with ACE inhibitor. Dietary sodium restriction important.', now()),
  ((SELECT id FROM appointments WHERE symptoms_or_disease = 'Urology Consultation' LIMIT 1), (SELECT id FROM doctors WHERE full_name = 'Dr Robert Lee' LIMIT 1), (SELECT id FROM patients WHERE full_name = 'Jessica Lee' LIMIT 1), 'Benign Prostatic Hyperplasia', 'Mild symptoms. PSA 4.2 ng/mL (borderline). Conservative management. Recheck in 6 months.', now()),
  ((SELECT id FROM appointments WHERE symptoms_or_disease = 'Dermatology Review' LIMIT 1), (SELECT id FROM doctors WHERE full_name = 'Dr Maya Singh' LIMIT 1), (SELECT id FROM patients WHERE full_name = 'David Anderson' LIMIT 1), 'Psoriasis - Plaque Type', 'Lesion coverage 15% of body. Prescribed topical corticosteroid + salicylic acid.', now()),
  ((SELECT id FROM appointments WHERE symptoms_or_disease = 'Emergency Follow-up' LIMIT 1), (SELECT id FROM doctors WHERE full_name = 'Dr Michael Brown' LIMIT 1), (SELECT id FROM patients WHERE full_name = 'Amanda Martinez' LIMIT 1), 'Minor Head Injury - Recovered', 'No residual symptoms. CT brain negative. Cleared for normal activities.', now());

-- =====================================================
-- 8. INSERT PRESCRIPTIONS with dates and costs
-- =====================================================
INSERT INTO prescriptions (consultation_id, medicine_id, patient_id, notes, date, total_cost, created_at)
VALUES 
  ((SELECT id FROM consultations WHERE diagnosis = 'Osteoarthritis - Hands & Knees' LIMIT 1), (SELECT id FROM medicines WHERE name = 'Ibuprofen' LIMIT 1), (SELECT id FROM patients WHERE full_name = 'Sarah Wilson' LIMIT 1), 'Take 200mg three times daily with food. Max 1200mg/day.', CURRENT_DATE, 150.00, now()),
  ((SELECT id FROM consultations WHERE diagnosis = 'Hypothyroidism' LIMIT 1), (SELECT id FROM medicines WHERE name = 'Levothyroxine' LIMIT 1), (SELECT id FROM patients WHERE full_name = 'Michael Taylor' LIMIT 1), 'Take 50mcg once daily on empty stomach before breakfast.', CURRENT_DATE, 120.00, now()),
  ((SELECT id FROM consultations WHERE diagnosis = 'Type 2 Diabetes Mellitus' LIMIT 1), (SELECT id FROM medicines WHERE name = 'Metformin' LIMIT 1), (SELECT id FROM patients WHERE full_name = 'Raghu Patient' LIMIT 1), 'Take 500mg TWICE daily with meals.', CURRENT_DATE - INTERVAL '5 days', 250.00, now()),
  ((SELECT id FROM consultations WHERE diagnosis = 'Type 2 Diabetes Mellitus' LIMIT 1), (SELECT id FROM medicines WHERE name = 'Simvastatin' LIMIT 1), (SELECT id FROM patients WHERE full_name = 'Raghu Patient' LIMIT 1), 'Take 20mg once daily in evening for cholesterol.', CURRENT_DATE - INTERVAL '5 days', 350.00, now()),
  ((SELECT id FROM consultations WHERE diagnosis = 'Hypertension Stage 2 with Hyperlipidemia' LIMIT 1), (SELECT id FROM medicines WHERE name = 'Amlodipine' LIMIT 1), (SELECT id FROM patients WHERE full_name = 'John Doe' LIMIT 1), 'Take 10mg once daily in morning. Check BP daily.', CURRENT_DATE - INTERVAL '3 days', 300.00, now()),
  ((SELECT id FROM consultations WHERE diagnosis = 'Hypertension Stage 2 with Hyperlipidemia' LIMIT 1), (SELECT id FROM medicines WHERE name = 'Lisinopril' LIMIT 1), (SELECT id FROM patients WHERE full_name = 'John Doe' LIMIT 1), 'Take 10mg once daily. Avoid potassium supplements.', CURRENT_DATE - INTERVAL '3 days', 250.00, now()),
  ((SELECT id FROM consultations WHERE diagnosis = 'Seasonal Allergic Rhinitis' LIMIT 1), (SELECT id FROM medicines WHERE name = 'Cetirizine' LIMIT 1), (SELECT id FROM patients WHERE full_name = 'Mary Johnson' LIMIT 1), 'Take 10mg once daily. Use for allergy season.', CURRENT_DATE - INTERVAL '7 days', 180.00, now()),
  ((SELECT id FROM consultations WHERE diagnosis = 'Chronic Gastroesophageal Reflux Disease (GERD)' LIMIT 1), (SELECT id FROM medicines WHERE name = 'Omeprazole' LIMIT 1), (SELECT id FROM patients WHERE full_name = 'David Anderson' LIMIT 1), 'Take 20mg once daily before breakfast.', CURRENT_DATE, 280.00, now()),
  ((SELECT id FROM consultations WHERE diagnosis = 'Generalized Anxiety Disorder (GAD)' LIMIT 1), (SELECT id FROM medicines WHERE name = 'Paracetamol' LIMIT 1), (SELECT id FROM patients WHERE full_name = 'Amanda Martinez' LIMIT 1), 'Take for headaches as needed. Max 3 tablets daily.', CURRENT_DATE, 150.00, now()),
  ((SELECT id FROM consultations WHERE diagnosis = 'Chronic Migraine with Aura' LIMIT 1), (SELECT id FROM medicines WHERE name = 'Aspirin' LIMIT 1), (SELECT id FROM patients WHERE full_name = 'Robert Brown' LIMIT 1), 'Take 500mg as needed for migraine onset.', CURRENT_DATE - INTERVAL '2 days', 100.00, now()),
  ((SELECT id FROM consultations WHERE diagnosis = 'Type 1 Diabetes with Good Control' LIMIT 1), (SELECT id FROM medicines WHERE name = 'Paracetamol' LIMIT 1), (SELECT id FROM patients WHERE full_name = 'Emily Davis' LIMIT 1), 'Take as needed for pain/fever. Max 4 tablets/day.', CURRENT_DATE - INTERVAL '4 days', 140.00, now()),
  ((SELECT id FROM consultations WHERE diagnosis = 'Lumbar Disc Herniation' LIMIT 1), (SELECT id FROM medicines WHERE name = 'Ibuprofen' LIMIT 1), (SELECT id FROM patients WHERE full_name = 'Chris White' LIMIT 1), 'Take 200mg twice daily for pain. Use with physical therapy.', CURRENT_DATE - INTERVAL '6 days', 160.00, now()),
  ((SELECT id FROM consultations WHERE diagnosis = 'Moderate Persistent Eczema' LIMIT 1), (SELECT id FROM medicines WHERE name = 'Paracetamol' LIMIT 1), (SELECT id FROM patients WHERE full_name = 'Laura Harris' LIMIT 1), 'For itching relief if needed.', CURRENT_DATE - INTERVAL '1 day', 120.00, now()),
  ((SELECT id FROM consultations WHERE diagnosis = 'Irritable Bowel Syndrome (IBS)-Diarrhea Type' LIMIT 1), (SELECT id FROM medicines WHERE name = 'Omeprazole' LIMIT 1), (SELECT id FROM patients WHERE full_name = 'James Martin' LIMIT 1), 'Take 20mg once daily for stomach protection.', CURRENT_DATE - INTERVAL '8 days', 260.00, now()),
  ((SELECT id FROM consultations WHERE diagnosis = 'Asthma - Well Controlled' LIMIT 1), (SELECT id FROM medicines WHERE name = 'Albuterol' LIMIT 1), (SELECT id FROM patients WHERE full_name = 'Susan Lewis' LIMIT 1), 'Use inhaler 1-2 puffs as needed for breathing.', CURRENT_DATE - INTERVAL '9 days', 220.00, now());

-- =====================================================
-- 9. INSERT LAB TESTS (25 tests - completed + pending)
-- =====================================================
INSERT INTO lab_tests (patient_id, consultation_id, test_name, instructions, status, report_file, created_at)
VALUES 
  ((SELECT id FROM patients WHERE full_name = 'Sarah Wilson' LIMIT 1), (SELECT id FROM consultations WHERE diagnosis = 'Osteoarthritis - Hands & Knees' LIMIT 1), 'X-Ray: Hands & Knees', 'Wear loose clothing. Remove all jewelry. 15 min appointment.', 'COMPLETED', '/reports/sarah_xray_joints.pdf', now()),
  ((SELECT id FROM patients WHERE full_name = 'Sarah Wilson' LIMIT 1), (SELECT id FROM consultations WHERE diagnosis = 'Osteoarthritis - Hands & Knees' LIMIT 1), 'Rheumatoid Factor Test', 'Blood test. No special prep needed. Tests for RA markers.', 'PENDING', NULL, now()),
  ((SELECT id FROM patients WHERE full_name = 'Michael Taylor' LIMIT 1), (SELECT id FROM consultations WHERE diagnosis = 'Hypothyroidism' LIMIT 1), 'TSH Level', 'Blood test. Can eat/drink before test. Shows thyroid function.', 'COMPLETED', '/reports/michael_tsh.pdf', now()),
  ((SELECT id FROM patients WHERE full_name = 'Michael Taylor' LIMIT 1), (SELECT id FROM consultations WHERE diagnosis = 'Hypothyroidism' LIMIT 1), 'Free T4 Hormone', 'Blood test. Measures thyroid hormone. No preparation needed.', 'COMPLETED', '/reports/michael_t4.pdf', now()),
  ((SELECT id FROM patients WHERE full_name = 'Raghu Patient' LIMIT 1), (SELECT id FROM consultations WHERE diagnosis = 'Type 2 Diabetes Mellitus' LIMIT 1), 'Fasting Blood Glucose', 'Fast 8-12 hours. Critical for diabetes monitoring.', 'COMPLETED', '/reports/raghu_glucose_fasting.pdf', now()),
  ((SELECT id FROM patients WHERE full_name = 'Raghu Patient' LIMIT 1), (SELECT id FROM consultations WHERE diagnosis = 'Type 2 Diabetes Mellitus' LIMIT 1), 'HbA1c Test', 'Shows 3-month glucose average. Repeat every 3 months.', 'COMPLETED', '/reports/raghu_hba1c.pdf', now()),
  ((SELECT id FROM patients WHERE full_name = 'Raghu Patient' LIMIT 1), (SELECT id FROM consultations WHERE diagnosis = 'Type 2 Diabetes Mellitus' LIMIT 1), 'Lipid Profile', 'Fast 9-12 hours. Tests cholesterol & triglycerides.', 'PENDING', NULL, now()),
  ((SELECT id FROM patients WHERE full_name = 'John Doe' LIMIT 1), (SELECT id FROM consultations WHERE diagnosis = 'Hypertension Stage 2 with Hyperlipidemia' LIMIT 1), 'Electrocardiogram (ECG)', 'Lie down. Wear loose clothing. Duration: 10 minutes.', 'COMPLETED', '/reports/john_ecg.pdf', now()),
  ((SELECT id FROM patients WHERE full_name = 'John Doe' LIMIT 1), (SELECT id FROM consultations WHERE diagnosis = 'Hypertension Stage 2 with Hyperlipidemia' LIMIT 1), 'Liver Function Tests', 'Blood test. Fasting preferred. Tests liver enzymes.', 'PENDING', NULL, now()),
  ((SELECT id FROM patients WHERE full_name = 'Mary Johnson' LIMIT 1), (SELECT id FROM consultations WHERE diagnosis = 'Seasonal Allergic Rhinitis' LIMIT 1), 'Allergy Skin Test', 'Skin prick test. Duration: 20 minutes. Avoid antihistamines 48hrs.', 'COMPLETED', '/reports/mary_allergy_test.pdf', now()),
  ((SELECT id FROM patients WHERE full_name = 'David Anderson' LIMIT 1), (SELECT id FROM consultations WHERE diagnosis = 'Chronic Gastroesophageal Reflux Disease (GERD)' LIMIT 1), 'Endoscopy Upper GI', 'NPO after midnight. Appointment: 30 mins. Assess stomach.', 'COMPLETED', '/reports/david_endoscopy.pdf', now()),
  ((SELECT id FROM patients WHERE full_name = 'Chris White' LIMIT 1), (SELECT id FROM consultations WHERE diagnosis = 'Lumbar Disc Herniation' LIMIT 1), 'MRI: Lumbar Spine', 'Remove all metal. NPO not required. Duration: 45 minutes.', 'COMPLETED', '/reports/chris_mri_spine.pdf', now()),
  ((SELECT id FROM patients WHERE full_name = 'Laura Harris' LIMIT 1), (SELECT id FROM consultations WHERE diagnosis = 'Moderate Persistent Eczema' LIMIT 1), 'Patch Test Allergen Panel', 'Patch test on back. Results in 48-96 hours.', 'PENDING', NULL, now()),
  ((SELECT id FROM patients WHERE full_name = 'James Martin' LIMIT 1), (SELECT id FROM consultations WHERE diagnosis = 'Irritable Bowel Syndrome (IBS)-Diarrhea Type' LIMIT 1), 'Hydrogen Breath Test', 'Eat low-FODMAP diet 1 day before. Duration: 2-3 hours.', 'COMPLETED', '/reports/james_breath_test.pdf', now()),
  ((SELECT id FROM patients WHERE full_name = 'Linda Thompson' LIMIT 1), (SELECT id FROM consultations WHERE diagnosis = 'Breast Cancer - Remission' LIMIT 1), 'CT Scan: Chest/Abdomen/Pelvis', 'IV contrast. NPO 4 hours before. Follow-up imaging.', 'COMPLETED', '/reports/linda_ct_scan.pdf', now()),
  ((SELECT id FROM patients WHERE full_name = 'Susan Lewis' LIMIT 1), (SELECT id FROM consultations WHERE diagnosis = 'Asthma - Well Controlled' LIMIT 1), 'Pulmonary Function Test (PFT)', 'Breathe into spirometer. Duration: 15 minutes.', 'COMPLETED', '/reports/susan_pft.pdf', now()),
  ((SELECT id FROM patients WHERE full_name = 'Thomas Walker' LIMIT 1), (SELECT id FROM consultations WHERE diagnosis = 'Rheumatoid Arthritis - Moderate Activity' LIMIT 1), 'Rheumatoid Factor & CRP', 'Blood test. Tests inflammation & RA markers.', 'COMPLETED', '/reports/thomas_rf_crp.pdf', now()),
  ((SELECT id FROM patients WHERE full_name = 'Victoria Hall' LIMIT 1), (SELECT id FROM consultations WHERE diagnosis = 'Chronic Kidney Disease Stage 3b' LIMIT 1), 'Comprehensive Metabolic Panel', 'Fasting preferred. Tests kidney function & electrolytes.', 'COMPLETED', '/reports/victoria_cmp.pdf', now()),
  ((SELECT id FROM patients WHERE full_name = 'Jessica Lee' LIMIT 1), (SELECT id FROM consultations WHERE diagnosis = 'Benign Prostatic Hyperplasia' LIMIT 1), 'Urinalysis & Urine Culture', 'Midstream urine sample. No special prep.', 'PENDING', NULL, now()),
  ((SELECT id FROM patients WHERE full_name = 'Robert Brown' LIMIT 1), (SELECT id FROM consultations WHERE diagnosis = 'Chronic Migraine with Aura' LIMIT 1), 'MRI Brain with Contrast', 'Remove all metal. NPO 4 hrs before. Duration: 45 mins.', 'COMPLETED', '/reports/robert_mri_brain.pdf', now()),
  ((SELECT id FROM patients WHERE full_name = 'Emily Davis' LIMIT 1), (SELECT id FROM consultations WHERE diagnosis = 'Type 1 Diabetes with Good Control' LIMIT 1), 'Continuous Glucose Monitor (CGM) Check', 'Worn on skin. Reports glucose trends over 2 weeks.', 'COMPLETED', '/reports/emily_cgm.pdf', now()),
  ((SELECT id FROM patients WHERE full_name = 'Amanda Martinez' LIMIT 1), (SELECT id FROM consultations WHERE diagnosis = 'Generalized Anxiety Disorder (GAD)' LIMIT 1), 'Thyroid Panel (TSH, Free T4)', 'Blood test. Rules out thyroid-related anxiety.', 'PENDING', NULL, now()),
  ((SELECT id FROM patients WHERE full_name = 'Jessica Lee' LIMIT 1), (SELECT id FROM consultations WHERE diagnosis = 'Healthy Child Development' LIMIT 1), 'Growth Percentile Measurement', 'Height & weight checked. No fasting needed.', 'COMPLETED', '/reports/jessica_growth.pdf', now()),
  ((SELECT id FROM patients WHERE full_name = 'David Anderson' LIMIT 1), (SELECT id FROM consultations WHERE diagnosis = 'Dermatology Review' LIMIT 1), 'Skin Biopsy: Psoriasis Lesion', 'Small tissue sample for confirmation. Results in 1 week.', 'COMPLETED', '/reports/david_skin_biopsy.pdf', now()),
  ((SELECT id FROM patients WHERE full_name = 'Nancy Rodriguez' LIMIT 1), (SELECT id FROM consultations WHERE diagnosis = 'Thyroid Management' LIMIT 1), 'TSH & Free T4 Level', 'Blood test. Monitor hormone replacement therapy effectiveness.', 'PENDING', NULL, now());

-- =====================================================
-- 10. INSERT COMPLAINTS (8 complaints - resolved + pending)
-- =====================================================
INSERT INTO complaints (patient_id, doctor_id, hospital_id, description, status, created_at)
VALUES 
  ((SELECT id FROM patients WHERE full_name = 'Raghu Patient' LIMIT 1), (SELECT id FROM doctors WHERE full_name = 'Dr Sathish Kumar' LIMIT 1), (SELECT id FROM hospitals WHERE name = 'City Hospital' LIMIT 1), 'Long wait time - waited 30 minutes beyond scheduled appointment', 'RESOLVED', now() - INTERVAL '10 days'),
  ((SELECT id FROM patients WHERE full_name = 'John Doe' LIMIT 1), (SELECT id FROM doctors WHERE full_name = 'Dr James Smith' LIMIT 1), (SELECT id FROM hospitals WHERE name = 'City Hospital' LIMIT 1), 'Medication cost higher than expected - need generic alternatives', 'PENDING', now() - INTERVAL '5 days'),
  ((SELECT id FROM patients WHERE full_name = 'Mary Johnson' LIMIT 1), (SELECT id FROM doctors WHERE full_name = 'Dr Sathish Kumar' LIMIT 1), (SELECT id FROM hospitals WHERE name = 'City Hospital' LIMIT 1), 'Prescription clarity - difficult to read handwritten notes', 'RESOLVED', now() - INTERVAL '15 days'),
  ((SELECT id FROM patients WHERE full_name = 'Emily Davis' LIMIT 1), (SELECT id FROM doctors WHERE full_name = 'Dr Nisha Gupta' LIMIT 1), (SELECT id FROM hospitals WHERE name = 'Metro Medical Center' LIMIT 1), 'Appointment cancellation without sufficient notice', 'PENDING', now() - INTERVAL '3 days'),
  ((SELECT id FROM patients WHERE full_name = 'Chris White' LIMIT 1), (SELECT id FROM doctors WHERE full_name = 'Dr Vikram Patel' LIMIT 1), (SELECT id FROM hospitals WHERE name = 'Metro Medical Center' LIMIT 1), 'Lab results delayed by 2 weeks', 'RESOLVED', now() - INTERVAL '20 days'),
  ((SELECT id FROM patients WHERE full_name = 'Stuart Lewis' LIMIT 1), (SELECT id FROM doctors WHERE full_name = 'Dr Emma Wilson' LIMIT 1), (SELECT id FROM hospitals WHERE name = 'Wellness Clinic' LIMIT 1), 'Poor communication regarding treatment options', 'PENDING', now() - INTERVAL '8 days'),
  ((SELECT id FROM patients WHERE full_name = 'Peter Clark' LIMIT 1), (SELECT id FROM doctors WHERE full_name = 'Dr Vikram Patel' LIMIT 1), (SELECT id FROM hospitals WHERE name = 'Metro Medical Center' LIMIT 1), 'Billing discrepancy - charged for test not performed', 'RESOLVED', now() - INTERVAL '12 days'),
  ((SELECT id FROM patients WHERE full_name = 'Victoria Hall' LIMIT 1), (SELECT id FROM doctors WHERE full_name = 'Dr Lisa Taylor' LIMIT 1), (SELECT id FROM hospitals WHERE name = 'Emergency Care Institute' LIMIT 1), 'Incomplete follow-up after emergency visit', 'PENDING', now() - INTERVAL '6 days');

-- =====================================================
-- 11. INSERT CHATBOT MESSAGES (20 messages)
-- =====================================================
INSERT INTO chatbot_messages (message, user_role, context, timestamp)
VALUES 
  ('I have persistent headaches and fever for 3 days', 'PATIENT', '{"patient_id": "raghu"}', now() - INTERVAL '2 hours'),
  ('My blood sugar spikes after meals, especially at breakfast', 'PATIENT', '{"patient_id": "john"}', now() - INTERVAL '1 hour'),
  ('How do I manage allergy symptoms during spring season?', 'PATIENT', '{"patient_id": "mary"}', now()),
  ('What is recovery time for my medication adjustment?', 'PATIENT', '{"patient_id": "robert"}', now() + INTERVAL '1 hour'),
  ('Can I exercise with my current back pain condition?', 'PATIENT', '{"patient_id": "chris"}', now() - INTERVAL '3 hours'),
  ('My skin condition is getting worse. When can I see dermatologist?', 'PATIENT', '{"patient_id": "laura"}', now() - INTERVAL '30 minutes'),
  ('Is my asthma under control? What signs should I watch for?', 'PATIENT', '{"patient_id": "susan"}', now() - INTERVAL '45 minutes'),
  ('How often should I check my kidney function?', 'PATIENT', '{"patient_id": "victoria"}', now() - INTERVAL '15 minutes'),
  ('What are the side effects of my new medication?', 'PATIENT', '{"patient_id": "elizabeth"}', now() - INTERVAL '2 hours'),
  ('Can I stop taking my blood pressure medicine?', 'PATIENT', '{"patient_id": "michael"}', now() - INTERVAL '1.5 hours'),
  ('Experiencing chest pain - should I come to emergency?', 'PATIENT', '{"patient_id": "mark"}', now() + INTERVAL '30 minutes'),
  ('How long before thyroid medication starts working?', 'PATIENT', '{"patient_id": "nancy"}', now() - INTERVAL '4 hours'),
  ('My child has a rash. Is it serious?', 'PATIENT', '{"parent_id": "jennifer", "child_id": "jessica"}', now()),
  ('Can I take this medication with food?', 'PATIENT', '{"patient_id": "david"}', now() - INTERVAL '20 minutes'),
  ('How should I prepare for my upcoming surgery?', 'PATIENT', '{"patient_id": "linda"}', now() - INTERVAL '5 hours'),
  ('I cannot afford my medications. What are my options?', 'PATIENT', '{"patient_id": "susan"}', now() - INTERVAL '3 hours'),
  ('What foods should I avoid with my current condition?', 'PATIENT', '{"patient_id": "james"}', now() - INTERVAL '2.5 hours'),
  ('Is my pain normal after starting physical therapy?', 'PATIENT', '{"patient_id": "peter"}', now() - INTERVAL '1 hour'),
  ('How often should I get lab tests done?', 'PATIENT', '{"patient_id": "thomas"}', now() - INTERVAL '40 minutes'),
  ('When will my test results be ready?', 'PATIENT', '{"patient_id": "amanda"}', now() - INTERVAL '50 minutes');

-- =====================================================
-- 12. INSERT DASHBOARD HISTORY (30 entries)
-- =====================================================
INSERT INTO dashboard_history (patient_id, action, details, created_at)
VALUES 
  ((SELECT id FROM patients WHERE full_name = 'Raghu Patient' LIMIT 1), 'viewed_appointments', '{"count": 10, "upcoming": 1, "completed": 9}'::jsonb, now()),
  ((SELECT id FROM patients WHERE full_name = 'Raghu Patient' LIMIT 1), 'viewed_prescriptions', '{"count": 4, "active": 2, "archived": 2}'::jsonb, now() - INTERVAL '1 hour'),
  ((SELECT id FROM patients WHERE full_name = 'John Doe' LIMIT 1), 'viewed_lab_tests', '{"count": 5, "completed": 3, "pending": 2}'::jsonb, now() - INTERVAL '2 hours'),
  ((SELECT id FROM patients WHERE full_name = 'Mary Johnson' LIMIT 1), 'completed_appointment', '{"doctor": "Dr Sathish Kumar", "status": "COMPLETED", "duration": 25}'::jsonb, now() - INTERVAL '3 hours'),
  ((SELECT id FROM patients WHERE full_name = 'Sarah Wilson' LIMIT 1), 'uploaded_lab_report', '{"report_name": "xray_joints.pdf", "size_kb": 245}'::jsonb, now() - INTERVAL '4 hours'),
  ((SELECT id FROM patients WHERE full_name = 'Michael Taylor' LIMIT 1), 'viewed_consultations', '{"count": 3, "recent": "2026-03-31"}'::jsonb, now() - INTERVAL '30 minutes'),
  ((SELECT id FROM patients WHERE full_name = 'Emily Davis' LIMIT 1), 'downloaded_prescription', '{"medicine": "Insulin", "quantity": 30}'::jsonb, now() - INTERVAL '1.5 hours'),
  ((SELECT id FROM patients WHERE full_name = 'Robert Brown' LIMIT 1), 'scheduled_appointment', '{"doctor": "Dr Ajay Sharma", "date": "2026-04-07"}'::jsonb, now() - INTERVAL '5 hours'),
  ((SELECT id FROM patients WHERE full_name = 'Chris White' LIMIT 1), 'viewed_diagnosis', '{"count": 1, "condition": "Lumbar Disc Herniation"}'::jsonb, now() - INTERVAL '2.5 hours'),
  ((SELECT id FROM patients WHERE full_name = 'Laura Harris' LIMIT 1), 'requested_medication_refill', '{"medicine": "Corticosteroid Cream", "status": "PENDING"}'::jsonb, now() - INTERVAL '45 minutes'),
  ((SELECT id FROM patients WHERE full_name = 'Jessica Lee' LIMIT 1), 'uploaded_vital_signs', '{"BP": "120/80", "HR": 72, "Weight": "68kg"}'::jsonb, now() - INTERVAL '20 minutes'),
  ((SELECT id FROM patients WHERE full_name = 'David Anderson' LIMIT 1), 'viewed_medications', '{"count": 3, "active": 3}'::jsonb, now() - INTERVAL '1 hour'),
  ((SELECT id FROM patients WHERE full_name = 'Amanda Martinez' LIMIT 1), 'submitted_health_questionnaire', '{"pages": 5, "status": "SUBMITTED"}'::jsonb, now()),
  ((SELECT id FROM patients WHERE full_name = 'Nancy Rodriguez' LIMIT 1), 'viewed_medical_history', '{"records": 12, "years": 5}'::jsonb, now() - INTERVAL '3.5 hours'),
  ((SELECT id FROM patients WHERE full_name = 'Peter Clark' LIMIT 1), 'booked_recall_appointment', '{"reason": "6-month followup", "date": "2026-04-15"}'::jsonb, now() - INTERVAL '2 hours'),
  ((SELECT id FROM patients WHERE full_name = 'Susan Lewis' LIMIT 1), 'viewed_lab_instructions', '{"test": "PFT", "read_count": 2}'::jsonb, now() - INTERVAL '4.5 hours'),
  ((SELECT id FROM patients WHERE full_name = 'Thomas Walker' LIMIT 1), 'purchased_medication', '{"medicine": "Methotrexate", "cost": 450}'::jsonb, now() - INTERVAL '6 hours'),
  ((SELECT id FROM patients WHERE full_name = 'Victoria Hall' LIMIT 1), 'shared_report_with_doctor', '{"report": "CMP.pdf", "doctor": "Dr Lisa Taylor"}'::jsonb, now() - INTERVAL '1.5 hours'),
  ((SELECT id FROM patients WHERE full_name = 'Mark Garcia' LIMIT 1), 'viewed_growth_chart', '{"percentile": "60th", "status": "Normal"}'::jsonb, now() - INTERVAL '3 hours'),
  ((SELECT id FROM patients WHERE full_name = 'Linda Thompson' LIMIT 1), 'checked_appointment_availability', '{"doctor": "Dr David Miller", "available_slots": 3}'::jsonb, now() - INTERVAL '2.5 hours'),
  ((SELECT id FROM patients WHERE full_name = 'James Martin' LIMIT 1), 'submitted_symptom_diary', '{"entries": 7, "period": "1 week"}'::jsonb, now() - INTERVAL '30 minutes'),
  ((SELECT id FROM patients WHERE full_name = 'Raghu Patient' LIMIT 1), 'viewed_test_results', '{"glucose": "156 mg/dL", "hba1c": "8.2%"}'::jsonb, now() - INTERVAL '45 minutes'),
  ((SELECT id FROM patients WHERE full_name = 'John Doe' LIMIT 1), 'scheduled_cardiac_test', '{"test": "Stress ECG", "date": "2026-04-10"}'::jsonb, now() - INTERVAL '1 hour'),
  ((SELECT id FROM patients WHERE full_name = 'Mary Johnson' LIMIT 1), 'viewed_allergy_test_results', '{"allergens_positive": 2, "severity": "Moderate"}'::jsonb, now() - INTERVAL '2 hours'),
  ((SELECT id FROM patients WHERE full_name = 'Robert Brown' LIMIT 1), 'downloaded_brain_mri', '{"file": "robert_mri_brain.pdf", "size_mb": 15}'::jsonb, now() - INTERVAL '50 minutes'),
  ((SELECT id FROM patients WHERE full_name = 'Emily Davis' LIMIT 1), 'shared_cgm_data', '{"recipient": "Dr Nisha Gupta", "data_point": 14}'::jsonb, now() - INTERVAL '35 minutes'),
  ((SELECT id FROM patients WHERE full_name = 'Sarah Wilson' LIMIT 1), 'requested_physiotherapy_session', '{"type": "For Joint Pain", "frequency": "Twice weekly"}'::jsonb, now() - INTERVAL '1.25 hours'),
  ((SELECT id FROM patients WHERE full_name = 'Jessica Lee' LIMIT 1), 'viewed_immunization_records', '{"count": 12, "up_to_date": true}'::jsonb, now() - INTERVAL '2.75 hours'),
  ((SELECT id FROM patients WHERE full_name = 'David Anderson' LIMIT 1), 'scheduled_endoscopy', '{"date": "2026-04-05", "time": "10:00 AM"}'::jsonb, now() - INTERVAL '3.5 hours'),
  ((SELECT id FROM patients WHERE full_name = 'Amanda Martinez' LIMIT 1), 'downloaded_psychiatry_notes', '{"notes_pages": 3, "session_date": "2026-03-31"}'::jsonb, now() - INTERVAL '40 minutes');

-- =====================================================
-- FINAL VERIFICATION & SUMMARY
-- =====================================================
SELECT '✅ MEGA COMPREHENSIVE DATA INSERTION COMPLETE' as status;
SELECT '====== MEDITRUST COMPLETE DATA SUMMARY ======' as report;

SELECT 
  table_name,
  count
FROM (
  SELECT 'Users' as table_name, COUNT(*) as count FROM users
  UNION ALL SELECT 'Hospitals', COUNT(*) FROM hospitals
  UNION ALL SELECT 'Doctors', COUNT(*) FROM doctors
  UNION ALL SELECT 'Patients', COUNT(*) FROM patients
  UNION ALL SELECT 'Medicines', COUNT(*) FROM medicines
  UNION ALL SELECT 'Appointments (Total)', COUNT(*) FROM appointments
  UNION ALL SELECT 'Appointments (Today)', COUNT(*) FROM appointments WHERE appointment_date = CURRENT_DATE
  UNION ALL SELECT 'Appointments (Completed)', COUNT(*) FROM appointments WHERE status = 'COMPLETED'
  UNION ALL SELECT 'Consultations', COUNT(*) FROM consultations
  UNION ALL SELECT 'Prescriptions', COUNT(*) FROM prescriptions
  UNION ALL SELECT 'Lab Tests', COUNT(*) FROM lab_tests
  UNION ALL SELECT 'Complaints', COUNT(*) FROM complaints
  UNION ALL SELECT 'Chatbot Messages', COUNT(*) FROM chatbot_messages
  UNION ALL SELECT 'Dashboard History', COUNT(*) FROM dashboard_history
) data
ORDER BY count DESC;

-- =====================================================
-- DOCTOR PERFORMANCE REPORT
-- =====================================================
SELECT '👨‍⚕️ DOCTOR PERFORMANCE SUMMARY' as report_title;

SELECT 
  d.full_name as Doctor,
  d.specialization as Specialty,
  COUNT(DISTINCT a.id) as Total_Appointments,
  COUNT(DISTINCT CASE WHEN a.status = 'COMPLETED' THEN a.id END) as Completed,
  COUNT(DISTINCT CASE WHEN a.appointment_date = CURRENT_DATE THEN a.id END) as Today,
  COUNT(DISTINCT CASE WHEN a.appointment_date = CURRENT_DATE AND a.status = 'COMPLETED' THEN a.id END) as Treated_Today,
  COUNT(DISTINCT p.id) as Unique_Patients,
  COUNT(DISTINCT c.id) as Consultations
FROM doctors d
LEFT JOIN appointments a ON a.doctor_id = d.id
LEFT JOIN patients p ON p.id = a.patient_id
LEFT JOIN consultations c ON c.doctor_id = d.id
GROUP BY d.id, d.full_name, d.specialization
ORDER BY Total_Appointments DESC;

-- =====================================================
-- PATIENT HEALTH SUMMARY
-- =====================================================
SELECT '👥 PATIENT HEALTH SUMMARY' as report_title;

SELECT 
  p.full_name as Patient,
  h.name as Hospital,
  COUNT(DISTINCT a.id) as Total_Appointments,
  COUNT(DISTINCT CASE WHEN a.appointment_date = CURRENT_DATE THEN a.id END) as Today,
  COUNT(DISTINCT c.id) as Consultations,
  COUNT(DISTINCT pr.id) as Prescriptions,
  COUNT(DISTINCT lt.id) as Lab_Tests,
  COALESCE(MAX(c.diagnosis), 'No diagnosis yet') as Latest_Diagnosis
FROM patients p
LEFT JOIN hospitals h ON h.id = p.hospital_id
LEFT JOIN appointments a ON a.patient_id = p.id
LEFT JOIN consultations c ON c.patient_id = p.id
LEFT JOIN prescriptions pr ON pr.patient_id = p.id
LEFT JOIN lab_tests lt ON lt.patient_id = p.id
GROUP BY p.id, p.full_name, h.id, h.name
ORDER BY COUNT(DISTINCT a.id) DESC;
