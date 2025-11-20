import React from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const COLORS = {
  bluegray: "#4d5b6f",
  skyblue: "#a3c1cd",
  rose: "#e5c3bd",
  white: "#ffffff",
};

export default function DashboardPage() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = token ? jwtDecode(token) : null;

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };
  const handleLaporan = () => {
    if (user?.role !== 'admin') {
      alert("Akses ditolak. Hanya admin yang dapat mengakses halaman laporan.");
      return;
    }
    navigate("/report");
  };
  const handlePresensi = () => {
    navigate("/attendance");
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-8"
      style={{
        background: `linear-gradient(180deg, ${COLORS.bluegray} 0%, #6b7686 100%)`,
      }}
    >
      {/* decorative left blob */}
      <div
        style={{
          position: "absolute",
          left: -80,
          top: 40,
          width: 320,
          height: 320,
          borderRadius: "50%",
          background: COLORS.rose,
          opacity: 0.08,
          transform: "rotate(15deg)",
        }}
      />

      {/* decorative right wave (SVG) */}
      <svg
        width="420"
        height="160"
        viewBox="0 0 800 200"
        style={{ position: "absolute", right: -40, bottom: 0, opacity: 0.06 }}
      >
        <path
          d="M0 120 C 200 10, 400 200, 800 80 L800 200 L0 200 Z"
          fill={COLORS.skyblue}
        />
      </svg>

      <div
        className="relative w-full max-w-4xl rounded-3xl p-8 shadow-2xl"
        style={{ backgroundColor: COLORS.white }}
      >
        {/* header with mini logo */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div
              style={{
                width: 56,
                height: 56,
                background: COLORS.rose,
                borderRadius: 12,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
              }}
            >
              {/* small logo */}
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
                <circle cx="8" cy="8" r="3" fill={COLORS.bluegray} />
                <rect x="6" y="13" width="12" height="6" rx="3" fill={COLORS.bluegray} />
              </svg>
            </div>

            <div>
              <h1 style={{ color: COLORS.bluegray }} className="text-2xl font-bold">
                Halo, {user?.nama ?? "User"}
              </h1>
              <p style={{ color: COLORS.skyblue }} className="text-sm">
                Role: {user?.role ?? "-"}
              </p>
            </div>
          </div>

          <div>
            <button
              onClick={handleLogout}
              className="py-2 px-4 rounded-lg font-semibold"
              style={{ background: COLORS.rose, color: COLORS.bluegray }}
            >
              Logout
            </button>
          </div>

          <div>
            <button
              onClick={handleLaporan}
              className="py-2 px-4 rounded-lg font-semibold"
              style={{ background: COLORS.rose, color: COLORS.bluegray }}
            >
              Laporan
            </button>
          </div>

          <div>
            <button
              onClick={handlePresensi}
              className="py-2 px-4 rounded-lg font-semibold"
              style={{ background: COLORS.rose, color: COLORS.bluegray }}
            >
              Presensi
            </button>
          </div>
        </div>

        {/* Main content: stats + decorative cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div
            className="p-5 rounded-xl shadow-md"
            style={{ background: `linear-gradient(135deg, ${COLORS.rose}, ${COLORS.white})` }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p style={{ color: COLORS.bluegray }} className="text-sm">Pesanan</p>
                <h3 style={{ color: COLORS.bluegray }} className="text-2xl font-bold">128</h3>
              </div>
              <div style={{ background: COLORS.skyblue, width: 48, height: 48, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M3 3h18v4H3z" fill={COLORS.white}/>
                  <rect x="3" y="10" width="18" height="11" rx="2" fill={COLORS.white}/>
                </svg>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div
            className="p-5 rounded-xl shadow-md"
            style={{ background: `linear-gradient(135deg, ${COLORS.white}, ${COLORS.skyblue})` }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p style={{ color: COLORS.bluegray }} className="text-sm">Pengguna Aktif</p>
                <h3 style={{ color: COLORS.bluegray }} className="text-2xl font-bold">54</h3>
              </div>
              <div style={{ background: COLORS.rose, width: 48, height: 48, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="8" r="3" fill={COLORS.white}/>
                  <rect x="9" y="13" width="6" height="6" rx="3" fill={COLORS.white}/>
                </svg>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div
            className="p-5 rounded-xl shadow-md"
            style={{ background: `linear-gradient(135deg, ${COLORS.skyblue}, ${COLORS.white})` }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p style={{ color: COLORS.bluegray }} className="text-sm">Feedback</p>
                <h3 style={{ color: COLORS.bluegray }} className="text-2xl font-bold">14</h3>
              </div>
              <div style={{ background: COLORS.bluegray, width: 48, height: 48, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2l3 6h6l-4.9 3.6L19 20l-7-4-7 4 1.9-8.4L2 8h6z" fill={COLORS.white}/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* decorative bottom strip */}
        <div style={{ height: 18 }} />

        <div className="mt-8 p-6 rounded-xl" style={{ background: "#f8fafb", border: "1px solid #eef1f4" }}>
          <h4 style={{ color: COLORS.bluegray }} className="font-semibold mb-2">Pengumuman</h4>
          <p style={{ color: COLORS.bluegray }} className="text-sm">
            Tidak ada pengumuman hari ini — nikmati harimu! ✨
          </p>
        </div>
      </div>
    </div>
  );
}
