import React from "react";
import {
  LayoutDashboardIcon,
  PlusSquareIcon,
  ListIcon,
  ListCollapseIcon,
  Sparkles,
  LogOut,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { assets } from "../../assets/assets";
import { useUser, useClerk } from "@clerk/clerk-react";

const AdminSideBar = () => {
  const { user } = useUser();
  const { signOut } = useClerk();

  // Fallback user data if not logged in
  const userData = {
    firstName: user?.firstName || "Admin",
    lastName: user?.lastName || "User",
    imageUrl: user?.imageUrl || assets.profile,
  };

  const adminNavLinks = [
    { name: "Dashboard", path: "/admin", icon: LayoutDashboardIcon },
    { name: "Add Shows", path: "/admin/add-shows", icon: PlusSquareIcon },
    { name: "List Shows", path: "/admin/list-shows", icon: ListIcon },
    {
      name: "List Bookings",
      path: "/admin/list-bookings",
      icon: ListCollapseIcon,
    },
  ];

  const handleLogout = () => {
    signOut(() => {
      window.location.href = "/";
    });
  };

  return (
    <div className="h-[calc(100vh-64px)] md:flex flex-col items-center pt-8 max-w-13 md:max-w-60 w-full border-r border-red-600/20 text-sm relative overflow-hidden">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="w-full h-full bg-[linear-gradient(to_right,#0f0f10_1px,transparent_1px),linear-gradient(to_bottom,#0f0f10_1px,transparent_1px)] bg-[size:1rem_1rem]" />
      </div>

      {/* Profile Section with Enhanced Styling */}
      <div className="relative z-10 flex flex-col items-center mb-6">
        {/* Avatar Container with Glow */}
        <div className="relative group cursor-pointer">
          {/* Outer Glow Effect */}
          <div className="absolute inset-0 bg-red-600/40 rounded-full blur-xl group-hover:bg-red-600/60 transition-all duration-300 animate-pulse" />

          {/* Rotating Ring Effect */}
          <div className="absolute -inset-0.5 bg-gradient-to-br from-red-600 to-red-800 rounded-full opacity-75 animate-spin [animation-duration:3s]" />

          {/* Avatar Image */}
          <img
            className="h-9 md:h-14 w-9 md:w-14 rounded-full mx-auto relative z-10 border-2 border-red-600 shadow-[0_0_15px_rgba(220,38,38,0.6)] group-hover:scale-105 transition-all duration-300 object-cover"
            src={userData.imageUrl}
            alt={`${userData.firstName} ${userData.lastName}`}
          />

          {/* Sparkle Icon */}
          <Sparkles className="w-4 h-4 text-red-500 absolute -top-0.5 -right-0.5 animate-pulse drop-shadow-[0_0_6px_rgba(220,38,38,0.8)]" />
        </div>

        {/* User Name */}
        <p className="mt-3 text-sm md:text-base max-md:hidden font-bold text-white drop-shadow-[0_2px_6px_rgba(220,38,38,0.4)]">
          {userData.firstName} {userData.lastName}
        </p>

        {/* User Email (optional) */}
        {user?.primaryEmailAddress && (
          <p className="text-xs text-gray-400 max-md:hidden mt-0.5">
            {user.primaryEmailAddress.emailAddress}
          </p>
        )}

        {/* Decorative Line */}
        <div className="hidden md:block w-16 h-0.5 bg-gradient-to-r from-transparent via-red-600 to-transparent mt-2 rounded-full shadow-[0_0_8px_rgba(220,38,38,0.5)]" />
      </div>

      {/* Navigation Links */}
      <div className="w-full relative z-10 flex-1">
        {adminNavLinks.map((link, index) => (
          <NavLink
            key={index}
            to={link.path}
            end
            className={({ isActive }) =>
              `relative flex items-center max-md:justify-center gap-3 w-full py-3.5 md:pl-10 transition-all duration-300 group ${
                index === 0 ? "mt-6" : "mt-1"
              } ${
                isActive
                  ? "bg-gradient-to-r from-red-600/25 via-red-600/15 to-transparent text-white border-l-4 border-red-600 shadow-[inset_0_0_20px_rgba(220,38,38,0.2)]"
                  : "text-gray-400 hover:text-gray-200 hover:bg-white/5 hover:border-l-2 hover:border-red-600/50"
              }`
            }
          >
            {({ isActive }) => (
              <>
                {/* Animated Background Glow for Active State */}
                {isActive && (
                  <>
                    <span className="absolute inset-0 bg-gradient-to-r from-red-600/20 via-red-600/10 to-transparent animate-pulse pointer-events-none" />
                    <span className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-transparent via-red-600 to-transparent animate-pulse" />
                  </>
                )}

                {/* Icon with Enhanced Effects */}
                <div className="relative">
                  <link.icon
                    className={`w-5 h-5 transition-all duration-300 relative z-10 ${
                      isActive
                        ? "text-red-500 scale-125 drop-shadow-[0_0_8px_rgba(220,38,38,0.8)]"
                        : "group-hover:scale-110 group-hover:text-red-500/70"
                    }`}
                  />
                  {/* Icon Glow Effect */}
                  {isActive && (
                    <span className="absolute inset-0 bg-red-600/30 blur-md rounded-full animate-pulse" />
                  )}
                </div>

                {/* Text Label */}
                <p
                  className={`max-md:hidden font-semibold transition-all duration-300 ${
                    isActive
                      ? "text-white drop-shadow-[0_2px_8px_rgba(220,38,38,0.5)]"
                      : "font-medium"
                  }`}
                >
                  {link.name}
                </p>

                {/* Enhanced Active Indicator Bar */}
                <span
                  className={`h-12 rounded-l right-0 absolute transition-all duration-300 ${
                    isActive
                      ? "w-2 bg-gradient-to-b from-red-600 via-red-600 to-red-600/50 shadow-[0_0_15px_rgba(220,38,38,0.8),-2px_0_10px_rgba(220,38,38,0.4)]"
                      : "w-0 bg-transparent group-hover:w-1 group-hover:bg-red-600/40"
                  }`}
                />

                {/* Shimmer Effect on Active */}
                {isActive && (
                  <span className="absolute inset-0 overflow-hidden pointer-events-none">
                    <span className="absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-transparent via-white/10 to-transparent animate-[shimmer_2s_infinite]" />
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>

      {/* Logout Button */}
      <div className="w-full relative z-10 pb-6 px-2 md:px-4">
        <button
          onClick={handleLogout}
          className="relative flex items-center max-md:justify-center gap-3 w-full py-3.5 md:pl-6 transition-all duration-300 group text-gray-400 hover:text-white hover:bg-red-600/10 rounded-lg border border-transparent hover:border-red-600/30"
        >
          {/* Hover Background Effect */}
          <span className="absolute inset-0 bg-gradient-to-r from-red-600/5 via-red-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />

          {/* Icon with Enhanced Effects */}
          <div className="relative">
            <LogOut className="w-5 h-5 transition-all duration-300 relative z-10 group-hover:scale-110 group-hover:text-red-500" />
            {/* Icon Glow Effect on Hover */}
            <span className="absolute inset-0 bg-red-600/20 blur-md rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>

          {/* Text Label */}
          <p className="max-md:hidden font-semibold transition-all duration-300 group-hover:drop-shadow-[0_2px_8px_rgba(220,38,38,0.5)]">
            Logout
          </p>

          {/* Hover Indicator Bar */}
          <span className="h-12 rounded-l right-0 absolute transition-all duration-300 w-0 bg-transparent group-hover:w-1 group-hover:bg-red-600/60" />
        </button>
      </div>

      {/* Bottom Decorative Elements */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 hidden md:flex gap-1">
        <div className="w-2 h-2 bg-red-600/30 rounded-full animate-pulse" />
        <div
          className="w-2 h-2 bg-red-600/50 rounded-full animate-pulse"
          style={{ animationDelay: "0.2s" }}
        />
        <div
          className="w-2 h-2 bg-red-600 rounded-full animate-pulse"
          style={{ animationDelay: "0.4s" }}
        />
      </div>
    </div>
  );
};

export default AdminSideBar;
