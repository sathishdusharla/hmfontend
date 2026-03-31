import { useNavigate } from 'react-router-dom';

export default function DashboardShell({ title, subtitle, children }) {
  const navigate = useNavigate();
  const username = localStorage.getItem('meditrust_user') || '';
  const role = localStorage.getItem('meditrust_role') || '';

  function handleLogout() {
    localStorage.removeItem('meditrust_token');
    localStorage.removeItem('meditrust_user');
    localStorage.removeItem('meditrust_role');
    localStorage.removeItem('meditrust_entity_id');
    navigate('/login');
  }

  const getRoleIcon = () => {
    switch (role) {
      case 'ADMIN': return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      );
      case 'DOCTOR': return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      );
      case 'PATIENT': return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      );
      default: return null;
    }
  };

  const getRoleColor = () => {
    switch (role) {
      case 'ADMIN': return 'from-purple-500 to-indigo-600';
      case 'DOCTOR': return 'from-emerald-500 to-teal-600';
      case 'PATIENT': return 'from-blue-500 to-cyan-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex justify-between items-center">
            {/* Logo & Brand */}
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${getRoleColor()} flex items-center justify-center shadow-lg`}>
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">MediTrust</h1>
                <p className="text-xs text-gray-500">Healthcare Management</p>
              </div>
            </div>

            {/* Page Title (center) */}
            <div className="hidden md:block text-center">
              <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
              <p className="text-xs text-gray-500">{subtitle}</p>
            </div>

            {/* User Section */}
            <div className="flex items-center gap-4">
              {/* User Info Card */}
              <div className="hidden sm:flex items-center gap-3 px-4 py-2 rounded-2xl bg-gray-50 border border-gray-200">
                <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${getRoleColor()} flex items-center justify-center text-white`}>
                  {getRoleIcon()}
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-900">{username}</p>
                  <p className="text-xs text-gray-500">{role}</p>
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="group flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-100 border border-gray-200 text-gray-600 hover:text-red-600 hover:bg-red-50 hover:border-red-200 transition-all duration-300"
              >
                <svg className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Title */}
      <div className="md:hidden px-6 py-4 bg-white border-b border-gray-100">
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        <p className="text-sm text-gray-500">{subtitle}</p>
      </div>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-6 py-8">
        {children}
      </main>
    </div>
  );
}
