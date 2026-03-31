-- ============================================
-- MediTrust Enhanced Supabase Setup with Sync Support
-- Execute this in Supabase SQL Editor
-- ============================================

-- ============================================
-- STEP 1: DROP EXISTING TABLES
-- ============================================
DROP TABLE IF EXISTS public.corruption_alert CASCADE;
DROP TABLE IF EXISTS public.prescription_medicine CASCADE;
DROP TABLE IF EXISTS public.prescription CASCADE;
DROP TABLE IF EXISTS public.lab_test CASCADE;
DROP TABLE IF EXISTS public.consultation CASCADE;
DROP TABLE IF EXISTS public.appointment CASCADE;
DROP TABLE IF EXISTS public.disease_medicine CASCADE;
DROP TABLE IF EXISTS public.medicine CASCADE;
DROP TABLE IF EXISTS public.disease CASCADE;
DROP TABLE IF EXISTS public.patient CASCADE;
DROP TABLE IF EXISTS public.staff CASCADE;
DROP TABLE IF EXISTS public.doctor CASCADE;
DROP TABLE IF EXISTS public.app_user CASCADE;
DROP TABLE IF EXISTS public.hospital CASCADE;
DROP TABLE IF EXISTS public.sync_log CASCADE;

-- ============================================
-- STEP 2: CREATE SYNC LOG TABLE (for tracking changes)
-- ============================================
CREATE TABLE public.sync_log (
    id BIGSERIAL PRIMARY KEY,
    table_name VARCHAR(100) NOT NULL,
    record_id BIGINT NOT NULL,
    action VARCHAR(20) NOT NULL, -- INSERT, UPDATE, DELETE
    changed_at TIMESTAMP DEFAULT NOW(),
    changed_by VARCHAR(255)
);

-- ============================================
-- STEP 3: CREATE MAIN TABLES
-- ============================================

