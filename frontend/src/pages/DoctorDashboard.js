import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api";

export default function DoctorDashboard() {
  const nav = useNavigate();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [latestToday, setLatestToday] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        setError("");
        const uid = localStorage.getItem("userId");

        const getFromAdmin = async () => {
          try {
            const all = await API.get("/admin/appointments");
            return (all.data || []).filter((x) => String(x.doctor?._id || x.doctor) === String(uid));
          } catch (e) {
            return [];
          }
        };

        let items = [];
        try {
          const mine = await API.get("/appointments/mine");
          items = mine.data || [];
        } catch (eMine) {
          items = await getFromAdmin();
        }

        if (!items.length) {
          const alt = await getFromAdmin();
          if (alt.length) items = alt;
        }

        try {
          const today = await API.get("/appointments/today");
          setLatestToday(today.data || []);
          if (!items.length && (today.data || []).length) items = today.data;
        } catch (eToday) {
          const todayStr = new Date().toISOString().slice(0, 10);
          const filtered = (items || []).filter((a) => a.date === todayStr);
          setLatestToday(filtered);
        }

        setList(items);
      } catch (e) {
        setList([]);
        setError(e.response?.data?.message || e.message || "Failed to load dashboard");
      }
      setLoading(false);
    };
    load();
  }, []);

  const stats = useMemo(() => {
    const patients = new Set();
    let earnings = 0;
    (list || []).forEach((a) => {
      if (a.patient?._id) patients.add(a.patient._id);
      if (a.paymentStatus === "PAID" || a.status === "COMPLETED") earnings += Number(a.fee || 0);
    });
    return { appointments: list.length, patients: patients.size, earnings };
  }, [list]);

  const latest = useMemo(() => {
    const src = latestToday.length ? latestToday : list;
    const copy = [...src];
    copy.sort((x, y) => (x.date + x.startTime).localeCompare(y.date + y.startTime));
    return copy.slice(0, 2);
  }, [list, latestToday]);

  return (
    <div className="max-w-7xl mx-auto px-4 mt-8">
      <div className="grid grid-cols-12 gap-6">
        <aside className="col-span-12 md:col-span-3">
          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <div className="text-indigo-700 font-semibold mb-4">Prescripto</div>
            <nav className="space-y-2 text-slate-700">
              <div className="px-3 py-2 rounded-md bg-indigo-50 text-indigo-700">Dashboard</div>
              <Link to="/doctor/today" className="block px-3 py-2 rounded-md hover:bg-slate-50">Appointments</Link>
              <Link to="/doctor/profile" className="block px-3 py-2 rounded-md hover:bg-slate-50">Profile</Link>
            </nav>
          </div>
        </aside>

        <main className="col-span-12 md:col-span-9">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-semibold">Doctor Dashboard</h1>
            <button
              onClick={() => { localStorage.removeItem("token"); nav("/doctor/login"); }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-full"
            >
              Logout
            </button>
          </div>

          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex-1 min-w-[160px] bg-white border border-slate-200 rounded-xl p-4">
              <div className="text-sm text-slate-600">Earnings</div>
              <div className="text-2xl font-semibold">₹{stats.earnings}</div>
            </div>
            <div className="flex-1 min-w-[160px] bg-white border border-slate-200 rounded-xl p-4">
              <div className="text-sm text-slate-600">Appointments</div>
              <div className="text-2xl font-semibold">{stats.appointments}</div>
            </div>
            <div className="flex-1 min-w-[160px] bg-white border border-slate-200 rounded-xl p-4">
              <div className="text-sm text-slate-600">Patients</div>
              <div className="text-2xl font-semibold">{stats.patients}</div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <div className="text-slate-700 mb-3">Latest Bookings</div>
            {loading && <div className="text-slate-600">Loading...</div>}
            {error && !loading && <div className="text-red-600 mb-3 text-sm">{error}</div>}
            <div className="space-y-3">
              {latest.length === 0 && !loading ? (
                <div className="text-slate-600">No recent bookings</div>
              ) : (
                latest.map((a) => (
                  <div key={a._id} className="flex items-center justify-between border border-slate-200 rounded-lg p-3">
                    <div>
                      <div className="font-semibold">{a.patient?.name || "User"}</div>
                      <div className="text-sm text-slate-600">{a.date} {a.startTime}</div>
                    </div>
                    <span className="inline-block text-xs px-2 py-1 rounded bg-green-100 text-green-700">{a.status || "Completed"}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}