import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const COLORS = {
  bluegray: "#4d5b6f",
  skyblue: "#a3c1cd",
  rose: "#e5c3bd",
  white: "#ffffff",
};

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await axios.post("http://localhost:3001/api/auth/login", {
        email,
        password,
      });
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login gagal");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{ backgroundColor: COLORS.bluegray }}
    >
      {/* decorative circles */}
      <div
        style={{
          position: "absolute",
          width: 220,
          height: 220,
          borderRadius: "50%",
          background: COLORS.rose,
          opacity: 0.08,
          top: 40,
          left: 30,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 140,
          height: 140,
          borderRadius: "50%",
          background: COLORS.skyblue,
          opacity: 0.06,
          bottom: 60,
          right: 40,
        }}
      />

      <div
        className="relative w-full max-w-md rounded-2xl shadow-2xl p-8"
        style={{ backgroundColor: COLORS.white }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 mb-6">
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: COLORS.rose,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="8" r="3" fill="#4d5b6f" />
              <rect x="6" y="13" width="12" height="6" rx="3" fill="#4d5b6f" />
            </svg>
          </div>

          <h1
            style={{ color: COLORS.bluegray }}
            className="text-2xl font-extrabold"
          >
            Login
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label style={{ color: COLORS.skyblue }} className="block mb-1 font-medium">
              Email
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              type="email"
              className="w-full px-4 py-2 rounded-lg border"
              style={{
                borderColor: "#e6e9ee",
                outlineColor: COLORS.skyblue,
              }}
            />
          </div>

          <div>
            <label style={{ color: COLORS.skyblue }} className="block mb-1 font-medium">
              Password
            </label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              type="password"
              className="w-full px-4 py-2 rounded-lg border"
              style={{
                borderColor: "#e6e9ee",
                outlineColor: COLORS.skyblue,
              }}
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 rounded-lg font-semibold"
            style={{
              background: COLORS.rose,
              color: COLORS.bluegray,
            }}
          >
            Login
          </button>
        </form>

        {error && <p className="mt-4 text-sm" style={{ color: "crimson" }}>{error}</p>}

        <p className="text-center mt-6" style={{ color: COLORS.bluegray }}>
          Belum punya akun?{" "}
          <span
            onClick={() => navigate("/register")}
            className="font-semibold"
            style={{ color: COLORS.rose, cursor: "pointer" }}
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
}
