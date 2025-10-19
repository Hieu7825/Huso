import React from "react";
import { useEffect, useState } from "react";
import {
  ChartLineIcon,
  CircleDollarSignIcon,
  PlayCircleIcon,
  UsersIcon,
  Sparkles,
  Flame,
  Crown,
  CalendarIcon,
} from "lucide-react";
import Loading from "../../components/Loading";
import { dummyDashboardData } from "../../assets/assets";
import Title from "../../components/admin/Title";
import BlurCircle from "../../components/BlurCircle";
import { StarIcon } from "@heroicons/react/24/solid";
import { dateFormat } from "../../lib/dateFormat";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const Dashboard = () => {
  const { axios, getToken, user, image_base_url } = useAppContext();

  const currency = import.meta.env.VITE_CURRENCY;

  const [dashboardData, setDashboardData] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    activeShows: [],
    totalUser: 0,
  });

  const [loading, setLoading] = useState(true);

  const dashboardCards = [
    {
      title: "Total Bookings",
      value: dashboardData.totalBookings || "0",
      icon: ChartLineIcon,
      gradient: "from-red-600 via-red-500 to-rose-600",
      borderColor: "border-red-600/50 hover:border-red-500",
      shadowColor: "shadow-red-600/30 hover:shadow-red-500/50",
      iconColor: "text-red-500",
      bgGlow: "bg-red-600/5",
    },
    {
      title: "Total Revenue",
      value: currency + dashboardData.totalRevenue || "0",
      icon: CircleDollarSignIcon,
      gradient: "from-rose-600 via-red-600 to-pink-600",
      borderColor: "border-rose-600/50 hover:border-rose-500",
      shadowColor: "shadow-rose-600/30 hover:shadow-rose-500/50",
      iconColor: "text-rose-500",
      bgGlow: "bg-rose-600/5",
    },
    {
      title: "Active Shows",
      value: dashboardData.activeShows.length || "0",
      icon: PlayCircleIcon,
      gradient: "from-red-700 via-red-600 to-red-500",
      borderColor: "border-red-700/50 hover:border-red-600",
      shadowColor: "shadow-red-700/30 hover:shadow-red-600/50",
      iconColor: "text-red-600",
      bgGlow: "bg-red-700/5",
    },
    {
      title: "Total Users",
      value: dashboardData.totalUser || "0",
      icon: UsersIcon,
      gradient: "from-pink-600 via-red-500 to-rose-500",
      borderColor: "border-pink-600/50 hover:border-pink-500",
      shadowColor: "shadow-pink-600/30 hover:shadow-pink-500/50",
      iconColor: "text-pink-500",
      bgGlow: "bg-pink-600/5",
    },
  ];

  const fetchDashboardData = async () => {
    try {
      const { data } = await axios.get("/api/admin/dashboard", {
        headers: {
          Authorization: `Bearer ${await getToken()}`,
        },
      });
      if (data.success) {
        setDashboardData(data.dashboardData);
        setLoading(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Error fetching dashboard data:", error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  return !loading ? (
    <>
      <Title text1="Admin" text2="Dashboard" />

      {/* Stats Cards */}
      <div className="relative flex flex-wrap gap-5 mt-8">
        <BlurCircle top="-100px" left="0" />
        <div className="flex flex-wrap gap-5 w-full">
          {dashboardCards.map((card, index) => (
            <div
              key={index}
              className={`group relative flex items-center justify-between 
                px-6 py-5 
                bg-gradient-to-br from-zinc-950 via-black to-zinc-950
                border-2 ${card.borderColor} rounded-2xl 
                max-w-xs w-full
                shadow-2xl ${card.shadowColor}
                transition-all duration-500 hover:-translate-y-2 hover:scale-105
                overflow-hidden cursor-pointer`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Glow Background */}
              <div
                className={`absolute inset-0 ${card.bgGlow} opacity-50 group-hover:opacity-70 transition-opacity duration-500`}
              />

              {/* Diagonal Light Streak */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
              />

              {/* Content */}
              <div className="relative z-10">
                <h1 className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-1 group-hover:text-gray-400 transition-colors">
                  {card.title}
                </h1>
                <p className="text-4xl font-black mt-2 text-white drop-shadow-[0_0_20px_rgba(239,68,68,0.5)]">
                  {card.value}
                </p>
              </div>

              {/* Icon with Glow */}
              <div className="relative">
                <div
                  className={`absolute inset-0 blur-xl ${card.iconColor} opacity-30 group-hover:opacity-50 transition-opacity`}
                />
                <card.icon
                  className={`w-14 h-14 ${card.iconColor} drop-shadow-[0_0_15px_rgba(239,68,68,0.7)] 
                    group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 relative z-10`}
                />
              </div>

              {/* Animated Border Shine */}
              <span className="absolute inset-0 overflow-hidden pointer-events-none rounded-2xl">
                <span className="absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-transparent via-red-500/30 to-transparent group-hover:animate-[shimmer_2s_infinite]" />
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Active Shows Section */}
      <div className="mt-16">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-red-600 blur-xl opacity-50" />
              <PlayCircleIcon className="w-8 h-8 text-red-500 relative z-10 drop-shadow-[0_0_15px_rgba(239,68,68,0.8)]" />
              <Flame className="w-4 h-4 text-rose-400 absolute -top-1 -right-1 animate-pulse" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-white">Active Shows</h2>
              <div className="h-1 w-32 bg-gradient-to-r from-red-600 via-rose-600 to-transparent mt-2 rounded-full shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
            </div>
          </div>

          {/* Count Badge */}
          <div className="relative group cursor-pointer">
            <div className="absolute inset-0 bg-red-600 blur-lg opacity-40 group-hover:opacity-60 transition-opacity rounded-full" />
            <span className="relative flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-black via-red-950 to-black border-2 border-red-600/50 rounded-full text-sm font-black shadow-2xl shadow-red-600/40 backdrop-blur-sm hover:border-red-500 hover:shadow-red-500/50 transition-all duration-300">
              <Sparkles className="w-5 h-5 text-red-500 animate-pulse drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
              <span className="text-white">
                {dashboardData.activeShows.length}
              </span>
              <span className="text-red-500">Shows</span>
            </span>
          </div>
        </div>

        {/* Shows Grid */}
        <div className="relative flex flex-wrap gap-6 mt-8">
          <BlurCircle top="100px" left="-10%" />
          {dashboardData.activeShows.map((show, index) => (
            <div
              key={show._id}
              className="group relative w-64 rounded-2xl overflow-hidden 
                bg-gradient-to-br from-zinc-950 via-black to-zinc-950
                border-2 border-red-600/30 hover:border-red-500/60
                shadow-2xl shadow-red-600/20 hover:shadow-red-500/40
                hover:-translate-y-3 hover:scale-105
                transition-all duration-500 cursor-pointer"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Outer Glow */}
              <div className="absolute -inset-1 bg-gradient-to-br from-red-600/20 via-red-800/10 to-red-950/20 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 rounded-2xl" />

              {/* Poster Container */}
              <div className="relative h-80 overflow-hidden">
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent z-10" />

                {/* Poster Image */}
                <img
                  src={image_base_url + show.movie.poster_path}
                  alt={show.movie.title}
                  className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                />

                {/* Top Badge - Rating */}
                <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 px-3 py-2 bg-black/80 backdrop-blur-md rounded-full border border-yellow-600/40 shadow-lg shadow-yellow-600/20">
                  <StarIcon className="w-4 h-4 text-yellow-400 fill-yellow-400 drop-shadow-[0_0_8px_rgba(234,179,8,0.8)]" />
                  <span className="text-sm font-bold text-white">
                    {show.movie.vote_average.toFixed(1)}
                  </span>
                </div>

                {/* Bottom Info Overlay */}
                <div className="absolute bottom-0 left-0 right-0 z-20 p-4">
                  <h3 className="text-lg font-black text-white truncate drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] mb-2">
                    {show.movie.title}
                  </h3>
                </div>
              </div>

              {/* Content Section */}
              <div className="relative p-4 space-y-3 bg-gradient-to-b from-black/50 to-black/80">
                {/* Price */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CircleDollarSignIcon className="w-5 h-5 text-red-500" />
                    <p className="text-2xl font-black text-white drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]">
                      {currency} {show.showPrice}
                    </p>
                  </div>
                  <span className="px-3 py-1.5 bg-red-950/50 border border-red-600/40 rounded-full text-xs font-bold text-red-400 uppercase tracking-wider">
                    Active
                  </span>
                </div>

                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-red-900/40 to-transparent" />

                {/* Date */}
                <div className="flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4 text-red-600" />
                  <span className="text-sm text-gray-400 font-semibold">
                    {dateFormat(show.showDateTime)}
                  </span>
                </div>
              </div>

              {/* Hover shimmer effect */}
              <span className="absolute inset-0 overflow-hidden pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl">
                <span className="absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-transparent via-red-500/20 to-transparent group-hover:animate-[shimmer_2s_infinite]" />
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  ) : (
    <Loading />
  );
};

export default Dashboard;
