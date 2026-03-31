import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Background decorations */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-purple-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-200/30 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-200/20 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-50 sticky top-0 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-300">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <span className="text-xl font-bold text-gray-900">MediTrust</span>
            </div>
            <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
              {['Features', 'Solutions', 'Plans', 'Pricing'].map((item) => (
                <a key={item} href={`#${item.toLowerCase()}`} className="text-gray-600 hover:text-indigo-600 transition-colors">{item}</a>
              ))}
            </nav>
          </div>
          <div className="flex gap-3">
            <Link to="/login" className="px-5 py-2.5 text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors">Log in</Link>
            <Link to="/register" className="px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg shadow-indigo-300 hover:shadow-indigo-400 transition-all hover:scale-105">
              Get Started Free
            </Link>
          </div>
        </div>
      </header>

      {/* Announcement bar */}
      <div className="relative z-40 bg-gradient-to-r from-indigo-100 to-purple-100 border-b border-indigo-200/50 py-3 text-center">
        <p className="text-sm text-gray-700">
          <span className="inline-flex items-center gap-2">
            <span className="px-2 py-0.5 text-xs font-semibold bg-indigo-500 text-white rounded-full">NEW</span>
            Accelerate your healthcare operations with secure dashboards and role-based visibility
          </span>
        </p>
      </div>

      {/* Hero Section */}
      <main className="relative z-30">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:py-32">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
            {/* Left content */}
            <section className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 shadow-sm mb-6">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="text-sm font-medium text-gray-600">Trusted by 500+ hospitals</span>
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                <span className="text-gray-900">Healthcare</span>
                <br />
                <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Reimagined
                </span>
              </h1>

              <p className="mt-6 text-xl text-gray-600 max-w-lg mx-auto lg:mx-0">
                One platform for patients, doctors, and administrators. Transparent, secure, and intelligent.
              </p>

              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/register" className="group px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl shadow-xl shadow-indigo-300 hover:shadow-indigo-400 transition-all hover:scale-105 flex items-center justify-center gap-2">
                  Start Free Trial
                  <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                <Link to="/login" className="px-8 py-4 text-lg font-semibold text-gray-700 bg-white border border-gray-200 rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                  Watch Demo
                </Link>
              </div>

              {/* Stats */}
              <div className="mt-16 grid grid-cols-3 gap-8">
                {[
                  { value: '99.9%', label: 'Uptime' },
                  { value: '50K+', label: 'Patients' },
                  { value: '4.9★', label: 'Rating' },
                ].map((stat) => (
                  <div key={stat.label} className="text-center lg:text-left">
                    <p className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">{stat.value}</p>
                    <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Right - Dashboard preview */}
            <section className="relative">
              <div className="relative">
                <div className="card p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Operations Dashboard</h3>
                    <div className="flex gap-2">
                      <span className="w-3 h-3 rounded-full bg-red-400"></span>
                      <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
                      <span className="w-3 h-3 rounded-full bg-green-400"></span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {[
                      { title: 'Emergency Appointment', doctor: 'Dr. Sarah Chen', status: 'In Progress', color: 'bg-blue-100 text-blue-700' },
                      { title: 'Routine Checkup', doctor: 'Dr. James Wilson', status: 'Scheduled', color: 'bg-purple-100 text-purple-700' },
                      { title: 'Lab Results Review', doctor: 'Dr. Emily Brown', status: 'Completed', color: 'bg-green-100 text-green-700' },
                    ].map((item, i) => (
                      <div key={i} className="p-4 rounded-xl bg-gray-50 border border-gray-100 hover:border-indigo-200 transition-all cursor-pointer group">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-medium text-gray-900 group-hover:text-indigo-600 transition-colors">{item.title}</h4>
                            <p className="text-sm text-gray-500 mt-1">{item.doctor}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${item.color}`}>
                            {item.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Floating notification card */}
                <div className="absolute -bottom-6 -left-6 card p-4 w-64 shadow-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Appointment Confirmed</p>
                      <p className="text-xs text-gray-500">Just now</p>
                    </div>
                  </div>
                </div>

                {/* Floating stats card */}
                <div className="absolute -top-4 -right-4 card p-4 shadow-xl">
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Today's Patients</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mt-1">127</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section id="features" className="relative z-20 py-24 bg-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-indigo-600 uppercase tracking-wider">Features</span>
            <h2 className="mt-4 text-4xl md:text-5xl font-bold text-gray-900">Everything you need</h2>
            <p className="mt-4 text-xl text-gray-500 max-w-2xl mx-auto">Powerful tools for every healthcare workflow</p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              { icon: <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>, title: 'Role-Based Access', desc: 'Secure portals for patients, doctors, and admins with granular permissions.' },
              { icon: <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>, title: 'Smart Scheduling', desc: 'AI-powered appointment booking with conflict detection and reminders.' },
              { icon: <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>, title: 'Fraud Detection', desc: 'Automatic alerts for suspicious prescriptions and overcharging.' },
              { icon: <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>, title: 'Real-time Analytics', desc: 'Live dashboards with insights into hospital operations.' },
              { icon: <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>, title: 'HIPAA Compliant', desc: 'Enterprise-grade security with end-to-end encryption.' },
              { icon: <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>, title: 'AI Assistant', desc: 'Smart chatbot for instant patient support and queries.' },
            ].map((feature, i) => (
              <div key={i} className="card group cursor-pointer hover:border-indigo-200">
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">{feature.title}</h3>
                <p className="mt-2 text-gray-500">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section id="solutions" className="relative z-20 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-purple-600 uppercase tracking-wider">Solutions</span>
            <h2 className="mt-4 text-4xl md:text-5xl font-bold text-gray-900">Built for everyone</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {[
              { icon: <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>, title: 'For Hospitals', desc: 'Centralized operations with compliance tracking, staff management, and analytics.', color: 'border-blue-200 hover:border-blue-300', bg: 'bg-blue-50' },
              { icon: <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>, title: 'For Patients', desc: 'Clear history, prescriptions, billing visibility, and easy complaint submission.', color: 'border-green-200 hover:border-green-300', bg: 'bg-green-50' },
              { icon: <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>, title: 'For Doctors', desc: 'Fast consultation workflow, diagnosis notes, and prescription validation.', color: 'border-purple-200 hover:border-purple-300', bg: 'bg-purple-50' },
              { icon: <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>, title: 'For Admins', desc: 'Monitor alerts, resolve complaints, approve entities, and audit trends.', color: 'border-orange-200 hover:border-orange-300', bg: 'bg-orange-50' },
            ].map((solution, i) => (
              <div key={i} className={`card group cursor-pointer ${solution.color}`}>
                <div className={`w-14 h-14 rounded-2xl ${solution.bg} flex items-center justify-center mb-4`}>{solution.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900">{solution.title}</h3>
                <p className="mt-2 text-gray-500">{solution.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="plans" className="relative z-20 py-24 bg-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-pink-600 uppercase tracking-wider">Pricing</span>
            <h2 className="mt-4 text-4xl md:text-5xl font-bold text-gray-900">Simple, transparent pricing</h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              { name: 'Starter', price: 'Free', desc: 'For small clinics', features: ['Up to 5 doctors', '100 consultations/month', 'Basic analytics', 'Email support'] },
              { name: 'Growth', price: '$49', period: '/month', desc: 'For growing hospitals', features: ['Unlimited doctors', '2000 consultations/month', 'Advanced analytics', 'Priority support', 'API access'], popular: true },
              { name: 'Enterprise', price: 'Custom', desc: 'For large networks', features: ['Unlimited everything', 'Custom integrations', 'Dedicated support', 'Custom SLA', 'On-premise option'] },
            ].map((plan, i) => (
              <div key={i} className={`card relative ${plan.popular ? 'border-indigo-300 scale-105 shadow-xl' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full text-sm font-semibold text-white">
                    Most Popular
                  </div>
                )}
                <h3 className="text-xl font-semibold text-gray-900">{plan.name}</h3>
                <p className="text-gray-500 mt-1">{plan.desc}</p>
                <div className="mt-6">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  {plan.period && <span className="text-gray-500">{plan.period}</span>}
                </div>
                <ul className="mt-6 space-y-3">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-3 text-gray-600">
                      <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link to="/register" className={`mt-8 block w-full py-3 text-center rounded-xl font-semibold transition-all ${plan.popular ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:shadow-lg hover:shadow-indigo-300' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                  Get Started
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-20 py-24">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <div className="card py-16 px-8 bg-gradient-to-r from-indigo-600 to-purple-700 border-0 shadow-2xl">
            <h2 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg">Ready to transform your healthcare?</h2>
            <p className="mt-4 text-xl text-indigo-100">Join 500+ hospitals already using MediTrust</p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" className="px-8 py-4 text-lg font-semibold text-indigo-700 bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:scale-105 hover:bg-indigo-50">
                Start Free Trial
              </Link>
              <Link to="/login" className="px-8 py-4 text-lg font-semibold text-white bg-white/20 border-2 border-white/50 rounded-2xl hover:bg-white/30 transition-all backdrop-blur-sm">
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-20 bg-white border-t border-gray-200 py-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <span className="text-lg font-bold text-gray-900">MediTrust</span>
            </div>
            <p className="text-gray-500 text-sm">© 2024 MediTrust. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
