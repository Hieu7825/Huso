import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { MenuIcon, SearchIcon, TicketPlus, XIcon, Heart } from "lucide-react";
import { useUser, useClerk, UserButton } from "@clerk/clerk-react";
import { useAppContext } from "../context/AppContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { user } = useUser();
  const { openSignIn } = useClerk();
  const navigate = useNavigate();
  const { favoriteMovies } = useAppContext();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY && window.scrollY > 80) {
        setShowNavbar(false);
      } else {
        setShowNavbar(true);
      }
      setLastScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <div
      className={`fixed top-0 left-0 z-50 w-full transition-transform duration-500 ${
        showNavbar ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      {/* Backdrop blur background */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-xl border-b border-white/5"></div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent pointer-events-none"></div>

      <div className="relative flex items-center justify-between px-6 md:px-16 lg:px-36 py-2.5">
        {/* Logo */}
        <Link to="/" className="max-md:flex-1 relative z-10">
          <img
            src={assets.logo}
            alt="Logo"
            className="w-20 h-auto drop-shadow-2xl hover:scale-105 transition-transform duration-300"
          />
        </Link>

        {/* Desktop & Mobile Menu */}
        <div
          className={`max-md:fixed max-md:top-0 max-md:left-0 max-md:font-medium
          max-md:text-lg z-50 flex flex-col md:flex-row items-center
          max-md:justify-center gap-4 md:gap-6 md:px-8 py-2 max-md:h-screen
          md:rounded-full backdrop-blur-2xl bg-gradient-to-br from-black/80 via-zinc-900/80 to-black/80
          md:border-2 border-red-500/20 overflow-hidden transition-all duration-500
          md:shadow-[0_0_40px_rgba(220,38,38,0.15)]
          md:hover:shadow-[0_0_60px_rgba(220,38,38,0.25)]
          md:hover:border-red-500/30
          ${
            isOpen
              ? "max-md:w-full max-md:opacity-100"
              : "max-md:w-0 max-md:opacity-0"
          }`}
        >
          {/* Close Icon for Mobile */}
          <XIcon
            className="md:hidden absolute top-8 right-8 w-7 h-7 cursor-pointer text-white/80 hover:text-red-500 hover:rotate-90 transition-all duration-300"
            onClick={() => setIsOpen(!isOpen)}
          />

          {/* Navigation Links */}
          <Link
            className="relative group text-white/90 hover:text-white text-base font-semibold px-3 py-1.5 transition-all duration-300 no-underline"
            onClick={() => {
              scrollTo(0, 0);
              setIsOpen(false);
            }}
            to="/"
          >
            Home
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-red-600 to-red-500 group-hover:w-full transition-all duration-300"></span>
          </Link>

          <Link
            className="relative group text-white/90 hover:text-white text-base font-semibold px-3 py-1.5 transition-all duration-300 no-underline"
            onClick={() => {
              scrollTo(0, 0);
              setIsOpen(false);
            }}
            to="/movies"
          >
            Movies
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-red-600 to-red-500 group-hover:w-full transition-all duration-300"></span>
          </Link>

          {favoriteMovies.length > 0 && (
            <Link
              className="relative group text-white/90 hover:text-white text-base font-semibold px-3 py-1.5 transition-all duration-300 no-underline flex items-center gap-2"
              onClick={() => {
                scrollTo(0, 0);
                setIsOpen(false);
              }}
              to="/favorite"
            >
              <Heart className="w-4 h-4 fill-red-500 text-red-500" />
              Favorites
              <span className="absolute -top-1 -right-2 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg shadow-red-500/50">
                {favoriteMovies.length}
              </span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-red-600 to-red-500 group-hover:w-full transition-all duration-300"></span>
            </Link>
          )}
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-3 md:gap-4 relative z-10">
          {/* Search Icon */}
          <button
            onClick={() => {
              scrollTo(0, 0);
              navigate("/movies");
            }}
            className="max-md:hidden p-2 rounded-full bg-white/5 border border-white/10 hover:bg-red-600/20 hover:border-red-500/30 transition-all duration-300 group"
          >
            <SearchIcon className="w-4 h-4 text-white/80 group-hover:text-red-400 transition-colors duration-300" />
          </button>

          {/* Auth Button */}
          {!user ? (
            <button
              onClick={openSignIn}
              className="relative px-5 py-2 sm:px-6 sm:py-2 bg-gradient-to-r from-red-600 via-red-700 to-red-800
              hover:from-red-500 hover:via-red-600 hover:to-red-700 text-white text-sm font-semibold
              rounded-full transition-all duration-300 cursor-pointer
              shadow-[0_0_30px_rgba(220,38,38,0.4)] hover:shadow-[0_0_50px_rgba(220,38,38,0.6)]
              hover:scale-105 border-2 border-red-500/50 hover:border-red-400/70
              overflow-hidden group"
            >
              <span className="relative z-10">Login</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            </button>
          ) : (
            <div className="hover:scale-110 transition-transform duration-300">
              <UserButton
                appearance={{
                  elements: {
                    avatarBox:
                      "w-9 h-9 ring-2 ring-red-500 ring-offset-2 ring-offset-black hover:ring-red-400 transition-all duration-300 shadow-lg shadow-red-500/30",
                    userButtonPopup:
                      "bg-zinc-900 border-2 border-red-500/30 shadow-2xl shadow-red-500/20",
                    userButtonTrigger:
                      "outline-red-500 hover:scale-110 transition-transform duration-300",
                  },
                }}
              >
                <UserButton.MenuItems>
                  <UserButton.Action
                    label="My Bookings"
                    labelIcon={<TicketPlus width={16} />}
                    onClick={() => navigate("/my-bookings")}
                  />
                </UserButton.MenuItems>
              </UserButton>
            </div>
          )}
        </div>

        {/* Mobile Menu Icon */}
        <button
          className="max-md:ml-3 md:hidden p-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-red-600/20 hover:border-red-500/30 transition-all duration-300 group"
          onClick={() => setIsOpen(!isOpen)}
        >
          <MenuIcon className="w-6 h-6 text-white/80 group-hover:text-red-400 transition-colors duration-300" />
        </button>
      </div>
    </div>
  );
};

export default Navbar;
