import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ReportPage() {
  const [reports, setReports] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  
  // State untuk menyimpan URL foto yang akan ditampilkan di modal
  const [selectedImage, setSelectedImage] = useState(null); 

  const fetchReports = async (query) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const baseUrl = "http://localhost:3001/api/reports/daily";
      // Menggunakan query string 'nama' untuk filter
      const url = query ? `${baseUrl}?nama=${encodeURIComponent(query)}` : baseUrl;

      const response = await axios.get(url, config);
      // Data yang diterima sudah diratakan oleh controller
      setReports(response.data.data);
      setError(null);
    } catch (err) {
      setReports([]);
      setError(
        err.response ? err.response.data.message : "Gagal mengambil data"
      );
    }
  };

  useEffect(() => {
    // Memuat data awal saat komponen dimuat
    fetchReports(searchTerm);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 
  
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchReports(searchTerm);
  };

  // Fungsi untuk mengkonversi path Windows (\) menjadi path URL (/)
  const getImageUrl = (path) => {
    if (!path) return null;
    // Ganti backslash (\) jadi slash (/) jika ada
    const cleanPath = path.replace(/\\/g, "/");
    return `http://localhost:3001/${cleanPath}`;
  };

  // Fungsi untuk menutup modal
  const closeModal = () => setSelectedImage(null);

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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Latitude
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Longitude
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bukti Foto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {presensi.latitude || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {presensi.longitude || "N/A"}
                    </td>
                    {/* START PERUBAHAN BENTUK THUMBNAIL */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {presensi.buktiFoto ? (
                        <img
                          src={getImageUrl(presensi.buktiFoto)}
                          alt="Bukti"
                          // PERUBAHAN: dari rounded-full menjadi rounded-lg
                          className="h-10 w-10 object-cover cursor-pointer border rounded-lg hover:border-blue-500" 
                          onClick={() =>
                            setSelectedImage(getImageUrl(presensi.buktiFoto))
                          }
                        />
                      ) : (
                        <span className="text-xs text-gray-400">Tidak ada</span>
                      )}
                    </td>
                    {/* END PERUBAHAN BENTUK THUMBNAIL */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="mb-2">
                        <button
                          onClick={() =>
                            alert(
                              `Detail Presensi:\n\nNama: ${
                                presensi.nama || "N/A"
                              }\nCheck-In: ${new Date(
                                presensi.checkIn
                              ).toLocaleString("id-ID", {
                                timeZone: "Asia/Jakarta",
                              })}\nCheck-Out: ${
                                presensi.checkOut
                                  ? new Date(presensi.checkOut).toLocaleString(
                                      "id-ID",
                                      {
                                        timeZone: "Asia/Jakarta",
                                      }
                                    )
                                  : "Belum Check-Out"
                              }\nLatitude: ${
                                presensi.latitude || "N/A"
                              }\nLongitude: ${presensi.longitude || "N/A"}`
                            )
                          }
                          className="text-blue-600 hover:text-blue-900 font-semibold"
                        >
                          Lihat Detail
                        </button>
                      </div>
                      <div>
                        <button
                          onClick={() =>
                            navigate(`/edit-presensi/${presensi.id}`)
                          }
                          className="text-green-600 hover:text-green-900 font-semibold"
                        >
                          Edit Presensi
                        </button>
                      </div>
                      <div>
                        <button
                          onClick={() =>
                            navigate(`/delete-presensi/${presensi.id}`)
                          }
                          className="text-red-600 hover:text-red-900 font-semibold"
                        >
                          Hapus Presensi
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="7" 
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

      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={closeModal} 
        >
          <div className="relative max-w-3xl w-full">
            <button
              className="absolute -top-10 right-0 text-white text-xl font-bold hover:text-gray-300"
              onClick={closeModal}
            >
              Tutup [X]
            </button>
            <img
              src={selectedImage}
              alt="Bukti Full"
              className="w-full h-auto rounded-lg shadow-2xl border-2 border-white"
              onClick={(e) => e.stopPropagation()} 
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default ReportPage;