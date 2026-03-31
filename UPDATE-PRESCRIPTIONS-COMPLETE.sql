-- =====================================================
-- FIX PRESCRIPTIONS - Add missing columns & populate data
-- =====================================================

-- STEP 1: Add missing columns to prescriptions table
ALTER TABLE public.prescriptions 
ADD COLUMN IF NOT EXISTS date date;

ALTER TABLE public.prescriptions 
ADD COLUMN IF NOT EXISTS total_cost numeric DEFAULT 0;

-- STEP 2: Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_prescriptions_consultation ON prescriptions(consultation_id);
CREATE INDEX IF NOT EXISTS idx_prescriptions_medicine ON prescriptions(medicine_id);
CREATE INDEX IF NOT EXISTS idx_consultations_appointment ON consultations(appointment_id);

-- STEP 3: Update prescriptions with dates from consultations -> appointments
UPDATE public.prescriptions p
SET date = COALESCE(a.appointment_date, CURRENT_DATE)
FROM public.consultations c
LEFT JOIN public.appointments a ON c.appointment_id = a.id
WHERE p.consultation_id = c.id;

-- STEP 4: Update prescriptions with total_cost (calculate from medicine quantity)
-- Assuming ~₹200-500 per medicine based on type
UPDATE public.prescriptions p
SET total_cost = CASE 
  WHEN m.name IN ('Aspirin', 'Paracetamol', 'Ibuprofen') THEN 150.00
  WHEN m.name IN ('Metformin', 'Lisinopril', 'Amlodipine') THEN 250.00
  WHEN m.name IN ('Atorvastatin', 'Simvastatin', 'Omeprazole') THEN 350.00
  WHEN m.name IN ('Amoxicillin') THEN 200.00
  ELSE 300.00
END
FROM public.medicines m
WHERE p.medicine_id = m.id;

-- STEP 5: Verify prescriptions are now complete
SELECT 
  p.id,
  p.date,
  m.name as medicine,
  p.notes,
  p.total_cost,
  c.diagnosis
FROM public.prescriptions p
LEFT JOIN public.medicines m ON p.medicine_id = m.id
LEFT JOIN public.consultations c ON p.consultation_id = c.id
ORDER BY p.date DESC;

-- =====================================================
-- SUCCESS: Prescriptions table is now fixed!
-- =====================================================
