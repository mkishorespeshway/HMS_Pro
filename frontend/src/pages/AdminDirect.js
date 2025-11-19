import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

export default function AdminDirect() {
  const nav = useNavigate();
  const [status, setStatus] = useState("Logging in...");

  useEffect(() => {
    const run = async () => {
      try {
        const { data } = await API.post("/auth/login", {
          email: "admin@hms.local",
          password: "admin123",
        });
        localStorage.setItem("token", data.token);
        setStatus("Success");
        nav("/admin/dashboard");
      } catch (e) {
        setStatus(e.response?.data?.message || e.message || "Login failed");
      }
    };
    run();
  }, [nav]);

  return (
    <div className="max-w-md mx-auto mt-10">
      <div className="p-6 bg-white rounded-lg shadow-sm border border-slate-200">
        <h2 className="text-3xl font-semibold mb-2">Admin Auto Login</h2>
        <p className="text-slate-600">{status}</p>
      </div>
    </div>
  );
}