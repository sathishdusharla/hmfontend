import { useEffect, useState } from 'react';
import DashboardShell from '../../components/DashboardShell';
import api from '../../lib/api';

export default function PatientDashboardPage() {
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [patients, setPatients] = useState([]);
  const [dayPatientNumber, setDayPatientNumber] = useState(null);
  const [tab, setTab] = useState('overview');
  const [overview, setOverview] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [patientLabTests, setPatientLabTests] = useState([]);
  const [history, setHistory] = useState({ consultations: [], prescriptions: [] });
  const [uploadFile, setUploadFile] = useState({ labTestId: null, file: null });
  const [uploadMsg, setUploadMsg] = useState('');
  const [form, setForm] = useState({ hospitalId: '', doctorId: '', appointmentDateTime: '', symptomsOrDisease: '', consultationFee: '' });
  const [appointmentError, setAppointmentError] = useState('');
  const [appointmentSuccess, setAppointmentSuccess] = useState('');
  const [isSubmittingAppointment, setIsSubmittingAppointment] = useState(false);
  const [complaintSuccess, setComplaintSuccess] = useState('');
  const [complaintError, setComplaintError] = useState('');
  const [loadError, setLoadError] = useState('');
  const [complaint, setComplaint] = useState({ consultationId: '', prescriptionId: '', complaintType: 'HIGH_CONSULTATION_FEE', description: '', reportedAmount: '' });
  const [hospitals, setHospitals] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const uniqueHospitals = Array.from(
    new Map((hospitals || []).map((h) => [h.name, h])).values()
  );

  useEffect(() => {
    initializePatientContext();
    api.get('/hospitals').then((r) => setHospitals(r.data || [])).catch(() => {});
  }, []);

  useEffect(() => {
    if (!form.appointmentDateTime) {
      setDayPatientNumber(null);
      return;
    }

    fetchDayPatientNumber(form.appointmentDateTime);
  }, [form.appointmentDateTime]);

  async function initializePatientContext() {
    try {
      const { data } = await api.get('/patients');
      setPatients(data || []);
    } catch {
      // non-critical, patients list only used for the switcher in booking form
    }
    const entityId = Number(localStorage.getItem('meditrust_entity_id')) || 1;
    setSelectedPatientId(entityId);
    await loadAll(entityId);
  }

  async function onPatientChange(nextPatientId) {
    const id = Number(nextPatientId);
    setSelectedPatientId(id);
    if (!id) return;
    await loadAll(id);
  }

  async function fetchDayPatientNumber(appointmentDateTime) {
    try {
      const normalizedDateTime = appointmentDateTime.length === 16
        ? `${appointmentDateTime}:00`
        : appointmentDateTime;
      const { data } = await api.get('/appointments/day-patient-number', {
        params: { appointmentDateTime: normalizedDateTime },
      });
      setDayPatientNumber(data?.dayPatientNumber ?? null);
    } catch {
      setDayPatientNumber(null);
    }
  }

  async function loadAll(patientId) {
    setLoadError('');
    try {
      const [overviewRes, appRes, presRes, historyRes, labTestsRes] = await Promise.all([
        api.get(`/patient/${patientId}/dashboard`),
        api.get(`/patient/${patientId}/appointments`),
        api.get(`/patient/${patientId}/prescriptions`),
        api.get(`/patient/${patientId}/dashboard-history`),
        api.get(`/patient/${patientId}/lab-tests`)
      ]);
      setOverview(overviewRes.data);
      const dedupedAppointments = Array.from(
        new Map((appRes.data || []).map((item) => [item.id, item])).values()
      );
      setAppointments(dedupedAppointments);
      setPrescriptions(presRes.data || []);
      setPatientLabTests(labTestsRes.data || []);
      setHistory(historyRes.data || { consultations: [], prescriptions: [] });
    } catch (err) {
      setLoadError(err?.response?.data?.message || 'Failed to load patient data.');
    }
  }

  async function onHospitalChange(hospitalId) {
    setForm((f) => ({ ...f, hospitalId, doctorId: '' }));
    setDoctors([]);
    if (!hospitalId) return;
    setLoadingDoctors(true);
    try {
      const res = await api.get(`/doctors/by-hospital/${hospitalId}`);
      setDoctors(res.data || []);
    } catch {
      setDoctors([]);
    } finally {
      setLoadingDoctors(false);
    }
  }

  async function submitAppointment(e) {
    e.preventDefault();
    setAppointmentError('');
    setAppointmentSuccess('');

    if (!form.hospitalId || !form.doctorId || !form.appointmentDateTime) {
      setAppointmentError('Please select a hospital, doctor, and date-time.');
      return;
    }

    // Convert datetime-local style input (yyyy-MM-ddTHH:mm) to full ISO datetime.
    const normalizedDateTime = form.appointmentDateTime.length === 16
      ? `${form.appointmentDateTime}:00`
      : form.appointmentDateTime;

    try {
      setIsSubmittingAppointment(true);
      const resolvedPatientId = Number(selectedPatientId || 1);
      await api.post('/patient/appointments', {
        patientId: resolvedPatientId,
        hospitalId: Number(form.hospitalId),
        doctorId: Number(form.doctorId),
        appointmentDateTime: normalizedDateTime,
        symptomsOrDisease: form.symptomsOrDisease,
        consultationFee: form.consultationFee ? Number(form.consultationFee) : null,
      });
      await loadAll(resolvedPatientId);
      setAppointmentSuccess('Appointment request submitted successfully.');
      setForm({ hospitalId: '', doctorId: '', appointmentDateTime: '', symptomsOrDisease: '', consultationFee: '' });
      setDayPatientNumber(null);
      setDoctors([]);
      setTab('appointments');
    } catch (err) {
      setAppointmentError(err?.response?.data?.message || 'Failed to book appointment. Please try again.');
    } finally {
      setIsSubmittingAppointment(false);
    }
  }

  async function submitComplaint(e) {
    e.preventDefault();
    setComplaintSuccess('');
    setComplaintError('');
    const resolvedPatientId = Number(selectedPatientId || 1);
    try {
      await api.post('/patient/complaints', {
        ...complaint,
        patientId: resolvedPatientId,
        consultationId: complaint.consultationId || null,
        prescriptionId: complaint.prescriptionId || null,
        reportedAmount: complaint.reportedAmount ? Number(complaint.reportedAmount) : null
      });
      setComplaint({ consultationId: '', prescriptionId: '', complaintType: 'HIGH_CONSULTATION_FEE', description: '', reportedAmount: '' });
      setComplaintSuccess('Complaint submitted for admin review.');
    } catch (err) {
      setComplaintError(err?.response?.data?.message || 'Failed to submit complaint.');
    }
  }

  function handleUploadFileChange(labTestId, file) {
    setUploadFile({ labTestId, file });
  }

  async function uploadLabTestReport(labTestId) {
    if (!uploadFile.file) {
      setUploadMsg('Please select a file to upload.');
      return;
    }

    try {
      setUploadMsg('Uploading...');
      const formData = new FormData();
      formData.append('file', uploadFile.file);

      await api.post(`/patient/lab-tests/${labTestId}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setUploadMsg('Report uploaded successfully!');
      setUploadFile({ labTestId: null, file: null });

      // Reload data after successful upload
      await loadAll(selectedPatientId);

      // Clear message after 3 seconds
      setTimeout(() => setUploadMsg(''), 3000);
    } catch (err) {
      setUploadMsg(err?.response?.data?.message || 'Failed to upload report. Please try again.');
    }
  }

  const pendingLabTestsCount = patientLabTests.filter(test => test.status === 'PENDING').length;

  return (
    <DashboardShell title="Patient Dashboard" subtitle="Appointments, prescriptions, history, and complaints">
      {loadError && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">{loadError}</div>
      )}
      <div className="flex flex-wrap gap-2 mb-6">
        {['overview', 'book', 'appointments', 'prescriptions', 'labTests', 'history', 'complaints'].map((name) => (
          <button key={name} onClick={() => setTab(name)} className={tab === name ? 'btn-tab active' : 'btn-tab'}>{name}</button>
        ))}
      </div>

      {tab === 'overview' && overview && (
        <div className="grid lg:grid-cols-3 gap-4">
          <div className="card lg:col-span-2">
            <h3 className="font-semibold">Upcoming Appointment</h3>
            <div className="mt-3 grid md:grid-cols-3 gap-3">
              <div className="card-light">
                <p className="text-sm text-slate-500">Doctor</p>
                <p className="text-slate-900 font-semibold mt-1">{overview.upcomingAppointment?.doctor?.name || 'N/A'}</p>
              </div>
              <div className="card-light">
                <p className="text-sm text-slate-500">Hospital</p>
                <p className="text-slate-900 font-semibold mt-1">{overview.upcomingAppointment?.hospital?.name || 'N/A'}</p>
              </div>
              <div className="card-light">
                <p className="text-sm text-slate-500">Date & Time</p>
                <p className="text-slate-900 font-semibold mt-1">{overview.upcomingAppointment?.appointmentDateTime || 'N/A'}</p>
              </div>
            </div>
          </div>
          <div className="card">
            <h3 className="font-semibold">Total Consultations</h3>
            <p className="metric-value mt-4">{overview.totalConsultations}</p>
            <p className="muted text-sm mt-1">Across your full medical history</p>
          </div>

          <div className="card lg:col-span-2">
            <h3 className="font-semibold">Last Prescription</h3>
            <div className="mt-3 track"><div className="track-fill" style={{ width: '76%' }} /></div>
            {overview.lastPrescription ? (
              <div className="mt-3 text-sm space-y-1">
                <p><span className="muted">Medicines:</span> {(overview.lastPrescription.medicines || []).map((m) => m.name).join(', ') || '—'}</p>
                <p><span className="muted">Total Cost:</span> <span className="font-semibold">₹{overview.lastPrescription.totalCost ?? '—'}</span></p>
                {overview.lastPrescription.notes && <p><span className="muted">Notes:</span> {overview.lastPrescription.notes}</p>}
              </div>
            ) : (
              <p className="muted text-sm mt-3">No prescriptions yet.</p>
            )}
          </div>
          <div className="card">
            <h3 className="font-semibold">Pending Lab Tests</h3>
            <p className="metric-value mt-4 text-yellow-600">{pendingLabTestsCount}</p>
            <p className="muted text-sm mt-1">Awaiting report upload</p>
          </div>

          <div className="card">
            <h3 className="font-semibold">Notifications</h3>
            <ul className="mt-3 space-y-2">
              {(overview.notifications || []).map((n) => (
                <li key={n} className="rounded-xl border border-slate-700 px-3 py-2 text-sm">{n}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {tab === 'book' && (
        <form onSubmit={submitAppointment} className="card grid md:grid-cols-2 gap-4">
          <div className="md:col-span-2 rounded-lg bg-slate-50 border border-slate-200 px-3 py-2 text-sm text-slate-700">
            <div className="grid md:grid-cols-2 gap-3 items-end">
              <div>
                <p className="text-xs text-slate-500 mb-1">Day Patient ID</p>
                <p className="font-semibold">{dayPatientNumber ?? 'Select date & time'}</p>
              </div>
              <div>
                <label className="text-xs text-slate-500">Patient Name</label>
                <select className="input mt-1" value={selectedPatientId || ''} onChange={(e) => onPatientChange(e.target.value)}>
                  {(patients || []).map((p) => (
                    <option key={p.id} value={p.id}>{p.fullName || p.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Select Hospital</label>
            <select className="input mt-1" required value={form.hospitalId} onChange={(e) => onHospitalChange(e.target.value)}>
              <option value="">-- Choose a hospital --</option>
              {uniqueHospitals.map((h) => (
                <option key={h.id} value={h.id}>{h.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium">Select Doctor</label>
            <select className="input mt-1" required value={form.doctorId} disabled={!form.hospitalId || loadingDoctors} onChange={(e) => setForm({ ...form, doctorId: e.target.value })}>
              <option value="">{loadingDoctors ? 'Loading doctors...' : form.hospitalId ? '-- Choose a doctor --' : '-- Select hospital first --'}</option>
              {doctors.map((d) => (
                <option key={d.id} value={d.id}>{d.name}{d.specialization ? ` (${d.specialization})` : ''}</option>
              ))}
            </select>
          </div>
          <div><label className="text-sm font-medium">Date &amp; Time</label><input className="input mt-1" type="datetime-local" required value={form.appointmentDateTime} onChange={(e) => setForm({ ...form, appointmentDateTime: e.target.value })} /></div>
          <div><label className="text-sm font-medium">Symptoms / Disease</label><input className="input mt-1" required value={form.symptomsOrDisease} onChange={(e) => setForm({ ...form, symptomsOrDisease: e.target.value })} /></div>
          <div>
            <label className="text-sm font-medium">Consultation Fee</label>
            <input className="input mt-1" type="number" min="0" step="0.01" required value={form.consultationFee} onChange={(e) => setForm({ ...form, consultationFee: e.target.value })} placeholder="e.g. 300" />
          </div>
          {appointmentError && <div className="md:col-span-2 text-sm text-red-600">{appointmentError}</div>}
          {appointmentSuccess && <div className="md:col-span-2 text-sm text-green-700">{appointmentSuccess}</div>}
          <div className="md:col-span-2">
            <button className="btn-primary" type="submit" disabled={isSubmittingAppointment || !selectedPatientId}>
              {isSubmittingAppointment ? 'Submitting...' : 'Submit Appointment Request'}
            </button>
          </div>
        </form>
      )}

      {tab === 'appointments' && (
        <div className="card">
          <h3 className="font-semibold mb-3">My Appointments</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left muted">
                  <th className="py-2 pr-3">Doctor</th>
                  <th className="py-2 pr-3">Hospital</th>
                  <th className="py-2 pr-3">Date & Time</th>
                  <th className="py-2 pr-3">Day Patient ID</th>
                  <th className="py-2 pr-3">Consultation Fee</th>
                  <th className="py-2 pr-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((a) => (
                  <tr key={a.id} className="border-t border-slate-700/60">
                    <td className="py-2 pr-3">{a.doctorName || a?.doctor?.name || '-'}</td>
                    <td className="py-2 pr-3">{a.hospitalName || a?.hospital?.name || '-'}</td>
                    <td className="py-2 pr-3">{a?.appointmentDateTime || '-'}</td>
                    <td className="py-2 pr-3">{a?.dayPatientNumber ?? '-'}</td>
                    <td className="py-2 pr-3">{a?.consultationFee != null ? `₹${a.consultationFee}` : '-'}</td>
                    <td className="py-2 pr-3">{a?.status || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {tab === 'prescriptions' && (
        <div className="card">
          <h3 className="font-semibold mb-3">My Prescriptions</h3>
          {(prescriptions || []).length === 0 ? (
            <p className="muted text-sm py-6 text-center">No prescriptions yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="text-left muted">
                  <th className="py-2 pr-4">ID</th>
                  <th className="py-2 pr-4">Date</th>
                  <th className="py-2 pr-4">Medicines</th>
                  <th className="py-2 pr-4">Notes</th>
                  <th className="py-2">Total Cost</th>
                </tr></thead>
                <tbody>
                  {(prescriptions || []).map((p) => (
                    <tr key={p.id} className="border-t">
                      <td className="py-2 pr-4 font-mono text-xs">#{p.id}</td>
                      <td className="py-2 pr-4 text-slate-500">{p.consultation?.dateTime ? new Date(p.consultation.dateTime).toLocaleDateString() : '—'}</td>
                      <td className="py-2 pr-4">{(p.medicines || []).map((m) => m.name).join(', ') || '—'}</td>
                      <td className="py-2 pr-4 text-slate-500">{p.notes || '—'}</td>
                      <td className="py-2 font-semibold">₹{p.totalCost ?? '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {tab === 'labTests' && (
        <div className="card">
          <h3 className="font-semibold mb-3">Lab Tests</h3>
          {(patientLabTests || []).length === 0 ? (
            <p className="muted text-sm py-6 text-center">No lab tests yet.</p>
          ) : (
            <div>
              {uploadMsg && (
                <div className={`mb-4 rounded-xl px-4 py-3 text-sm ${uploadMsg.includes('successfully') ? 'bg-green-50 text-green-700 border border-green-200' : uploadMsg === 'Uploading...' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                  {uploadMsg}
                </div>
              )}
              <div className="grid md:grid-cols-2 gap-4">
                {patientLabTests.map((test) => (
                  <div key={test.id} className="border border-slate-700/30 rounded-xl p-4 bg-slate-50">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-bold text-slate-900 text-lg">{test.name || 'Lab Test'}</h4>
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${test.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : test.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-700'}`}>
                        {test.status}
                      </span>
                    </div>

                    {test.instructions && (
                      <p className="text-sm text-slate-600 mb-3">
                        <span className="muted">Instructions: </span>
                        {test.instructions}
                      </p>
                    )}

                    <div className="space-y-2 text-sm mb-4">
                      {test.orderedAt && (
                        <p className="text-slate-600">
                          <span className="muted">Ordered:</span> {new Date(test.orderedAt).toLocaleDateString()}
                        </p>
                      )}
                      {test.completedAt && (
                        <p className="text-slate-600">
                          <span className="muted">Completed:</span> {new Date(test.completedAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>

                    {test.status === 'PENDING' ? (
                      <div className="space-y-2 pt-3 border-t border-slate-200">
                        <label className="block text-sm text-slate-700">Upload Report</label>
                        <input
                          type="file"
                          onChange={(e) => handleUploadFileChange(test.id, e.target.files?.[0] || null)}
                          className="input text-sm"
                          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        />
                        <button
                          onClick={() => uploadLabTestReport(test.id)}
                          className="btn-primary w-full text-sm"
                        >
                          Upload Report
                        </button>
                      </div>
                    ) : test.status === 'COMPLETED' && test.filename ? (
                      <div className="pt-3 border-t border-slate-200">
                        <button
                          onClick={() => window.open(`/api/files/${test.filename}`, '_blank')}
                          className="btn-primary w-full text-sm"
                        >
                          View Report
                        </button>
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {tab === 'history' && (
        <div className="space-y-4">
          <div className="card">
            <h3 className="font-semibold mb-3">Consultations</h3>
            {(history.consultations || []).length === 0 ? (
              <p className="muted text-sm py-4 text-center">No consultations yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="text-left muted">
                    <th className="py-2 pr-4">Date</th>
                    <th className="py-2 pr-4">Doctor</th>
                    <th className="py-2 pr-4">Symptoms</th>
                    <th className="py-2 pr-4">Diagnosis</th>
                    <th className="py-2">Fee</th>
                  </tr></thead>
                  <tbody>
                    {(history.consultations || []).map((c) => (
                      <tr key={c.id} className="border-t">
                        <td className="py-2 pr-4">{c.dateTime ? new Date(c.dateTime).toLocaleDateString() : '—'}</td>
                        <td className="py-2 pr-4 font-medium">{c.doctor?.name || '—'}</td>
                        <td className="py-2 pr-4 text-slate-500">{c.symptoms || '—'}</td>
                        <td className="py-2 pr-4">{c.diagnosis || '—'}</td>
                        <td className="py-2 font-semibold">{c.consultationFee != null ? '₹' + c.consultationFee : '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          {(history.prescriptions || []).length > 0 && (
            <div className="card">
              <h3 className="font-semibold mb-3">Prescription History</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="text-left muted">
                    <th className="py-2 pr-4">ID</th>
                    <th className="py-2 pr-4">Medicines</th>
                    <th className="py-2">Total Cost</th>
                  </tr></thead>
                  <tbody>
                    {(history.prescriptions || []).map((p) => (
                      <tr key={p.id} className="border-t">
                        <td className="py-2 pr-4 font-mono text-xs">#{p.id}</td>
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

      {tab === 'complaints' && (
        <form onSubmit={submitComplaint} className="card grid md:grid-cols-2 gap-4">
          <div><label className="text-sm">Complaint Type</label><select className="input mt-1" value={complaint.complaintType} onChange={(e) => setComplaint({ ...complaint, complaintType: e.target.value })}><option value="HIGH_CONSULTATION_FEE">High Consultation Fee</option><option value="EXPENSIVE_MEDICINE">Expensive Medicine</option></select></div>
          <div><label className="text-sm">Reported Amount</label><input className="input mt-1" type="number" value={complaint.reportedAmount} onChange={(e) => setComplaint({ ...complaint, reportedAmount: e.target.value })} /></div>
          <div><label className="text-sm">Consultation ID (optional)</label><input className="input mt-1" value={complaint.consultationId} onChange={(e) => setComplaint({ ...complaint, consultationId: e.target.value })} /></div>
          <div><label className="text-sm">Prescription ID (optional)</label><input className="input mt-1" value={complaint.prescriptionId} onChange={(e) => setComplaint({ ...complaint, prescriptionId: e.target.value })} /></div>
          <div className="md:col-span-2"><label className="text-sm">Description</label><textarea className="input mt-1" rows="4" value={complaint.description} onChange={(e) => setComplaint({ ...complaint, description: e.target.value })} /></div>
          {complaintError && <div className="md:col-span-2 text-sm text-red-600 bg-red-50 rounded-xl px-3 py-2">{complaintError}</div>}
          {complaintSuccess && <div className="md:col-span-2 text-sm text-green-700 bg-green-50 rounded-xl px-3 py-2">{complaintSuccess}</div>}
          <div className="md:col-span-2"><button className="btn-primary" type="submit">Report Overcharging</button></div>
        </form>
      )}
    </DashboardShell>
  );
}