-- Hospital Table
CREATE TABLE public.hospital (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(500),
    phone VARCHAR(50),
    approved BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Doctor Table
CREATE TABLE public.doctor (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    specialization VARCHAR(255),
    license_number VARCHAR(100) UNIQUE,
    hospital_id BIGINT REFERENCES public.hospital(id) ON DELETE SET NULL,
    approved BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Staff Table
CREATE TABLE public.staff (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(100),
    employee_id VARCHAR(100) UNIQUE,
    hospital_id BIGINT REFERENCES public.hospital(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Patient Table (Enhanced with email support)
CREATE TABLE public.patient (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    date_of_birth VARCHAR(50),
    gender VARCHAR(20),
    contact_info VARCHAR(500), -- Stores email and phone as comma-separated
    hospital_id BIGINT REFERENCES public.hospital(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- App User Table (Authentication)
CREATE TABLE public.app_user (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    full_name VARCHAR(255),
    linked_entity_id BIGINT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Disease Table
CREATE TABLE public.disease (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Medicine Table
CREATE TABLE public.medicine (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    cost DECIMAL(10,2),
    standard_price DECIMAL(10,2),
    is_expensive BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Disease-Medicine Junction Table
CREATE TABLE public.disease_medicine (
    disease_id BIGINT REFERENCES public.disease(id) ON DELETE CASCADE,
    medicine_id BIGINT REFERENCES public.medicine(id) ON DELETE CASCADE,
    PRIMARY KEY (disease_id, medicine_id)
);

-- Consultation Table
CREATE TABLE public.consultation (
    id BIGSERIAL PRIMARY KEY,
    consultation_date TIMESTAMP,
    diagnosis TEXT,
    notes TEXT,
    doctor_id BIGINT REFERENCES public.doctor(id) ON DELETE SET NULL,
    patient_id BIGINT REFERENCES public.patient(id) ON DELETE CASCADE,
    disease_id BIGINT REFERENCES public.disease(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Appointment Table (Enhanced for sync)
CREATE TABLE public.appointment (
    id BIGSERIAL PRIMARY KEY,
    appointment_date_time TIMESTAMP NOT NULL,
    symptoms_or_disease TEXT,
    status VARCHAR(50) DEFAULT 'PENDING',
    consultation_fee DECIMAL(10,2),
    day_patient_number INTEGER,
    hospital_id BIGINT REFERENCES public.hospital(id) ON DELETE SET NULL,
    doctor_id BIGINT REFERENCES public.doctor(id) ON DELETE CASCADE,
    patient_id BIGINT REFERENCES public.patient(id) ON DELETE CASCADE,
    consultation_id BIGINT REFERENCES public.consultation(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Lab Test Table
CREATE TABLE public.lab_test (
    id BIGSERIAL PRIMARY KEY,
    test_name VARCHAR(255),
    instructions TEXT,
    result TEXT,
    file_path VARCHAR(500),
    status VARCHAR(50),
    ordered_at TIMESTAMP,
    completed_at TIMESTAMP,
    consultation_id BIGINT REFERENCES public.consultation(id) ON DELETE CASCADE,
    patient_id BIGINT REFERENCES public.patient(id) ON DELETE CASCADE,
    doctor_id BIGINT REFERENCES public.doctor(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Prescription Table
CREATE TABLE public.prescription (
    id BIGSERIAL PRIMARY KEY,
    notes TEXT,
    total_cost DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT NOW(),
    consultation_id BIGINT REFERENCES public.consultation(id) ON DELETE CASCADE
);

-- Prescription-Medicine Junction Table
CREATE TABLE public.prescription_medicine (
    prescription_id BIGINT REFERENCES public.prescription(id) ON DELETE CASCADE,
    medicine_id BIGINT REFERENCES public.medicine(id) ON DELETE CASCADE,
    PRIMARY KEY (prescription_id, medicine_id)
);

-- Corruption Alert Table
CREATE TABLE public.corruption_alert (
    id BIGSERIAL PRIMARY KEY,
    alert_type VARCHAR(100),
    description TEXT,
    severity VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW(),
    resolved BOOLEAN DEFAULT FALSE,
    resolved_at TIMESTAMP,
    prescription_id BIGINT REFERENCES public.prescription(id) ON DELETE SET NULL,
    doctor_id BIGINT REFERENCES public.doctor(id) ON DELETE SET NULL,
    patient_id BIGINT REFERENCES public.patient(id) ON DELETE SET NULL
);

-- ============================================
-- STEP 4: CREATE INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX idx_doctor_hospital ON public.doctor(hospital_id);
CREATE INDEX idx_patient_hospital ON public.patient(hospital_id);
CREATE INDEX idx_appointment_doctor ON public.appointment(doctor_id);
CREATE INDEX idx_appointment_patient ON public.appointment(patient_id);
CREATE INDEX idx_appointment_datetime ON public.appointment(appointment_date_time);
CREATE INDEX idx_appointment_status ON public.appointment(status);
CREATE INDEX idx_consultation_doctor ON public.consultation(doctor_id);
CREATE INDEX idx_consultation_patient ON public.consultation(patient_id);
CREATE INDEX idx_app_user_username ON public.app_user(username);
CREATE INDEX idx_lab_test_consultation ON public.lab_test(consultation_id);
CREATE INDEX idx_sync_log_table_record ON public.sync_log(table_name, record_id);

-- ============================================
-- STEP 5: CREATE TRIGGERS FOR SYNC TRACKING
-- ============================================

-- Function to log changes
CREATE OR REPLACE FUNCTION log_change()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO public.sync_log (table_name, record_id, action)
        VALUES (TG_TABLE_NAME, NEW.id, 'INSERT');
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO public.sync_log (table_name, record_id, action)
        VALUES (TG_TABLE_NAME, NEW.id, 'UPDATE');
        NEW.updated_at = NOW();
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO public.sync_log (table_name, record_id, action)
        VALUES (TG_TABLE_NAME, OLD.id, 'DELETE');
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers to track changes
CREATE TRIGGER patient_change_log AFTER INSERT OR UPDATE OR DELETE ON public.patient
    FOR EACH ROW EXECUTE FUNCTION log_change();

CREATE TRIGGER appointment_change_log AFTER INSERT OR UPDATE OR DELETE ON public.appointment
    FOR EACH ROW EXECUTE FUNCTION log_change();

CREATE TRIGGER doctor_change_log AFTER INSERT OR UPDATE OR DELETE ON public.doctor
    FOR EACH ROW EXECUTE FUNCTION log_change();

CREATE TRIGGER hospital_change_log AFTER INSERT OR UPDATE OR DELETE ON public.hospital
    FOR EACH ROW EXECUTE FUNCTION log_change();

-- ============================================
-- STEP 6: INSERT DUMMY DATA
-- ============================================

-- Insert Hospitals
INSERT INTO public.hospital (name, address, phone, approved) VALUES
('City General Hospital', '123 Main St, City', '123-456-7890', TRUE),
('Sunrise Multispeciality Hospital', '45 Lake View Road', '123-456-7891', TRUE),
('Green Valley Medical Center', '78 River Park Avenue', '123-456-7892', TRUE),
('MetroCare Institute', '12 Central Square', '123-456-7893', TRUE),
('HopeWell Community Hospital', '9 Garden Street', '123-456-7894', TRUE),
('MedTrust', 'Hyderabad, Telangana', '+91-9876543210', TRUE);

-- Insert Doctors
INSERT INTO public.doctor (name, specialization, license_number, hospital_id, approved) VALUES
('Dr. John Doe', 'General Medicine', 'LIC12345', 1, TRUE),
('Dr. Meera Nair', 'Cardiology', 'LIC20001', 2, TRUE),
('Dr. Arjun Verma', 'Neurology', 'LIC20002', 3, TRUE),
('Dr. Priya Shah', 'Orthopedics', 'LIC20003', 4, TRUE),
('Dr. Rohan Kulkarni', 'Dermatology', 'LIC20004', 5, TRUE),
('Dr. Sana Ali', 'Pediatrics', 'LIC20005', 1, TRUE),
('Dr. Vikram Iyer', 'ENT', 'LIC20006', 2, TRUE),
('Dr. Ananya Rao', 'Gynecology', 'LIC20007', 3, TRUE),
('Dr. Karan Gupta', 'Pulmonology', 'LIC20008', 4, TRUE),
('Dr. Neha Bansal', 'Psychiatry', 'LIC20009', 5, TRUE),
('Dr. Sathish Dusharla', 'General Physician', 'MED-2024-SD-001', 6, TRUE);

-- Insert Staff
INSERT INTO public.staff (name, role, employee_id, hospital_id) VALUES
('Jane Smith', 'Nurse', 'EMP001', 1);

-- Insert Patients (with email in contact_info)
INSERT INTO public.patient (name, date_of_birth, gender, contact_info, hospital_id) VALUES
('Alice Johnson', '1990-01-01', 'Female', 'alice@example.com, +1234567890', 1),
('Rahul Mehta', '1988-06-11', 'Male', 'rahul@example.com, +1234567891', 2),
('Divya Menon', '1995-09-18', 'Female', 'divya@example.com, +1234567892', 3),
('Karthik Raj', '1992-03-22', 'Male', 'karthik@example.com, +1234567893', 4),
('Raghu', '1995-05-15', 'Male', 'raghu@example.com, +919876543210', 6);

-- Insert App Users (BCrypt hashed passwords)
-- Passwords: admin/doctor/patient = "password", ram = "ram123", drsathish = "doctor123", raghu = "raghu123"
INSERT INTO public.app_user (username, password, role, full_name, linked_entity_id) VALUES
('admin', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'ADMIN', 'System Administrator', NULL),
('doctor', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'DOCTOR', 'Dr. John Doe', 1),
('patient', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'PATIENT', 'Alice Johnson', 1),
('ram', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'ADMIN', 'Ram', NULL),
('drsathish', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'DOCTOR', 'Dr. Sathish Dusharla', 11),
('raghu', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'PATIENT', 'Raghu', 5);

-- Insert Diseases
INSERT INTO public.disease (name, description) VALUES
('Common Cold', 'Viral infection of the upper respiratory tract'),
('Fever', 'Elevated body temperature due to infection'),
('Diabetes', 'Metabolic disease causing high blood sugar'),
('Hypertension', 'High blood pressure condition'),
('Allergies', 'Immune system reaction to substances');

-- Insert Medicines
INSERT INTO public.medicine (name, description, cost, standard_price, is_expensive) VALUES
('Paracetamol', 'Pain reliever and fever reducer', 25.00, 30.00, FALSE),
('Expensive Drug', 'Very expensive medicine', 1000.00, 800.00, TRUE),
('Amoxicillin', 'Antibiotic for bacterial infections', 80.00, 100.00, FALSE),
('Ibuprofen', 'Anti-inflammatory pain reliever', 35.00, 40.00, FALSE),
('Omeprazole', 'Reduces stomach acid', 45.00, 55.00, FALSE),
('Metformin', 'Diabetes medication', 60.00, 75.00, FALSE),
('Azithromycin', 'Antibiotic (Z-Pack)', 150.00, 180.00, FALSE),
('Cetirizine', 'Antihistamine for allergies', 20.00, 25.00, FALSE),
('Dolo 650', 'Fever and pain relief', 30.00, 35.00, FALSE),
('Crocin', 'Paracetamol brand for fever', 28.00, 32.00, FALSE),
('Vitamin D3', 'Vitamin supplement', 200.00, 250.00, TRUE),
('B-Complex', 'Vitamin B complex supplement', 90.00, 110.00, FALSE),
('Montelukast', 'Asthma and allergy medication', 180.00, 220.00, TRUE),
('Atorvastatin', 'Cholesterol lowering medication', 250.00, 300.00, TRUE);

-- Link Diseases to Medicines
INSERT INTO public.disease_medicine (disease_id, medicine_id) VALUES
(1, 1), (1, 2), (2, 1), (2, 9), (2, 10),
(3, 6), (4, 14), (5, 8), (5, 13);

-- Insert Sample Appointment (Raghu with Dr. Sathish)
INSERT INTO public.appointment (
    appointment_date_time, symptoms_or_disease, status,
    day_patient_number, hospital_id, doctor_id, patient_id
) VALUES (
    NOW() + INTERVAL '1 day', 'General checkup and fever', 'PENDING',
    1, 6, 11, 5
);

-- ============================================
-- STEP 7: CREATE VIEWS FOR SYNC (Optional)
-- ============================================

-- View for recent changes
CREATE OR REPLACE VIEW recent_changes AS
SELECT
    sl.id,
    sl.table_name,
    sl.record_id,
    sl.action,
    sl.changed_at,
    CASE
        WHEN sl.table_name = 'patient' THEN (SELECT name FROM public.patient WHERE id = sl.record_id)
        WHEN sl.table_name = 'doctor' THEN (SELECT name FROM public.doctor WHERE id = sl.record_id)
        WHEN sl.table_name = 'appointment' THEN 'Appointment #' || sl.record_id
        ELSE NULL
    END as entity_name
FROM public.sync_log sl
ORDER BY sl.changed_at DESC
LIMIT 100;

-- ============================================
-- STEP 8: VERIFY DATA
-- ============================================
SELECT 'Hospitals: ' || COUNT(*)::text as count FROM public.hospital
UNION ALL SELECT 'Doctors: ' || COUNT(*)::text FROM public.doctor
UNION ALL SELECT 'Patients: ' || COUNT(*)::text FROM public.patient
UNION ALL SELECT 'Users: ' || COUNT(*)::text FROM public.app_user
UNION ALL SELECT 'Medicines: ' || COUNT(*)::text FROM public.medicine
UNION ALL SELECT 'Appointments: ' || COUNT(*)::text FROM public.appointment;

-- Show recent changes
SELECT * FROM recent_changes LIMIT 10;
