-- =====================================================
-- MEDITRUST - COMPLETE PERFECT DUMMY DATA 
-- ALL FLOWS FULLY INTEGRATED & WORKING
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
-- 1. INSERT HOSPITALS (3 hospitals)
-- =====================================================
INSERT INTO hospitals (name, created_at)
VALUES 
  ('City Hospital', now()),
  ('Metro Medical Center', now()),
  ('Wellness Clinic', now());

-- =====================================================
-- 2. INSERT MEDICINES (10 medicines)
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
  ('Simvastatin', 'Cholesterol medication', '20mg', now());

-- =====================================================
-- 3. INSERT USERS (3 doctors + 7 patients + 1 admin = 11 users)
-- =====================================================
INSERT INTO users (email, password, name, role, created_at)
VALUES 
  -- DOCTORS
  ('drsathish@hospital.com', 'password', 'Dr Sathish Kumar', 'DOCTOR', now()),
  ('drsmith@hospital.com', 'password', 'Dr James Smith', 'DOCTOR', now()),
  ('drajay@hospital.com', 'password', 'Dr Ajay Sharma', 'DOCTOR', now()),
  -- PATIENTS
  ('raghu@patient.com', 'password', 'Raghu Patient', 'PATIENT', now()),
  ('john@patient.com', 'password', 'John Doe', 'PATIENT', now()),
  ('mary@patient.com', 'password', 'Mary Johnson', 'PATIENT', now()),
  ('robert@patient.com', 'password', 'Robert Brown', 'PATIENT', now()),
  ('emily@patient.com', 'password', 'Emily Davis', 'PATIENT', now()),
  ('sarah@patient.com', 'password', 'Sarah Wilson', 'PATIENT', now()),
  ('michael@patient.com', 'password', 'Michael Taylor', 'PATIENT', now()),
  -- ADMIN
  ('ram@admin.com', 'password', 'Ram Admin', 'ADMIN', now());

-- =====================================================
-- 4. INSERT DOCTORS (3 doctors, properly linked to users)
-- =====================================================
INSERT INTO doctors (user_id, hospital_id, full_name, specialization, license_number, approved, created_at)
VALUES 
  (
    (SELECT id FROM users WHERE email = 'drsathish@hospital.com' LIMIT 1),
    (SELECT id FROM hospitals WHERE name = 'City Hospital' LIMIT 1),
    'Dr Sathish Kumar',
    'General Medicine',
    'DL001234',
    true,
    now()
  ),
  (
    (SELECT id FROM users WHERE email = 'drsmith@hospital.com' LIMIT 1),
    (SELECT id FROM hospitals WHERE name = 'City Hospital' LIMIT 1),
    'Dr James Smith',
    'Cardiology',
    'DL002345',
    true,
    now()
  ),
  (
    (SELECT id FROM users WHERE email = 'drajay@hospital.com' LIMIT 1),
    (SELECT id FROM hospitals WHERE name = 'Metro Medical Center' LIMIT 1),
    'Dr Ajay Sharma',
    'Neurology',
    'DL003456',
    true,
    now()
  );

