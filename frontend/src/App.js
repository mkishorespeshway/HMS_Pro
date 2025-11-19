import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import DoctorLogin from "./pages/DoctorLogin";
import Register from "./pages/Register";
 
import DoctorDetails from "./pages/DoctorDetails";
import BookAppointment from "./pages/BookAppointment";
import Payment from "./pages/Payment";
import DoctorToday from "./pages/DoctorToday";
import DoctorDashboard from "./pages/DoctorDashboard";
import DoctorProfile from "./pages/DoctorProfile";
import Prescription from "./pages/Prescription";
import AdminPendingDoctors from "./pages/AdminPendingDoctors";
import AdminDirect from "./pages/AdminDirect";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminAppointments from "./pages/AdminAppointments";
import AdminAddDoctor from "./pages/AdminAddDoctor";
import SearchDoctors from "./pages/SearchDoctors";


function App() {
return (
<BrowserRouter>
<header className="bg-white border-b">
  <div className="max-w-7xl mx-auto px-4">
    <div className="flex items-center justify-between h-16">
      <Link to="/" className="text-lg font-semibold text-indigo-700">Prescripto</Link>
      <nav className="flex items-center gap-6 text-slate-700">
        <Link to="/" className="hover:text-indigo-600">Home</Link>
        <Link to="/search" className="hover:text-indigo-600">All Doctors</Link>
        <Link to="/about" className="hover:text-indigo-600">About</Link>
        <Link to="/contact" className="hover:text-indigo-600">Contact</Link>
        <Link to="/admin/login" className="hover:text-indigo-600">Admin</Link>
      </nav>
      <Link to="/register" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-full">Create Account</Link>
    </div>
  </div>
</header>


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
        <Route path="/book/:id" element={<BookAppointment />} />
        <Route path="/pay/:id" element={<Payment />} />
        <Route path="/doctor/today" element={<DoctorToday />} />
        <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
        <Route path="/doctor/profile" element={<DoctorProfile />} />
        <Route path="/prescription/:id" element={<Prescription />} />
        <Route path="/admin/doctors/pending" element={<AdminPendingDoctors />} />
        <Route path="/admin" element={<AdminDirect />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/appointments" element={<AdminAppointments />} />
        <Route path="/admin/add-doctor" element={<AdminAddDoctor />} />
        <Route path="/admin/doctors" element={<SearchDoctors />} />
        <Route path="/forgot" element={<ForgotPassword />} />
</Routes>
</div>
</BrowserRouter>
);
}
export default App;