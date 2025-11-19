import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Home() {
  const FALLBACK = "https://raw.githubusercontent.com/abhi051002/hms-fullstack/main/frontend/src/readme_images/home1.png";
  const LOCAL = (process.env.PUBLIC_URL || "") + "/doctor3.jpeg";
  const [heroSrc, setHeroSrc] = useState(FALLBACK);
  useEffect(() => {
    const bust = `${LOCAL}?v=${Date.now()}`;
    fetch(bust, { method: "HEAD" })
      .then((res) => {
        if (res.ok) setHeroSrc(LOCAL);
        else setHeroSrc(FALLBACK);
      })
      .catch(() => setHeroSrc(FALLBACK));
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
    </div>
  );
}