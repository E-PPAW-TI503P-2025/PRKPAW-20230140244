import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const COLORS = {
  bluegray: "#4d5b6f",
  skyblue: "#a3c1cd",
  rose: "#e5c3bd",
  white: "#ffffff",
};

export default function RegisterPage() {
  const [nama, setNama] = useState("");
  const [role, setRole] = useState("mahasiswa");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await axios.post("http://localhost:3001/api/auth/register", {
        nama,
        role,
        email,
        password,
      });
      alert("Registrasi berhasil!");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registrasi gagal");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{ backgroundColor: COLORS.bluegray }}
    >
      <div
        style={{
          position: "absolute",
          right: 40,
          top: 40,
          width: 160,
          height: 160,
          borderRadius: 100,
          background: COLORS.skyblue,
          opacity: 0.06,
        }}
      />
      <div
        className="relative w-full max-w-md rounded-2xl shadow-2xl p-8"
        style={{ backgroundColor: COLORS.white }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 10,
              background: COLORS.rose,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <rect x="4" y="6" width="16" height="12" rx="4" fill="#4d5b6f" />
            </svg>
          </div>
          <h1 style={{ color: COLORS.bluegray }} className="text-2xl font-bold">
            Register
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium" style={{ color: COLORS.skyblue }}>
              Nama
            </label>
            <input
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-lg border"
              style={{ borderColor: "#e6e9ee" }}
            />
          </div>

          <div>
            <label className="block mb-1 font-medium" style={{ color: COLORS.skyblue }}>
              Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border"
              style={{ borderColor: "#e6e9ee" }}
            >
              <option value="mahasiswa">Mahasiswa</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium" style={{ color: COLORS.skyblue }}>
              Email
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              type="email"
              className="w-full px-4 py-2 rounded-lg border"
              style={{ borderColor: "#e6e9ee" }}
            />
          </div>

          <div>
            <label className="block mb-1 font-medium" style={{ color: COLORS.skyblue }}>
              Password
            </label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              type="password"
              className="w-full px-4 py-2 rounded-lg border"
              style={{ borderColor: "#e6e9ee" }}
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 rounded-lg font-semibold"
            style={{ background: COLORS.rose, color: COLORS.bluegray }}
          >
            Register
          </button>
        </form>

        {error && <p className="mt-4 text-sm" style={{ color: "crimson" }}>{error}</p>}

        <p className="text-center mt-6" style={{ color: COLORS.bluegray }}>
          Sudah punya akun?{" "}
          <span
            onClick={() => navigate("/login")}
            style={{ color: COLORS.rose, cursor: "pointer" }}
            className="font-semibold"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
