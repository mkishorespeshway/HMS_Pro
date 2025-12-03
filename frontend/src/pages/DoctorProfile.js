import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api";
import Logo from "../components/Logo";

export default function DoctorProfile() {
  const nav = useNavigate();
  const [profile, setProfile] = useState(null);
  const [online, setOnline] = useState(() => {
    const uid = localStorage.getItem("userId") || "";
    const byId = uid ? localStorage.getItem(`doctorOnlineById_${uid}`) : null;
    if (byId !== null) return byId === "1";
    const v = localStorage.getItem("doctorOnline");
    return v === null ? true : v === "1";
  });
  const [busy, setBusy] = useState(() => {
    const uid = localStorage.getItem("userId") || "";
    const byId = uid ? localStorage.getItem(`doctorBusyById_${uid}`) : null;
    return byId === "1";
  });
  const [panelOpen, setPanelOpen] = useState(false);
  const [panelItems, setPanelItems] = useState([]);
  const [panelLoading, setPanelLoading] = useState(false);
  const [panelUnread, setPanelUnread] = useState(0);
  const [bellCount, setBellCount] = useState(0);
  
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    specializations: "",
    clinicName: "",
    clinicAddress: "",
    clinicCity: "",
    consultationFees: "",
    slotDurationMins: ""
  });

  useEffect(() => {
    const load = async () => {
      const id = localStorage.getItem("userId");
      if (!id) return;
      
      try {
        const { data } = await API.get("/doctors", { params: { user: id } });
        setProfile(data?.[0] || null);
        const onlineById = localStorage.getItem(`doctorOnlineById_${id}`);
        if (onlineById !== null) setOnline(onlineById === "1");
        const busyById = localStorage.getItem(`doctorBusyById_${id}`);
        if (busyById !== null) setBusy(busyById === "1");
      } catch (e) {}
      
    };
    load();
  }, []);

  useEffect(() => {
    localStorage.setItem("doctorOnline", online ? "1" : "0");
    const id = localStorage.getItem("userId");
    if (id) localStorage.setItem(`doctorOnlineById_${id}`, online ? "1" : "0");
  }, [online]);
  useEffect(() => {
    const id = localStorage.getItem("userId");
    if (id) localStorage.setItem(`doctorBusyById_${id}`, busy ? "1" : "0");
  }, [busy]);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await API.get('/notifications', { params: { unread: 1 } });
        const items = Array.isArray(data) ? data : [];
        const unread = items.filter((x) => !x.read).length;
        setBellCount(unread);
      } catch (_) {}
    })();
  }, []);

  const setStatus = async (status) => {
    const uid = localStorage.getItem("userId") || "";
    if (status === "online") {
      localStorage.setItem(`doctorOnlineById_${uid}`, "1");
      localStorage.setItem(`doctorBusyById_${uid}`, "0");
      setOnline(true);
      setBusy(false);
      try { await API.put('/doctors/me/status', { isOnline: true, isBusy: false }); } catch (_) {}
    } else if (status === "offline") {
      localStorage.setItem(`doctorOnlineById_${uid}`, "0");
      localStorage.setItem(`doctorBusyById_${uid}`, "0");
      setOnline(false);
      setBusy(false);
      try { await API.put('/doctors/me/status', { isOnline: false, isBusy: false }); } catch (_) {}
    } else {
      localStorage.setItem(`doctorBusyById_${uid}`, "1");
      localStorage.setItem(`doctorOnlineById_${uid}`, "1");
      setOnline(true);
      setBusy(true);
      try { await API.put('/doctors/me/status', { isOnline: true, isBusy: true }); } catch (_) {}
    }
  };

  const name = profile?.user?.name || "";
  const specs = (profile?.specializations || []).join(", ");
  const about = profile?.about || "";
  const fee = profile?.consultationFees ?? "";
  const address = profile?.clinic?.address || "";
  const city = profile?.clinic?.city || "";

  const startEdit = () => {
    setError("");
    setForm({
      specializations: (profile?.specializations || []).join(", "),
      clinicName: profile?.clinic?.name || "",
      clinicAddress: profile?.clinic?.address || "",
      clinicCity: profile?.clinic?.city || "",
      consultationFees: String(profile?.consultationFees ?? ""),
      slotDurationMins: String(profile?.slotDurationMins ?? "")
    });
    setEditing(true);
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const payload = {
        specializations: String(form.specializations || "")
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        clinic: {
          name: form.clinicName || "",
          address: form.clinicAddress || "",
          city: form.clinicCity || ""
        },
        consultationFees: form.consultationFees ? Number(form.consultationFees) : undefined,
        slotDurationMins: form.slotDurationMins ? Number(form.slotDurationMins) : undefined
      };
      const { data } = await API.post("/doctors/me", payload);
      setProfile(data);
      setEditing(false);
    } catch (e) {
      setError(e.response?.data?.message || e.message || "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 mt-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link to="/doctor/dashboard" className="flex items-center gap-2 text-indigo-700">
            <Logo size={24} />
            <span className="font-semibold">HospoZen</span>
          </Link>
          <nav className="flex items-center gap-6 ml-6 text-slate-700">
            <Link to="/doctor/dashboard" className="nav-link">Dashboard</Link>
            <Link to="/doctor/appointments" className="nav-link">Appointments</Link>
            <Link to="/doctor/profile" className="nav-link text-indigo-700 font-semibold">Profile</Link>
          </nav>
        </div>
        <div className="relative flex items-center gap-3">
          <span className={`inline-block text-xs px-2 py-1 rounded ${busy ? 'bg-amber-100 text-amber-700' : (online ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700')}`}>{busy ? 'Busy' : (online ? 'Online' : 'Offline')}</span>
          <div className="flex rounded-full border border-slate-300 overflow-hidden">
            <button onClick={() => setStatus('online')} className={`px-3 py-1 text-xs ${online && !busy ? 'bg-green-600 text-white' : 'bg-white text-green-700'}`}>Online</button>
            <button onClick={() => setStatus('offline')} className={`px-3 py-1 text-xs ${(!online && !busy) ? 'bg-red-600 text-white' : 'bg-white text-red-700'}`}>Offline</button>
            <button onClick={() => setStatus('busy')} className={`px-3 py-1 text-xs ${busy ? 'bg-amber-500 text-white' : 'bg-white text-amber-700'}`}>Busy</button>
          </div>
          <button
            onClick={async () => {
              try {
                setPanelOpen((v) => !v);
                if (!panelOpen) {
                  setPanelLoading(true);
                  const { data } = await API.get('/notifications');
                  const items = Array.isArray(data) ? data : [];
                  setPanelItems(items);
                  const unread = items.filter((x) => !x.read).length;
                  setPanelUnread(unread);
                  setBellCount(unread);
                  setPanelLoading(false);
                }
              } catch (_) { setPanelLoading(false); }
            }}
            className="relative h-9 w-9 rounded-full border border-slate-300 flex items-center justify-center"
            title="Notifications"
          >
            <span role="img" aria-label="bell">🔔</span>
            {bellCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full px-1">{bellCount}</span>
            )}
          </button>
          {panelOpen && (
            <div className="absolute right-0 top-12 w-96 bg-white rounded-xl shadow-2xl border border-slate-200 z-50">
              <div className="bg-indigo-700 text-white px-4 py-3 rounded-t-xl flex items-center justify-between">
                <div className="font-semibold">Your Notifications</div>
                <div className="text-xs bg-green-500 text-white rounded-full px-2 py-0.5">{panelUnread} New</div>
              </div>
              <div className="px-4 py-2 flex items-center justify-between border-b">
                <button onClick={() => nav('/doctor/appointments')} className="text-indigo-700 text-sm">View All</button>
                <div className="flex items-center gap-3">
                  <button
                    onClick={async () => {
                      try { await API.delete('/notifications'); setPanelItems([]); setPanelUnread(0); setBellCount(0); } catch(_) {}
                    }}
                    className="text-white bg-indigo-700 rounded-md px-2 py-1 text-xs"
                  >
                    Clear All
                  </button>
                </div>
              </div>
              <div className="max-h-[60vh] overflow-y-auto">
                {panelLoading ? (
                  <div className="p-4 text-sm text-slate-600">Loading…</div>
                ) : panelItems.length === 0 ? (
                  <div className="p-4 text-sm text-slate-600">No notifications</div>
                ) : (
                  panelItems.map((n) => (
                    <div key={n._id || n.id} className="px-4 py-3 border-b hover:bg-slate-50">
                      <div className="flex items-start justify-between">
                        <button
                          onClick={async () => {
                            try {
                              if (n.type === 'appointment') {
                                nav('/doctor/appointments');
                              } else if (n.link) {
                                nav(n.link);
                              }
                              setPanelOpen(false);
                              try { await API.put(`/notifications/${n._id || n.id}/read`); } catch(_) {}
                              setPanelItems((prev) => prev.map((x) => (String(x._id || x.id) === String(n._id || n.id) ? { ...x, read: true } : x)));
                              setPanelUnread((c) => Math.max(0, c - 1));
                              setBellCount((c) => Math.max(0, c - 1));
                            } catch(_) {}
                          }}
                          className="text-left text-sm text-slate-900"
                        >
                          {n.message}
                        </button>
                        {!n.read && (
                          <button onClick={async () => { try { await API.put(`/notifications/${n._id || n.id}/read`); setPanelItems((prev) => prev.map((x) => (String(x._id || x.id) === String(n._id || n.id) ? { ...x, read: true } : x))); setPanelUnread((c) => Math.max(0, c - 1)); } catch(_) {} }} className="text-xs text-slate-600">Mark As Read</button>
                        )}
                      </div>
                      <div className="text-xs text-slate-500 mt-1">{new Date(n.createdAt).toLocaleString()}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
          <button
            onClick={() => { localStorage.removeItem("token"); nav("/doctor/login"); }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-full"
          >
            Logout
          </button>
        </div>
      </div>
      <div className="grid grid-cols-12 gap-6">
        <main className="col-span-12">
          <div className="mb-6">
            <h1 className="text-3xl font-semibold">Doctor Profile</h1>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <div className="grid sm:grid-cols-3 gap-6">
              <div>
                {String(profile?.photoBase64 || "").startsWith("data:image") ? (
                  <img
                    src={profile?.photoBase64}
                    alt="Doctor"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-full h-48 rounded-lg border bg-white" />
                )}
              </div>
              <div className="sm:col-span-2">
                <div className="text-xl font-semibold">{name}</div>
                <div className="text-sm text-slate-600">{specs}</div>
                <p className="mt-3 text-sm text-slate-700">{about}</p>
                {fee !== "" && (<div className="mt-4 text-sm text-slate-700">Appointment Fee: ₹{fee}</div>)}
                <div className="mt-1 text-sm text-slate-700">Address: {address}</div>
                <div className="mt-1 text-sm text-slate-700">City: {city}</div>
                <div className="mt-3 flex items-center gap-3">
                  <span className={`inline-block text-xs px-2 py-1 rounded ${online ? "bg-green-100 text-green-700" : "bg-slate-200 text-slate-700"}`}>{online ? "Online" : "Offline"}</span>
                  <button
                    onClick={() => setOnline((v) => !v)}
                    className={`text-xs px-3 py-1 rounded-full border ${online ? "border-green-600 text-green-700" : "border-slate-600 text-slate-700"}`}
                  >
                    {online ? "Go Offline" : "Go Online"}
                  </button>
                </div>
                <button onClick={startEdit} className="mt-3 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md">Edit</button>
              </div>
            </div>
          </div>

          {editing && (
            <div className="mt-6 bg-white border border-slate-200 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
              {error && <div className="text-red-600 mb-3 text-sm">{error}</div>}
              <form onSubmit={save} className="grid gap-3 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Specializations</label>
                  <input name="specializations" value={form.specializations} onChange={onChange} className="border border-slate-300 rounded-md p-2 w-full" placeholder="e.g., Cardiology, Dermatology" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Clinic Name</label>
                  <input name="clinicName" value={form.clinicName} onChange={onChange} className="border border-slate-300 rounded-md p-2 w-full" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">City</label>
                  <input name="clinicCity" value={form.clinicCity} onChange={onChange} className="border border-slate-300 rounded-md p-2 w-full" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
                  <input name="clinicAddress" value={form.clinicAddress} onChange={onChange} className="border border-slate-300 rounded-md p-2 w-full" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Consultation Fees</label>
                  <input name="consultationFees" value={form.consultationFees} onChange={onChange} className="border border-slate-300 rounded-md p-2 w-full" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Slot Duration (mins)</label>
                  <input name="slotDurationMins" value={form.slotDurationMins} onChange={onChange} className="border border-slate-300 rounded-md p-2 w-full" />
                </div>
                <div className="sm:col-span-2 flex gap-3 mt-2">
                  <button disabled={saving} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md">{saving ? "Saving..." : "Save"}</button>
                  <button type="button" onClick={() => setEditing(false)} className="bg-slate-200 hover:bg-slate-300 text-slate-800 px-4 py-2 rounded-md">Cancel</button>
                </div>
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
