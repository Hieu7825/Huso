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
              className="relative group h-8 w-8 rounded-lg transition-all duration-300 text-xs font-semibold"
              style={{
                background: isSelected
                  ? "linear-gradient(135deg, #f84565, #d63854)"
                  : isOccupied
                  ? "rgba(100, 100, 100, 0.3)"
                  : "rgba(248, 69, 101, 0.05)",
                border: `2px solid ${
                  isSelected
                    ? "#f84565"
                    : isOccupied
                    ? "rgba(100, 100, 100, 0.5)"
                    : "rgba(248, 69, 101, 0.3)"
                }`,
                cursor: isOccupied ? "not-allowed" : "pointer",
                opacity: isOccupied ? 0.5 : 1,
                boxShadow: isSelected
                  ? "0 4px 15px rgba(248, 69, 101, 0.5)"
                  : "none",
                transform: isSelected ? "scale(1.05)" : "scale(1)",
                color: isSelected ? "#fff" : isOccupied ? "#666" : "#d1d5db",
              }}
              disabled={isOccupied}
            >
              {!isSelected && !isOccupied && (
                <div
                  className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(248, 69, 101, 0.2), rgba(234, 88, 12, 0.2))",
                    filter: "blur(8px)",
                  }}
                />
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
      <div
        className="w-60 rounded-2xl py-10 h-max md:sticky md:top-30 overflow-hidden"
        style={{
          background: "linear-gradient(180deg, #161329, #000, #1d1b4b)",
          border: "2px solid rgba(248, 69, 101, 0.3)",
          boxShadow: "0 0 30px rgba(248, 69, 101, 0.1)",
        }}
      >
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
                className="relative group flex items-center gap-2 px-4 py-3 rounded-xl cursor-pointer transition-all duration-300"
                style={{
                  background: isSelected
                    ? "linear-gradient(135deg, #f84565, #d63854)"
                    : "rgba(248, 69, 101, 0.05)",
                  border: `2px solid ${
                    isSelected ? "#f84565" : "rgba(248, 69, 101, 0.2)"
                  }`,
                  boxShadow: isSelected
                    ? "0 4px 15px rgba(248, 69, 101, 0.4)"
                    : "none",
                  transform: isSelected ? "scale(1.02)" : "scale(1)",
                }}
              >
                {!isSelected && (
                  <div
                    className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(248, 69, 101, 0.15), rgba(234, 88, 12, 0.15))",
                    }}
                  />
                )}
                <Clock
                  className="w-4 h-4 relative z-10"
                  style={{ color: isSelected ? "#fff" : "#ef4444" }}
                />
                <p
                  className="text-sm font-medium relative z-10"
                  style={{ color: isSelected ? "#fff" : "#d1d5db" }}
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
          <div
            className="absolute -bottom-2 left-0 right-0 h-1 rounded-full"
            style={{
              background:
                "linear-gradient(90deg, transparent, #f84565, transparent)",
              boxShadow: "0 0 20px rgba(248, 69, 101, 0.6)",
            }}
          />
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
            <div
              className="w-6 h-6 rounded-lg"
              style={{
                background: "rgba(248, 69, 101, 0.05)",
                border: "2px solid rgba(248, 69, 101, 0.3)",
              }}
            />
            <span className="text-gray-400">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6 rounded-lg"
              style={{
                background: "linear-gradient(135deg, #f84565, #d63854)",
                border: "2px solid #f84565",
              }}
            />
            <span className="text-gray-400">Selected</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6 rounded-lg"
              style={{
                background: "rgba(100, 100, 100, 0.3)",
                border: "2px solid rgba(100, 100, 100, 0.5)",
                opacity: 0.5,
              }}
            />
            <span className="text-gray-400">Occupied</span>
          </div>
        </div>

        {/* Checkout Button */}
        <button
          onClick={bookTickets}
          className="relative group flex items-center gap-2 mt-12 px-10 py-4 rounded-full font-bold overflow-hidden transition-all duration-300 active:scale-95"
          style={{
            background:
              selectedSeats.length > 0
                ? "linear-gradient(135deg, #f84565, #d63854)"
                : "rgba(248, 69, 101, 0.3)",
            border: "2px solid rgba(248, 69, 101, 0.5)",
            boxShadow:
              selectedSeats.length > 0
                ? "0 10px 30px rgba(248, 69, 101, 0.4)"
                : "none",
            cursor: selectedSeats.length > 0 ? "pointer" : "not-allowed",
            opacity: selectedSeats.length > 0 ? 1 : 0.6,
            color: "#fff",
          }}
          disabled={selectedSeats.length === 0}
        >
          {selectedSeats.length > 0 && (
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)",
                animation: "shimmer 2s infinite",
              }}
            />
          )}
          <span className="relative z-10">Proceed to Checkout</span>
          <ArrowRight strokeWidth={3} className="w-4 h-4 relative z-10" />
          {selectedSeats.length > 0 && (
            <span
              className="absolute -top-1 right-2 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
              style={{
                background: "#fff",
                color: "#f84565",
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
              }}
            >
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
