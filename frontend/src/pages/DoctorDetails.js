import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api";


export default function DoctorDetails() {
const { id } = useParams();
const [doctor, setDoctor] = useState(null);
const nav = useNavigate();


useEffect(() => {
API.get(`/doctors`, { params: { user: id } })
.then((res) => setDoctor(res.data[0]));
}, [id]);


if (!doctor) return <div>Loading...</div>;


return (
  <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-sm border border-slate-200">
    <h2 className="text-2xl font-semibold">{doctor.user?.name}</h2>
    <p className="text-slate-600">Specializations: {doctor.specializations?.join(", ")}</p>
    <p className="mt-2">Fees: ₹{doctor.consultationFees || "--"}</p>
    <button
      onClick={() => nav(`/book/${doctor.user._id}`)}
      className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md mt-4"
    >
      Book Appointment
    </button>
  </div>
);
}