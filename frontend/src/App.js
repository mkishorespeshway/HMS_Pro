import { BrowserRouter, Routes, Route, Link, useLocation, useNavigate, Navigate } from "react-router-dom";
import Logo from "./components/Logo";
import { useState, useEffect, useRef } from "react";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import DoctorLogin from "./pages/DoctorLogin";
import Register from "./pages/Register";
 
import DoctorDetails from "./pages/DoctorDetails";
import Payment from "./pages/Payment";
import DoctorDashboard from "./pages/DoctorDashboard";
import DoctorToday from "./pages/DoctorToday";
import DoctorProfile from "./pages/DoctorProfile";
import Prescription from "./pages/Prescription";
import AdminPendingDoctors from "./pages/AdminPendingDoctors";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminAppointments from "./pages/AdminAppointments";
import AdminAddDoctor from "./pages/AdminAddDoctor";
import SearchDoctors from "./pages/SearchDoctors";
import Profile from "./pages/Profile";
import Appointments from "./pages/Appointments";


function Header() {
  const location = useLocation();
  const nav = useNavigate();
  const [open, setOpen] = useState(false);
  const [bell, setBell] = useState(() => {
    try { return Number(localStorage.getItem('patientBellCount') || 0) || 0; } catch(_) { return 0; }
  });
  const menuRef = useRef(null);
  const hideHeader = location.pathname.startsWith('/admin') || location.pathname.startsWith('/doctor') || location.pathname.startsWith('/prescription');
  const token = localStorage.getItem('token');
  const uid = localStorage.getItem('userId');
  const photo = uid ? localStorage.getItem(`userPhotoBase64ById_${uid}`) : '';
  const showAdminLink = !token && !location.pathname.startsWith('/login');
  useEffect(() => {
    try {
      const chan = new BroadcastChannel('chatmsg');
      const onMsg = (e) => {
        try {
          const { apptId, actor } = e.data || {};
          if (String(actor || '').toLowerCase() !== 'doctor') return;
          setBell((c) => {
            const next = c + 1;
            try { localStorage.setItem('patientBellCount', String(next)); } catch(_) {}
            return next;
          });
          try { localStorage.setItem('lastChatApptId', String(apptId || '')); } catch(_) {}
        } catch(_) {}
      };
      chan.onmessage = onMsg;
      return () => { try { chan.close(); } catch(_) {} };
    } catch(_) {}
  }, []);
  useEffect(() => {
    const onDocClick = (e) => {
      try {
        if (!open) return;
        const el = menuRef.current;
        if (el && !el.contains(e.target)) setOpen(false);
      } catch(_) {}
    };
    const onEsc = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('click', onDocClick, true);
    document.addEventListener('keydown', onEsc, true);
    return () => {
      document.removeEventListener('click', onDocClick, true);
      document.removeEventListener('keydown', onEsc, true);
    };
  }, [open]);
  if (hideHeader) return null;
  return (
    <header className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 text-indigo-700">
            <Logo size={28} />
            <span className="text-lg font-semibold">HospoZen</span>
          </Link>
          <nav className="flex items-center gap-6 text-slate-700">
            <Link to="/" className="hover:text-indigo-600">Home</Link>
            <Link to="/search" className="hover:text-indigo-600">All Doctors</Link>
            <Link to="/about" className="hover:text-indigo-600">About</Link>
            <Link to="/contact" className="hover:text-indigo-600">Contact</Link>
            {showAdminLink && <Link to="/admin/login" className="hover:text-indigo-600">Admin</Link>}
          </nav>
          {token ? (
            <div ref={menuRef} className="relative flex items-center gap-3">
              <button
                onClick={() => { setBell(0); try { localStorage.setItem('patientBellCount', '0'); } catch(_) {}; nav('/appointments?alertChat=1'); }}
                className="relative h-9 w-9 rounded-full border border-slate-300 flex items-center justify-center hover:bg-slate-50"
                title="Notifications"
              >
                <span role="img" aria-label="bell">🔔</span>
                {bell > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full px-1">{bell}</span>
                )}
              </button>
              {photo ? (
                <img
                  src={photo}
                  alt="User"
                  className="h-9 w-9 rounded-full object-cover border border-slate-300 cursor-pointer"
                  onClick={() => setOpen((v) => !v)}
                />
              ) : (
                <div
                  className="h-9 w-9 rounded-full border border-slate-300 bg-white cursor-pointer"
                  onClick={() => setOpen((v) => !v)}
                />
              )}
              {open && (
                <div className="absolute right-0 mt-2 min-w-[12rem] w-auto bg-white border border-slate-200 rounded-lg shadow-xl ring-1 ring-black/5 text-sm z-[100]">
                  <Link to="/profile" className="block px-3 py-2 hover:bg-slate-50 whitespace-nowrap">My Profile</Link>
                  <Link to="/appointments" className="block px-3 py-2 hover:bg-slate-50 whitespace-nowrap">My Appointments</Link>
                  <button
                    onClick={() => { localStorage.removeItem('token'); localStorage.removeItem('userId'); nav('/login'); }}
                    className="block w-full text-left px-3 py-2 hover:bg-slate-50 whitespace-nowrap"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/register" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-full">Create Account</Link>
          )}
        </div>
      </div>
    </header>
  );
}

function App() {
return (
<BrowserRouter>
<Header />


<div className="p-6 bg-slate-50 min-h-screen">
<Routes>
<Route path="/" element={<Home />} />
<Route path="/about" element={<About />} />
<Route path="/contact" element={<Contact />} />
<Route path="/admin/login" element={<AdminLogin />} />
<Route path="/login" element={<Login />} />
<Route path="/doctor/login" element={<DoctorLogin />} />
<Route path="/register" element={<Register />} />
<Route path="/search" element={<SearchDoctors />} />
        <Route path="/doctor/:id" element={<DoctorDetails />} />
        <Route path="/admin/doctors/:id" element={<DoctorDetails />} />
        <Route path="/book/:id" element={<Navigate to="/search" />} />
        <Route path="/pay/:id" element={<Payment />} />
        <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
        <Route path="/doctor/appointments" element={<DoctorToday />} />
        <Route path="/doctor/profile" element={<DoctorProfile />} />
        <Route path="/prescription/:id" element={<Prescription />} />
        <Route path="/admin/doctors/pending" element={<AdminPendingDoctors />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/appointments" element={<AdminAppointments />} />
        <Route path="/admin/add-doctor" element={<AdminAddDoctor />} />
        <Route path="/admin/doctors" element={<SearchDoctors />} />
        <Route path="/forgot" element={<ForgotPassword />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/appointments" element={<Appointments />} />
</Routes>
</div>
</BrowserRouter>
);
}
export default App;
