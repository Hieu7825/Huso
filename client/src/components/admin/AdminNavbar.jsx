import React from "react";
import { assets } from "../../assets/assets";
import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";

const AdminNavbar = () => {
  return (
    <div className="relative flex items-center justify-between px-6 md:px-10 h-16 border-b border-red-600/20 bg-gradient-to-r from-black via-zinc-900/50 to-black overflow-hidden">
      {/* Background Grid Effect */}
      <div className="absolute inset-0 opacity-5">
        <div className="w-full h-full bg-[linear-gradient(to_right,#0f0f10_1px,transparent_1px),linear-gradient(to_bottom,#0f0f10_1px,transparent_1px)] bg-[size:1rem_1rem]" />
      </div>

      {/* Animated Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-600/5 via-red-500/10 to-red-600/5 animate-pulse pointer-events-none" />

      {/* Top Border Glow */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-600/50 to-transparent" />

      {/* Logo Container with Enhanced Effects */}
      <Link to="/" className="relative group z-10">
        {/* Glow Effect Behind Logo */}
        <div className="absolute -inset-2 bg-red-600/20 rounded-lg blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500" />

        {/* Sparkle Effect */}
        <div className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <Sparkles className="w-4 h-4 text-red-500 animate-pulse drop-shadow-[0_0_6px_rgba(220,38,38,0.8)]" />
        </div>

        {/* Logo Image */}
        <img
          src={assets.logo}
          alt="logo"
          className="w-36 h-auto relative z-10 transition-all duration-300 group-hover:scale-105 group-hover:drop-shadow-[0_0_15px_rgba(220,38,38,0.6)]"
        />
      </Link>
    </div>
  );
};

export default AdminNavbar;
