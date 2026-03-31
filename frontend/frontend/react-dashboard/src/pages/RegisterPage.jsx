import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../lib/api';

export default function RegisterPage() {
  const specializationOptions = [
    'General Medicine',
    'Cardiology',
    'Neurology',
    'Orthopedics',
    'Dermatology',
    'Pediatrics',
    'ENT',
    'Gynecology',
    'Pulmonology',
    'Psychiatry',
  ];

  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    hospitalId: '',
    specialization: '',
    licenseNumber: '',
    emergencyContact: '',
    role: 'PATIENT'
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [hospitals, setHospitals] = useState([]);
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/hospitals').then((r) => setHospitals(r.data || [])).catch(() => setHospitals([]));
  }, []);

  const uniqueHospitals = Array.from(
    new Map((hospitals || []).map((h) => [h.name, h])).values()
  );

  async function submit(e) {
    e.preventDefault();
    setError('');
    setMessage('');
    if (form.password !== form.confirmPassword) {
      setError('Password and confirm password do not match.');
      return;
    }

    try {
      setLoading(true);
      await api.post('/auth/register', {
        fullName: form.fullName,
        phone: form.phone,
        dateOfBirth: form.dateOfBirth,
        gender: form.gender,
        address: form.address,
        email: form.email,
        username: form.username,
        password: form.password,
        role: form.role,
        hospitalId: form.hospitalId ? Number(form.hospitalId) : null,
        specialization: form.specialization,
        licenseNumber: form.licenseNumber,
        emergencyContact: form.emergencyContact,
      });

      setMessage('Registration successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err?.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const roles = [
    { value: 'PATIENT', label: 'Patient', desc: 'Book appointments & view records', gradient: 'from-blue-500 to-cyan-500',
      icon: <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
    },
    { value: 'DOCTOR', label: 'Doctor', desc: 'Manage patients & consultations', gradient: 'from-emerald-500 to-teal-500',
      icon: <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
    },
    { value: 'ADMIN', label: 'Admin', desc: 'Oversee hospital operations', gradient: 'from-purple-500 to-pink-500',
      icon: <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200/40 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200/40 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-200/30 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-2xl">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-2xl shadow-indigo-300 mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Create Your Account</h1>
          <p className="text-gray-500 mt-2">Join MediTrust healthcare platform</p>
        </div>

        {/* Progress indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${step >= s ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg' : 'bg-gray-100 text-gray-400'}`}>
                {s}
              </div>
              {s < 3 && <div className={`w-12 h-1 mx-1 rounded ${step > s ? 'bg-gradient-to-r from-indigo-500 to-purple-600' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>

        <form onSubmit={submit} className="card p-8">
          {/* Step 1: Role Selection */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Select Your Role</h2>
                <p className="text-gray-500 mt-1">Choose how you'll use MediTrust</p>
              </div>

              <div className="grid gap-4">
                {roles.map((role) => (
                  <button
                    key={role.value}
                    type="button"
                    onClick={() => setForm({ ...form, role: role.value })}
                    className={`p-6 rounded-2xl border-2 transition-all text-left ${form.role === role.value ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300'}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${role.gradient} flex items-center justify-center shadow-lg`}>
                        {role.icon}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{role.label}</h3>
                        <p className="text-gray-500 text-sm">{role.desc}</p>
                      </div>
                      {form.role === role.value && (
                        <div className="ml-auto">
                          <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setStep(2)}
                className="btn-primary w-full py-4 text-base"
              >
                Continue
              </button>
            </div>
          )}

          {/* Step 2: Personal Information */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
                <p className="text-gray-500 mt-1">Tell us about yourself</p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input className="input" required value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input className="input" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+1 234 567 8900" />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                  <input className="input" type="date" required value={form.dateOfBirth} onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                  <select className="input" required value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}>
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input className="input" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="john@example.com" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <textarea className="input" rows="2" required value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="123 Main St, City" />
              </div>

              {/* Role-specific fields */}
              {form.role === 'DOCTOR' && (
                <div className="space-y-4 p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                  <h3 className="text-sm font-semibold text-emerald-700 uppercase tracking-wider">Doctor Details</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Hospital</label>
                      <select className="input" required value={form.hospitalId} onChange={(e) => setForm({ ...form, hospitalId: e.target.value })}>
                        <option value="">Select hospital</option>
                        {uniqueHospitals.map((h) => (
                          <option key={h.id} value={h.id}>{h.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Specialization</label>
                      <select className="input" required value={form.specialization} onChange={(e) => setForm({ ...form, specialization: e.target.value })}>
                        <option value="">Select specialization</option>
                        {specializationOptions.map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">License Number</label>
                      <input className="input" required value={form.licenseNumber} onChange={(e) => setForm({ ...form, licenseNumber: e.target.value })} placeholder="MED-12345" />
                    </div>
                  </div>
                </div>
              )}

              {form.role === 'PATIENT' && (
                <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
                  <h3 className="text-sm font-semibold text-blue-700 uppercase tracking-wider mb-4">Emergency Contact</h3>
                  <input className="input" required value={form.emergencyContact} onChange={(e) => setForm({ ...form, emergencyContact: e.target.value })} placeholder="Emergency contact number" />
                </div>
              )}

              <div className="flex gap-4">
                <button type="button" onClick={() => setStep(1)} className="btn-secondary flex-1 py-4">
                  Back
                </button>
                <button type="button" onClick={() => setStep(3)} className="btn-primary flex-1 py-4">
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Account Setup */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Account Setup</h2>
                <p className="text-gray-500 mt-1">Create your login credentials</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">@</span>
                  <input className="input pl-10" required value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} placeholder="johndoe" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <input className="input" type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Create a strong password" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                <input className="input" type="password" required value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} placeholder="Confirm your password" />
              </div>

              {/* Summary */}
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                <h3 className="text-sm font-semibold text-gray-600 mb-3">Registration Summary</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span className="text-gray-500">Role:</span>
                  <span className="text-gray-900 font-medium">{form.role}</span>
                  <span className="text-gray-500">Name:</span>
                  <span className="text-gray-900 font-medium">{form.fullName || '—'}</span>
                  <span className="text-gray-500">Email:</span>
                  <span className="text-gray-900 font-medium">{form.email || '—'}</span>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 border border-red-200">
                  <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {message && (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-green-50 border border-green-200">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <p className="text-sm text-green-700">{message}</p>
                </div>
              )}

              <div className="flex gap-4">
                <button type="button" onClick={() => setStep(2)} className="btn-secondary flex-1 py-4">
                  Back
                </button>
                <button type="submit" disabled={loading} className="btn-primary flex-1 py-4">
                  {loading ? (
                    <span className="flex items-center gap-2 justify-center">
                      <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Creating...
                    </span>
                  ) : 'Create Account'}
                </button>
              </div>
            </div>
          )}

          {/* Footer links */}
          <div className="mt-6 pt-6 border-t border-gray-200 text-center space-y-3">
            <Link to="/login" className="block text-gray-600 hover:text-indigo-600 transition-colors">
              Already have an account? <span className="text-indigo-600 font-medium">Sign in</span>
            </Link>
            <Link to="/" className="block text-gray-400 hover:text-gray-600 transition-colors text-sm">
              Back to Home
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
