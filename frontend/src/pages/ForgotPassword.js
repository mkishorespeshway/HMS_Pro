import { useState } from "react";
import { Link } from "react-router-dom";
import API from "../api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setStatus("");
    setLoading(true);
    try {
      try {
        await API.post("/auth/forgot", { email: email.trim() });
        setStatus("If the email matches an account, reset instructions have been sent.");
      } catch (e2) {
        setStatus("Password reset email not available. Please contact admin@hms.local to reset your password.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-start justify-center pt-24">
      <div className="max-w-md w-full">
        <div className="bg-white shadow-lg rounded-xl p-6 border border-slate-200">
          <div className="text-center text-indigo-700 font-semibold mb-4">Forgot Password</div>
          <form onSubmit={submit}>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input
              className="border border-slate-300 rounded-md p-2 w-full mb-3 focus:outline-none focus:ring-4 focus:ring-indigo-100"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {status && <div className="text-slate-700 mb-3 text-sm">{status}</div>}
            <button
              className="bg-indigo-600 hover:bg-indigo-700 text-white w-full h-10 rounded-full"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Reset Instructions"}
            </button>
          </form>
          <div className="mt-3 text-sm text-slate-700">
            <Link to="/login" className="text-indigo-600 hover:text-indigo-800">Back to Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
}