-- =====================================================
-- 5. INSERT PATIENTS (7 patients, properly linked to users)
-- =====================================================
INSERT INTO patients (user_id, hospital_id, full_name, date_of_birth, gender, phone, address, created_at)
VALUES 
  (
    (SELECT id FROM users WHERE email = 'raghu@patient.com' LIMIT 1),
    (SELECT id FROM hospitals WHERE name = 'City Hospital' LIMIT 1),
    'Raghu Patient',
    '1990-05-15'::date,
    'M',
    '+1-212-555-1001',
    '123 Main St, New York',
    now()
  ),
  (
    (SELECT id FROM users WHERE email = 'john@patient.com' LIMIT 1),
    (SELECT id FROM hospitals WHERE name = 'City Hospital' LIMIT 1),
    'John Doe',
    '1985-03-20'::date,
    'M',
    '+1-212-555-1002',
    '456 Park Ave, New York',
    now()
  ),
  (
    (SELECT id FROM users WHERE email = 'mary@patient.com' LIMIT 1),
    (SELECT id FROM hospitals WHERE name = 'City Hospital' LIMIT 1),
    'Mary Johnson',
    '1992-07-10'::date,
    'F',
    '+1-212-555-1003',
    '789 Broadway, New York',
    now()
  ),
  (
    (SELECT id FROM users WHERE email = 'robert@patient.com' LIMIT 1),
    (SELECT id FROM hospitals WHERE name = 'Metro Medical Center' LIMIT 1),
    'Robert Brown',
    '1980-12-25'::date,
    'M',
    '+1-212-555-1004',
    '321 5th Ave, New York',
    now()
  ),
  (
    (SELECT id FROM users WHERE email = 'emily@patient.com' LIMIT 1),
    (SELECT id FROM hospitals WHERE name = 'Metro Medical Center' LIMIT 1),
    'Emily Davis',
    '1995-01-30'::date,
    'F',
    '+1-212-555-1005',
    '654 Madison Ave, New York',
    now()
  ),
  (
    (SELECT id FROM users WHERE email = 'sarah@patient.com' LIMIT 1),
    (SELECT id FROM hospitals WHERE name = 'Wellness Clinic' LIMIT 1),
    'Sarah Wilson',
    '1988-08-12'::date,
    'F',
    '+1-212-555-1006',
    '987 Lexington Ave, New York',
    now()
  ),
  (
    (SELECT id FROM users WHERE email = 'michael@patient.com' LIMIT 1),
    (SELECT id FROM hospitals WHERE name = 'Wellness Clinic' LIMIT 1),
    'Michael Taylor',
    '1993-11-22'::date,
    'M',
    '+1-212-555-1007',
    '246 Park Pl, New York',
    now()
  );

-- =====================================================
-- 6. INSERT APPOINTMENTS - TODAY & PAST
-- 5 PENDING TODAY + 2 COMPLETED TODAY + 3 PAST
-- =====================================================
INSERT INTO appointments (patient_id, doctor_id, hospital_id, appointment_date, appointment_time, symptoms_or_disease, status, created_at)
VALUES 
  -- ===== TODAY'S PENDING APPOINTMENTS (5) =====
  (
    (SELECT id FROM patients WHERE full_name = 'Raghu Patient' LIMIT 1),
    (SELECT id FROM doctors WHERE full_name = 'Dr Sathish Kumar' LIMIT 1),
    (SELECT id FROM hospitals WHERE name = 'City Hospital' LIMIT 1),
    CURRENT_DATE,
    '09:00:00',
    'Diabetes Follow-up & Blood Sugar Management',
    'PENDING',
    now()
  ),
  (
    (SELECT id FROM patients WHERE full_name = 'John Doe' LIMIT 1),
    (SELECT id FROM doctors WHERE full_name = 'Dr Sathish Kumar' LIMIT 1),
    (SELECT id FROM hospitals WHERE name = 'City Hospital' LIMIT 1),
    CURRENT_DATE,
    '10:00:00',
    'Hypertension Check & Medication Review',
    'PENDING',
    now()
  ),
  (
    (SELECT id FROM patients WHERE full_name = 'Mary Johnson' LIMIT 1),
    (SELECT id FROM doctors WHERE full_name = 'Dr Sathish Kumar' LIMIT 1),
    (SELECT id FROM hospitals WHERE name = 'City Hospital' LIMIT 1),
    CURRENT_DATE,
    '11:30:00',
    'General Checkup & Physical Examination',
    'PENDING',
    now()
  ),
  (
    (SELECT id FROM patients WHERE full_name = 'Robert Brown' LIMIT 1),
    (SELECT id FROM doctors WHERE full_name = 'Dr Sathish Kumar' LIMIT 1),
    (SELECT id FROM hospitals WHERE name = 'Metro Medical Center' LIMIT 1),
    CURRENT_DATE,
    '14:00:00',
    'Migraine Treatment & Relief',
    'PENDING',
    now()
  ),
  (
    (SELECT id FROM patients WHERE full_name = 'Emily Davis' LIMIT 1),
    (SELECT id FROM doctors WHERE full_name = 'Dr Sathish Kumar' LIMIT 1),
    (SELECT id FROM hospitals WHERE name = 'Metro Medical Center' LIMIT 1),
    CURRENT_DATE,
    '15:30:00',
    'Respiratory Infection Consultation',
    'PENDING',
    now()
  ),
  -- ===== TODAY'S COMPLETED APPOINTMENTS (2) =====
  (
    (SELECT id FROM patients WHERE full_name = 'Sarah Wilson' LIMIT 1),
    (SELECT id FROM doctors WHERE full_name = 'Dr Sathish Kumar' LIMIT 1),
    (SELECT id FROM hospitals WHERE name = 'Wellness Clinic' LIMIT 1),
    CURRENT_DATE,
    '08:00:00',
    'Arthritis Management & Joint Care',
    'COMPLETED',
    now()
  ),
  (
    (SELECT id FROM patients WHERE full_name = 'Michael Taylor' LIMIT 1),
    (SELECT id FROM doctors WHERE full_name = 'Dr Sathish Kumar' LIMIT 1),
    (SELECT id FROM hospitals WHERE name = 'Wellness Clinic' LIMIT 1),
    CURRENT_DATE,
    '08:45:00',
    'Thyroid Assessment & Hormone Levels',
    'COMPLETED',
    now()
  ),
  -- ===== PAST APPOINTMENTS (3) =====
  (
    (SELECT id FROM patients WHERE full_name = 'Raghu Patient' LIMIT 1),
    (SELECT id FROM doctors WHERE full_name = 'Dr Sathish Kumar' LIMIT 1),
    (SELECT id FROM hospitals WHERE name = 'City Hospital' LIMIT 1),
    CURRENT_DATE - INTERVAL '5 days',
    '10:00:00',
    'Diabetes Assessment',
    'COMPLETED',
    now()
  ),
  (
    (SELECT id FROM patients WHERE full_name = 'John Doe' LIMIT 1),
    (SELECT id FROM doctors WHERE full_name = 'Dr James Smith' LIMIT 1),
    (SELECT id FROM hospitals WHERE name = 'City Hospital' LIMIT 1),
    CURRENT_DATE - INTERVAL '3 days',
    '14:00:00',
    'Cardiac Checkup',
    'COMPLETED',
    now()
  ),
  (
    (SELECT id FROM patients WHERE full_name = 'Mary Johnson' LIMIT 1),
    (SELECT id FROM doctors WHERE full_name = 'Dr Sathish Kumar' LIMIT 1),
    (SELECT id FROM hospitals WHERE name = 'City Hospital' LIMIT 1),
    CURRENT_DATE - INTERVAL '7 days',
    '09:30:00',
    'Allergy Testing & Management',
    'COMPLETED',
    now()
  );

