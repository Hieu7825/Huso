import React, { useEffect, useState } from "react";
import Loading from "../../components/Loading";
import Title from "../../components/admin/Title";
import { dateFormat } from "../../lib/dateFormat";
import { useAppContext } from "../../context/AppContext";
import {
  User,
  Film,
  Calendar,
  Armchair,
  DollarSign,
  TrendingUp,
  Ticket,
  RefreshCw,
} from "lucide-react";

const ListBookings = () => {
  const currency = import.meta.env.VITE_CURRENCY;
  const { axios, getToken, user } = useAppContext();

  const [bookings, setBookings] = useState([]);
  const [isloading, setIsLoading] = useState(true);
  const [isMigrating, setIsMigrating] = useState(false);

  const getAllBookings = async () => {
    try {
      const { data } = await axios.get("/api/admin/all-bookings", {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });
      setBookings(data.bookings);
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  };

  // ⭐ FUNCTION MIGRATION
  const handleMigrate = async () => {
    if (
      !window.confirm(
        "Bạn có chắc muốn migrate các booking cũ? Thao tác này sẽ cập nhật tên user cho tất cả booking chưa có userName."
      )
    ) {
      return;
    }

    try {
      setIsMigrating(true);
      const { data } = await axios.post(
        "/api/admin/migrate-bookings",
        {},
        {
          headers: { Authorization: `Bearer ${await getToken()}` },
        }
      );

      console.log("Migration result:", data);

      if (data.success) {
        alert(
          `✅ ${data.message}\n\nTotal: ${data.total}\nUpdated: ${
            data.updated
          }\nFailed: ${data.failed || 0}`
        );
        // Reload bookings để hiển thị dữ liệu mới
        getAllBookings();
      } else {
        alert("❌ Migration failed: " + data.message);
      }
    } catch (error) {
      console.error("Migration error:", error);
      alert("❌ Migration failed: " + error.message);
    } finally {
      setIsMigrating(false);
    }
  };

  useEffect(() => {
    if (user) {
      getAllBookings();
    }
  }, [user]);

  // Calculate statistics
  const totalBookings = bookings.length;
  const totalRevenue = bookings.reduce(
    (sum, booking) => sum + booking.amount,
    0
  );
  const totalSeats = bookings.reduce(
    (sum, booking) => sum + Object.keys(booking.bookedSeats || {}).length,
    0
  );
  const uniqueUsers = new Set(bookings.map((b) => b.user?.name)).size;

  return !isloading ? (
    <div className="space-y-6 animate-fade-in">
      {/* Header with Title and Migration Button */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <Title text1="List" text2="Bookings" />

        {/* ⭐ MIGRATION BUTTON */}
        <button
          onClick={handleMigrate}
          disabled={isMigrating}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          <RefreshCw
            className={`w-4 h-4 ${
              isMigrating
                ? "animate-spin"
                : "group-hover:rotate-180 transition-transform duration-500"
            }`}
          />
          <span className="font-medium">
            {isMigrating ? "Migrating..." : "Migrate Old Bookings"}
          </span>
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Total Bookings */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-zinc-900 to-zinc-950 border border-red-500/20 p-5 group hover:border-red-500/40 transition-all duration-300 hover:scale-105">
          <div className="absolute top-0 right-0 w-24 h-24 bg-red-600/10 rounded-full blur-3xl group-hover:bg-red-600/20 transition-all duration-500" />
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-xs font-medium mb-1">
                Total Bookings
              </p>
              <h3 className="text-2xl font-bold text-white">{totalBookings}</h3>
            </div>
            <div className="p-3 bg-red-600/20 rounded-lg ring-2 ring-red-600/30">
              <Ticket className="w-5 h-5 text-red-500" />
            </div>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-zinc-900 to-zinc-950 border border-yellow-500/20 p-5 group hover:border-yellow-500/40 transition-all duration-300 hover:scale-105">
          <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-600/10 rounded-full blur-3xl group-hover:bg-yellow-600/20 transition-all duration-500" />
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-xs font-medium mb-1">
                Total Revenue
              </p>
              <h3 className="text-2xl font-bold text-white">
                {currency} {totalRevenue.toLocaleString()}
              </h3>
            </div>
            <div className="p-3 bg-yellow-600/20 rounded-lg ring-2 ring-yellow-600/30">
              <TrendingUp className="w-5 h-5 text-yellow-500" />
            </div>
          </div>
        </div>

        {/* Total Seats */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-zinc-900 to-zinc-950 border border-orange-500/20 p-5 group hover:border-orange-500/40 transition-all duration-300 hover:scale-105">
          <div className="absolute top-0 right-0 w-24 h-24 bg-orange-600/10 rounded-full blur-3xl group-hover:bg-orange-600/20 transition-all duration-500" />
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-xs font-medium mb-1">
                Total Seats
              </p>
              <h3 className="text-2xl font-bold text-white">{totalSeats}</h3>
            </div>
            <div className="p-3 bg-orange-600/20 rounded-lg ring-2 ring-orange-600/30">
              <Armchair className="w-5 h-5 text-orange-500" />
            </div>
          </div>
        </div>

        {/* Unique Users */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-zinc-900 to-zinc-950 border border-blue-500/20 p-5 group hover:border-blue-500/40 transition-all duration-300 hover:scale-105">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-600/10 rounded-full blur-3xl group-hover:bg-blue-600/20 transition-all duration-500" />
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-xs font-medium mb-1">
                Unique Users
              </p>
              <h3 className="text-2xl font-bold text-white">{uniqueUsers}</h3>
            </div>
            <div className="p-3 bg-blue-600/20 rounded-lg ring-2 ring-blue-600/30">
              <User className="w-5 h-5 text-blue-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="relative overflow-hidden rounded-xl border border-red-500/20 bg-gradient-to-br from-zinc-900/50 to-zinc-950/50 backdrop-blur-sm">
        {/* Glow Effects */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-red-600/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-orange-600/20 rounded-full blur-3xl" />

        <div className="relative overflow-x-auto custom-scrollbar">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-red-500/20">
                <th className="p-4 pl-6 font-semibold text-white bg-gradient-to-r from-red-600/10 to-transparent">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-red-500" />
                    User Name
                  </div>
                </th>
                <th className="p-4 font-semibold text-white bg-gradient-to-r from-red-600/10 to-transparent">
                  <div className="flex items-center gap-2">
                    <Film className="w-4 h-4 text-red-500" />
                    Movie Name
                  </div>
                </th>
                <th className="p-4 font-semibold text-white bg-gradient-to-r from-red-600/10 to-transparent">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-red-500" />
                    Show Time
                  </div>
                </th>
                <th className="p-4 font-semibold text-white bg-gradient-to-r from-red-600/10 to-transparent">
                  <div className="flex items-center gap-2">
                    <Armchair className="w-4 h-4 text-red-500" />
                    Seats
                  </div>
                </th>
                <th className="p-4 font-semibold text-white bg-gradient-to-r from-red-600/10 to-transparent">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-red-500" />
                    Amount
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {bookings.length > 0 ? (
                bookings.map((item, index) => (
                  <tr
                    key={index}
                    className="group border-b border-red-500/5 hover:bg-red-600/5 transition-all duration-300"
                  >
                    {/* User Name */}
                    <td className="p-4 pl-6 text-gray-300 group-hover:text-white transition-colors duration-300">
                      <div className="flex items-center gap-3">
                        <div className="w-1 h-10 bg-gradient-to-b from-red-600 to-red-800 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-red-600/20 to-red-800/20 rounded-full flex items-center justify-center border border-red-500/30">
                            <User className="w-4 h-4 text-red-400" />
                          </div>
                          <span className="font-medium whitespace-nowrap">
                            {item.user?.name || "N/A"}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Movie Name */}
                    <td className="p-4 text-gray-300 group-hover:text-white transition-colors duration-300">
                      <div className="flex items-center gap-2">
                        <Film className="w-4 h-4 text-red-500/50" />
                        <span className="font-medium whitespace-nowrap">
                          {item.show?.movie?.title || "N/A"}
                        </span>
                      </div>
                    </td>

                    {/* Show Time */}
                    <td className="p-4 text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                      <span className="px-3 py-1 bg-red-600/10 border border-red-500/20 rounded-lg text-red-400 text-xs font-medium whitespace-nowrap inline-block">
                        {dateFormat(item.show?.showDateTime)}
                      </span>
                    </td>

                    {/* Seats */}
                    <td className="p-4 text-gray-300 group-hover:text-white transition-colors duration-300">
                      <div className="flex flex-wrap gap-1.5 max-w-xs">
                        {Object.keys(item.bookedSeats || {}).map((key, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 bg-orange-600/10 border border-orange-500/20 rounded text-orange-400 text-xs font-semibold"
                          >
                            {item.bookedSeats[key]}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Amount */}
                    <td className="p-4 text-gray-300 group-hover:text-white transition-colors duration-300">
                      <span className="px-3 py-1 bg-yellow-600/10 border border-yellow-500/20 rounded-lg text-yellow-400 font-semibold inline-block">
                        {currency} {item.amount?.toLocaleString() || 0}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="p-4 bg-red-600/10 rounded-full">
                        <Ticket className="w-8 h-8 text-red-500/50" />
                      </div>
                      <p className="text-gray-500 text-lg font-medium">
                        No bookings yet
                      </p>
                      <p className="text-gray-600 text-sm">
                        Bookings will appear here once users make reservations
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Summary */}
        {bookings.length > 0 && (
          <div className="border-t border-red-500/20 bg-gradient-to-r from-red-600/5 to-transparent p-4 px-6">
            <div className="flex flex-wrap items-center justify-between gap-4 text-sm">
              <p className="text-gray-400">
                Showing{" "}
                <span className="text-white font-semibold">
                  {bookings.length}
                </span>{" "}
                bookings
              </p>
              <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-2">
                  <Armchair className="w-4 h-4 text-orange-500" />
                  <span className="text-gray-400">Total Seats:</span>
                  <span className="text-white font-semibold">{totalSeats}</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-yellow-500" />
                  <span className="text-gray-400">Total Revenue:</span>
                  <span className="text-white font-semibold">
                    {currency} {totalRevenue.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default ListBookings;
