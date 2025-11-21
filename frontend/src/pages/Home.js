import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import API from "../api";

export default function Home() {
  const FALLBACK = "https://raw.githubusercontent.com/abhi051002/hms-fullstack/main/frontend/src/readme_images/home1.png";
  const LOCAL = (process.env.PUBLIC_URL || "") + "/doctor3.jpeg";
  const CARD_FALLBACK = "https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=640&auto=format&fit=crop";
  const [heroSrc, setHeroSrc] = useState(FALLBACK);
  const [list, setList] = useState([]);
  const [error, setError] = useState("");
  const didInit = useRef(false);
  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;
    const bust = `${LOCAL}?v=${Date.now()}`;
    fetch(bust, { method: "HEAD" })
      .then((res) => {
        if (res.ok) setHeroSrc(LOCAL);
        else setHeroSrc(FALLBACK);
      })
      .catch(() => setHeroSrc(FALLBACK));
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
  return (
    <div className="min-h-screen bg-white">
      <section className="bg-indigo-600/90">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="bg-indigo-500 rounded-2xl p-8 text-white shadow-lg">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold leading-tight">Book Appointment<br/>With Trusted Doctors</h1>
                <p className="mt-3 text-indigo-100">Browse from a selection of verified doctors, schedule your appointment with ease.</p>
                <div className="mt-6 flex items-center gap-4">
                  <div className="flex -space-x-2">
                    <span className="inline-block w-9 h-9 rounded-full ring-2 ring-white bg-white/20" />
                    <span className="inline-block w-9 h-9 rounded-full ring-2 ring-white bg-white/30" />
                    <span className="inline-block w-9 h-9 rounded-full ring-2 ring-white bg-white/40" />
                  </div>
                  <Link to="/search" className="bg-white text-indigo-700 font-medium px-4 py-2 rounded-full hover:bg-indigo-50">Book Appointment</Link>
                </div>
              </div>
              <div className="hidden md:block">
                <img
                  src={heroSrc}
                  alt="Doctors"
                  className="h-56 md:h-64 w-full object-cover rounded-xl shadow-md"
                  onError={() => {
                    if (heroSrc !== FALLBACK) setHeroSrc(FALLBACK);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      

      <section>
        <div className="max-w-7xl mx-auto px-4 py-10">
          <h2 className="text-2xl font-semibold text-slate-900 text-center">Find by Speciality</h2>
          <p className="text-slate-600 text-center mt-2">Simply browse through specialties and schedule your appointment.</p>
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {[
              { label: "Cardiology", icon: "❤️" },
              { label: "Dermatology", icon: "🧴" },
              { label: "Orthopedics", icon: "🦴" },
              { label: "Pediatrics", icon: "🧒" },
              { label: "Neurology", icon: "🧠" },
              { label: "Dental", icon: "🦷" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="mx-auto w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-2xl">
                  <span>{s.icon}</span>
                </div>
                <div className="mt-2 text-sm text-slate-700">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="max-w-7xl mx-auto px-4 py-10">
          <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 text-center">Top Doctors to Book</h2>
          <p className="text-slate-600 text-center mt-2">Simply browse through our extensive list of trusted doctors.</p>
          {error && <div className="text-center text-sm text-red-600 mt-3">{error}</div>}
          <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {list.map((d) => (
              <div key={d._id} className="bg-indigo-50 rounded-xl border border-indigo-100 shadow-sm overflow-hidden">
                <div className="relative">
                  {String(d.photoBase64 || "").startsWith("data:image") ? (
                    <img
                      src={d.photoBase64}
                      alt="Doctor"
                      className="w-full h-56 object-cover"
                    />
                  ) : (
                    <div className="w-full h-56 bg-white" />
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-base font-semibold">{`Dr. ${d.user?.name || ''}`}</h3>
                  <p className="text-sm text-slate-600">{(d.specializations && d.specializations[0]) || ""}</p>
                  <Link to={`/doctor/${d.user._id}`} className="mt-3 inline-block text-indigo-600 hover:text-indigo-800">View Profile</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section>
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="bg-indigo-500 rounded-2xl p-8 text-white shadow-lg">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold leading-tight">Book Appointment<br/>With 100+ Trusted Doctors</h2>
                <div className="mt-6">
                  <Link to="/register" className="inline-block bg-white text-indigo-700 font-medium px-4 py-2 rounded-full hover:bg-indigo-50">Create account</Link>
                </div>
              </div>
              <div className="hidden md:block">
                <img
                  src={heroSrc}
                  alt="Doctor"
                  className="h-56 md:h-64 w-full object-cover rounded-xl shadow-md"
                  onError={() => {
                    if (heroSrc !== FALLBACK) setHeroSrc(FALLBACK);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid md:grid-cols-3 gap-8 items-start">
            <div>
              <div className="flex items-center gap-2 text-indigo-700 font-semibold text-lg">Prescripto</div>
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