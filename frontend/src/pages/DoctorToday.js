import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api";

export default function DoctorToday() {
  const nav = useNavigate();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      let items = [];
      try {
        const mine = await API.get("/appointments/mine");
        items = mine.data || [];
      } catch (eMine) {
        try {
          const uid = localStorage.getItem("userId");
          const admin = await API.get("/admin/appointments");
          const all = admin.data || [];
          items = all.filter((a) => String(a.doctor?._id || a.doctor) === String(uid));
        } catch (_) {}
      }
      const toTS = (a) => {
        const d = new Date(a.date);
        if (Number.isNaN(d.getTime())) return 0;
        const t = String(a.startTime || "00:00");
        const parts = t.split(":");
        const hh = Number(parts[0]) || 0;
        const mm = Number(parts[1]) || 0;
        d.setHours(hh, mm, 0, 0);
        return d.getTime();
      };
      const pending = (items || []).filter((a) => String(a.status).toUpperCase() === "PENDING");
      const confirmed = (items || []).filter((a) => String(a.status).toUpperCase() === "CONFIRMED");
      const done = (items || []).filter((a) => {
        const s = String(a.status).toUpperCase();
        return s === "CANCELLED" || s === "COMPLETED";
      });
      pending.sort((x, y) => toTS(y) - toTS(x));
      confirmed.sort((x, y) => toTS(y) - toTS(x));
      done.sort((x, y) => toTS(y) - toTS(x));
      items = [...pending, ...confirmed, ...done];
      setList(items);
    } catch (e) {
      alert(e.response?.data?.message || e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const accept = async (id, date, startTime) => {
    const apptId = id || "";
    if (!apptId) { alert("Invalid appointment"); return; }
    try {
      await API.put(`/appointments/${String(apptId)}/accept`, { date, startTime });
      setList((prev) => prev.map((x) => (String(x._id || x.id) === String(apptId) ? { ...x, status: "CONFIRMED" } : x)));
      load();
    } catch (e) {
      const msg = e.response?.data?.message || e.message || "Failed to accept";
      if (e.response?.status === 404) {
        alert("Appointment not found");
        await load();
      } else {
        alert(msg);
      }
    }
  };

  const reject = async (id, date, startTime) => {
    const apptId = id || "";
    if (!apptId) { alert("Invalid appointment"); return; }
    try {
      await API.put(`/appointments/${String(apptId)}/reject`, { date, startTime });
      setList((prev) => prev.map((x) => (String(x._id || x.id) === String(apptId) ? { ...x, status: "CANCELLED" } : x)));
      load();
    } catch (e) {
      const msg = e.response?.data?.message || e.message || "Failed to reject";
      if (e.response?.status === 404) {
        alert("Appointment not found");
        await load();
      } else {
        alert(msg);
      }
    }
  };

  const rows = list.map((a, i) => (
    <tr key={a._id} className="border-t">
      <td className="px-4 py-3">{i + 1}</td>
      <td className="px-4 py-3">{a.patient?.name || ""}</td>
      <td className="px-4 py-3">
        <span className="inline-block text-xs px-2 py-1 rounded bg-slate-100 text-slate-700">{a.type === "offline" ? "Cash" : "Online"}</span>
      </td>
      <td className="px-4 py-3">{(() => {
        const p = a.patient || {};
        if (p.age !== undefined && p.age !== null && p.age !== "") return p.age;
        const pid = String(p._id || a.patient || "");
        const locAge = localStorage.getItem(`userAgeById_${pid}`) || "";
        if (locAge) return String(locAge);
        const dob = p.birthday || p.dob || p.dateOfBirth || localStorage.getItem(`userDobById_${pid}`) || "";
        if (!dob) return "";
        const b = new Date(dob);
        if (Number.isNaN(b.getTime())) return "";
        const today = new Date();
        let age = today.getFullYear() - b.getFullYear();
        const m = today.getMonth() - b.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < b.getDate())) age--;
        return String(age);
      })()}</td>
      <td className="px-4 py-3">{a.date} {a.startTime}</td>
      <td className="px-4 py-3">₹{a.fee || 0}</td>
      <td className="px-4 py-3">
        {String(a.status).toUpperCase() === 'PENDING' ? (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => accept(a._id || a.id, a.date, a.startTime)}
              disabled={!(a?._id || a?.id)}
              className={`h-7 w-7 rounded-full flex items-center justify-center ${(a?._id || a?.id) ? "bg-green-600 hover:bg-green-700 text-white" : "bg-slate-200 text-slate-500"}`}
              title="Accept"
            >
              ✓
            </button>
            <button
              type="button"
              onClick={() => reject(a._id || a.id, a.date, a.startTime)}
              disabled={!(a?._id || a?.id)}
              className={`h-7 w-7 rounded-full flex items-center justify-center ${(a?._id || a?.id) ? "bg-red-600 hover:bg-red-700 text-white" : "bg-slate-200 text-slate-500"}`}
              title="Reject"
            >
              ✕
            </button>
          </div>
        ) : (
          <span className={`inline-block text-xs px-2 py-1 rounded ${String(a.status).toUpperCase() === 'CANCELLED' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {String(a.status).toUpperCase() === 'CANCELLED' ? 'Cancelled' : 'Confirmed'}
          </span>
        )}
      </td>
    </tr>
  ));

  return (
    <div className="max-w-7xl mx-auto px-4 mt-8">
      <div className="grid grid-cols-12 gap-6">
        <aside className="col-span-12 md:col-span-3">
          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <div className="text-indigo-700 font-semibold mb-4">Prescripto</div>
            <nav className="space-y-2 text-slate-700">
              <Link to="/doctor/dashboard" className="block px-3 py-2 rounded-md hover:bg-slate-50">Dashboard</Link>
              <div className="px-3 py-2 rounded-md bg-indigo-50 text-indigo-700">Appointments</div>
              <Link to="/doctor/profile" className="block px-3 py-2 rounded-md hover:bg-slate-50">Profile</Link>
            </nav>
          </div>
        </aside>

        <main className="col-span-12 md:col-span-9">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-semibold">Doctor Appointments</h1>
            <button
              onClick={() => { localStorage.removeItem("token"); nav("/doctor/login"); }}
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
                    <th className="px-4 py-3 text-left">Payment</th>
                    <th className="px-4 py-3 text-left">Age</th>
                    <th className="px-4 py-3 text-left">Date & Time</th>
                    <th className="px-4 py-3 text-left">Fee</th>
                    <th className="px-4 py-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-6 text-center text-slate-600">Loading...</td>
                    </tr>
                  ) : list.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-6 text-center text-slate-600">No appointments found</td>
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