-- =====================================================
-- MediTrust Hospital Management System - Dummy Data
-- Run this in Supabase SQL Editor AFTER running schema.sql
-- =====================================================

-- =====================================================
-- HOSPITALS
-- =====================================================
INSERT INTO hospital (name, address, phone, is_approved) VALUES
('City General Hospital', '123 Main St, City', '123-456-7890', true),
('Sunrise Multispeciality Hospital', '45 Lake View Road', '123-456-7891', true),
('Green Valley Medical Center', '78 River Park Avenue', '123-456-7892', true),
('MetroCare Institute', '12 Central Square', '123-456-7893', true),
('HopeWell Community Hospital', '9 Garden Street', '123-456-7894', true),
('MedTrust', 'Hyderabad, Telangana', '+91-9876543210', true);

-- =====================================================
-- DOCTORS
-- =====================================================
INSERT INTO doctor (name, specialization, license_number, hospital_id, is_approved) VALUES
('Dr. John Doe', 'General Medicine', 'LIC12345', 1, true),
('Dr. Meera Nair', 'Cardiology', 'LIC20001', 2, true),
('Dr. Arjun Verma', 'Neurology', 'LIC20002', 3, true),
('Dr. Priya Shah', 'Orthopedics', 'LIC20003', 4, true),
('Dr. Rohan Kulkarni', 'Dermatology', 'LIC20004', 5, true),
('Dr. Sana Ali', 'Pediatrics', 'LIC20005', 1, true),
('Dr. Vikram Iyer', 'ENT', 'LIC20006', 2, true),
('Dr. Ananya Rao', 'Gynecology', 'LIC20007', 3, true),
('Dr. Karan Gupta', 'Pulmonology', 'LIC20008', 4, true),
('Dr. Neha Bansal', 'Psychiatry', 'LIC20009', 5, true),
('Dr. Sathish Dusharla', 'General Physician', 'MED-2024-SD-001', 6, true);

-- =====================================================
-- STAFF
-- =====================================================
INSERT INTO staff (name, role, employee_id, hospital_id) VALUES
('Jane Smith', 'Nurse', 'EMP001', 1);

-- =====================================================
-- PATIENTS
-- =====================================================
INSERT INTO patient (name, date_of_birth, gender, contact_info, hospital_id) VALUES
('Alice Johnson', '1990-01-01', 'Female', 'alice@example.com', 1),
('Rahul Mehta', '1988-06-11', 'Male', 'rahul@example.com', 2),
('Divya Menon', '1995-09-18', 'Female', 'divya@example.com', 3),
('Karthik Raj', '1992-03-22', 'Male', 'karthik@example.com', 4),
('Raghu', '1995-05-15', 'Male', 'raghu@example.com', 6);

-- =====================================================
-- APP_USERS (Authentication)
-- Passwords are BCrypt encoded
-- Default users: admin/password, doctor/password, patient/password
-- Custom users: ram/ram123, drsathish/doctor123, raghu/raghu123
-- =====================================================
INSERT INTO app_user (username, password, role, full_name, linked_entity_id) VALUES
-- admin/password
('admin', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n3.QNGNvOyDBT1k6bEi4K', 'ADMIN', 'System Administrator', NULL),
-- doctor/password (linked to Dr. John Doe, id=1)
('doctor', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n3.QNGNvOyDBT1k6bEi4K', 'DOCTOR', 'Dr. John Doe', 1),
-- patient/password (linked to Alice Johnson, id=1)
('patient', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n3.QNGNvOyDBT1k6bEi4K', 'PATIENT', 'Alice Johnson', 1),
-- ram/ram123
('ram', '$2a$10$xPPL7nGrhK0j5xLQH5yHoOeqmFsVrLnPBQ6RKJFNi5LBOsGqR2KWi', 'ADMIN', 'Ram', NULL),
-- drsathish/doctor123 (linked to Dr. Sathish Dusharla, id=11)
('drsathish', '$2a$10$QVHPxMloTRhQvC6qBZ.ZluoLMQ6k6AyTkqGHxGf0gkbZ3c1T5qK7m', 'DOCTOR', 'Dr. Sathish Dusharla', 11),
-- raghu/raghu123 (linked to Raghu, id=5)
('raghu', '$2a$10$sPv5L0cVPBhU9n7R0cHxguQCqhVfFcaQB9x5jE0z6Q3HpvCv5lLQS', 'PATIENT', 'Raghu', 5);

-- =====================================================
-- DISEASES
-- =====================================================
INSERT INTO disease (name, description) VALUES
('Common Cold', 'Viral infection of the upper respiratory tract'),
('Flu', 'Influenza viral infection'),
('Diabetes', 'Metabolic disorder affecting blood sugar'),
('Hypertension', 'High blood pressure condition'),
('Asthma', 'Chronic respiratory condition');

-- =====================================================
-- MEDICINES
-- =====================================================
INSERT INTO medicine (name, description, cost, standard_price, is_expensive) VALUES
('Paracetamol', 'Pain reliever and fever reducer', 25.00, 30.00, false),
('Expensive Drug', 'Very expensive medicine', 1000.00, 800.00, true),
('Amoxicillin', 'Antibiotic for bacterial infections', 80.00, 100.00, false),
('Ibuprofen', 'Anti-inflammatory pain reliever', 35.00, 40.00, false),
('Omeprazole', 'Reduces stomach acid', 45.00, 55.00, false),
('Metformin', 'Diabetes medication', 60.00, 75.00, false),
('Azithromycin', 'Antibiotic (Z-Pack)', 150.00, 180.00, false),
('Cetirizine', 'Antihistamine for allergies', 20.00, 25.00, false),
('Dolo 650', 'Fever and pain relief', 30.00, 35.00, false),
('Crocin', 'Paracetamol brand for fever', 28.00, 32.00, false),
('Vitamin D3', 'Vitamin supplement', 200.00, 250.00, true),
('B-Complex', 'Vitamin B complex supplement', 90.00, 110.00, false),
('Montelukast', 'Asthma and allergy medication', 180.00, 220.00, true),
('Atorvastatin', 'Cholesterol lowering medication', 250.00, 300.00, true);

-- =====================================================
-- DISEASE_MEDICINE (Link diseases to recommended medicines)
-- =====================================================
INSERT INTO disease_medicine (disease_id, medicine_id) VALUES
(1, 1),  -- Common Cold -> Paracetamol
(1, 2),  -- Common Cold -> Expensive Drug
(2, 1),  -- Flu -> Paracetamol
(2, 9),  -- Flu -> Dolo 650
(3, 6),  -- Diabetes -> Metformin
(4, 14), -- Hypertension -> Atorvastatin
(5, 13); -- Asthma -> Montelukast

-- =====================================================
-- SAMPLE APPOINTMENT (Raghu with Dr. Sathish Dusharla)
-- =====================================================
INSERT INTO appointment (appointment_date_time, symptoms_or_disease, status, day_patient_number, hospital_id, doctor_id, patient_id) VALUES
(CURRENT_TIMESTAMP + INTERVAL '1 day', 'General checkup and fever', 'SCHEDULED', 1, 6, 11, 5);

-- =====================================================
-- DUMMY DATA COMPLETE
-- =====================================================
