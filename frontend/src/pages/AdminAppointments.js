import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api";

export default function AdminAppointments() {
  const nav = useNavigate();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        setError("");
        const { data } = await API.get("/admin/appointments");
        setList(data || []);
      } catch (e) {
        setList([]);
        setError(e.response?.data?.message || e.message || "Failed to load appointments");
      }
      setLoading(false);
    };
    load();
  }, []);

  const rows = list.length
    ? list.map((a, i) => (
        <tr key={a._id} className="border-t">
          <td className="px-4 py-3">{i + 1}</td>
          <td className="px-4 py-3">{a.patient?.name || "User"}</td>
          <td className="px-4 py-3">--</td>
          <td className="px-4 py-3">{a.date} {a.startTime}</td>
          <td className="px-4 py-3">{a.doctor?.name || "--"}</td>
          <td className="px-4 py-3">₹{a.fee || 0}</td>
          <td className="px-4 py-3">
            <span className="inline-block text-xs px-2 py-1 rounded bg-green-100 text-green-700">
              {a.status}
            </span>
          </td>
        </tr>
      ))
    : (
        <tr>
          <td colSpan={7} className="px-4 py-6 text-center text-slate-600">No appointments found</td>
        </tr>
      );

  return (
    <div className="max-w-7xl mx-auto px-4 mt-8">
      <div className="grid grid-cols-12 gap-6">
        <aside className="col-span-12 md:col-span-3">
          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <div className="text-indigo-700 font-semibold mb-4">Prescripto</div>
            <nav className="space-y-2 text-slate-700">
              <Link to="/admin/dashboard" className="block px-3 py-2 rounded-md hover:bg-slate-50">Dashboard</Link>
              <div className="px-3 py-2 rounded-md bg-indigo-50 text-indigo-700">Appointments</div>
              <Link to="/admin/add-doctor" className="block px-3 py-2 rounded-md hover:bg-slate-50">Add Doctor</Link>
              
              <Link to="/admin/doctors" className="block px-3 py-2 rounded-md hover:bg-slate-50">Doctors List</Link>
            </nav>
          </div>
        </aside>

        <main className="col-span-12 md:col-span-9">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-semibold">All Appointments</h1>
            <button
              onClick={() => { localStorage.removeItem("token"); nav("/admin/login"); }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-full"
            >
              Logout
            </button>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-50 text-slate-700">
                  <tr>
                    <th className="px-4 py-3 text-left">#</th>
                    <th className="px-4 py-3 text-left">Patient</th>
                    <th className="px-4 py-3 text-left">Age</th>
                    <th className="px-4 py-3 text-left">Date & Time</th>
                    <th className="px-4 py-3 text-left">Doctor Name</th>
                    <th className="px-4 py-3 text-left">Fee</th>
                    <th className="px-4 py-3 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-6 text-center text-slate-600">Loading...</td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-6 text-center text-red-600">{error}</td>
                    </tr>
                  ) : (
                    rows
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}