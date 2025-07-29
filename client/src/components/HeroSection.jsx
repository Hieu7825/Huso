import { assets } from "../assets/assets";
import { CalendarIcon, ClockIcon, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();
  return (
    <div
      className='flex flex-col items-start justify-center gap-4
px-6 md:px-16 lg:px-36 bg-[url("/backgroundImage.png")] bg-cover bg-center h-screen'
    >
      <img
        src={assets.KYNLogo}
        alt="KYN Logo"
        className="max-h-60 lg:h-60 mt-6 ml-10 drop-shadow-[2px_2px_4px_rgba(0,0,0,0.6)]"
      />
      <h1 className="text-5xl md:text-[70px] md:leading-[4.5rem] font-bold max-w-110 text-white drop-shadow-[2px_2px_4px_#000] tracking-wide">
        <span className="text-red-500">Kimetsu</span> <br />
        <span className="text-white">no Yaiba</span>
      </h1>
      <div className="flex flex-col gap-2 bg-blue-900/50 p-4 rounded-xl text-white drop-shadow-lg">
        <div className="flex items-center gap-4 text-gray-300">
          <span>Animation | Action | Fantasy | Thriller</span>
          <div className="flex items-center gap-1">
            <CalendarIcon className="w-4.5 h-4.5" /> 2025
          </div>
          <div className="flex items-center gap-1">
            <ClockIcon className="w-4.5 h-4.5" /> 2h 35m
          </div>
        </div>
        <p className="max-w-md text-gray-300">
          Tanjiro and the Hashira are cast into the Infinity Castle, where their
          final battle against Muzan and the demons begins.
        </p>
      </div>
      <button
        onClick={() => navigate("/movies")}
        className="flex items-center gap-1 px-6 py-3 text-sm bg-primary
hover:bg-primary-dull transition rounded-full font-medium cursor-pointer"
      >
        Explore Movies
        <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  );
};

export default HeroSection;
