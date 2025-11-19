import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api";

export default function AdminAddDoctor() {
  const nav = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    specializations: "",
    clinic: "",
    city: "",
    fees: "",
    slotDurationMins: "15",
  });

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        specializations: form.specializations,
        clinic: form.clinic,
        city: form.city,
        fees: form.fees,
        slotDurationMins: form.slotDurationMins,
      };
      const { data } = await API.post("/admin/doctors", payload);
      alert(`Doctor created. Temporary password: ${data?.tempPassword || 'sent via email'}`);
      setForm({ name: "", email: "", phone: "", specializations: "", clinic: "", city: "", fees: "", slotDurationMins: "15" });
      nav("/admin/doctors");
    } catch (err) {
      alert(err.response?.data?.message || err.message || "Failed to create doctor");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 mt-8">
      <div className="grid grid-cols-12 gap-6">
        <aside className="col-span-12 md:col-span-3">
          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <div className="text-indigo-700 font-semibold mb-4">Prescripto</div>
            <nav className="space-y-2 text-slate-700">
              <Link to="/admin/dashboard" className="block px-3 py-2 rounded-md hover:bg-slate-50">Dashboard</Link>
              <Link to="/admin/appointments" className="block px-3 py-2 rounded-md hover:bg-slate-50">Appointments</Link>
              <div className="px-3 py-2 rounded-md bg-indigo-50 text-indigo-700">Add Doctor</div>
              <Link to="/admin/doctors/pending" className="block px-3 py-2 rounded-md hover:bg-slate-50">Approvals</Link>
              <Link to="/admin/doctors" className="block px-3 py-2 rounded-md hover:bg-slate-50">Doctors List</Link>
            </nav>
          </div>
        </aside>

        <main className="col-span-12 md:col-span-9">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-semibold">Add Doctor</h1>
            <button
              onClick={() => { localStorage.removeItem("token"); nav("/admin/login"); }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-full"
            >
              Logout
            </button>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-6 max-w-xl">
            <form onSubmit={submit}>
          <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
          <input name="name" value={form.name} onChange={onChange} className="border border-slate-300 rounded-md p-2 w-full mb-3" placeholder="Dr. John Doe" />

          <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
          <input name="email" value={form.email} onChange={onChange} className="border border-slate-300 rounded-md p-2 w-full mb-3" placeholder="doctor@example.com" />

          <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
          <input name="phone" value={form.phone} onChange={onChange} className="border border-slate-300 rounded-md p-2 w-full mb-3" placeholder="+91-XXXXXXXXXX" />

          <label className="block text-sm font-medium text-slate-700 mb-1">Specializations</label>
          <input name="specializations" value={form.specializations} onChange={onChange} className="border border-slate-300 rounded-md p-2 w-full mb-3" placeholder="e.g., Cardiology, Dermatology" />

          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Clinic</label>
              <input name="clinic" value={form.clinic} onChange={onChange} className="border border-slate-300 rounded-md p-2 w-full mb-3" placeholder="Clinic name" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">City</label>
              <input name="city" value={form.city} onChange={onChange} className="border border-slate-300 rounded-md p-2 w-full mb-3" placeholder="City" />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Consultation Fees</label>
              <input name="fees" value={form.fees} onChange={onChange} className="border border-slate-300 rounded-md p-2 w-full mb-3" placeholder="₹" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Slot Duration (mins)</label>
              <input name="slotDurationMins" value={form.slotDurationMins} onChange={onChange} className="border border-slate-300 rounded-md p-2 w-full mb-3" />
            </div>
          </div>

          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md">Create Doctor</button>
        </form>
      </div>
        </main>
      </div>
    </div>
  );
}