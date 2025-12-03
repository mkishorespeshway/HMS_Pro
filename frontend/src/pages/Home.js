import { Link } from "react-router-dom";
import Logo from "../components/Logo";
import { useEffect, useRef, useState } from "react";
import API from "../api";

export default function Home() {
  const FALLBACK = "";
  const LOCAL = (process.env.PUBLIC_URL || "") + "/uploads/Screenshot 2025-12-03 145101.png";
  const CARD_FALLBACK = "https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=640&auto=format&fit=crop";
  const [heroSrc, setHeroSrc] = useState(FALLBACK);
  const [list, setList] = useState([]);
  const [error, setError] = useState("");
  const didInit = useRef(false);
  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;
    const bust = `${LOCAL}?v=${Date.now()}`;
    const img = new Image();
    img.onload = () => setHeroSrc(LOCAL);
    img.onerror = () => setHeroSrc(FALLBACK);
    img.src = bust;
    (async () => {
      try {
        setError("");
        const { data } = await API.get("/doctors");
        setList(Array.isArray(data) ? data : []);
      } catch (e) {
        setList([]);
        setError(e.response?.data?.message || e.message || "Network Error");
      }
    })();
  }, []);

  useEffect(() => {
    const iv = setInterval(async () => {
      try {
        const { data } = await API.get('/doctors');
        setList(Array.isArray(data) ? data : []);
      } catch (_) {}
    }, 1000);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    const cleanup = [];
    const origin = String(API.defaults.baseURL || "").replace(/\/(api)?$/, "");
    const w = window;
    const onReady = () => {
      try {
        const socket = w.io ? w.io(origin, { transports: ["websocket", "polling"] }) : null;
        if (socket) {
          socket.on('doctor:status', (p) => {
            const did = String(p?.doctorId || "");
            if (!did) return;
            setList((prev) => prev.map((d) => (
              String(d?.user?._id || "") === did ? { ...d, isOnline: !!p.isOnline, isBusy: !!p.isBusy } : d
            )));
          });
          cleanup.push(() => { try { socket.close(); } catch(_) {} });
        }
      } catch (_) {}
    };
    if (!w.io) {
      const s = document.createElement('script');
      s.src = 'https://cdn.socket.io/4.7.2/socket.io.min.js';
      s.onload = onReady;
      document.body.appendChild(s);
      cleanup.push(() => { try { document.body.removeChild(s); } catch(_) {} });
    } else {
      onReady();
    }
    return () => { cleanup.forEach((fn) => fn()); };
  }, []);
  return (
    <div className="page-gradient">

      <section className="hero-gradient">
        <div className="max-w-7xl mx-auto px-4 py-12 animate-fade-in">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="text-sm uppercase tracking-wide opacity-90">HospoZen</div>
              <h1 className="mt-2 text-3xl md:text-4xl font-semibold leading-tight animate-slide-in-left">Book Appointment With Trusted Doctors</h1>
              <p className="mt-3 text-indigo-100 max-w-xl animate-fade-in" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>Discover verified specialists, schedule easily, and take control of your health journey.</p>
              <div className="mt-6 flex items-center gap-4">
                <Link to="/search" className="btn-gradient">Book Appointment</Link>
                <div className="flex items-center gap-2 text-indigo-100">
                  <span className="w-2 h-2 rounded-full bg-white/70"></span>
                  <span className="w-2 h-2 rounded-full bg-white/50"></span>
                </div>
              </div>
            </div>
            <div className="relative">
              {heroSrc && (
                <img src={heroSrc} alt="Hero" className="w-full rounded-2xl shadow-2xl animate-zoom-in" />
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="animate-fade-in">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <h2 className="text-2xl font-semibold text-slate-900 text-center">Find by Speciality</h2>
          <p className="text-slate-600 text-center mt-2">Simply browse through specialties and schedule your appointment.</p>
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-8 gap-4">
            {[
              { label: "Cardiology", icon: "❤️" },
              { label: "Dermatology", icon: "🧴" },
              { label: "Orthopedics", icon: "🦴" },
              { label: "Pediatrics", icon: "🧒" },
              { label: "Neurology", icon: "🧠" },
              { label: "Dental", icon: "🦷" },
            ].map((s) => (
              <div key={s.label} className="text-center animate-fade-in" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
                <div className="mx-auto w-16 h-16 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-2xl shadow-sm card-hover">
                  <span>{s.icon}</span>
                </div>
                <div className="mt-2 text-sm font-medium text-slate-800">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="animate-fade-in">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 text-center">Top Doctors to Book</h2>
          <p className="text-slate-600 text-center mt-2">Simply browse through our extensive list of trusted doctors.</p>
          {error && <div className="text-center text-sm text-red-600 mt-3">{error}</div>}
          <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {(() => {
              const sorted = (list || []).slice().sort((a, b) => {
                const tb = new Date(b.createdAt || 0).getTime();
                const ta = new Date(a.createdAt || 0).getTime();
                if (tb !== ta) return tb - ta;
                const nb = String(b.user?.name || "");
                const na = String(a.user?.name || "");
                return nb.localeCompare(na);
              });
              return sorted.map((d, i) => (
                <div key={d._id} className="glass-card overflow-hidden card-hover animate-zoom-in opacity-0" style={{ animationDelay: `${i * 0.1}s`, animationFillMode: 'forwards' }}>
                  <div className="relative">
                    {String(d.photoBase64 || "").startsWith("data:image") ? (
                      <img src={d.photoBase64} alt="Doctor" className="w-full h-56 object-cover transform hover:scale-110 transition-transform duration-700" />
                    ) : (
                      <div className="w-full h-56 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                        <div className="text-5xl text-slate-400">👨‍⚕️</div>
                      </div>
                    )}
                    <div className="absolute top-2 right-2 animate-fade-in" style={{ animationDelay: `${i * 0.1 + 0.3}s`, animationFillMode: 'forwards' }}>
                      {(() => {
                        const online = typeof d.isOnline === 'boolean' ? d.isOnline : null;
                        const busy = typeof d.isBusy === 'boolean' ? d.isBusy : null;
                        if (online === null && busy === null) return null;
                        const cls = busy ? 'badge badge-busy' : (online ? 'badge badge-online' : 'badge badge-offline');
                        const txt = busy ? 'Busy' : (online ? 'Online' : 'Offline');
                        return <span className={cls}>{txt}</span>;
                      })()}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-base font-semibold">{`Dr. ${d.user?.name || ''}`}</h3>
                    <p className="text-sm text-slate-600">{(d.specializations && d.specializations[0]) || ""}</p>
                    <div className="mt-3">
                      <Link to={`/doctor/${d.user._id}`} className="btn-gradient inline-flex items-center justify-center">View Profile</Link>
                    </div>
                  </div>
                </div>
              ));
            })()}
          </div>
        </div>
      </section>

      

      <section className="animate-fade-in">
        <div className="max-w-7xl mx-auto px-4 py-12 glass-card">
          <div className="grid md:grid-cols-3 gap-8 items-start">
            <div>
              <div className="flex items-center gap-2 text-indigo-700 font-semibold text-lg">
                <Logo size={24} />
                <span>HospoZen</span>
              </div>
              <p className="mt-3 text-slate-600 text-sm">
                Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                It has been the industry's standard dummy text ever since the 1500s.
              </p>
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
              <div className="text-slate-700 text-sm">+0-000-000-000</div>
              <div className="text-slate-700 text-sm">greatstackdev@gmail.com</div>
            </div>
          </div>
          <hr className="my-6 border-slate-200" />
          <div className="text-center text-slate-600 text-sm">Copyright 2024 © GreatStack.dev - All Right Reserved.</div>
        </div>
      </section>
    </div>
  );
}
