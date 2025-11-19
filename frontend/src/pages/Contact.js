import { Link } from "react-router-dom";

export default function Contact() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 pt-10">
        <h1 className="text-3xl font-semibold">Contact Information</h1>
      </div>

      <section className="max-w-7xl mx-auto px-4 mt-6">
        <div className="text-center text-slate-600 tracking-widest">CONTACT US</div>
        <div className="mt-6 grid md:grid-cols-2 gap-8 items-start">
          <img
            src="https://images.unsplash.com/photo-1629909613651-c0c98c3f75f0?q=80&w=1200&auto=format&fit=crop"
            alt="Clinic"
            className="rounded-xl shadow-sm"
          />
          <div>
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-900">OUR OFFICE</h3>
              <p className="mt-2 text-slate-700">Chennai, Tamilnadu</p>
              <p className="text-slate-700">Ennore, Chennai–600057</p>
              <p className="mt-2 text-slate-700">+91-9999-00770</p>
              <p className="text-slate-700">admin@hms.local</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm mt-4">
              <h3 className="text-sm font-semibold text-slate-900">CAREERS AT PRESCRIPTO</h3>
              <p className="mt-2 text-slate-700">Learn more about our team and job openings.</p>
              <Link to="/about" className="mt-3 inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md">Explore Jobs</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 mt-12 pb-16">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <div className="text-indigo-700 font-semibold">Prescripto</div>
            <p className="mt-2 text-slate-600">We make it easy to find and book appointments quickly.</p>
          </div>
          <div>
            <div className="text-slate-900 font-semibold">COMPANY</div>
            <ul className="mt-2 space-y-1 text-slate-700">
              <li><Link to="/about" className="hover:text-indigo-700">About Us</Link></li>
              <li><Link to="/search" className="hover:text-indigo-700">All Doctors</Link></li>
              <li><Link to="/" className="hover:text-indigo-700">Home</Link></li>
            </ul>
          </div>
          <div>
            <div className="text-slate-900 font-semibold">GET IN TOUCH</div>
            <p className="mt-2 text-slate-700">+91-9999-00770</p>
            <p className="text-slate-700">admin@hms.local</p>
          </div>
        </div>
        <div className="mt-10 text-center text-slate-500">Copyright © 2025 Prescripto — All Rights Reserved.</div>
      </section>
    </div>
  );
}