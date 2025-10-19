import React, { useEffect, useState } from "react";
import { dummyShowsData } from "../../assets/assets";
import Loading from "../../components/Loading";
import Title from "../../components/admin/Title";
import { dateFormat } from "../../lib/dateFormat";
import { useAppContext } from "../../context/AppContext";
import { Calendar, Users, DollarSign, Film, TrendingUp } from "lucide-react";

const ListShows = () => {
  const currency = import.meta.env.VITE_CURRENCY;
  const { axios, getToken, user } = useAppContext();

  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);

  const getAllShows = async () => {
    try {
      const { data } = await axios.get("/api/admin/all-shows", {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });
      setShows(data.shows);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (user) {
      getAllShows();
    }
  }, [user]);

  // Calculate statistics
  const totalBookings = shows.reduce(
    (sum, show) => sum + Object.keys(show.occupiedSeats || {}).length,
    0
  );
  const totalEarnings = shows.reduce(
    (sum, show) =>
      sum + Object.keys(show.occupiedSeats || {}).length * show.showPrice,
    0
  );

  return !loading ? (
    <div className="space-y-6 animate-fade-in">
      <Title text1="List" text2="Shows" />

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {/* Total Shows */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-zinc-900 to-zinc-950 border border-red-500/20 p-5 group hover:border-red-500/40 transition-all duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-red-600/10 rounded-full blur-3xl group-hover:bg-red-600/20 transition-all duration-500" />
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium mb-1">
                Total Shows
              </p>
              <h3 className="text-3xl font-bold text-white">{shows.length}</h3>
            </div>
            <div className="p-3 bg-red-600/20 rounded-lg ring-2 ring-red-600/30">
              <Film className="w-6 h-6 text-red-500" />
            </div>
          </div>
        </div>

        {/* Total Bookings */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-zinc-900 to-zinc-950 border border-orange-500/20 p-5 group hover:border-orange-500/40 transition-all duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-orange-600/10 rounded-full blur-3xl group-hover:bg-orange-600/20 transition-all duration-500" />
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium mb-1">
                Total Bookings
              </p>
              <h3 className="text-3xl font-bold text-white">{totalBookings}</h3>
            </div>
            <div className="p-3 bg-orange-600/20 rounded-lg ring-2 ring-orange-600/30">
              <Users className="w-6 h-6 text-orange-500" />
            </div>
          </div>
        </div>

        {/* Total Earnings */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-zinc-900 to-zinc-950 border border-yellow-500/20 p-5 group hover:border-yellow-500/40 transition-all duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-600/10 rounded-full blur-3xl group-hover:bg-yellow-600/20 transition-all duration-500" />
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium mb-1">
                Total Earnings
              </p>
              <h3 className="text-3xl font-bold text-white">
                {currency} {totalEarnings.toLocaleString()}
              </h3>
            </div>
            <div className="p-3 bg-yellow-600/20 rounded-lg ring-2 ring-yellow-600/30">
              <TrendingUp className="w-6 h-6 text-yellow-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="relative overflow-hidden rounded-xl border border-red-500/20 bg-gradient-to-br from-zinc-900/50 to-zinc-950/50 backdrop-blur-sm">
        {/* Glow Effect */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-red-600/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-orange-600/20 rounded-full blur-3xl" />

        <div className="relative overflow-x-auto custom-scrollbar">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-red-500/20">
                <th className="p-4 pl-6 font-semibold text-white bg-gradient-to-r from-red-600/10 to-transparent">
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
                    <Users className="w-4 h-4 text-red-500" />
                    Total Bookings
                  </div>
                </th>
                <th className="p-4 font-semibold text-white bg-gradient-to-r from-red-600/10 to-transparent">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-red-500" />
                    Earnings
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {shows.length > 0 ? (
                shows.map((show, index) => (
                  <tr
                    key={index}
                    className="group border-b border-red-500/5 hover:bg-red-600/5 transition-all duration-300"
                  >
                    <td className="p-4 pl-6 text-gray-300 group-hover:text-white transition-colors duration-300 font-medium">
                      <div className="flex items-center gap-3">
                        <div className="w-1 h-8 bg-gradient-to-b from-red-600 to-red-800 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <span className="whitespace-nowrap">
                          {show.movie.title}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-red-600/10 border border-red-500/20 rounded-lg text-red-400 text-xs font-medium whitespace-nowrap">
                          {dateFormat(show.showDateTime)}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-gray-300 group-hover:text-white transition-colors duration-300 font-medium">
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-orange-600/10 border border-orange-500/20 rounded-lg text-orange-400 font-semibold">
                          {Object.keys(show.occupiedSeats || {}).length}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-gray-300 group-hover:text-white transition-colors duration-300 font-semibold">
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-yellow-600/10 border border-yellow-500/20 rounded-lg text-yellow-400">
                          {currency}{" "}
                          {(
                            Object.keys(show.occupiedSeats || {}).length *
                            show.showPrice
                          ).toLocaleString()}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="p-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="p-4 bg-red-600/10 rounded-full">
                        <Film className="w-8 h-8 text-red-500/50" />
                      </div>
                      <p className="text-gray-500 text-lg font-medium">
                        No shows available
                      </p>
                      <p className="text-gray-600 text-sm">
                        Start by adding your first show
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Summary */}
        {shows.length > 0 && (
          <div className="border-t border-red-500/20 bg-gradient-to-r from-red-600/5 to-transparent p-4 px-6">
            <div className="flex flex-wrap items-center justify-between gap-4 text-sm">
              <p className="text-gray-400">
                Showing{" "}
                <span className="text-white font-semibold">{shows.length}</span>{" "}
                shows
              </p>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-orange-500" />
                  <span className="text-gray-400">Total Bookings:</span>
                  <span className="text-white font-semibold">
                    {totalBookings}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-yellow-500" />
                  <span className="text-gray-400">Total Revenue:</span>
                  <span className="text-white font-semibold">
                    {currency} {totalEarnings.toLocaleString()}
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

export default ListShows;