-- =====================================================
-- 7. INSERT CONSULTATIONS (for COMPLETED appointments only)
-- =====================================================
INSERT INTO consultations (appointment_id, doctor_id, patient_id, diagnosis, notes, created_at)
VALUES 
  -- TODAY'S COMPLETED (2)
  (
    (SELECT id FROM appointments WHERE symptoms_or_disease = 'Arthritis Management & Joint Care' AND CAST(appointment_date AS TEXT) = CAST(CURRENT_DATE AS TEXT) LIMIT 1),
    (SELECT id FROM doctors WHERE full_name = 'Dr Sathish Kumar' LIMIT 1),
    (SELECT id FROM patients WHERE full_name = 'Sarah Wilson' LIMIT 1),
    'Osteoarthritis - Hands & Knees',
    'Patient reports joint pain and stiffness. Prescribed anti-inflammatory medications and recommended physiotherapy sessions twice weekly. Pain management plan established with follow-up in 2 weeks.',
    now()
  ),
  (
    (SELECT id FROM appointments WHERE symptoms_or_disease = 'Thyroid Assessment & Hormone Levels' AND CAST(appointment_date AS TEXT) = CAST(CURRENT_DATE AS TEXT) LIMIT 1),
    (SELECT id FROM doctors WHERE full_name = 'Dr Sathish Kumar' LIMIT 1),
    (SELECT id FROM patients WHERE full_name = 'Michael Taylor' LIMIT 1),
    'Hypothyroidism',
    'TSH levels elevated (8.5 mIU/L). Started Levothyroxine 50mcg daily therapy. Advised to take on empty stomach before breakfast. Recheck TSH in 6 weeks to adjust dosage.',
    now()
  ),
  -- PAST COMPLETED (3)
  (
    (SELECT id FROM appointments WHERE symptoms_or_disease = 'Diabetes Assessment' LIMIT 1),
    (SELECT id FROM doctors WHERE full_name = 'Dr Sathish Kumar' LIMIT 1),
    (SELECT id FROM patients WHERE full_name = 'Raghu Patient' LIMIT 1),
    'Type 2 Diabetes Mellitus',
    'Blood sugar: Fasting 156 mg/dL, Post-meal 285 mg/dL. Adjusted Metformin to 1000mg twice daily. Patient counseled on low-glycemic diet and 30-min daily exercise. Next HbA1c check in 3 months.',
    now()
  ),
  (
    (SELECT id FROM appointments WHERE symptoms_or_disease = 'Cardiac Checkup' LIMIT 1),
    (SELECT id FROM doctors WHERE full_name = 'Dr James Smith' LIMIT 1),
    (SELECT id FROM patients WHERE full_name = 'John Doe' LIMIT 1),
    'Hypertension Stage 2',
    'BP: 158/98 mmHg. ECG: Normal sinus rhythm. Increased Amlodipine 5->10mg, Added Lisinopril 10mg. Sodium restriction <2g/day. Exercise 30-45min daily, reduce stress. Follow-up in 1 month.',
    now()
  ),
  (
    (SELECT id FROM appointments WHERE symptoms_or_disease = 'Allergy Testing & Management' LIMIT 1),
    (SELECT id FROM doctors WHERE full_name = 'Dr Sathish Kumar' LIMIT 1),
    (SELECT id FROM patients WHERE full_name = 'Mary Johnson' LIMIT 1),
    'Seasonal Allergic Rhinitis',
    'Positive to pollen and dust mite allergens. Prescribed Cetirizine 10mg daily, mometasone nasal spray. Use HEPA air purifier, hypoallergenic bedding. Avoid allergen exposure. Review in 4 weeks.',
    now()
  );

