import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api";

export default function Appointments() {
  const nav = useNavigate();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [profiles, setProfiles] = useState(new Map());

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { nav("/login"); return; }
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const { data } = await API.get("/appointments/mine");
        const arr = Array.isArray(data) ? data : [];
        setList(arr);
        const ids = Array.from(new Set(arr.map((a) => String(a.doctor?._id || a.doctor || ""))).values()).filter(Boolean);
        if (ids.length) {
          const resps = await Promise.all(ids.map((id) => API.get(`/doctors?user=${id}`).catch(() => ({ data: [] }))));
          const map = new Map();
          ids.forEach((id, idx) => {
            const first = Array.isArray(resps[idx]?.data) ? resps[idx].data[0] : null;
            if (first) map.set(String(id), first);
          });
          setProfiles(map);
        } else {
          setProfiles(new Map());
        }
      } catch (e) {
        setError(e.response?.data?.message || e.message || "Failed to load");
      }
      setLoading(false);
    };
    load();
  }, [nav]);

  const cancel = async (id) => {
    try {
      const apptId = id || "";
      await API.put(`/appointments/${String(apptId)}/cancel`);
      setList((prev) => prev.map((x) => (String(x._id) === String(apptId) ? { ...x, status: "CANCELLED" } : x)));
    } catch (e) {
      const msg = e.response?.data?.message || e.message || "Cancel failed";
      if (e.response?.status === 404) {
        alert("Appointment not found or already cancelled");
        try {
          const { data } = await API.get("/appointments/mine");
          setList(Array.isArray(data) ? data : []);
        } catch (_) {}
      } else {
        alert(msg);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 mt-8">
      <h1 className="text-2xl font-semibold mb-4">My appointments</h1>
      <div className="bg-white border border-slate-200 rounded-xl">
        {loading ? (
          <div className="p-4 text-slate-600">Loading...</div>
        ) : error ? (
          <div className="p-4 text-red-600">{error}</div>
        ) : list.length === 0 ? (
          <div className="p-4 text-slate-600">No appointments found</div>
        ) : (
          <div className="divide-y">
            {list.map((a) => (
              <div key={a._id} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {(() => {
                    const docId = String(a.doctor?._id || a.doctor || "");
                    const prof = profiles.get(docId);
                    const img = String((prof?.photoBase64 || a.doctor?.photoBase64 || ""));
                    const hasImg = img.startsWith("data:") || img.startsWith("http");
                    return hasImg ? (
                      <img
                        src={img}
                        alt="Doctor"
                        className="h-14 w-14 rounded-md object-cover border"
                      />
                    ) : (
                      <div className="h-14 w-14 rounded-md border bg-white" />
                    );
                  })()}
                  <div>
                    {(() => {
                      const docId = String(a.doctor?._id || a.doctor || "");
                      const prof = profiles.get(docId);
                      const name = a.doctor?.name ? `Dr. ${a.doctor?.name}` : "";
                      const spec = (prof?.specializations && prof.specializations[0]) || a.doctor?.specializations?.[0] || "";
                      const addr = (prof?.clinic?.address || a.doctor?.clinic?.address || a.doctor?.address || a.doctor?.clinicAddress || a.clinic?.address || a.clinicAddress || "");
                      return (
                        <>
                          <div className="font-semibold">{name}</div>
                          <div className="text-sm text-slate-600">{spec}</div>
                          <div className="text-sm text-slate-700">Address: <span className="text-slate-900">{addr}</span></div>
                        </>
                      );
                    })()}
                    <div className="text-sm text-slate-700">Date & Time: <span className="text-slate-900">{`${a.date} | ${a.startTime}`}</span></div>
                  </div>
                </div>
                <div className="flex gap-3 items-center">
                  {String(a.status).toUpperCase() === 'CANCELLED' ? (
                    <span className="inline-block text-xs px-2 py-1 rounded bg-red-100 text-red-700">Cancelled</span>
                  ) : String(a.status).toUpperCase() === 'COMPLETED' ? (
                    <span className="inline-block text-xs px-2 py-1 rounded bg-green-100 text-green-700">Completed</span>
                  ) : (
                    <>
                      <button
                        onClick={() => nav(`/pay/${a._id}`)}
                        className="border border-slate-300 px-3 py-1 rounded-md"
                      >
                        Pay Online
                      </button>
                      <button
                        onClick={() => cancel(a._id || a.id)}
                        disabled={!a?._id}
                        className={`border px-3 py-1 rounded-md ${(!a?._id) ? 'border-slate-200 text-slate-400 cursor-not-allowed' : 'border-slate-300'}`}
                      >
                        Cancel appointment
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="mt-8">
        <div className="grid md:grid-cols-3 gap-8 items-start">
          <div>
            <div className="flex items-center gap-2 text-indigo-700 font-semibold text-lg">Prescripto</div>
            <p className="mt-3 text-slate-600 text-sm">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
          </div>
          <div>
            <div className="font-semibold text-slate-900 mb-2">COMPANY</div>
            <div className="space-y-1 text-slate-700 text-sm">
              <Link to="/" className="hover:text-indigo-700">Home</Link>
              <div>
                <Link to="/about" className="hover:text-indigo-700">About us</Link>
              </div>
              <div className="text-slate-700">Delivery</div>
              <div className="text-slate-700">Privacy policy</div>
            </div>
          </div>
          <div>
            <div className="font-semibold text-slate-900 mb-2">GET IN TOUCH</div>
            <div className="text-slate-700 text-sm">+1-212-456-7890</div>
            <div className="text-slate-700 text-sm">greatstackdev@gmail.com</div>
          </div>
        </div>
        <hr className="my-6 border-slate-200" />
        <div className="text-center text-slate-600 text-sm">Copyright 2024 © Prescripto.com - All Right Reserved.</div>
      </div>
    </div>
  );
}