import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api";

export default function Payment() {
  const { id } = useParams();
  const nav = useNavigate();
  const [appt, setAppt] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      const { data } = await API.get("/appointments/mine");
      const found = data.find(a => a._id === id);
      setAppt(found || null);
    };
    load();
  }, [id]);

  const pay = async () => {
    try {
      setLoading(true);
      const { data } = await API.post(`/appointments/${id}/pay`);
      alert("Payment successful. Appointment confirmed.");
      nav("/search");
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

return (
  <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow-sm border border-slate-200 mt-8">
    <h2 className="text-2xl font-semibold mb-4">Complete Payment</h2>
      {!appt && <p>Loading appointment...</p>}
      {appt && (
        <div className="mb-4 text-slate-700">
          <p className="mb-1">Doctor: {appt.doctor?.name || "--"}</p>
          <p className="mb-1">Date: {appt.date}</p>
          <p className="mb-1">Time: {appt.startTime}-{appt.endTime}</p>
          <p className="mb-1">Type: {appt.type}</p>
          <p className="font-semibold">Amount: ₹{appt.fee || 0}</p>
        </div>
      )}
      <button
        onClick={pay}
        disabled={loading}
        className="bg-indigo-600 hover:bg-indigo-700 text-white w-full py-2 rounded-md disabled:opacity-50"
      >
        {loading ? "Processing..." : "Pay Now"}
      </button>
    </div>
  );
}