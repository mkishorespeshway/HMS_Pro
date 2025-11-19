import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("patient");

  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/register", {
        name,
        email,
        password: password || "password123",
        role,
      });

      if (role === "doctor") {
        alert("Registration submitted. Admin approval is required before you can login as a doctor.");
        nav("/doctor/login");
      } else {
        localStorage.setItem("token", res.data.token);
        nav("/search");
      }
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  return (
  <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
    <div className="max-w-md mx-auto pt-16">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent">Create Account</h1>
        <p className="text-slate-600 mt-1">Join DoctorConnect</p>
      </div>
      <div className="bg-white shadow-lg rounded-xl p-6 border border-slate-200 transition-shadow duration-200 hover:shadow-xl">
        <form onSubmit={submit}>
          <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
          <input
            className="border border-slate-300 rounded-md p-2 w-full mb-3 focus:outline-none focus:ring-4 focus:ring-indigo-100"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
          <input
            className="border border-slate-300 rounded-md p-2 w-full mb-3 focus:outline-none focus:ring-4 focus:ring-indigo-100"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
          <input
            className="border border-slate-300 rounded-md p-2 w-full mb-3 focus:outline-none focus:ring-4 focus:ring-indigo-100"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
          <select
            className="border border-slate-300 rounded-md p-2 w-full mb-4 focus:outline-none focus:ring-4 focus:ring-indigo-100"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="patient">Patient</option>
            <option value="doctor">Doctor</option>
          </select>
          <button className="group w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md flex items-center justify-center gap-2">
            <span>Register</span>
            <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
          </button>
        </form>
      </div>
      <div className="text-center mt-4">
        <a href="/login" className="text-indigo-700 hover:text-indigo-900">Already have an account? Login</a>
      </div>
    </div>
  </div>
);
}
