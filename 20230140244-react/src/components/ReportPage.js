import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ReportPage() {
  const [reports, setReports] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  
  // START ADDITION: State untuk modal foto
  const [selectedPhoto, setSelectedPhoto] = useState(null); // Menyimpan URL foto yang akan ditampilkan di modal
  // END ADDITION

  const fetchReports = async (query) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    // Menggunakan parameter 'query' untuk membuat URL dengan query string 'nama'
    const url = query
      ? `http://localhost:3001/api/reports/daily?nama=${encodeURIComponent(query)}`
      : "http://localhost:3001/api/reports/daily";
    
    try {
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        // Perbaikan: API backend mengembalikan data presensi dalam properti 'data'
        setReports(response.data.data);
        setError(null);
    } catch (err) {
      setReports([]); 
      setError(
        err.response ? err.response.data.message : "Gagal mengambil data"
      );
    }
  };
  
  // Perbaikan: Memuat data saat komponen pertama kali di-mount
  useEffect(() => {
    fetchReports(searchTerm);
  }, []); 

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchReports(searchTerm);
  };

  // ADDITION: Fungsi untuk menutup modal
  const closeModal = () => setSelectedPhoto(null);

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Laporan Presensi Harian
      </h1>
      <form onSubmit={handleSearchSubmit} className="mb-6 flex space-x-2">
        <input
          type="text"
          placeholder="Cari berdasarkan nama..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
        <button
          type="submit"
          className="py-2 px-4 bg-blue-600 text-white font-semibold rounded-md shadow-sm hover:bg-blue-700"
        >
          Cari
        </button>
      </form>

      {error && (
        <p className="text-red-600 bg-red-100 p-4 rounded-md mb-4">{error}</p>
      )}
      {!error && (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
 
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nama
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Check-In
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Check-Out
                </th>
                {/* ADDITION: Kolom Bukti Foto */}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bukti Foto
                </th>
                {/* END ADDITION */}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reports.length > 0 ? (
                reports.map((presensi) => (
                  <tr key={presensi.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {presensi.nama || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(presensi.checkIn).toLocaleString("id-ID", {
                        timeZone: "Asia/Jakarta",
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {presensi.checkOut
                        ? new Date(presensi.checkOut).toLocaleString("id-ID", {
                            timeZone: "Asia/Jakarta",
                          })
                        : "Belum Check-Out"}
                    </td>
                    {/* START ADDITION: Menampilkan thumbnail foto */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {presensi.buktiFoto ? (
                        // URL dibentuk dari alamat server + path yang disimpan di DB
                        <img 
                          src={`http://localhost:3001/${presensi.buktiFoto}`}
                          alt="Bukti Presensi"
                          className="h-10 w-10 object-cover cursor-pointer rounded-full hover:ring-2 ring-blue-500"
                          onClick={() => setSelectedPhoto(`http://localhost:3001/${presensi.buktiFoto}`)}
                        />
                      ) : (
                        "N/A"
                      )}
                    </td>
                    {/* END ADDITION */}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4" // Ubah colspan menjadi 4
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    Tidak ada data yang ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      
      {/* START ADDITION: Modal untuk menampilkan foto ukuran penuh */}
      {selectedPhoto && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={closeModal} // Tutup modal saat klik di luar
        >
          <div 
            className="p-4 bg-white rounded-lg max-w-3xl max-h-[90vh] overflow-auto relative"
            onClick={(e) => e.stopPropagation()} // Cegah event klik dari modal memicu closeModal
          >
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-white bg-red-600 rounded-full w-8 h-8 text-xl leading-none flex items-center justify-center"
            >
              &times;
            </button>
            <img 
              src={selectedPhoto} 
              alt="Bukti Presensi Penuh" 
              className="max-w-full max-h-full object-contain"
            />
            <p className="text-center mt-2 text-sm text-gray-400">Klik di luar foto untuk menutup</p>
          </div>
        </div>
      )}
      {/* END ADDITION */}
    </div>
  );
}
export default ReportPage;