-- =====================================================
-- 8. INSERT PRESCRIPTIONS (linked to consultations & patients)
-- Includes date (from appointment) and total_cost
-- =====================================================
INSERT INTO prescriptions (consultation_id, medicine_id, patient_id, notes, date, total_cost, created_at)
VALUES 
  -- Sarah Wilson (Arthritis) - COMPLETED TODAY
  (
    (SELECT id FROM consultations WHERE diagnosis = 'Osteoarthritis - Hands & Knees' LIMIT 1),
    (SELECT id FROM medicines WHERE name = 'Ibuprofen' LIMIT 1),
    (SELECT id FROM patients WHERE full_name = 'Sarah Wilson' LIMIT 1),
    'Take 200mg tablet three times daily with meals (morning, afternoon, evening). Maximum 1200mg/day. Use for 2 weeks then reassess pain levels.',
    CURRENT_DATE,
    150.00,
    now()
  ),
  -- Michael Taylor (Thyroid) - COMPLETED TODAY
  (
    (SELECT id FROM consultations WHERE diagnosis = 'Hypothyroidism' LIMIT 1),
    (SELECT id FROM medicines WHERE name = 'Atorvastatin' LIMIT 1),
    (SELECT id FROM patients WHERE full_name = 'Michael Taylor' LIMIT 1),
    'Take 20mg tablet once daily in evening with/without food. Monitor cholesterol levels with labs in 6 weeks.',
    CURRENT_DATE,
    350.00,
    now()
  ),
  -- Raghu Patient (Diabetes) - PAST APPOINTMENT (5 days ago)
  (
    (SELECT id FROM consultations WHERE diagnosis = 'Type 2 Diabetes Mellitus' LIMIT 1),
    (SELECT id FROM medicines WHERE name = 'Metformin' LIMIT 1),
    (SELECT id FROM patients WHERE full_name = 'Raghu Patient' LIMIT 1),
    'Take 500mg tablet TWICE daily with breakfast and dinner. Take with food to minimize stomach upset. Monitor blood sugar 4 times daily (fasting, pre-lunch, pre-dinner, bedtime).',
    CURRENT_DATE - INTERVAL '5 days',
    250.00,
    now()
  ),
  (
    (SELECT id FROM consultations WHERE diagnosis = 'Type 2 Diabetes Mellitus' LIMIT 1),
    (SELECT id FROM medicines WHERE name = 'Simvastatin' LIMIT 1),
    (SELECT id FROM patients WHERE full_name = 'Raghu Patient' LIMIT 1),
    'Take 20mg tablet once daily in evening for cholesterol management. Critical for diabetes patients to prevent cardiovascular complications.',
    CURRENT_DATE - INTERVAL '5 days',
    350.00,
    now()
  ),
  -- John Doe (Hypertension) - PAST APPOINTMENT (3 days ago)
  (
    (SELECT id FROM consultations WHERE diagnosis = 'Hypertension Stage 2' LIMIT 1),
    (SELECT id FROM medicines WHERE name = 'Amlodipine' LIMIT 1),
    (SELECT id FROM patients WHERE full_name = 'John Doe' LIMIT 1),
    'Take 10mg tablet once daily in morning. Check BP daily at same time. Avoid grapefruit and grapefruit juice.',
    CURRENT_DATE - INTERVAL '3 days',
    300.00,
    now()
  ),
  (
    (SELECT id FROM consultations WHERE diagnosis = 'Hypertension Stage 2' LIMIT 1),
    (SELECT id FROM medicines WHERE name = 'Lisinopril' LIMIT 1),
    (SELECT id FROM patients WHERE full_name = 'John Doe' LIMIT 1),
    'Take 10mg tablet once daily in morning. Watch for persistent dry cough (common side effect). Do NOT take with potassium supplements.',
    CURRENT_DATE - INTERVAL '3 days',
    250.00,
    now()
  ),
  -- Mary Johnson (Allergies) - PAST APPOINTMENT (7 days ago)
  (
    (SELECT id FROM consultations WHERE diagnosis = 'Seasonal Allergic Rhinitis' LIMIT 1),
    (SELECT id FROM medicines WHERE name = 'Paracetamol' LIMIT 1),
    (SELECT id FROM patients WHERE full_name = 'Mary Johnson' LIMIT 1),
    'Take 650mg tablet as needed for allergic symptoms (max 4 tablets/day). Can combine with antihistamine initially for faster relief.',
    CURRENT_DATE - INTERVAL '7 days',
    150.00,
    now()
  );

