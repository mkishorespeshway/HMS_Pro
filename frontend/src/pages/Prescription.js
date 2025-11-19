import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api";

export default function Prescription() {
  const { id } = useParams();
  const [appt, setAppt] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await API.get(`/appointments/${id}`);
        setAppt(data);
      } catch (e) {
        alert(e.response?.data?.message || e.message);
      }
    };
    load();
  }, [id]);

return (
  <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-sm border border-slate-200 mt-8">
    <h2 className="text-2xl font-semibold mb-4">Prescription</h2>
    {!appt && <p className="text-slate-600">Loading...</p>}
    {appt && (
      <div>
        <p className="mb-2">Doctor: {appt.doctor?.name}</p>
        <p className="mb-2">Patient: {appt.patient?.name}</p>
        <p className="mb-2">Date: {appt.date} {appt.startTime}-{appt.endTime}</p>
        <div className="mt-4">
          <pre className="whitespace-pre-wrap border border-slate-300 rounded-md p-3 bg-slate-50">{appt.prescriptionText || "--"}</pre>
        </div>
      </div>
    )}
  </div>
);
}