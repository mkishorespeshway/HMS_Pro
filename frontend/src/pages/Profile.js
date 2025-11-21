import { useEffect, useState } from "react";
import { } from "react-router-dom";

export default function Profile() {
  const DEFAULT_PHOTO = "https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=256&auto=format&fit=crop";
  const [editing, setEditing] = useState(false);
  const [photo, setPhoto] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [gender, setGender] = useState("");
  const [birthday, setBirthday] = useState("");
  const [age, setAge] = useState("");
  const ageFromBirthday = (d) => {
    if (!d) return "--";
    const b = new Date(d);
    if (Number.isNaN(b.getTime())) return "--";
    const today = new Date();
    let age = today.getFullYear() - b.getFullYear();
    const m = today.getMonth() - b.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < b.getDate())) age--;
    return String(age);
  };

  useEffect(() => {
    const uid = localStorage.getItem("userId");
    const n = uid ? localStorage.getItem(`userNameById_${uid}`) : null;
    const e = uid ? localStorage.getItem(`userEmailById_${uid}`) : null;
    const p = uid ? localStorage.getItem(`userPhoneById_${uid}`) : null;
    const a = uid ? localStorage.getItem(`userAddressById_${uid}`) : null;
    const g = uid ? localStorage.getItem(`userGenderById_${uid}`) : null;
    const b = uid ? localStorage.getItem(`userBirthdayById_${uid}`) : null;
    const ag = uid ? localStorage.getItem(`userAgeById_${uid}`) : null;
    const byId = uid ? localStorage.getItem(`userPhotoBase64ById_${uid}`) : null;
    setName(n || "");
    setEmail(e || "");
    setPhone(p || "");
    setAddress(a || "");
    setGender(g || "");
    setBirthday(b || "");
    setAge(ag || "");
    setPhoto(byId || "");
  }, []);

  const save = () => {
    const uid = localStorage.getItem("userId");
    if (uid) {
      localStorage.setItem(`userNameById_${uid}`, name || "");
      localStorage.setItem(`userEmailById_${uid}`, email || "");
      localStorage.setItem(`userPhoneById_${uid}`, phone || "");
      localStorage.setItem(`userAddressById_${uid}`, address || "");
      localStorage.setItem(`userGenderById_${uid}`, gender || "");
      localStorage.setItem(`userBirthdayById_${uid}`, birthday || "");
      localStorage.setItem(`userAgeById_${uid}`, age || "");
      localStorage.setItem(`userPhotoBase64ById_${uid}`, photo || "");
    }
    setEditing(false);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            {String(photo || "").startsWith("data:image") ? (
              <img
                src={photo}
                alt="User"
                className="w-24 h-24 md:w-36 md:h-36 object-cover rounded-lg border"
              />
            ) : (
              <div className="w-24 h-24 md:w-36 md:h-36 rounded-lg border bg-white" />
            )}
          </div>
          <div className="md:col-span-2">
            <div className="text-2xl font-semibold">{name}</div>
            <hr className="my-4" />

            <div>
              <div className="text-xs font-semibold tracking-wide text-slate-500">CONTACT INFORMATION</div>
              {!editing ? (
                <div className="mt-3 text-sm text-slate-700 space-y-2">
                  <div> Email id: <a className="text-indigo-600" href={`mailto:${email}`}>{email}</a></div>
                  <div> Phone: <span className="text-indigo-600">{phone}</span></div>
                  <div> Address: <div className="whitespace-pre-wrap">{address}</div></div>
                </div>
              ) : (
                <div className="mt-3 grid sm:grid-cols-2 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-sm text-slate-700 mb-1">Profile Image</label>
                    <input type="file" accept="image/*" onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = () => setPhoto(String(reader.result || ""));
                      reader.readAsDataURL(file);
                    }} />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-700 mb-1">Email</label>
                    <input value={email} onChange={(e) => setEmail(e.target.value)} className="border border-slate-300 rounded-md p-2 w-full" />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-700 mb-1">Phone</label>
                    <input value={phone} onChange={(e) => setPhone(e.target.value)} className="border border-slate-300 rounded-md p-2 w-full" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm text-slate-700 mb-1">Address</label>
                    <textarea rows={3} value={address} onChange={(e) => setAddress(e.target.value)} className="border border-slate-300 rounded-md p-2 w-full" />
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6">
              <div className="text-xs font-semibold tracking-wide text-slate-500">BASIC INFORMATION</div>
              {!editing ? (
                <div className="mt-3 text-sm text-slate-700 space-y-2">
                  <div> Gender: <span className="text-slate-900">{gender}</span></div>
                  <div> Birthday: <span className="text-slate-900">{birthday}</span></div>
                  <div> Age: <span className="text-slate-900">{age}</span></div>
                </div>
              ) : (
                <div className="mt-3 grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-slate-700 mb-1">Gender</label>
                    <select value={gender} onChange={(e) => setGender(e.target.value)} className="border border-slate-300 rounded-md p-2 w-full">
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-slate-700 mb-1">Birthday</label>
                    <input type="date" value={birthday} onChange={(e) => setBirthday(e.target.value)} className="border border-slate-300 rounded-md p-2 w-full" />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-700 mb-1">Age</label>
                    <input type="number" min="0" value={age} onChange={(e) => setAge(e.target.value)} className="border border-slate-300 rounded-md p-2 w-full" />
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6">
              {!editing ? (
                <button onClick={() => setEditing(true)} className="bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-full">Edit</button>
              ) : (
                <div className="flex gap-3">
                  <button onClick={save} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-full">Save</button>
                  <button onClick={() => setEditing(false)} className="bg-slate-200 hover:bg-slate-300 text-slate-800 px-4 py-2 rounded-full">Cancel</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}