-- =====================================================
-- 9. INSERT LAB TESTS
-- =====================================================
INSERT INTO lab_tests (patient_id, consultation_id, test_name, instructions, status, report_file, created_at)
VALUES 
  -- Sarah Wilson (2 tests)
  (
    (SELECT id FROM patients WHERE full_name = 'Sarah Wilson' LIMIT 1),
    (SELECT id FROM consultations WHERE diagnosis = 'Osteoarthritis - Hands & Knees' LIMIT 1),
    'X-Ray: Hands & Knees',
    'Wear loose clothing without buttons/metal. Remove jewelry. Duration: 15 minutes.',
    'COMPLETED',
    '/reports/sarah_xray_joints.pdf',
    now()
  ),
  (
    (SELECT id FROM patients WHERE full_name = 'Sarah Wilson' LIMIT 1),
    (SELECT id FROM consultations WHERE diagnosis = 'Osteoarthritis - Hands & Knees' LIMIT 1),
    'Rheumatoid Factor Test',
    'Blood test. No fasting needed. Tests for autoimmune arthritis markers.',
    'PENDING',
    NULL,
    now()
  ),
  -- Michael Taylor (2 tests)
  (
    (SELECT id FROM patients WHERE full_name = 'Michael Taylor' LIMIT 1),
    (SELECT id FROM consultations WHERE diagnosis = 'Hypothyroidism' LIMIT 1),
    'TSH (Thyroid Stimulating Hormone)',
    'Blood test. Fasting preferred but not required. Measures thyroid function.',
    'COMPLETED',
    '/reports/michael_tsh.pdf',
    now()
  ),
  (
    (SELECT id FROM patients WHERE full_name = 'Michael Taylor' LIMIT 1),
    (SELECT id FROM consultations WHERE diagnosis = 'Hypothyroidism' LIMIT 1),
    'Free T4 Hormone Level',
    'Blood test. Measures free thyroxine hormone. No special preparation needed.',
    'COMPLETED',
    '/reports/michael_t4.pdf',
    now()
  ),
  -- Raghu Patient (3 tests)
  (
    (SELECT id FROM patients WHERE full_name = 'Raghu Patient' LIMIT 1),
    (SELECT id FROM consultations WHERE diagnosis = 'Type 2 Diabetes Mellitus' LIMIT 1),
    'Complete Blood Count (CBC)',
    'Fasting 8-12 hours. Avoid strenuous exercise 24 hours before. Tests blood cell counts.',
    'COMPLETED',
    '/reports/raghu_cbc.pdf',
    now()
  ),
  (
    (SELECT id FROM patients WHERE full_name = 'Raghu Patient' LIMIT 1),
    (SELECT id FROM consultations WHERE diagnosis = 'Type 2 Diabetes Mellitus' LIMIT 1),
    'Fasting Blood Glucose',
    'Fasting 8-12 hours. No food/drink except water. Critical for diabetes monitoring.',
    'COMPLETED',
    '/reports/raghu_glucose_fasting.pdf',
    now()
  ),
  (
    (SELECT id FROM patients WHERE full_name = 'Raghu Patient' LIMIT 1),
    (SELECT id FROM consultations WHERE diagnosis = 'Type 2 Diabetes Mellitus' LIMIT 1),
    'HbA1c Test',
    'Blood test. Shows 3-month average glucose. Repeat every 3 months.',
    'COMPLETED',
    '/reports/raghu_hba1c.pdf',
    now()
  ),
  -- John Doe (2 tests)
  (
    (SELECT id FROM patients WHERE full_name = 'John Doe' LIMIT 1),
    (SELECT id FROM consultations WHERE diagnosis = 'Hypertension Stage 2' LIMIT 1),
    'Electrocardiogram (ECG)',
    'Wear loose clothing. Lie down. Duration: 10 minutes. Checks heart rhythm.',
    'COMPLETED',
    '/reports/john_ecg.pdf',
    now()
  ),
  (
    (SELECT id FROM patients WHERE full_name = 'John Doe' LIMIT 1),
    (SELECT id FROM consultations WHERE diagnosis = 'Hypertension Stage 2' LIMIT 1),
    'Lipid Profile',
    'Fasting 9-12 hours. No food/drinks except water. Tests cholesterol levels.',
    'PENDING',
    NULL,
    now()
  ),
  -- Mary Johnson (1 test)
  (
    (SELECT id FROM patients WHERE full_name = 'Mary Johnson' LIMIT 1),
    (SELECT id FROM consultations WHERE diagnosis = 'Seasonal Allergic Rhinitis' LIMIT 1),
    'Allergy Skin Test',
    'Skin prick test for common allergens. Duration: 20 minutes. Avoid antihistamines 48 hours before.',
    'COMPLETED',
    '/reports/mary_allergy_test.pdf',
    now()
  );

