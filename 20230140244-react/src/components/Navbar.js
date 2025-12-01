import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const COLORS = {
  bluegray: "#4d5b6f",
  skyblue: "#a3c1cd",
  rose: "#e5c3bd",
  white: "#ffffff",
};

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = token ? jwtDecode(token) : null;

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleLaporan = (e) => {
    if (user?.role !== 'admin') {
      e.preventDefault();
      alert("Akses ditolak. Hanya admin yang dapat mengakses halaman laporan.");
      return;
    }
    navigate("/report");
  };

  if (!user) {
    return null; // Jangan tampilkan Navbar jika pengguna belum login
  }

  return (
    <nav className="p-4 shadow-lg" style={{ backgroundColor: COLORS.bluegray }}>
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo/Nama Aplikasi */}
        <div className="flex items-center space-x-4">
          <Link to="/dashboard" className="text-xl font-bold" style={{ color: COLORS.white }}>
            {/* Menggunakan ikon sederhana dari DashboardPage untuk konsistensi */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ display: 'inline', marginRight: '8px' }}>
                <circle cx="8" cy="8" r="3" fill={COLORS.rose} />
                <rect x="6" y="13" width="12" height="6" rx="3" fill={COLORS.rose} />
            </svg>
            App Presensi
          </Link>
          
          {/* Navigasi Utama */}
          <Link to="/dashboard" className="text-sm font-medium hover:underline" style={{ color: COLORS.skyblue }}>
            Dashboard
          </Link>
          <Link to="/attendance" className="text-sm font-medium hover:underline" style={{ color: COLORS.skyblue }}>
            Presensi
          </Link>
          <Link 
            to="/report" 
            onClick={handleLaporan}
            className={`text-sm font-medium hover:underline ${user.role !== 'admin' ? 'cursor-not-allowed opacity-60' : ''}`}
            style={{ color: COLORS.skyblue }}
          >
            Laporan
          </Link>
        </div>

        {/* Info User dan Logout */}
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-sm font-semibold" style={{ color: COLORS.white }}>
              {user?.nama ?? "User"} ({user?.role ?? "-"})
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="py-1 px-3 rounded-md text-sm font-semibold"
            style={{ background: COLORS.rose, color: COLORS.bluegray }}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}