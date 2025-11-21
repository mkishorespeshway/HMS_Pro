import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [dob, setDob] = useState("");
  const [photoBase64, setPhotoBase64] = useState("");
  const role = "patient";

  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/register", {
        name,
        email,
        password: password || "password123",
        role,
      });

      localStorage.setItem("token", res.data.token);
      if (res.data?.user?.id) localStorage.setItem("userId", res.data.user.id);
      const uid = res.data?.user?.id;
      if (uid && res.data?.user?.name) localStorage.setItem(`userNameById_${uid}`, res.data.user.name);
      if (uid && res.data?.user?.email) localStorage.setItem(`userEmailById_${uid}`, res.data.user.email);
      if (uid && photoBase64) localStorage.setItem(`userPhotoBase64ById_${uid}`, photoBase64);
      if (uid && phone) localStorage.setItem(`userPhoneById_${uid}`, phone);
      if (uid && gender) localStorage.setItem(`userGenderById_${uid}`, gender);
      if (uid && age) localStorage.setItem(`userAgeById_${uid}`, age);
      if (uid && dob) localStorage.setItem(`userDobById_${uid}`, dob);
      nav("/search");
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  return (
  <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
    <div className="max-w-md mx-auto pt-16">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent">Create Account</h1>
        <p className="text-slate-600 mt-1">Join DoctorConnect</p>
      </div>
      <div className="bg-white shadow-lg rounded-xl p-6 border border-slate-200 transition-shadow duration-200 hover:shadow-xl">
        <form onSubmit={submit}>
          <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
          <input
            className="border border-slate-300 rounded-md p-2 w-full mb-3 focus:outline-none focus:ring-4 focus:ring-indigo-100"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
          <input
            className="border border-slate-300 rounded-md p-2 w-full mb-3 focus:outline-none focus:ring-4 focus:ring-indigo-100"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
          <input
            className="border border-slate-300 rounded-md p-2 w-full mb-3 focus:outline-none focus:ring-4 focus:ring-indigo-100"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <label className="block text-sm font-medium text-slate-700 mb-1">Upload Image</label>
          <input
            type="file"
            accept="image/*"
            className="border border-slate-300 rounded-md p-2 w-full mb-3"
            onChange={(e) => {
              const file = e.target.files && e.target.files[0];
              if (!file) { setPhotoBase64(""); return; }
              const reader = new FileReader();
              reader.onloadend = () => setPhotoBase64(String(reader.result || ""));
              reader.readAsDataURL(file);
            }}
          />
          <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
          <input
            className="border border-slate-300 rounded-md p-2 w-full mb-3 focus:outline-none focus:ring-4 focus:ring-indigo-100"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Gender</label>
              <select
                className="border border-slate-300 rounded-md p-2 w-full mb-3"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Age</label>
              <input
                className="border border-slate-300 rounded-md p-2 w-full mb-3 focus:outline-none focus:ring-4 focus:ring-indigo-100"
                placeholder="Age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
            </div>
          </div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Date of Birth</label>
          <input
            type="date"
            className="border border-slate-300 rounded-md p-2 w-full mb-3 focus:outline-none focus:ring-4 focus:ring-indigo-100"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
          />
          <input type="hidden" value={role} readOnly />
          <div className="mb-4 text-sm text-slate-600">Creating a patient account</div>
          <button className="group w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md flex items-center justify-center gap-2">
            <span>Register</span>
            <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
          </button>
        </form>
      </div>
      <div className="text-center mt-4">
        <a href="/login" className="text-indigo-700 hover:text-indigo-900">Already have an account? Login</a>
      </div>
    </div>
  </div>
);
}
