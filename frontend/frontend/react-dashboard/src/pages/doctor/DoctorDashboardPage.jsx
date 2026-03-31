import { useEffect, useState } from 'react';
import DashboardShell from '../../components/DashboardShell';
import api from '../../lib/api';



export default function DoctorDashboardPage() {
  const DOCTOR_ID = Number(localStorage.getItem('meditrust_entity_id')) || 1;
  const [tab, setTab] = useState('overview');
  const [overview, setOverview] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [treatedToday, setTreatedToday] = useState([]);
  const [eligibleConsultations, setEligibleConsultations] = useState([]);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const [selectedPatientDetails, setSelectedPatientDetails] = useState(null);
  const [appointmentActionMsg, setAppointmentActionMsg] = useState('');
  const [loadingAppointmentPatient, setLoadingAppointmentPatient] = useState(false);
  const [patientId, setPatientId] = useState('');
  const [patientDetails, setPatientDetails] = useState(null);
  const [patientActionMsg, setPatientActionMsg] = useState('');
  const [diagnosis, setDiagnosis] = useState({ consultationId: '', diagnosis: '', notes: '' });
  const [diagMsg, setDiagMsg] = useState('');
  const [medicines, setMedicines] = useState([]);
  const [selectedMeds, setSelectedMeds] = useState([]);
  const [prescConsultationId, setPrescConsultationId] = useState('');
  const [prescNotes, setPrescNotes] = useState('');
  const [prescResult, setPrescResult] = useState(null);
  const [prescError, setPrescError] = useState('');
  const [labTests, setLabTests] = useState([]);
  const [orderedLabTests, setOrderedLabTests] = useState([]);
  const [labTestForm, setLabTestForm] = useState({ consultationId: '', testName: '', instructions: '' });
  const [labTestMsg, setLabTestMsg] = useState('');

  const commonLabTests = ['Blood Test', 'X-Ray', 'CT Scan', 'Ultrasound', 'ECG', 'Labs'];

  useEffect(() => {
    loadData();
    api.get('/medicines').then((r) => setMedicines(Array.isArray(r.data) ? r.data : [])).catch(() => setMedicines([]));
  }, []);

  async function loadData() {
    try {
      const [ov, ap, tt, ec] = await Promise.all([
        api.get(`/doctor/${DOCTOR_ID}/dashboard`),
        api.get(`/doctor/${DOCTOR_ID}/appointments`),
        api.get(`/doctor/${DOCTOR_ID}/treated-patients`),
        api.get(`/doctor/${DOCTOR_ID}/prescription-eligible-consultations`),
      ]);
      setOverview(ov.data);
      setAppointments(ap.data || []);
      setTreatedToday(tt.data || []);
      setEligibleConsultations(ec.data || []);

      // Fetch lab tests for each eligible consultation
      const allLabTests = [];
      if (ec.data && ec.data.length > 0) {
        for (const consultation of ec.data) {
          try {
            const { data } = await api.get(`/doctor/${DOCTOR_ID}/consultations/${consultation.consultationId}/lab-tests`);
            if (data && Array.isArray(data)) {
              allLabTests.push(...data);
            }
          } catch {
            // Skip if lab tests endpoint fails for this consultation
          }
        }
      }
      setOrderedLabTests(allLabTests);
    } catch {
      setAppointments([]);
      setTreatedToday([]);
      setEligibleConsultations([]);
      setOrderedLabTests([]);
    }
  }

  async function openAppointment(appointment) {
    setSelectedAppointmentId(appointment.id);
    setAppointmentActionMsg('');
    setLoadingAppointmentPatient(true);
    try {
      const patientId = appointment.patientId || appointment?.patient?.id;
      const { data } = await api.get(`/doctor/patients/${patientId}`);
      setSelectedPatientDetails(data);
    } catch {
      setSelectedPatientDetails(null);
      setAppointmentActionMsg('✗ Unable to load patient details for selected appointment.');
    } finally {
      setLoadingAppointmentPatient(false);
    }
  }

  async function markSelectedAppointmentTreated() {
    setAppointmentActionMsg('');
    if (!selectedAppointmentId) {
      setAppointmentActionMsg('✗ Select an appointment first.');
      return;
    }

    const selected = (appointments || []).find((a) => a.id === selectedAppointmentId);
    if (!selected) {
      setAppointmentActionMsg('✗ Selected appointment not found.');
      return;
    }

    if (selected.status === 'COMPLETED') {
      setAppointmentActionMsg('✓ This appointment is already marked as treated.');
      return;
    }

    try {
      const { data } = await api.post(`/doctor/appointments/${selectedAppointmentId}/treat`);
      const consultationId = data?.consultationId;
      if (consultationId) {
        setDiagnosis((prev) => ({ ...prev, consultationId: String(consultationId) }));
        setAppointmentActionMsg(`✓ Appointment #${selectedAppointmentId} marked as treated. Consultation #${consultationId} created.`);
      } else {
        setAppointmentActionMsg(`✓ Appointment #${selectedAppointmentId} marked as treated.`);
      }
      await loadData();
      await openAppointment(selected);
    } catch (err) {
      setAppointmentActionMsg('✗ ' + (err?.response?.data?.message || 'Failed to mark appointment as treated.'));
    }
  }

  async function loadPatient() {
    setPatientActionMsg('');
    if (!patientId) return;
    try {
      const { data } = await api.get(`/doctor/patients/${patientId}`);
      setPatientDetails(data);
    } catch { setPatientDetails(null); }
  }

  async function markTreatmentCompleted() {
    setPatientActionMsg('');
    const targetPatientId = Number(patientId);
    if (!targetPatientId) {
      setPatientActionMsg('✗ Enter a valid Patient ID first.');
      return;
    }

    const targetAppointment = appointments.find((a) => Number(a.patientId || a?.patient?.id) === targetPatientId && a.status !== 'COMPLETED');
    if (!targetAppointment) {
      setPatientActionMsg('✗ No pending today appointment found for this patient.');
      return;
    }

    try {
      await api.put(`/appointments/${targetAppointment.id}/status`, null, { params: { status: 'COMPLETED' } });
      setPatientActionMsg(`✓ Treatment completed for appointment #${targetAppointment.id}.`);
      await loadData();
      await loadPatient();
    } catch (err) {
      setPatientActionMsg('✗ ' + (err?.response?.data?.message || 'Failed to mark treatment completed.'));
    }
  }

  async function submitDiagnosis(e) {
    e.preventDefault();
    setDiagMsg('');
    try {
      await api.put(`/doctor/consultations/${diagnosis.consultationId}/diagnosis`, {
        diagnosis: diagnosis.diagnosis,
        notes: diagnosis.notes,
      });
      setDiagMsg('✓ Diagnosis saved successfully.');
      setPrescConsultationId(diagnosis.consultationId);
      setDiagnosis({ consultationId: '', diagnosis: '', notes: '' });
      await loadData();
    } catch (err) {
      setDiagMsg('✗ ' + (err?.response?.data?.message || 'Failed to save.'));
    }
  }

  function toggleMed(id) {
    const numericId = Number(id);
    setSelectedMeds((prev) => (prev.includes(numericId) ? prev.filter((x) => x !== numericId) : [...prev, numericId]));
  }

  async function submitPrescription(e) {
    e.preventDefault();
    setPrescResult(null);
    setPrescError('');
    if (!prescConsultationId || selectedMeds.length === 0) {
      setPrescError('Enter consultation ID and select at least one medicine.');
      return;
    }
    try {
      const { data } = await api.post('/doctor/prescriptions', {
        consultationId: Number(prescConsultationId),
        medicineIds: selectedMeds.map((id) => Number(id)).filter((id) => Number.isFinite(id)),
        notes: prescNotes,
      });
      setPrescResult(data);
      setSelectedMeds([]);
      setPrescNotes('');
      setPrescConsultationId('');
      loadData();
    } catch (err) {
      setPrescError(err?.response?.data?.message || 'Failed to save prescription.');
    }
  }

  async function submitLabTest(e) {
    e.preventDefault();
    setLabTestMsg('');
    if (!labTestForm.consultationId || !labTestForm.testName) {
      setLabTestMsg('✗ Consultation ID and test name are required.');
      return;
    }
    try {
      const { data } = await api.post('/doctor/lab-tests', {
        consultationId: Number(labTestForm.consultationId),
        testName: labTestForm.testName,
        instructions: labTestForm.instructions,
      });
      setLabTestMsg('✓ Lab test ordered successfully.');
      setLabTestForm({ consultationId: '', testName: '', instructions: '' });
      await loadData();
    } catch (err) {
      setLabTestMsg('✗ ' + (err?.response?.data?.message || 'Failed to order lab test.'));
    }
  }

  const tabs = ['overview', 'appointments', 'treatedPatients', 'labTests', 'patient', 'diagnosis', 'prescription'];

  return (
    <DashboardShell title="Doctor Dashboard" subtitle="Manage appointments, diagnoses, and prescriptions">
      <div className="flex flex-wrap gap-2 mb-6">
        {tabs.map((name) => (
          <button key={name} onClick={() => setTab(name)} className={tab === name ? 'btn-tab active' : 'btn-tab'}>
            {name.charAt(0).toUpperCase() + name.slice(1)}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW ── */}
      {tab === 'overview' && (
        <div className="grid md:grid-cols-3 gap-4">
          <div className="card text-center">
            <p className="muted text-sm">Today's Appointments</p>
            <p className="metric-value mt-2">{overview ? (overview.todaysAppointments || []).length : '—'}</p>
          </div>
          <div className="card text-center">
            <p className="muted text-sm">Total Patients Treated</p>
            <p className="metric-value mt-2">{overview ? overview.totalPatientsTreated : '—'}</p>
          </div>
          <div className="card text-center">
            <p className="muted text-sm">Recent Prescriptions</p>
            <p className="metric-value mt-2">{overview ? (overview.recentPrescriptions || []).length : '—'}</p>
          </div>
          {overview && (overview.recentPrescriptions || []).length > 0 && (
            <div className="card md:col-span-3">
              <h3 className="font-semibold mb-3">Recent Prescriptions</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="text-left muted">
                    <th className="py-2 pr-4">ID</th>
                    <th className="py-2 pr-4">Patient</th>
                    <th className="py-2 pr-4">Medicines</th>
                    <th className="py-2">Total Cost</th>
                  </tr></thead>
                  <tbody>
                    {(overview.recentPrescriptions || []).map((p) => (
                      <tr key={p.id} className="border-t">
                        <td className="py-2 pr-4 font-mono text-xs">#{p.id}</td>
                        <td className="py-2 pr-4">{p.consultation?.patient?.name || '—'}</td>
                        <td className="py-2 pr-4">{(p.medicines || []).map((m) => m.name).join(', ') || '—'}</td>
                        <td className="py-2 font-semibold">₹{p.totalCost ?? '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── APPOINTMENTS ── */}
      {tab === 'appointments' && (
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Doctor Appointments</h3>
            <button className="btn-secondary text-xs" onClick={loadData}>Refresh</button>
          </div>
          {appointments.length === 0 ? (
            <p className="muted text-sm py-6 text-center">No appointments found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="text-left muted">
                  <th className="py-2 pr-4">Patient</th>
                  <th className="py-2 pr-4">Date & Time</th>
                  <th className="py-2 pr-4">Complaint / Symptoms</th>
                  <th className="py-2 pr-4">Hospital</th>
                  <th className="py-2 pr-4">Status</th>
                  <th className="py-2">Action</th>
                </tr></thead>
                <tbody>
                  {appointments.map((a) => (
                    <tr
                      key={a.id}
                      className={`border-t cursor-pointer ${selectedAppointmentId === a.id ? 'bg-blue-50' : ''}`}
                      onClick={() => openAppointment(a)}
                    >
                      <td className="py-2 pr-4 font-medium">{a.patientFullName || a.patient?.name || 'Patient #' + a.id}</td>
                      <td className="py-2 pr-4 text-slate-500">{a.appointmentDateTime ? new Date(a.appointmentDateTime).toLocaleString() : '—'}</td>
                      <td className="py-2 pr-4">{a.symptomsOrDisease || '—'}</td>
                      <td className="py-2 pr-4 text-slate-500">{a.hospitalName || a.hospital?.name || '—'}</td>
                      <td className="py-2 pr-4">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${a.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : a.status === 'APPROVED' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>
                          {a.status || 'PENDING'}
                        </span>
                      </td>
                      <td className="py-2">
                        <button className="btn-secondary text-xs py-1" type="button" onClick={(e) => { e.stopPropagation(); openAppointment(a); }}>
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {selectedAppointmentId && (
            <div className="mt-5 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">Selected Appointment Details</h4>
                <button className="btn-primary text-xs py-1" type="button" onClick={markSelectedAppointmentTreated}>Mark as Treated</button>
              </div>
              {appointmentActionMsg && <p className={`text-sm rounded-xl px-3 py-2 ${appointmentActionMsg.startsWith('✓') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>{appointmentActionMsg}</p>}
              {loadingAppointmentPatient ? (
                <p className="muted text-sm">Loading patient details...</p>
              ) : selectedPatientDetails ? (
                <>
                  <div className="card grid md:grid-cols-4 gap-4">
                    <div><p className="text-xs muted">Name</p><p className="font-semibold mt-1">{selectedPatientDetails.patient?.name || '—'}</p></div>
                    <div><p className="text-xs muted">Gender</p><p className="font-semibold mt-1">{selectedPatientDetails.patient?.gender || '—'}</p></div>
                    <div><p className="text-xs muted">DOB</p><p className="font-semibold mt-1">{selectedPatientDetails.patient?.dateOfBirth || '—'}</p></div>
                    <div><p className="text-xs muted">Contact</p><p className="font-semibold mt-1">{selectedPatientDetails.patient?.contactInfo || '—'}</p></div>
                  </div>
                  <div className="card">
                    <h5 className="font-semibold mb-3">Previous Medical Reports</h5>
                    {(selectedPatientDetails.medicalHistory || []).length === 0 ? (
                      <p className="muted text-sm">No previous reports found for this patient.</p>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead><tr className="text-left muted">
                            <th className="py-2 pr-4">Date</th>
                            <th className="py-2 pr-4">Symptoms</th>
                            <th className="py-2 pr-4">Diagnosis</th>
                            <th className="py-2 pr-4">Doctor</th>
                            <th className="py-2">Hospital</th>
                          </tr></thead>
                          <tbody>
                            {selectedPatientDetails.medicalHistory.map((h) => (
                              <tr key={h.id} className="border-t">
                                <td className="py-2 pr-4">{h.dateTime ? new Date(h.dateTime).toLocaleDateString() : '—'}</td>
                                <td className="py-2 pr-4">{h.symptoms || '—'}</td>
                                <td className="py-2 pr-4">{h.diagnosis || '—'}</td>
                                <td className="py-2 pr-4">{h.doctor?.name || '—'}</td>
                                <td className="py-2">{h.doctor?.hospital?.name || '—'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <p className="muted text-sm">Select an appointment to view patient details.</p>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── TREATED PATIENTS ── */}
      {tab === 'treatedPatients' && (
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Treated Patients (Today)</h3>
            <button className="btn-secondary text-xs" onClick={loadData}>Refresh</button>
          </div>
          {treatedToday.length === 0 ? (
            <p className="muted text-sm py-6 text-center">No treated patients found for today.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="text-left muted">
                  <th className="py-2 pr-4">Appointment ID</th>
                  <th className="py-2 pr-4">Consultation ID</th>
                  <th className="py-2 pr-4">Patient</th>
                  <th className="py-2 pr-4">Diagnosis</th>
                  <th className="py-2 pr-4">Time</th>
                  <th className="py-2">Prescription</th>
                </tr></thead>
                <tbody>
                  {treatedToday.map((c) => (
                    <tr key={c.appointmentId || c.consultationId} className="border-t">
                      <td className="py-2 pr-4 font-mono text-xs">#{c.appointmentId ?? '—'}</td>
                      <td className="py-2 pr-4 font-mono text-xs">#{c.consultationId}</td>
                      <td className="py-2 pr-4 font-medium">{c.patientName || '—'}</td>
                      <td className="py-2 pr-4">{c.diagnosis || '—'}</td>
                      <td className="py-2 pr-4 text-slate-500">{c.dateTime ? new Date(c.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}</td>
                      <td className="py-2">{c.hasPrescription ? <span className="text-green-700">Added</span> : <span className="text-amber-700">Pending</span>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ── LAB TESTS ── */}
      {tab === 'labTests' && (
        <div className="space-y-4">
          <form onSubmit={submitLabTest} className="card space-y-4">
            <h3 className="font-semibold text-lg">Order Lab Tests</h3>
            <div className="rounded-xl bg-purple-50 border border-purple-200 px-4 py-3 text-sm text-purple-700">
              Select a consultation and order laboratory tests. Enter test name and any special instructions for the lab technician.
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Choose Eligible Consultation</label>
                <select
                  className="input mt-1"
                  value={labTestForm.consultationId}
                  onChange={(e) => setLabTestForm({ ...labTestForm, consultationId: e.target.value })}
                >
                  <option value="">Select consultation</option>
                  {eligibleConsultations.map((c) => (
                    <option key={c.consultationId} value={c.consultationId}>
                      #{c.consultationId} - {c.patientName || 'Unknown'} - {c.diagnosis || 'No diagnosis'}
                    </option>
                  ))}
                </select>
                <p className="text-xs muted mt-1">Only consultations with diagnosis are listed.</p>
              </div>
              <div>
                <label className="text-sm font-medium">Test Name</label>
                <input
                  className="input mt-1"
                  required
                  value={labTestForm.testName}
                  onChange={(e) => setLabTestForm({ ...labTestForm, testName: e.target.value })}
                  placeholder="e.g. Blood Test"
                  list="lab-test-suggestions"
                />
                <datalist id="lab-test-suggestions">
                  {commonLabTests.map((test) => (
                    <option key={test} value={test} />
                  ))}
                </datalist>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Instructions</label>
              <textarea
                className="input mt-1"
                rows="3"
                value={labTestForm.instructions}
                onChange={(e) => setLabTestForm({ ...labTestForm, instructions: e.target.value })}
                placeholder="e.g. Fasting required, collect samples in morning…"
              />
            </div>
            {labTestMsg && <p className={`text-sm rounded-xl px-3 py-2 ${labTestMsg.startsWith('✓') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>{labTestMsg}</p>}
            <button className="btn-primary" type="submit">Order Lab Test</button>
          </form>

          {orderedLabTests.length === 0 ? (
            <div className="card">
              <p className="muted text-sm py-6 text-center">No lab tests ordered yet.</p>
            </div>
          ) : (
            <div className="card">
              <h3 className="font-semibold mb-4">Ordered Lab Tests</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="text-left muted">
                    <th className="py-2 pr-4">Consultation ID</th>
                    <th className="py-2 pr-4">Patient Name</th>
                    <th className="py-2 pr-4">Test Name</th>
                    <th className="py-2 pr-4">Instructions</th>
                    <th className="py-2 pr-4">Status</th>
                    <th className="py-2 pr-4">Completed Date</th>
                    <th className="py-2 pr-4">Report</th>
                    <th className="py-2">Ordered At</th>
                  </tr></thead>
                  <tbody>
                    {orderedLabTests.map((test) => (
                      <tr key={test.id} className="border-t">
                        <td className="py-2 pr-4 font-mono text-xs">#{test.consultationId || test.consultation?.id || '—'}</td>
                        <td className="py-2 pr-4 font-medium">{test.patientName || test.consultation?.patient?.name || '—'}</td>
                        <td className="py-2 pr-4">{test.testName || '—'}</td>
                        <td className="py-2 pr-4 text-xs">{test.instructions || '—'}</td>
                        <td className="py-2 pr-4">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${test.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : test.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'}`}>
                            {test.status || 'PENDING'}
                          </span>
                        </td>
                        <td className="py-2 pr-4 text-slate-500">{test.completedDate ? new Date(test.completedDate).toLocaleDateString() : '—'}</td>
                        <td className="py-2 pr-4">
                          {test.status === 'COMPLETED' && test.reportUrl ? (
                            <a href={test.reportUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary text-xs py-1">View</a>
                          ) : (
                            <span className="text-slate-400 text-xs">—</span>
                          )}
                        </td>
                        <td className="py-2 text-slate-500">{test.orderedAt ? new Date(test.orderedAt).toLocaleDateString() : '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {tab === 'patient' && (
        <div className="space-y-4">
          <div className="card flex gap-3 items-end">
            <div className="flex-1">
              <label className="text-sm font-medium">Patient ID</label>
              <input className="input mt-1" value={patientId} onChange={(e) => setPatientId(e.target.value)} placeholder="e.g. 1" />
            </div>
            <button className="btn-primary" onClick={loadPatient}>Load Patient</button>
            <button className="btn-secondary" onClick={markTreatmentCompleted}>Treatment Completed</button>
          </div>
          {patientActionMsg && <p className={`text-sm rounded-xl px-3 py-2 ${patientActionMsg.startsWith('✓') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>{patientActionMsg}</p>}
          {patientDetails && (
            <>
              <div className="card grid md:grid-cols-4 gap-4">
                <div><p className="text-xs muted">Name</p><p className="font-semibold mt-1">{patientDetails.patient?.name || '—'}</p></div>
                <div><p className="text-xs muted">Age</p><p className="font-semibold mt-1">{patientDetails.patient?.age || '—'}</p></div>
                <div><p className="text-xs muted">Gender</p><p className="font-semibold mt-1">{patientDetails.patient?.gender || '—'}</p></div>
                <div><p className="text-xs muted">Phone</p><p className="font-semibold mt-1">{patientDetails.patient?.phone || '—'}</p></div>
              </div>
              {(patientDetails.medicalHistory || []).length > 0 && (
                <div className="card">
                  <h3 className="font-semibold mb-3">Medical History</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead><tr className="text-left muted">
                        <th className="py-2 pr-4">Date</th>
                        <th className="py-2 pr-4">Diagnosis</th>
                        <th className="py-2 pr-4">Doctor</th>
                        <th className="py-2">Hospital</th>
                      </tr></thead>
                      <tbody>
                        {(patientDetails.medicalHistory || []).map((h) => (
                          <tr key={h.id} className="border-t">
                            <td className="py-2 pr-4">{h.dateTime ? new Date(h.dateTime).toLocaleDateString() : '—'}</td>
                            <td className="py-2 pr-4">{h.diagnosis || '—'}</td>
                            <td className="py-2 pr-4">{h.doctor?.name || '—'}</td>
                            <td className="py-2">{h.hospital?.name || '—'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* ── DIAGNOSIS ── */}
      {tab === 'diagnosis' && (
        <form onSubmit={submitDiagnosis} className="card space-y-4">
          <h3 className="font-semibold text-lg">Add / Update Diagnosis</h3>
          <div className="rounded-xl bg-blue-50 border border-blue-200 px-4 py-3 text-sm text-blue-700">
            Enter the consultation ID from today's appointment. Then enter the diagnosed disease and any clinical notes.
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Consultation ID</label>
              <input className="input mt-1" required value={diagnosis.consultationId} onChange={(e) => setDiagnosis({ ...diagnosis, consultationId: e.target.value })} placeholder="e.g. 1" />
            </div>
            <div>
              <label className="text-sm font-medium">Disease / Diagnosis</label>
              <input className="input mt-1" required value={diagnosis.diagnosis} onChange={(e) => setDiagnosis({ ...diagnosis, diagnosis: e.target.value })} placeholder="e.g. Malaria" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Clinical Notes</label>
            <textarea className="input mt-1" rows="3" value={diagnosis.notes} onChange={(e) => setDiagnosis({ ...diagnosis, notes: e.target.value })} placeholder="Additional observations…" />
          </div>
          {diagMsg && <p className={`text-sm rounded-xl px-3 py-2 ${diagMsg.startsWith('✓') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>{diagMsg}</p>}
          <button className="btn-primary" type="submit">Save Diagnosis</button>
        </form>
      )}

      {/* ── PRESCRIPTION ── */}
      {tab === 'prescription' && (
        <div className="space-y-4">
          <form onSubmit={submitPrescription} className="card space-y-4">
            <h3 className="font-semibold text-lg">Create Prescription</h3>
            <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-700">
              The system automatically validates medicines against the diagnosed disease. Any suspicious prescriptions generate corruption alerts for admin review.
            </div>
            <div>
              <label className="text-sm font-medium">Choose Eligible Consultation</label>
              <select
                className="input mt-1"
                value={prescConsultationId}
                onChange={(e) => setPrescConsultationId(e.target.value)}
              >
                <option value="">Select consultation</option>
                {eligibleConsultations.map((c) => (
                  <option key={c.consultationId} value={c.consultationId}>
                    #{c.consultationId} - {c.patientName || 'Unknown'} - {c.diagnosis || 'No diagnosis'}
                  </option>
                ))}
              </select>
              <p className="text-xs muted mt-1">Only consultations with diagnosis and without prescription are listed.</p>
            </div>
            <div>
              <label className="text-sm font-medium">Consultation ID</label>
              <input className="input mt-1" required value={prescConsultationId} onChange={(e) => setPrescConsultationId(e.target.value)} placeholder="e.g. 1" />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Select Medicines ({selectedMeds.length} selected)</label>
              {medicines.length === 0 ? (
                <p className="muted text-sm">Loading medicines…</p>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-2 max-h-72 overflow-y-auto pr-1">
                  {medicines.map((med) => (
                    <label key={med.id} className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${selectedMeds.includes(med.id) ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-slate-300 bg-white'}`}>
                      <input type="checkbox" className="mt-0.5 accent-blue-600" checked={selectedMeds.includes(med.id)} onChange={() => toggleMed(med.id)} />
                      <div>
                        <p className="font-medium text-sm">{med.name}</p>
                        <p className="text-xs text-slate-500">Cost: ₹{med.cost} | Standard: ₹{med.standardPrice}</p>
                        {med.isExpensive && <span className="text-xs text-orange-600 font-medium">⚠ Expensive</span>}
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>
            <div>
              <label className="text-sm font-medium">Prescription Notes</label>
              <textarea className="input mt-1" rows="2" value={prescNotes} onChange={(e) => setPrescNotes(e.target.value)} placeholder="Dosage instructions, follow-up notes…" />
            </div>
            {prescError && <p className="text-sm bg-red-50 text-red-600 rounded-xl px-3 py-2">{prescError}</p>}
            <button className="btn-primary" type="submit">Save &amp; Validate Prescription</button>
          </form>

          {prescResult && (
            <div className="card border-l-4 border-green-500 space-y-2">
              <h3 className="font-semibold text-green-700">✓ Prescription Saved &amp; Validated</h3>
              <p className="text-sm">Prescription <span className="font-mono font-bold">#{prescResult.id}</span> — Total Cost: <span className="font-semibold">₹{prescResult.totalCost}</span></p>
              <p className="text-sm">Medicines: {(prescResult.medicines || []).map((m) => m.name).join(', ')}</p>
              <p className="text-xs muted mt-2">Prescription validation rules ran automatically. Any violations (wrong medicine for disease, overpriced, too many medicines) are recorded as corruption alerts visible to admin.</p>
            </div>
          )}
        </div>
      )}
    </DashboardShell>
  );
}
