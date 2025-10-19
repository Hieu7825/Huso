import React, { useEffect } from "react";
import { useState } from "react";
import { dummyBookingData } from "../assets/assets";
import Loading from "../components/Loading";
import BlurCircle from "../components/BlurCircle";
import timeFormat from "../lib/timeFormat";
import { dateFormat } from "../lib/dateFormat";
import { useAppContext } from "../context/AppContext";
import { Link } from "react-router-dom";
import {
  Ticket,
  Calendar,
  Clock,
  Armchair,
  CreditCard,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

const MyBooking = () => {
  const currency = import.meta.env.VITE_CURRENCY;
  const { axios, getToken, user, image_base_url } = useAppContext();
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getMyBookings = async () => {
    try {
      const { data } = await axios.get("/api/user/bookings", {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });

      if (data.success) {
        setBookings(data.bookings);
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (user) {
      getMyBookings();
    }
  }, [user]);

  return !isLoading ? (
    <div className="relative px-6 md:px-16 lg:px-24 xl:px-44 pt-20 pb-60 min-h-[80vh]">
      {/* Background Effects */}
      <BlurCircle top="150px" left="-80px" />
      <BlurCircle bottom="50px" right="50px" />

      {/* Grid Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="w-full h-full grid-background" />
      </div>

      {/* Enhanced Header Section */}
      <div className="relative flex justify-center pt-20 pb-10">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Ticket className="w-8 h-8 text-red-500 animate-pulse" />
            <Sparkles className="w-4 h-4 text-yellow-400 absolute -top-1 -right-1 animate-bounce" />
          </div>
          <div className="relative">
            <h2 className="gradient text-4xl md:text-5xl font-bold tracking-wide uppercase transform hover:scale-105 transition-all duration-300">
              🎫 My Bookings
            </h2>
            <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-red-600 via-red-500 to-red-600 animate-pulse rounded-full"></div>
          </div>
          <div className="flex gap-1">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-red-400 rounded-full animate-bounce delay-75"></div>
            <div className="w-3 h-3 bg-red-300 rounded-full animate-bounce delay-150"></div>
          </div>
        </div>
      </div>

      {/* Bookings Count Info */}
      {bookings.length > 0 && (
        <div className="mb-8 text-center animate-fade-in">
          <p className="text-gray-400 text-lg">
            You have{" "}
            <span className="text-red-500 font-bold text-xl">
              {bookings.length}
            </span>{" "}
            {bookings.length === 1 ? "booking" : "bookings"}
          </p>
        </div>
      )}

      {/* Bookings List */}
      {bookings.length > 0 ? (
        <div className="max-w-5xl mx-auto space-y-6">
          {bookings.map((item, index) => (
            <div
              key={index}
              className="relative group animate-fade-in-up overflow-hidden rounded-2xl bg-gradient-to-br from-[#161329] via-black to-[#1d1b4b] border-2 border-red-500/30 shadow-[0_0_30px_rgba(248,69,101,0.1)] transition-all duration-300 hover:border-red-500/50 hover:shadow-[0_0_40px_rgba(248,69,101,0.2)]"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Glow effect on hover */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-red-500/5 to-orange-600/5 blur-xl pointer-events-none" />

              {/* Paid Badge */}
              {item.isPaid && (
                <div className="absolute top-4 right-4 z-10 flex items-center gap-2 bg-green-500/20 border border-green-500/40 rounded-full px-3 py-1.5">
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                  <span className="text-green-400 text-xs font-semibold">
                    PAID
                  </span>
                </div>
              )}

              <div className="relative flex flex-col md:flex-row gap-6 p-6">
                {/* Movie Poster */}
                <div className="relative flex-shrink-0 group/poster">
                  <div className="relative overflow-hidden rounded-xl w-full md:w-64 aspect-video">
                    <img
                      src={image_base_url + item.show.movie.poster_path}
                      alt={item.show.movie.title}
                      className="w-full h-full object-cover object-center transition-transform duration-500 group-hover/poster:scale-110"
                    />
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover/poster:opacity-100 transition-opacity duration-300" />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col justify-between">
                  {/* Movie Info */}
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-red-400 transition-colors">
                      {item.show.movie.title}
                    </h3>

                    {/* Details Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                      {/* Date */}
                      <div className="flex items-center gap-3 bg-red-500/5 border border-red-500/20 rounded-lg px-3 py-2">
                        <Calendar className="w-5 h-5 text-red-400 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-gray-500">Date</p>
                          <p className="text-sm text-gray-300 font-medium">
                            {dateFormat(item.show.showDateTime)}
                          </p>
                        </div>
                      </div>

                      {/* Runtime */}
                      <div className="flex items-center gap-3 bg-red-500/5 border border-red-500/20 rounded-lg px-3 py-2">
                        <Clock className="w-5 h-5 text-red-400 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-gray-500">Runtime</p>
                          <p className="text-sm text-gray-300 font-medium">
                            {timeFormat(item.show.movie.runtime)}
                          </p>
                        </div>
                      </div>

                      {/* Seats */}
                      <div className="flex items-center gap-3 bg-red-500/5 border border-red-500/20 rounded-lg px-3 py-2 sm:col-span-2">
                        <Armchair className="w-5 h-5 text-red-400 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-xs text-gray-500">
                            Seats ({item.bookedSeats.length})
                          </p>
                          <p className="text-sm text-gray-300 font-medium">
                            {item.bookedSeats.join(", ")}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer - Price & Action */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-6 pt-4 border-t border-red-500/20">
                    {/* Price */}
                    <div className="flex items-baseline gap-2">
                      <span className="text-gray-400 text-sm">Total:</span>
                      <span className="text-3xl font-bold text-white">
                        {currency}
                        {item.amount}
                      </span>
                    </div>

                    {/* Pay Now Button */}
                    {!item.isPaid && (
                      <Link
                        to={item.paymentLink}
                        className="relative group/btn flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white transition-all duration-300 overflow-hidden bg-gradient-to-br from-[#f84565] to-[#d63854] border-2 border-red-500/50 shadow-[0_10px_30px_rgba(248,69,101,0.4)] hover:scale-105"
                      >
                        <div className="absolute inset-0 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_2s_infinite]" />
                        <CreditCard className="w-5 h-5 relative z-10" />
                        <span className="relative z-10">Pay Now</span>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
          {/* Animated Ticket Icon */}
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-red-500/20 rounded-full blur-3xl animate-pulse"></div>
            <Ticket className="w-32 h-32 text-gray-700 relative z-10 animate-pulse" />
            <Ticket className="w-32 h-32 text-red-500/30 absolute top-0 left-0 animate-ping" />
          </div>

          {/* Main Message */}
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4 gradient">
            No Bookings Yet
          </h1>

          {/* Description */}
          <p className="text-gray-400 text-center max-w-md mb-8 text-lg">
            Start your cinema journey by booking your first movie!
          </p>

          {/* Decorative Elements */}
          <div className="flex gap-3 mb-8">
            <div className="w-4 h-4 bg-red-500/30 rounded-full animate-bounce"></div>
            <div className="w-4 h-4 bg-orange-500/30 rounded-full animate-bounce delay-75"></div>
            <div className="w-4 h-4 bg-red-400/30 rounded-full animate-bounce delay-150"></div>
          </div>

          {/* CTA Button */}
          <Link
            to="/movies"
            className="relative group flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-white transition-all duration-300 overflow-hidden bg-gradient-to-br from-[#f84565] to-[#d63854] border-2 border-red-500/50 shadow-[0_10px_30px_rgba(248,69,101,0.4)] hover:scale-105"
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_2s_infinite]" />
            <Ticket className="w-5 h-5 relative z-10" />
            <span className="relative z-10">Browse Movies</span>
          </Link>
        </div>
      )}
    </div>
  ) : (
    <Loading />
  );
};

export default MyBooking;
