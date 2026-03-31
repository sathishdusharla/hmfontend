import { useEffect, useState } from 'react';
import DashboardShell from '../../components/DashboardShell';
import api from '../../lib/api';

function Badge({ text, variant = 'gray' }) {
  const cls = {
    green:  'bg-green-100 text-green-700',
    red:    'bg-red-100 text-red-700',
    yellow: 'bg-yellow-100 text-yellow-700',
    blue:   'bg-blue-100 text-blue-700',
    gray:   'bg-slate-100 text-slate-600',
  }[variant] || 'bg-slate-100 text-slate-600';
  return <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${cls}`}>{text}</span>;
}

export default function AdminDashboardPage() {
  const [tab, setTab]             = useState('overview');
  const [overview, setOverview]   = useState(null);
  const [hospitals, setHospitals] = useState([]);
  const [doctors, setDoctors]     = useState([]);
  const [alerts, setAlerts]       = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [patients, setPatients]   = useState([]);
  const [allAppointments, setAllAppointments] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');
  const [actionMsg, setActionMsg] = useState('');

  const [patientForm, setPatientForm] = useState({
    fullName: '',
    dateOfBirth: '',
    gender: '',
    phone: '',
    email: '',
    username: '',
    password: '',
    hospitalId: '',
  });

  const [bookForm, setBookForm] = useState({
    patientId: '',
    doctorId: '',
    hospitalId: '',
    appointmentDateTime: '',
    symptomsOrDisease: '',
  });

  const [bookDoctors, setBookDoctors] = useState([]);

  useEffect(() => { loadData(); }, []);

  useEffect(() => {
    if (bookForm.hospitalId) {
      const hospitalId = Number(bookForm.hospitalId);
      const filtered = doctors.filter(d => d.hospital?.id === hospitalId);
      setBookDoctors(filtered);
    } else {
      setBookDoctors([]);
    }
  }, [bookForm.hospitalId, doctors]);

  async function loadData() {
    setLoading(true);
    setError('');
    try {
      const [ov, h, d, a, c, an, p, ap] = await Promise.all([
        api.get('/admin/system-overview'),
        api.get('/admin/hospitals'),
        api.get('/admin/doctors'),
        api.get('/admin/alerts'),
        api.get('/admin/complaints'),
        api.get('/admin/analytics'),
        api.get('/admin/patients'),
        api.get('/admin/appointments'),
      ]);
      setOverview(ov.data);
      setHospitals(h.data || []);
      setDoctors(d.data || []);
      setAlerts(a.data || []);
      setComplaints(c.data || []);
      setAnalytics(an.data);
      setPatients(p.data || []);
      setAllAppointments(ap.data || []);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load dashboard data. Check that the backend is running.');
    } finally {
      setLoading(false);
    }
  }

  async function resolveAlert(id) {
    try {
      await api.put(`/admin/alerts/${id}/resolve`);
      setActionMsg('Alert resolved.');
      await loadData();
    } catch (err) {
      setActionMsg('✗ ' + (err?.response?.data?.message || 'Failed to resolve alert.'));
    }
  }

  async function resolveComplaint(id) {
    try {
      await api.put(`/admin/complaints/${id}/resolve`);
      setActionMsg('Complaint resolved.');
      await loadData();
    } catch (err) {
      setActionMsg('✗ ' + (err?.response?.data?.message || 'Failed to resolve complaint.'));
    }
  }

  async function approveDoctor(id) {
    try {
      await api.put(`/admin/doctors/${id}/approve`);
      setActionMsg('Doctor approved.');
      await loadData();
    } catch (err) {
      setActionMsg('✗ ' + (err?.response?.data?.message || 'Failed to approve doctor.'));
    }
  }

  async function approveHospital(id) {
    try {
      await api.put(`/admin/hospitals/${id}/approve`);
      setActionMsg('Hospital approved.');
      await loadData();
    } catch (err) {
      setActionMsg('✗ ' + (err?.response?.data?.message || 'Failed to approve hospital.'));
    }
  }

  async function createPatient(e) {
    e.preventDefault();
    if (!patientForm.fullName || !patientForm.dateOfBirth || !patientForm.gender || !patientForm.phone || !patientForm.email || !patientForm.username || !patientForm.password || !patientForm.hospitalId) {
      setActionMsg('✗ Please fill in all required fields.');
      return;
    }
    try {
      await api.post('/admin/patients', patientForm);
      setActionMsg('Patient created successfully.');
      setPatientForm({
        fullName: '',
        dateOfBirth: '',
        gender: '',
        phone: '',
        email: '',
        username: '',
        password: '',
        hospitalId: '',
      });
      await loadData();
    } catch (err) {
      setActionMsg('✗ ' + (err?.response?.data?.message || 'Failed to create patient.'));
    }
  }

  async function deletePatient(id) {
    if (!confirm('Are you sure you want to delete this patient?')) return;
    try {
      await api.delete(`/admin/patients/${id}`);
      setActionMsg('Patient deleted successfully.');
      await loadData();
    } catch (err) {
      setActionMsg('✗ ' + (err?.response?.data?.message || 'Failed to delete patient.'));
    }
  }

  async function bookAppointment(e) {
    e.preventDefault();
    if (!bookForm.patientId || !bookForm.doctorId || !bookForm.hospitalId || !bookForm.appointmentDateTime || !bookForm.symptomsOrDisease) {
      setActionMsg('✗ Please fill in all required fields.');
      return;
    }
    try {
      await api.post('/admin/appointments', bookForm);
      setActionMsg('Appointment booked successfully.');
      setBookForm({
        patientId: '',
        doctorId: '',
        hospitalId: '',
        appointmentDateTime: '',
        symptomsOrDisease: '',
      });
      await loadData();
    } catch (err) {
      setActionMsg('✗ ' + (err?.response?.data?.message || 'Failed to book appointment.'));
    }
  }

  const openAlerts     = alerts.filter((a) => !a.reviewed).length;
  const openComplaints = complaints.filter((c) => c.status !== 'RESOLVED').length;

  if (loading) {
    return (
      <DashboardShell title="Admin Dashboard" subtitle="System oversight, fraud detection, and analytics">
        <p className="muted text-sm py-12 text-center">Loading dashboard…</p>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell title="Admin Dashboard" subtitle="System oversight, fraud detection, and analytics">
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm flex justify-between items-center">
          <span>{error}</span>
          <button className="text-xs underline ml-4" onClick={loadData}>Retry</button>
        </div>
      )}
      {actionMsg && (
        <div className={`mb-4 rounded-xl px-4 py-3 text-sm ${actionMsg.startsWith('✗') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
          {actionMsg}
        </div>
      )}

      <div className="flex flex-wrap gap-2 mb-6">
        {['overview', 'patients', 'appointments', 'hospitals', 'doctors', 'alerts', 'complaints', 'analytics'].map((name) => (
          <button key={name} onClick={() => { setTab(name); setActionMsg(''); }} className={tab === name ? 'btn-tab active' : 'btn-tab'}>
            {name.charAt(0).toUpperCase() + name.slice(1)}
            {name === 'alerts'     && openAlerts > 0     && <span className="ml-1.5 bg-red-500 text-white text-xs rounded-full px-1.5">{openAlerts}</span>}
            {name === 'complaints' && openComplaints > 0 && <span className="ml-1.5 bg-orange-500 text-white text-xs rounded-full px-1.5">{openComplaints}</span>}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW ── */}
      {tab === 'overview' && (
        <div className="space-y-4">
          <div className="grid md:grid-cols-4 gap-4">
            {[
              { label: 'Total Hospitals',     value: overview?.totalHospitals      ?? '—', color: 'text-blue-600' },
              { label: 'Total Doctors',        value: overview?.totalDoctors        ?? '—', color: 'text-emerald-600' },
              { label: 'Total Patients',       value: overview?.totalPatients       ?? '—', color: 'text-violet-600' },
              { label: 'Corruption Alerts',    value: overview?.totalCorruptionAlerts ?? '—', color: 'text-red-600' },
            ].map(({ label, value, color }) => (
              <div key={label} className="card text-center">
                <p className="text-sm muted">{label}</p>
                <p className={`text-4xl font-bold mt-2 ${color}`}>{value}</p>
              </div>
            ))}
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="card">
              <h3 className="font-semibold mb-3">Pending Hospital Approvals</h3>
              {hospitals.filter(h => !h.approved).length === 0
                ? <p className="muted text-sm">All hospitals approved.</p>
                : hospitals.filter(h => !h.approved).map(h => (
                  <div key={h.id} className="flex justify-between items-center border-b py-2">
                    <div><p className="font-medium">{h.name}</p><p className="text-xs muted">{h.address}</p></div>
                    <button className="btn-primary text-xs py-1" onClick={() => approveHospital(h.id)}>Approve</button>
                  </div>
                ))}
            </div>
            <div className="card">
              <h3 className="font-semibold mb-3">Recent Open Corruption Alerts</h3>
              {alerts.filter(a => !a.reviewed).slice(0, 5).length === 0
                ? <p className="muted text-sm">No open alerts.</p>
                : alerts.filter(a => !a.reviewed).slice(0, 5).map(a => (
                  <div key={a.id} className="flex justify-between items-center border-b py-2">
                    <div>
                      <p className="font-medium text-sm">{a.type}</p>
                      <p className="text-xs muted">{a.message}</p>
                    </div>
                    <Badge text={a.severity || 'MEDIUM'} variant={a.severity === 'HIGH' ? 'red' : a.severity === 'MEDIUM' ? 'yellow' : 'blue'} />
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* ── PATIENTS ── */}
      {tab === 'patients' && (
        <div className="space-y-4">
          <div className="card">
            <h3 className="font-semibold mb-4">Add New Patient</h3>
            <form onSubmit={createPatient} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Full Name *</label>
                  <input type="text" placeholder="John Doe" value={patientForm.fullName} onChange={(e) => setPatientForm({...patientForm, fullName: e.target.value})} className="input w-full" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Date of Birth *</label>
                  <input type="date" value={patientForm.dateOfBirth} onChange={(e) => setPatientForm({...patientForm, dateOfBirth: e.target.value})} className="input w-full" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Gender *</label>
                  <select value={patientForm.gender} onChange={(e) => setPatientForm({...patientForm, gender: e.target.value})} className="input w-full">
                    <option value="">Select Gender</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Phone *</label>
                  <input type="tel" placeholder="+1234567890" value={patientForm.phone} onChange={(e) => setPatientForm({...patientForm, phone: e.target.value})} className="input w-full" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Email *</label>
                  <input type="email" placeholder="patient@example.com" value={patientForm.email} onChange={(e) => setPatientForm({...patientForm, email: e.target.value})} className="input w-full" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Username *</label>
                  <input type="text" placeholder="johndoe" value={patientForm.username} onChange={(e) => setPatientForm({...patientForm, username: e.target.value})} className="input w-full" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Password *</label>
                  <input type="password" placeholder="Secure password" value={patientForm.password} onChange={(e) => setPatientForm({...patientForm, password: e.target.value})} className="input w-full" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Hospital *</label>
                  <select value={patientForm.hospitalId} onChange={(e) => setPatientForm({...patientForm, hospitalId: e.target.value})} className="input w-full">
                    <option value="">Select Hospital</option>
                    {hospitals.map(h => (
                      <option key={h.id} value={h.id}>{h.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <button type="submit" className="btn-primary">Add Patient</button>
            </form>
          </div>

          <div className="card">
            <h3 className="font-semibold mb-4">All Patients ({patients.length})</h3>
            {patients.length === 0 ? <p className="muted text-sm py-4 text-center">No patients registered.</p> : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="text-left muted">
                    <th className="py-2 pr-4">Name</th>
                    <th className="py-2 pr-4">DOB</th>
                    <th className="py-2 pr-4">Gender</th>
                    <th className="py-2 pr-4">Phone</th>
                    <th className="py-2 pr-4">Email</th>
                    <th className="py-2">Action</th>
                  </tr></thead>
                  <tbody>
                    {patients.map((p) => (
                      <tr key={p.id} className="border-t">
                        <td className="py-2 pr-4 font-medium">{p.fullName || p.name || '—'}</td>
                        <td className="py-2 pr-4">{p.dateOfBirth ? new Date(p.dateOfBirth).toLocaleDateString() : '—'}</td>
                        <td className="py-2 pr-4">{p.gender || '—'}</td>
                        <td className="py-2 pr-4">{p.phone || '—'}</td>
                        <td className="py-2 pr-4 text-slate-500">{p.email || '—'}</td>
                        <td className="py-2">
                          <button className="btn-danger text-xs py-1" onClick={() => deletePatient(p.id)}>Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── APPOINTMENTS ── */}
      {tab === 'appointments' && (
        <div className="space-y-4">
          <div className="card">
            <h3 className="font-semibold mb-4">Book New Appointment</h3>
            <form onSubmit={bookAppointment} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Patient *</label>
                  <select value={bookForm.patientId} onChange={(e) => setBookForm({...bookForm, patientId: e.target.value})} className="input w-full">
                    <option value="">Select Patient</option>
                    {patients.map(p => (
                      <option key={p.id} value={p.id}>{p.fullName || p.name} {p.email ? `(${p.email})` : ''}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Hospital *</label>
                  <select value={bookForm.hospitalId} onChange={(e) => setBookForm({...bookForm, hospitalId: e.target.value, doctorId: ''})} className="input w-full">
                    <option value="">Select Hospital</option>
                    {hospitals.map(h => (
                      <option key={h.id} value={h.id}>{h.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Doctor *</label>
                  <select value={bookForm.doctorId} onChange={(e) => setBookForm({...bookForm, doctorId: e.target.value})} className="input w-full" disabled={!bookForm.hospitalId}>
                    <option value="">Select Doctor</option>
                    {bookDoctors.map(d => (
                      <option key={d.id} value={d.id}>{d.name} ({d.specialization})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Appointment Date & Time *</label>
                  <input type="datetime-local" value={bookForm.appointmentDateTime} onChange={(e) => setBookForm({...bookForm, appointmentDateTime: e.target.value})} className="input w-full" />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium mb-1 block">Symptoms or Disease *</label>
                  <textarea placeholder="Describe symptoms or disease" value={bookForm.symptomsOrDisease} onChange={(e) => setBookForm({...bookForm, symptomsOrDisease: e.target.value})} className="input w-full" rows="3"></textarea>
                </div>
              </div>
              <button type="submit" className="btn-primary">Book Appointment</button>
            </form>
          </div>

          <div className="card">
            <h3 className="font-semibold mb-4">All Appointments ({allAppointments.length})</h3>
            {allAppointments.length === 0 ? <p className="muted text-sm py-4 text-center">No appointments booked.</p> : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="text-left muted">
                    <th className="py-2 pr-4">Patient Name</th>
                    <th className="py-2 pr-4">Doctor Name</th>
                    <th className="py-2 pr-4">Hospital</th>
                    <th className="py-2 pr-4">Date & Time</th>
                    <th className="py-2 pr-4">Symptoms</th>
                    <th className="py-2">Status</th>
                  </tr></thead>
                  <tbody>
                    {allAppointments.map((apt) => (
                      <tr key={apt.id} className="border-t">
                        <td className="py-2 pr-4 font-medium">{apt.patientFullName || '—'}</td>
                        <td className="py-2 pr-4">{apt.doctorName || '—'}</td>
                        <td className="py-2 pr-4">{apt.hospitalName || '—'}</td>
                        <td className="py-2 pr-4">{apt.appointmentDateTime ? new Date(apt.appointmentDateTime).toLocaleString() : '—'}</td>
                        <td className="py-2 pr-4 text-slate-500 max-w-xs truncate">{apt.symptomsOrDisease || '—'}</td>
                        <td className="py-2"><Badge text={apt.status || 'SCHEDULED'} variant={apt.status === 'COMPLETED' ? 'green' : apt.status === 'CANCELLED' ? 'red' : 'blue'} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── HOSPITALS ── */}
      {tab === 'hospitals' && (
        <div className="card">
          <h3 className="font-semibold mb-4">Registered Hospitals ({hospitals.length})</h3>
          {hospitals.length === 0 ? <p className="muted text-sm py-4 text-center">No hospitals registered.</p> : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="text-left muted">
                  <th className="py-2 pr-4">Name</th>
                  <th className="py-2 pr-4">Address</th>
                  <th className="py-2 pr-4">Phone</th>
                  <th className="py-2 pr-4">Status</th>
                  <th className="py-2">Action</th>
                </tr></thead>
                <tbody>
                  {hospitals.map((h) => (
                    <tr key={h.id} className="border-t">
                      <td className="py-2 pr-4 font-medium">{h.name}</td>
                      <td className="py-2 pr-4 text-slate-500">{h.address || '—'}</td>
                      <td className="py-2 pr-4 text-slate-500">{h.phone || '—'}</td>
                      <td className="py-2 pr-4"><Badge text={h.approved ? 'Approved' : 'Pending'} variant={h.approved ? 'green' : 'yellow'} /></td>
                      <td className="py-2">
                        {!h.approved && <button className="btn-primary text-xs py-1" onClick={() => approveHospital(h.id)}>Approve</button>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ── DOCTORS ── */}
      {tab === 'doctors' && (
        <div className="card">
          <h3 className="font-semibold mb-4">Registered Doctors ({doctors.length})</h3>
          {doctors.length === 0 ? <p className="muted text-sm py-4 text-center">No doctors registered.</p> : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="text-left muted">
                  <th className="py-2 pr-4">Name</th>
                  <th className="py-2 pr-4">Specialization</th>
                  <th className="py-2 pr-4">Hospital</th>
                  <th className="py-2 pr-4">Status</th>
                  <th className="py-2">Action</th>
                </tr></thead>
                <tbody>
                  {doctors.map((d) => (
                    <tr key={d.id} className="border-t">
                      <td className="py-2 pr-4 font-medium">{d.name}</td>
                      <td className="py-2 pr-4">{d.specialization || '—'}</td>
                      <td className="py-2 pr-4 text-slate-500">{d.hospital?.name || '—'}</td>
                      <td className="py-2 pr-4"><Badge text={d.approved ? 'Approved' : 'Pending'} variant={d.approved ? 'green' : 'yellow'} /></td>
                      <td className="py-2">
                        {!d.approved && <button className="btn-primary text-xs py-1" onClick={() => approveDoctor(d.id)}>Approve</button>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ── ALERTS ── */}
      {tab === 'alerts' && (
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Corruption Alerts ({alerts.length}) — {openAlerts} open</h3>
            <button className="btn-secondary text-xs" onClick={loadData}>Refresh</button>
          </div>
          {alerts.length === 0 ? <p className="muted text-sm py-4 text-center">No alerts recorded.</p> : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="text-left muted">
                  <th className="py-2 pr-4">Type</th>
                  <th className="py-2 pr-4">Message</th>
                  <th className="py-2 pr-4">Doctor</th>
                  <th className="py-2 pr-4">Severity</th>
                  <th className="py-2 pr-4">Date</th>
                  <th className="py-2 pr-4">Status</th>
                  <th className="py-2">Action</th>
                </tr></thead>
                <tbody>
                  {alerts.map((a) => (
                    <tr key={a.id} className="border-t">
                      <td className="py-2 pr-4 font-medium">{a.type}</td>
                      <td className="py-2 pr-4 text-slate-500 max-w-xs truncate">{a.message}</td>
                      <td className="py-2 pr-4">{a.doctor?.name || '—'}</td>
                      <td className="py-2 pr-4"><Badge text={a.severity || 'MEDIUM'} variant={a.severity === 'HIGH' ? 'red' : a.severity === 'MEDIUM' ? 'yellow' : 'blue'} /></td>
                      <td className="py-2 pr-4 text-slate-500 text-xs">{a.dateTime ? new Date(a.dateTime).toLocaleDateString() : '—'}</td>
                      <td className="py-2 pr-4"><Badge text={a.reviewed ? 'Resolved' : 'Open'} variant={a.reviewed ? 'green' : 'red'} /></td>
                      <td className="py-2">
                        {!a.reviewed && <button className="btn-secondary text-xs py-1" onClick={() => resolveAlert(a.id)}>Resolve</button>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ── COMPLAINTS ── */}
      {tab === 'complaints' && (
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Patient Complaints ({complaints.length}) — {openComplaints} open</h3>
            <button className="btn-secondary text-xs" onClick={loadData}>Refresh</button>
          </div>
          {complaints.length === 0 ? <p className="muted text-sm py-4 text-center">No complaints filed.</p> : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="text-left muted">
                  <th className="py-2 pr-4">Type</th>
                  <th className="py-2 pr-4">Description</th>
                  <th className="py-2 pr-4">Reported Amount</th>
                  <th className="py-2 pr-4">Status</th>
                  <th className="py-2">Action</th>
                </tr></thead>
                <tbody>
                  {complaints.map((c) => (
                    <tr key={c.id} className="border-t">
                      <td className="py-2 pr-4 font-medium">{c.complaintType}</td>
                      <td className="py-2 pr-4 text-slate-500 max-w-xs truncate">{c.description || '—'}</td>
                      <td className="py-2 pr-4">{c.reportedAmount ? '₹' + c.reportedAmount : '—'}</td>
                      <td className="py-2 pr-4"><Badge text={c.status} variant={c.status === 'RESOLVED' ? 'green' : c.status === 'UNDER_REVIEW' ? 'yellow' : 'red'} /></td>
                      <td className="py-2">
                        {c.status !== 'RESOLVED' && <button className="btn-secondary text-xs py-1" onClick={() => resolveComplaint(c.id)}>Resolve</button>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ── ANALYTICS ── */}
      {tab === 'analytics' && (
        <div className="space-y-4">
          {!analytics ? (
            <p className="muted text-sm py-8 text-center">No analytics data available yet. Consultations and prescriptions will populate this view.</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              <div className="card">
                <h3 className="font-semibold mb-3">Most Prescribed Medicines</h3>
                {Object.keys(analytics.mostPrescribedMedicines || {}).length === 0
                  ? <p className="muted text-sm">No data yet.</p>
                  : Object.entries(analytics.mostPrescribedMedicines).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([name, count]) => {
                    const max = Math.max(...Object.values(analytics.mostPrescribedMedicines));
                    return (
                      <div key={name} className="flex items-center gap-3 py-1.5 border-b last:border-0">
                        <span className="flex-1 text-sm font-medium">{name}</span>
                        <span className="text-xs muted">{count}×</span>
                        <div className="w-20 track"><div className="track-fill" style={{ width: `${Math.min((count / max) * 100, 100)}%` }} /></div>
                      </div>
                    );
                  })}
              </div>
              <div className="card">
                <h3 className="font-semibold mb-3">Doctors — Prescription Costs</h3>
                {Object.keys(analytics.doctorsWithHighestPrescriptionCost || {}).length === 0
                  ? <p className="muted text-sm">No data yet.</p>
                  : Object.entries(analytics.doctorsWithHighestPrescriptionCost).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([name, cost]) => (
                    <div key={name} className="flex items-center gap-3 py-1.5 border-b last:border-0">
                      <span className="flex-1 text-sm font-medium">{name}</span>
                      <span className="text-sm font-semibold">₹{Number(cost).toFixed(0)}</span>
                    </div>
                  ))}
              </div>
              <div className="card">
                <h3 className="font-semibold mb-3">Hospitals — Alert Count</h3>
                {Object.keys(analytics.hospitalsWithMostAlerts || {}).length === 0
                  ? <p className="muted text-sm">No alerts yet.</p>
                  : Object.entries(analytics.hospitalsWithMostAlerts).sort((a, b) => b[1] - a[1]).map(([name, count]) => (
                    <div key={name} className="flex items-center gap-3 py-1.5 border-b last:border-0">
                      <span className="flex-1 text-sm font-medium">{name}</span>
                      <Badge text={count + ' alerts'} variant={count > 3 ? 'red' : count > 1 ? 'yellow' : 'gray'} />
                    </div>
                  ))}
              </div>
              <div className="card">
                <h3 className="font-semibold mb-3">Monthly Consultation Visits</h3>
                {Object.keys(analytics.monthlyPatientVisits || {}).length === 0
                  ? <p className="muted text-sm">No visit data yet.</p>
                  : Object.entries(analytics.monthlyPatientVisits).sort((a, b) => a[0].localeCompare(b[0])).map(([month, count]) => {
                    const max = Math.max(...Object.values(analytics.monthlyPatientVisits));
                    return (
                      <div key={month} className="flex items-center gap-3 py-1.5 border-b last:border-0">
                        <span className="flex-1 text-sm font-medium">{month}</span>
                        <span className="text-sm font-semibold">{count} visits</span>
                        <div className="w-20 track"><div className="track-fill" style={{ width: `${Math.min((count / max) * 100, 100)}%` }} /></div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}
        </div>
      )}
    </DashboardShell>
  );
}
