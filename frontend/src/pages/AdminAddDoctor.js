import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api";
import Logo from "../components/Logo";

export default function AdminAddDoctor() {
  const nav = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    specializations: "",
    clinic: "",
    city: "",
    address: "",
    fees: "",
    slotDurationMins: "15",
    experienceYears: "",
    about: "",
    password: "",
    photoBase64: "",
  });
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState({});
  const [mobileOpen, setMobileOpen] = useState(false);
  const [specialties, setSpecialties] = useState([
    "General Physician",
    "Gynecologist",
    "Dermatologist",
    "Pediatrician",
    "Neurologist",
    "Cardiologist",
    "Orthopedic Surgeon",
    "Gastroenterologist",
    "ENT Specialist",
    "Dentist",
    "Psychiatrist",
    "Diabetologist",
    "Endocrinologist",
    "Pulmonologist",
    "Nephrologist",
    "Urologist",
    "Ophthalmologist",
    "Oncologist",
    "Rheumatologist",
    "Physiotherapist"
  ]);

  const onChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;

    if (name === "email") {
      if (value.includes(" ")) {
        alert("Spaces are not allowed in the email field! All spaces will be removed.");
      }
      processedValue = value.replace(/\s/g, "").toLowerCase();
    } else if (name === "name") {
      if (processedValue.startsWith(" ")) {
        alert("Leading spaces are not allowed in Full Name!");
        processedValue = processedValue.trimStart();
      }
      const nameRegex = /^[a-zA-Z\s_]*$/;
      if (!nameRegex.test(processedValue)) {
        alert("Full Name can only contain letters, spaces, and underscores!");
        processedValue = processedValue.replace(/[^a-zA-Z\s_]/g, "");
      }
    } else if (name === "clinic") {
      if (processedValue.startsWith(" ")) {
        alert("Leading spaces are not allowed in Clinic Name!");
        processedValue = processedValue.trimStart();
      }
      const clinicRegex = /^[a-zA-Z\s_]*$/;
      if (!clinicRegex.test(processedValue)) {
        alert("Clinic Name can only contain letters, spaces, and underscores!");
        processedValue = processedValue.replace(/[^a-zA-Z\s_]/g, "");
      }
    } else if (name === "city") {
      if (processedValue.startsWith(" ")) {
        alert("Leading spaces are not allowed in City!");
        processedValue = processedValue.trimStart();
      }
      const cityRegex = /^[a-zA-Z\s_]*$/;
      if (!cityRegex.test(processedValue)) {
        alert("City can only contain letters, spaces, and underscores!");
        processedValue = processedValue.replace(/[^a-zA-Z\s_]/g, "");
      }
    } else {
      if (processedValue.startsWith(" ")) {
        alert("Spaces are not allowed at the beginning!");
        processedValue = processedValue.trimStart();
      }
    }

    if (name === "phone") processedValue = String(processedValue).replace(/\D/g, "").slice(0, 10);
    if (name === "fees") processedValue = String(processedValue).replace(/\D/g, "").slice(0, 4);
    if (name === "experienceYears") processedValue = String(processedValue).replace(/\D/g, "").slice(0, 2);
    if (name === "slotDurationMins") processedValue = String(processedValue).replace(/\D/g, "");
    
    if (name === "name" && processedValue.length > 50) return; 
    if (name === "email" && processedValue.length > 100) return;
    if (name === "specializations" && processedValue.length > 100) return;
    if (name === "clinic" && processedValue.length > 100) return;
    if (name === "city" && processedValue.length > 50) return;
    if (name === "address" && processedValue.length > 50) return;
    if (name === "about" && processedValue.length > 350) return;
    setForm((f) => ({ ...f, [name]: processedValue }));
  };

  const onBlur = (e) => {
    const { name, value } = e.target;
    if (value.endsWith(" ")) {
      alert(`Spaces are not allowed at the end of ${name === 'name' ? 'Full Name' : name}!`);
      setForm((f) => ({ ...f, [name]: value.trim() }));
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    const errs = {};

    // Final Trim for all fields to remove trailing spaces
    const trimmedForm = {};
    Object.keys(form).forEach(key => {
      trimmedForm[key] = typeof form[key] === 'string' ? form[key].trim() : form[key];
    });

    const trimmedName = trimmedForm.name;
    const trimmedEmail = trimmedForm.email;

    // Mandatory field check
    if (!trimmedName) { alert("Please enter Full Name"); return; }
    if (trimmedName.length < 3) { alert("Name is too short (min 3 characters)"); return; }
    if (trimmedName.length > 50) { alert("Name is too long (max 50 characters)"); return; }

    if (!trimmedEmail) { alert("Please enter Email"); return; }
    
    // Strict Email validation: no capital letters, no spaces, only @gmail.com or @hms.com
    const emailRegex = /^[a-z0-9._%+-]+@(gmail\.com|hms\.com)$/;
    if (!emailRegex.test(trimmedEmail)) {
      alert("Please enter a valid lowercase email ending with @gmail.com or @hms.com (e.g., doctor@gmail.com)");
      return;
    }

    if (!trimmedForm.phone) { alert("Please enter Phone Number"); return; }
    if (!trimmedForm.specializations) { alert("Please enter Specializations"); return; }

    // Check if entered specializations exist in the predefined list and are unique
    const enteredSpecs = trimmedForm.specializations.split(",").map(s => s.trim()).filter(s => s !== "");
    const invalidSpecs = enteredSpecs.filter(s => !specialties.includes(s));
    
    if (invalidSpecs.length > 0) {
      alert(`specialization is not here in the list: ${invalidSpecs.join(", ")}`);
      return;
    }

    const uniqueSpecs = [...new Set(enteredSpecs)];
    if (uniqueSpecs.length !== enteredSpecs.length) {
      alert("Duplicate specializations are not allowed.");
      return;
    }

    if (!trimmedForm.clinic) { alert("Please enter Clinic Name"); return; }
    if (!trimmedForm.city) { alert("Please enter City"); return; }
    if (!trimmedForm.address) { alert("Please enter Clinic Address"); return; }
    if (!trimmedForm.fees) { alert("Please enter Consultation Fees"); return; }
    if (!trimmedForm.experienceYears) { alert("Please enter Experience (years)"); return; }
    if (!trimmedForm.password) { alert("Please enter Password"); return; }

    // Regex and format validation
    if (!/^[6-9]\d{9}$/.test(String(trimmedForm.phone))) errs.phone = "Phone must start 6-9 and be 10 digits";
    if (trimmedForm.fees && !/^\d+$/.test(String(trimmedForm.fees))) errs.fees = "Fees must be digits";
    if (trimmedForm.slotDurationMins && !/^\d+$/.test(String(trimmedForm.slotDurationMins))) errs.slot = "Slot must be digits";
    if (trimmedForm.experienceYears && !/^\d+$/.test(String(trimmedForm.experienceYears))) errs.exp = "Experience must be digits";
    const passOk = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,12}$/.test(String(trimmedForm.password));
    if (!passOk) errs.password = "Password 6-12 chars, letters & numbers";

    setErrors(errs);
    if (Object.keys(errs).length) {
      const firstError = Object.values(errs)[0];
      alert(firstError);
      return;
    }

    try {
      const payload = {
        name: trimmedName,
        email: trimmedEmail,
        phone: trimmedForm.phone,
        specializations: trimmedForm.specializations,
        clinic: trimmedForm.clinic,
        city: trimmedForm.city,
        address: trimmedForm.address,
        fees: trimmedForm.fees,
        slotDurationMins: trimmedForm.slotDurationMins,
        experienceYears: trimmedForm.experienceYears ? Number(trimmedForm.experienceYears) : undefined,
        about: trimmedForm.about,
        password: trimmedForm.password,
        photoBase64: trimmedForm.photoBase64,
      };
      await API.post("/admin/doctors", payload);
      alert("Doctor created successfully.");
      setForm({ name: "", email: "", phone: "", specializations: "", clinic: "", city: "", address: "", fees: "", slotDurationMins: "15", experienceYears: "", about: "", password: "", photoBase64: "" });
      nav("/admin/doctors");
    } catch (err) {
      alert(err.response?.data?.message || err.message || "Failed to create doctor");
    }
  };

  const linkClass = (active) =>
    active
      ? "relative px-4 py-2 text-blue-700 font-bold bg-blue-50 rounded-xl border-2 border-blue-200 shadow-sm"
      : "relative px-4 py-2 text-gray-600 hover:text-blue-600 font-medium rounded-xl hover:bg-blue-50/50 transition-all duration-300 hover:scale-105";

  return (
    <div className="min-h-screen">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-xl border-b border-blue-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
          <div className="flex items-center justify-between h-16">
            {/* Enhanced Logo Section */}
            <Link to="/admin/dashboard" className="flex items-center gap-4 group hover:scale-105 transition-all duration-300">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 border-2 border-white/20">
                <div className="text-white">
                  <Logo size={20} />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
                  HospoZen
                </span>
              </div>
            </Link>

            {/* Enhanced Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-10">
              {(() => {
                const p = window.location.pathname;
                return (
                  <>
                    <Link to="/admin/dashboard" className={linkClass(p === "/admin/dashboard")}>
                      <span className="relative z-10">Dashboard</span>
                      {p === "/admin/dashboard" && <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-xl"></div>}
                    </Link>
                    <Link to="/admin/appointments" className={linkClass(p.startsWith("/admin/appointments"))}>
                      <span className="relative z-10">Appointments</span>
                      {p.startsWith("/admin/appointments") && <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-xl"></div>}
                    </Link>
                    <Link to="/admin/add-doctor" className={linkClass(p.startsWith("/admin/add-doctor"))}>
                      <span className="relative z-10">Add Doctor</span>
                      {p.startsWith("/admin/add-doctor") && <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-xl"></div>}
                    </Link>

                    <Link to="/admin/doctors" className={linkClass(p.startsWith("/admin/doctors") && !p.startsWith("/admin/doctors/pending"))}>
                      <span className="relative z-10">Doctors List</span>
                      {(p.startsWith("/admin/doctors") && !p.startsWith("/admin/doctors/pending")) && <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-xl"></div>}
                    </Link>
                  </>
                );
              })()}
            </nav>

            {/* Enhanced User Actions */}
            <div className="flex items-center space-x-4">
              {/* Enhanced Mobile Menu Button */}
              <button
                className="lg:hidden p-3 rounded-xl text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 border border-gray-200 hover:border-blue-300"
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              {/* Logout Button */}
              <button
                onClick={() => { localStorage.removeItem("token"); nav("/admin/login"); }}
                className="hidden lg:inline-flex bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-bold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 border-2 border-white/20"
              >
                Logout
              </button>
            </div>
          </div>

            {/* Enhanced Mobile Menu */}
          {mobileOpen && (
            <div className="lg:hidden fixed inset-0 z-40" onClick={() => setMobileOpen(false)}>
              <div className="absolute top-16 left-0 right-0">
                <div className="mx-3 bg-white/98 backdrop-blur-md rounded-xl shadow-lg border border-blue-200/50 py-2" onClick={(e) => e.stopPropagation()}>
                  <nav className="flex flex-col space-y-2 px-3">
                    {[
                      { path: '/admin/dashboard', label: 'Dashboard' },
                      { path: '/admin/appointments', label: 'Appointments' },
                      { path: '/admin/add-doctor', label: 'Add Doctor' },
                      { path: '/admin/doctors', label: 'Doctors List' }
                    ].map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`px-3 py-2 rounded-lg font-medium text-sm transition-all duration-300 ${
                          window.location.pathname === item.path
                            ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border border-blue-200 shadow-sm'
                            : 'text-gray-700 hover:bg-blue-50/50 hover:text-blue-600'
                        }`}
                        onClick={() => setMobileOpen(false)}
                      >
                        {item.label}
                      </Link>
                    ))}
                    <button
                      onClick={() => { localStorage.removeItem('token'); nav('/admin/login'); setMobileOpen(false); }}
                      className="px-3 py-2 rounded-lg text-white text-sm bg-gradient-to-r from-blue-500 to-purple-600"
                    >Logout</button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>
      <div className="pt-14 page-gradient">
        <div className="relative max-w-7xl mx-auto px-4 animate-fade-in">
          <div className="absolute inset-x-0 -top-6 h-20 bg-gradient-to-r from-indigo-100 via-purple-100 to-blue-100 blur-xl opacity-70 rounded-full pointer-events-none"></div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-3 text-center bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent animate-slide-in-right">Add Doctor</h2>
          <div className="mx-auto max-w-2xl bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-2xl p-6 animate-slide-in-left opacity-0 hover:scale-105 hover:shadow-2xl transition-all duration-500" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
            <form onSubmit={submit}>
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Name <span className="text-red-500">*</span></label>
              <input name="name" maxLength={50} value={form.name} onChange={onChange} onBlur={onBlur} className="w-full p-3 border-2 border-slate-200 rounded-xl bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-300 mb-3" placeholder="Dr. John Doe" />

              <label className="block text-sm font-medium text-slate-700 mb-1">Email <span className="text-red-500">*</span></label>
              <input type="email" name="email" maxLength={100} value={form.email} onChange={onChange} onBlur={onBlur} className="w-full p-3 border-2 border-slate-200 rounded-xl bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-300 mb-1" placeholder="doctor@example.com" />
              {errors.email ? (<div className="text-red-600 text-xs mb-3">{errors.email}</div>) : (<div className="mb-3" />)}

              <label className="block text-sm font-medium text-slate-700 mb-1">Phone <span className="text-red-500">*</span></label>
              <input name="phone" inputMode="numeric" maxLength={10} value={form.phone} onChange={onChange} onBlur={onBlur} className="w-full p-3 border-2 border-slate-200 rounded-xl bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-300 mb-1" placeholder="XXXXXXXXXX" />
              {errors.phone ? (<div className="text-red-600 text-xs mb-3">{errors.phone}</div>) : (<div className="mb-3" />)}

              <label className="block text-sm font-medium text-slate-700 mb-1">Specializations <span className="text-red-500">*</span></label>
              <select
                value=""
                onChange={(e) => {
                  const val = e.target.value;
                  if (!val) return;
                  
                  if (val === "ADD_NEW") {
                    const newSpec = prompt("Enter new specialization name:");
                    if (newSpec && newSpec.trim()) {
                      const formattedSpec = newSpec.trim();
                      
                      // Check if already in form specializations
                      const currentSpecs = form.specializations ? form.specializations.split(",").map(s => s.trim()) : [];
                      if (currentSpecs.includes(formattedSpec)) {
                        alert("This specialization is already added to the doctor.");
                        return;
                      }

                      if (!specialties.includes(formattedSpec)) {
                        setSpecialties(prev => [...prev, formattedSpec].sort());
                      }
                      
                      setForm(f => ({
                        ...f,
                        specializations: f.specializations ? `${f.specializations}, ${formattedSpec}` : formattedSpec,
                      }));
                    }
                    return;
                  }

                  // Check if already in form specializations for existing selection
                  const currentSpecs = form.specializations ? form.specializations.split(",").map(s => s.trim()) : [];
                  if (currentSpecs.includes(val)) {
                    alert("This specialization is already added to the doctor.");
                    return;
                  }

                  setForm((f) => ({
                    ...f,
                    specializations: f.specializations ? `${f.specializations}, ${val}` : val,
                  }));
                }}
                className="w-full p-3 border-2 border-slate-200 rounded-xl bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-300 mb-2"
              >
                <option value="">Select specialization</option>
                {specialties.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
                <option value="ADD_NEW" className="text-indigo-600 font-bold">+ Add New Specialization</option>
              </select>
              <input name="specializations" maxLength={100} value={form.specializations} onChange={onChange} onBlur={onBlur} className="w-full p-3 border-2 border-slate-200 rounded-xl bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-300 mb-3" placeholder="e.g., Cardiology, Dermatology" />

              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Clinic <span className="text-red-500">*</span></label>
                  <input name="clinic" maxLength={100} value={form.clinic} onChange={onChange} onBlur={onBlur} className="w-full p-3 border-2 border-slate-200 rounded-xl bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-300 mb-3" placeholder="Clinic name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">City <span className="text-red-500">*</span></label>
                  <input name="city" maxLength={50} value={form.city} onChange={onChange} onBlur={onBlur} className="w-full p-3 border-2 border-slate-200 rounded-xl bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-300 mb-3" placeholder="City" />
                </div>
              </div>

              <label className="block text-sm font-medium text-slate-700 mb-1">Address <span className="text-red-500">*</span></label>
              <textarea name="address" maxLength={50} value={form.address} onChange={onChange} onBlur={onBlur} className="w-full p-3 border-2 border-slate-200 rounded-xl bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-300 mb-3" placeholder="Clinic address" rows={3} />

              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Consultation Fees <span className="text-red-500">*</span></label>
                  <input name="fees" inputMode="numeric" maxLength={4} value={form.fees} onChange={onChange} onBlur={onBlur} className="w-full p-3 border-2 border-slate-200 rounded-xl bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-300 mb-1" placeholder="e.g., 500" />
                  {errors.fees ? (<div className="text-red-600 text-xs mb-3">{errors.fees}</div>) : (<div className="mb-3" />)}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Slot Duration (mins) <span className="text-red-500">*</span></label>
                  <select
                    name="slotDurationMins"
                    value={form.slotDurationMins}
                    onChange={onChange}
                    onBlur={onBlur}
                    className="w-full p-3 border-2 border-slate-200 rounded-xl bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-300 mb-1"
                  >
                    <option value="15">15</option>
                    <option value="30">30</option>
                    <option value="60">60</option>
                  </select>
                  {errors.slot ? (<div className="text-red-600 text-xs mb-3">{errors.slot}</div>) : (<div className="mb-3" />)}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Experience (years) <span className="text-red-500">*</span></label>
                  <input name="experienceYears" inputMode="numeric" maxLength={2} value={form.experienceYears} onChange={onChange} onBlur={onBlur} className="w-full p-3 border-2 border-slate-200 rounded-xl bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-300 mb-1" placeholder="e.g., 5" />
                  {errors.exp ? (<div className="text-red-600 text-xs mb-3">{errors.exp}</div>) : (<div className="mb-3" />)}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Password <span className="text-red-500">*</span></label>
                  <div className="relative mb-1">
                    <input name="password" type={showPass ? "text" : "password"} value={form.password} onChange={onChange} onBlur={onBlur} className="w-full p-3 border-2 border-slate-200 rounded-xl bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-300 pr-10" placeholder="Set doctor password" />
                    <button type="button" onClick={() => setShowPass((v) => !v)} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-600">{showPass ? "🙈" : "👁"}</button>
                  </div>
                  {errors.password ? (<div className="text-red-600 text-xs mb-3">{errors.password}</div>) : (<div className="mb-3" />)}
                </div>
              </div>

              <label className="block text-sm font-medium text-slate-700 mb-1">About</label>
              <textarea name="about" maxLength={350} value={form.about} onChange={onChange} onBlur={onBlur} className="w-full p-3 border-2 border-slate-200 rounded-xl bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-300 mb-3" placeholder="Write about yourself..." rows={3} />

              <label className="block text-sm font-medium text-slate-700 mb-1">Upload Image</label>
              <input type="file" accept="image/*" className="w-full p-3 border-2 border-slate-200 rounded-xl bg-white transition-all duration-300 mb-3" onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = () => {
                  setForm((f) => ({ ...f, photoBase64: String(reader.result || "") }));
                };
                reader.readAsDataURL(file);
              }} />
              {form.photoBase64 && (
                <div className="mb-3">
                  <img src={form.photoBase64} alt="Selected" className="w-full h-40 object-cover rounded-xl border-2 border-slate-200" />
                </div>
              )}

              <div className="flex items-center justify-end">
                <button className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold">Create Doctor</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}