-- =====================================================
-- STEP 1: ADD MISSING COLUMNS TO PRESCRIPTIONS
-- =====================================================
ALTER TABLE public.prescriptions 
ADD COLUMN IF NOT EXISTS date date;

ALTER TABLE public.prescriptions 
ADD COLUMN IF NOT EXISTS total_cost numeric DEFAULT 0;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_prescriptions_consultation ON prescriptions(consultation_id);
CREATE INDEX IF NOT EXISTS idx_prescriptions_medicine ON prescriptions(medicine_id);

-- =====================================================
-- STEP 2: NOW RUN THE COMPLETE-MEGA-DUMMY-DATA.sql
-- Copy entire content and paste here after this section
-- =====================================================