-- =====================================================
-- 10. INSERT COMPLAINTS
-- =====================================================
INSERT INTO complaints (patient_id, doctor_id, hospital_id, description, status, created_at)
VALUES 
  (
    (SELECT id FROM patients WHERE full_name = 'Raghu Patient' LIMIT 1),
    (SELECT id FROM doctors WHERE full_name = 'Dr Sathish Kumar' LIMIT 1),
    (SELECT id FROM hospitals WHERE name = 'City Hospital' LIMIT 1),
    'Long wait time - waited 30 minutes beyond scheduled appointment time',
    'RESOLVED',
    now() - INTERVAL '10 days'
  ),
  (
    (SELECT id FROM patients WHERE full_name = 'John Doe' LIMIT 1),
    (SELECT id FROM doctors WHERE full_name = 'Dr James Smith' LIMIT 1),
    (SELECT id FROM hospitals WHERE name = 'City Hospital' LIMIT 1),
    'Medication cost higher than expected - need information on generic alternatives',
    'PENDING',
    now() - INTERVAL '5 days'
  );

-- =====================================================
-- 11. INSERT CHATBOT MESSAGES
-- =====================================================
INSERT INTO chatbot_messages (message, user_role, context, timestamp)
VALUES 
  ('I have persistent headaches and fever for 3 days', 'PATIENT', '{"patient_id": "raghu"}', now() - INTERVAL '2 hours'),
  ('My blood sugar spikes after meals, especially at breakfast', 'PATIENT', '{"patient_id": "john"}', now() - INTERVAL '1 hour'),
  ('How do I manage allergy symptoms during spring season?', 'PATIENT', '{"patient_id": "mary"}', now()),
  ('What is recovery time for my medication adjustment?', 'PATIENT', '{"patient_id": "robert"}', now());

