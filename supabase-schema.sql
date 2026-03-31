-- =====================================================
-- MediTrust Hospital Management System - Supabase Schema
-- Run this in Supabase SQL Editor
-- =====================================================

-- Drop existing tables if needed (in reverse order of dependencies)
DROP TABLE IF EXISTS prescription_medicine CASCADE;
DROP TABLE IF EXISTS disease_medicine CASCADE;
DROP TABLE IF EXISTS lab_test CASCADE;
DROP TABLE IF EXISTS prescription CASCADE;
DROP TABLE IF EXISTS consultation CASCADE;
DROP TABLE IF EXISTS appointment CASCADE;
DROP TABLE IF EXISTS corruption_alert CASCADE;
DROP TABLE IF EXISTS app_user CASCADE;
DROP TABLE IF EXISTS patient CASCADE;
DROP TABLE IF EXISTS staff CASCADE;
DROP TABLE IF EXISTS doctor CASCADE;
DROP TABLE IF EXISTS medicine CASCADE;
DROP TABLE IF EXISTS disease CASCADE;
DROP TABLE IF EXISTS hospital CASCADE;

-- =====================================================
-- HOSPITAL TABLE
-- =====================================================
CREATE TABLE hospital (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(500),
    phone VARCHAR(50),
    is_approved BOOLEAN DEFAULT true
);

-- =====================================================
-- DOCTOR TABLE
-- =====================================================
CREATE TABLE doctor (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    specialization VARCHAR(255),
    license_number VARCHAR(100) UNIQUE,
    hospital_id BIGINT REFERENCES hospital(id),
    is_approved BOOLEAN DEFAULT true
);

-- =====================================================
-- STAFF TABLE
-- =====================================================
CREATE TABLE staff (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(100),
    employee_id VARCHAR(50) UNIQUE,
    hospital_id BIGINT REFERENCES hospital(id)
);

-- =====================================================
-- PATIENT TABLE
-- =====================================================
CREATE TABLE patient (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    date_of_birth VARCHAR(20),
    gender VARCHAR(20),
    contact_info VARCHAR(500),
    hospital_id BIGINT REFERENCES hospital(id)
);

-- =====================================================
-- APP_USER TABLE (Authentication)
-- =====================================================
CREATE TABLE app_user (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    full_name VARCHAR(255),
    linked_entity_id BIGINT
);

-- =====================================================
-- DISEASE TABLE
-- =====================================================
CREATE TABLE disease (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    description TEXT
);

-- =====================================================
-- MEDICINE TABLE
-- =====================================================
CREATE TABLE medicine (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    cost DECIMAL(10,2),
    standard_price DECIMAL(10,2),
    is_expensive BOOLEAN DEFAULT false
);

-- =====================================================
-- DISEASE_MEDICINE (Many-to-Many Join Table)
-- =====================================================
CREATE TABLE disease_medicine (
    disease_id BIGINT REFERENCES disease(id) ON DELETE CASCADE,
    medicine_id BIGINT REFERENCES medicine(id) ON DELETE CASCADE,
    PRIMARY KEY (disease_id, medicine_id)
);

-- =====================================================
-- CONSULTATION TABLE
-- =====================================================
CREATE TABLE consultation (
    id BIGSERIAL PRIMARY KEY,
    consultation_date TIMESTAMP,
    diagnosis TEXT,
    notes TEXT,
    doctor_id BIGINT REFERENCES doctor(id),
    patient_id BIGINT REFERENCES patient(id),
    hospital_id BIGINT REFERENCES hospital(id)
);

-- =====================================================
-- APPOINTMENT TABLE
-- =====================================================
CREATE TABLE appointment (
    id BIGSERIAL PRIMARY KEY,
    appointment_date_time TIMESTAMP,
    symptoms_or_disease TEXT,
    status VARCHAR(50),
    consultation_fee DECIMAL(10,2),
    day_patient_number INTEGER,
    hospital_id BIGINT REFERENCES hospital(id),
    doctor_id BIGINT REFERENCES doctor(id),
    patient_id BIGINT REFERENCES patient(id),
    consultation_id BIGINT REFERENCES consultation(id)
);

-- =====================================================
-- PRESCRIPTION TABLE
-- =====================================================
CREATE TABLE prescription (
    id BIGSERIAL PRIMARY KEY,
    notes TEXT,
    total_cost DECIMAL(10,2),
    is_suspicious BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    consultation_id BIGINT REFERENCES consultation(id)
);

-- =====================================================
-- PRESCRIPTION_MEDICINE (Many-to-Many Join Table)
-- =====================================================
CREATE TABLE prescription_medicine (
    prescription_id BIGINT REFERENCES prescription(id) ON DELETE CASCADE,
    medicine_id BIGINT REFERENCES medicine(id) ON DELETE CASCADE,
    PRIMARY KEY (prescription_id, medicine_id)
);

-- =====================================================
-- LAB_TEST TABLE
-- =====================================================
CREATE TABLE lab_test (
    id BIGSERIAL PRIMARY KEY,
    test_name VARCHAR(255) NOT NULL,
    instructions TEXT,
    status VARCHAR(50) DEFAULT 'ORDERED',
    result TEXT,
    report_file_path VARCHAR(500),
    ordered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    consultation_id BIGINT REFERENCES consultation(id),
    patient_id BIGINT REFERENCES patient(id),
    doctor_id BIGINT REFERENCES doctor(id)
);

-- =====================================================
-- CORRUPTION_ALERT TABLE
-- =====================================================
CREATE TABLE corruption_alert (
    id BIGSERIAL PRIMARY KEY,
    alert_type VARCHAR(100),
    description TEXT,
    severity VARCHAR(50),
    is_resolved BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP,
    doctor_id BIGINT REFERENCES doctor(id),
    patient_id BIGINT REFERENCES patient(id),
    prescription_id BIGINT REFERENCES prescription(id)
);

-- =====================================================
-- CREATE INDEXES FOR BETTER PERFORMANCE
-- =====================================================
CREATE INDEX idx_doctor_hospital ON doctor(hospital_id);
CREATE INDEX idx_patient_hospital ON patient(hospital_id);
CREATE INDEX idx_appointment_doctor ON appointment(doctor_id);
CREATE INDEX idx_appointment_patient ON appointment(patient_id);
CREATE INDEX idx_consultation_doctor ON consultation(doctor_id);
CREATE INDEX idx_consultation_patient ON consultation(patient_id);
CREATE INDEX idx_app_user_username ON app_user(username);
CREATE INDEX idx_lab_test_patient ON lab_test(patient_id);
CREATE INDEX idx_lab_test_doctor ON lab_test(doctor_id);

-- =====================================================
-- SCHEMA COMPLETE
-- =====================================================
