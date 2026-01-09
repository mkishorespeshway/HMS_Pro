import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api";

export default function BookAppointment() {
  const { id } = useParams();  // doctorId
  const nav = useNavigate();
  const [date, setDate] = useState("");
  const [slots, setSlots] = useState([]);
  const [type, setType] = useState("offline");
  const [beneficiaryType, setBeneficiaryType] = useState("self");
  const [beneficiaryName, setBeneficiaryName] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) nav("/login");
  }, [nav]);

  // Load available time slots
  const loadSlots = async () => {
    if (!date) {
      alert("Select date first");
      return;
    }

    const res = await API.get(`/appointments/slots/${id}`, {
      params: { date },
    });

    setSlots(res.data || []);
  };

  // Book appointment
  const bookSlot = async (slot) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) { nav("/login"); return; }
      const { data } = await API.post("/appointments", {
        doctorId: id,
        date,
        startTime: slot.start,
        endTime: slot.end,
        type,
        beneficiaryType,
        beneficiaryName: beneficiaryType === "family" ? beneficiaryName : undefined,
      });

      nav(`/pay/${data._id}`);
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow-sm border border-slate-200 mt-8">
      <div className="relative mb-10 text-center">
        <h1 className="inline-block px-8 py-3 text-2xl sm:text-3xl md:text-4xl font-black bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 bg-clip-text text-transparent relative z-10">
          Book Appointment
          <div className="absolute -bottom-1 left-0 right-0 h-2 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-full blur-sm"></div>
        </h1>
      </div>

      <input
        type="date"
        className="border p-2 w-full mb-3"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      <select
        className="border border-slate-300 rounded-md p-2 w-full mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        value={type}
        onChange={(e) => setType(e.target.value)}
      >
        <option value="offline">Clinic Visit</option>
        <option value="online">Online Consultation</option>
      </select>

      <div className="mb-3">
        <label className="block mb-2">For</label>
        <div className="flex gap-4 mb-2">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="beneficiary"
              checked={beneficiaryType === "self"}
              onChange={() => setBeneficiaryType("self")}
            />
            <span>Self</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="beneficiary"
              checked={beneficiaryType === "family"}
              onChange={() => setBeneficiaryType("family")}
            />
            <span>Family Member</span>
          </label>
        </div>
        {beneficiaryType === "family" && (
          <input
            className="border border-slate-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Family member name"
            value={beneficiaryName}
            onChange={(e) => setBeneficiaryName(e.target.value)}
          />
        )}
      </div>

      <button
        onClick={loadSlots}
        className="bg-indigo-600 hover:bg-indigo-700 text-white w-full py-2 rounded-md mb-4"
      >
        Load Available Slots
      </button>

      {slots.length === 0 && <p>No slots loaded yet</p>}

      {slots.map((slot) => (
        <button
          key={`${slot.start}-${slot.end}`}
          onClick={() => bookSlot(slot)}
          className="block w-full p-2 mb-2 border border-slate-300 rounded-md hover:bg-slate-50"
        >
          {slot.start} - {slot.end}
        </button>
      ))}
    </div>
  );
}