-- =====================================================
-- 12. INSERT DASHBOARD HISTORY
-- =====================================================
INSERT INTO dashboard_history (patient_id, action, details, created_at)
VALUES 
  (
    (SELECT id FROM patients WHERE full_name = 'Raghu Patient' LIMIT 1),
    'viewed_appointments',
    '{"count": 10, "upcoming": 1, "completed": 9}'::jsonb,
    now()
  ),
  (
    (SELECT id FROM patients WHERE full_name = 'Raghu Patient' LIMIT 1),
    'viewed_prescriptions',
    '{"count": 4, "active": 2, "archived": 2}'::jsonb,
    now() - INTERVAL '1 hour'
  ),
  (
    (SELECT id FROM patients WHERE full_name = 'John Doe' LIMIT 1),
    'viewed_lab_tests',
    '{"count": 5, "completed": 4, "pending": 1}'::jsonb,
    now() - INTERVAL '2 hours'
  ),
  (
    (SELECT id FROM patients WHERE full_name = 'Mary Johnson' LIMIT 1),
    'completed_appointment',
    '{"doctor": "Dr Sathish Kumar", "status": "COMPLETED", "duration_minutes": 25}'::jsonb,
    now() - INTERVAL '3 hours'
  ),
  (
    (SELECT id FROM patients WHERE full_name = 'Sarah Wilson' LIMIT 1),
    'uploaded_lab_report',
    '{"report_name": "xray_joints.pdf", "test_type": "X-Ray", "date": "2026-03-31"}'::jsonb,
    now() - INTERVAL '4 hours'
  );

-- =====================================================
-- FINAL VERIFICATION & SUMMARY
-- =====================================================
SELECT '✅ DATA INSERTION COMPLETE' as status;
SELECT '====== COMPLETE DATA SUMMARY ======' as report;

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
SELECT '====== DOCTOR SUMMARY ======' as report_title;

SELECT 
  d.full_name as Doctor,
  d.specialization as Specialty,
  COUNT(DISTINCT a.id) as Total_Appointments,
  COUNT(DISTINCT CASE WHEN a.status = 'COMPLETED' THEN a.id END) as Completed,
  COUNT(DISTINCT CASE WHEN a.appointment_date = CURRENT_DATE THEN a.id END) as Today,
  COUNT(DISTINCT CASE WHEN a.appointment_date = CURRENT_DATE AND a.status = 'COMPLETED' THEN a.id END) as Treated_Today,
  COUNT(DISTINCT p.id) as Unique_Patients
FROM doctors d
LEFT JOIN appointments a ON a.doctor_id = d.id
LEFT JOIN patients p ON p.id = a.patient_id
GROUP BY d.id, d.full_name, d.specialization
ORDER BY Completed DESC;

-- =====================================================
-- PATIENT HEALTH SUMMARY
-- =====================================================
SELECT '====== PATIENT SUMMARY ======' as report_title;

SELECT 
  p.full_name as Patient,
  COUNT(DISTINCT a.id) as Total_Appointments,
  COUNT(DISTINCT c.id) as Consultations,
  COUNT(DISTINCT pr.id) as Prescriptions,
  COUNT(DISTINCT lt.id) as Lab_Tests,
  COALESCE(MAX(c.diagnosis), 'No diagnosis yet') as Last_Diagnosis
FROM patients p
LEFT JOIN appointments a ON a.patient_id = p.id
LEFT JOIN consultations c ON c.patient_id = p.id
LEFT JOIN prescriptions pr ON pr.patient_id = p.id
LEFT JOIN lab_tests lt ON lt.patient_id = p.id
GROUP BY p.id, p.full_name
ORDER BY Total_Appointments DESC;
