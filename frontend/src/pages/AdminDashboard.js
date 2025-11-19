import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api";

export default function AdminDashboard() {
  const nav = useNavigate();
  const [doctorCount, setDoctorCount] = useState(0);
  const [appointmentCount, setAppointmentCount] = useState(0);
  const [patientCount, setPatientCount] = useState(0);

  useEffect(() => {
    const load = async () => {
      try {
        const d = await API.get("/doctors");
        setDoctorCount(d.data?.length || 0);

        const a = await API.get("/admin/appointments");
        const list = a.data || [];
        setAppointmentCount(list.length);
        const setIds = new Set(list.map((x) => x.patient?._id || String(x.patient || "")));
        setPatientCount(setIds.size);
      } catch (e) {}
    };
    load();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 mt-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-semibold">Admin Dashboard</h1>
        <button
          onClick={() => { localStorage.removeItem("token"); nav("/admin/login"); }}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-full"
        >
          Logout
        </button>
      </div>
      <div className="grid grid-cols-12 gap-6">
        <aside className="col-span-12 md:col-span-3">
          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <div className="text-indigo-700 font-semibold mb-4">Prescripto</div>
            <nav className="space-y-2 text-slate-700">
              <div className="px-3 py-2 rounded-md bg-indigo-50 text-indigo-700">Dashboard</div>
              <Link to="/admin/appointments" className="block px-3 py-2 rounded-md hover:bg-slate-50">Appointments</Link>
              <Link to="/admin/add-doctor" className="block px-3 py-2 rounded-md hover:bg-slate-50">Add Doctor</Link>
              <Link to="/admin/doctors/pending" className="block px-3 py-2 rounded-md hover:bg-slate-50">Approvals</Link>
              <Link to="/admin/doctors" className="block px-3 py-2 rounded-md hover:bg-slate-50">Doctors List</Link>
            </nav>
          </div>
        </aside>

        <main className="col-span-12 md:col-span-9">
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex-1 min-w-[160px] bg-white border border-slate-200 rounded-xl p-4">
              <div className="text-sm text-slate-600">Doctors</div>
              <div className="text-2xl font-semibold">{doctorCount}</div>
            </div>
            <div className="flex-1 min-w-[160px] bg-white border border-slate-200 rounded-xl p-4">
              <div className="text-sm text-slate-600">Appointments</div>
              <div className="text-2xl font-semibold">{appointmentCount}</div>
            </div>
            <div className="flex-1 min-w-[160px] bg-white border border-slate-200 rounded-xl p-4">
              <div className="text-sm text-slate-600">Patients</div>
              <div className="text-2xl font-semibold">{patientCount}</div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <div className="text-slate-700">Latest Bookings</div>
          </div>
        </main>
      </div>
    </div>
  );
}