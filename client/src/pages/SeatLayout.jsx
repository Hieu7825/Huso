import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "../components/Loading";
import { dummyShowsData, dummyDateTimeData, assets } from "../assets/assets";
import { ArrowRight, Clock } from "lucide-react";
import isoTimeFormat from "../lib/isoTimeFormat";
import BlurCircle from "../components/BlurCircle";
import toast from "react-hot-toast";
import { useAppContext } from "../context/AppContext";

const SeatLayout = () => {
  const groupRows = [
    ["A", "B"],
    ["C", "D"],
    ["E", "F"],
    ["G", "H"],
    ["I", "J"],
  ];
  const { id, date } = useParams();
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [show, setShow] = useState(null);
  const [occupiedSeats, setOccupiedSeats] = useState([]);
  const navigate = useNavigate();
  const { axios, getToken, user } = useAppContext();

  const getShow = async () => {
    try {
      const { data } = await axios.get(`/api/show/${id}`);
      if (data.success) {
        setShow(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSeatClick = (seatId) => {
    if (!selectedTime) {
      return toast("Please select a time first");
    }
    if (!selectedSeats.includes(seatId) && selectedSeats.length > 4) {
      return toast("You can only select up to 5 seats");
    }
    if (occupiedSeats.includes(seatId)) {
      return toast("This seat is already booked");
    }
    setSelectedSeats((prev) =>
      prev.includes(seatId)
        ? prev.filter((seat) => seat !== seatId)
        : [...prev, seatId]
    );
  };

  const renderSeats = (row, count = 8) => (
    <div key={row} className="flex gap-2 mt-2">
      <div className="flex flex-wrap items-center justify-center gap-2">
        {Array.from({ length: count }, (_, i) => {
          const seatId = `${row}${i + 1}`;
          const isSelected = selectedSeats.includes(seatId);
          const isOccupied = occupiedSeats.includes(seatId);

          return (
            <button
              key={seatId}
              onClick={() => handleSeatClick(seatId)}
              className={`relative group h-8 w-8 rounded-lg transition-all duration-300 text-xs font-semibold ${
                isSelected
                  ? "bg-gradient-to-br from-[#f84565] to-[#d63854] border-2 border-[#f84565] shadow-[0_4px_15px_rgba(248,69,101,0.5)] scale-105 text-white"
                  : isOccupied
                  ? "bg-gray-600/30 border-2 border-gray-600/50 cursor-not-allowed opacity-50 text-gray-600"
                  : "bg-red-500/5 border-2 border-red-500/30 cursor-pointer text-gray-300"
              }`}
              disabled={isOccupied}
            >
              {!isSelected && !isOccupied && (
                <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-red-500/20 to-orange-600/20 blur-[8px]" />
              )}
              <span className="relative z-10">{seatId}</span>
            </button>
          );
        })}
      </div>
    </div>
  );

  const getOccupiedSeats = async () => {
    try {
      const { data } = await axios.get(
        `/api/booking/seats/${selectedTime.showId}`
      );
      if (data.success) {
        setOccupiedSeats(data.occupiedSeats);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const bookTickets = async () => {
    try {
      if (!user) return toast.error("Please login to proceed");

      if (!selectedTime || !selectedSeats.length)
        return toast.error("Please select a time and seats");

      const { data } = await axios.post(
        "/api/booking/create",
        { showId: selectedTime.showId, selectedSeats },
        { headers: { Authorization: `Bearer ${await getToken()}` } }
      );
      if (data.success) {
        window.location.href = data.url;
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    getShow();
  }, []);

  useEffect(() => {
    if (selectedTime) {
      getOccupiedSeats();
    }
  }, [selectedTime]);

  return show ? (
    <div className="flex flex-col md:flex-row px-6 md:px-16 lg:px-40 py-30 md:pt-50 gap-8">
      {/* Available Timing */}
      <div className="w-60 rounded-2xl py-10 h-max md:sticky md:top-30 overflow-hidden bg-gradient-to-b from-[#161329] via-black to-[#1d1b4b] border-2 border-red-500/30 shadow-[0_0_30px_rgba(248,69,101,0.1)]">
        <p className="text-xl font-bold px-6 bg-gradient-to-r from-red-500 via-orange-500 to-red-600 bg-clip-text text-transparent">
          Available Timings
        </p>
        <div className="mt-5 space-y-2 px-3">
          {show.dateTime[date].map((item) => {
            const isSelected = selectedTime?.time === item.time;
            return (
              <div
                key={item.time}
                onClick={() => setSelectedTime(item)}
                className={`relative group flex items-center gap-2 px-4 py-3 rounded-xl cursor-pointer transition-all duration-300 ${
                  isSelected
                    ? "bg-gradient-to-br from-[#f84565] to-[#d63854] border-2 border-[#f84565] shadow-[0_4px_15px_rgba(248,69,101,0.4)] scale-[1.02]"
                    : "bg-red-500/5 border-2 border-red-500/20"
                }`}
              >
                {!isSelected && (
                  <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-red-500/15 to-orange-600/15" />
                )}
                <Clock
                  className={`w-4 h-4 relative z-10 ${
                    isSelected ? "text-white" : "text-red-500"
                  }`}
                />
                <p
                  className={`text-sm font-medium relative z-10 ${
                    isSelected ? "text-white" : "text-gray-300"
                  }`}
                >
                  {isoTimeFormat(item.time)}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Seat Layout */}
      <div className="relative flex-1 flex flex-col items-center max-md:mt-16">
        <BlurCircle top="-100px" left="-100px" />
        <BlurCircle bottom="0px" right="0px" />

        <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-red-500 via-orange-500 to-red-600 bg-clip-text text-transparent">
          Select Your Seats
        </h1>

        {/* Screen */}
        <div className="relative mb-8">
          <img src={assets.screenImage} alt="screen" className="opacity-80" />
          <div className="absolute -bottom-2 left-0 right-0 h-1 rounded-full bg-gradient-to-r from-transparent via-[#f84565] to-transparent shadow-[0_0_20px_rgba(248,69,101,0.6)]" />
        </div>
        <p className="text-gray-400 text-sm mb-6 font-semibold tracking-wider">
          SCREEN SIDE
        </p>

        {/* Seats Grid */}
        <div className="flex flex-col items-center mt-10 text-xs text-gray-300">
          <div className="grid grid-cols-2 md:grid-cols-1 gap-8 md:gap-2 mb-6">
            {groupRows[0].map((row) => renderSeats(row))}
          </div>
          <div className="grid grid-cols-2 gap-11">
            {groupRows.slice(1).map((group, idx) => (
              <div key={idx}>{group.map((row) => renderSeats(row))}</div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-6 mt-12 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-red-500/5 border-2 border-red-500/30" />
            <span className="text-gray-400">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#f84565] to-[#d63854] border-2 border-[#f84565]" />
            <span className="text-gray-400">Selected</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gray-600/30 border-2 border-gray-600/50 opacity-50" />
            <span className="text-gray-400">Occupied</span>
          </div>
        </div>

        {/* Checkout Button */}
        <button
          onClick={bookTickets}
          className={`relative group flex items-center gap-2 mt-12 px-10 py-4 rounded-full font-bold overflow-hidden transition-all duration-300 active:scale-95 text-white border-2 border-red-500/50 ${
            selectedSeats.length > 0
              ? "bg-gradient-to-br from-[#f84565] to-[#d63854] shadow-[0_10px_30px_rgba(248,69,101,0.4)] cursor-pointer opacity-100"
              : "bg-red-500/30 cursor-not-allowed opacity-60"
          }`}
          disabled={selectedSeats.length === 0}
        >
          {selectedSeats.length > 0 && (
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_2s_infinite]" />
          )}
          <span className="relative z-10">Proceed to Checkout</span>
          <ArrowRight strokeWidth={3} className="w-4 h-4 relative z-10" />
          {selectedSeats.length > 0 && (
            <span className="absolute -top-1 right-2 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold bg-white text-[#f84565] shadow-[0_4px_10px_rgba(0,0,0,0.3)]">
              {selectedSeats.length}
            </span>
          )}
        </button>

        {selectedSeats.length > 0 && (
          <p className="text-xs text-gray-400 mt-4 animate-fade-in">
            {selectedSeats.length} seat{selectedSeats.length > 1 ? "s" : ""}{" "}
            selected: {selectedSeats.join(", ")}
          </p>
        )}
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default SeatLayout;
