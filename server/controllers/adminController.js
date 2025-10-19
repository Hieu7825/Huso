import { clerkClient } from "@clerk/express";
import Booking from "../models/Booking.js";
import Show from "../models/Show.js";
import User from "../models/User.js";

// API to check if user is admin
export const isAdmin = async (req, res) => {
  res.json({ success: true, isAdmin: true });
};

// API to get dashboard data
export const getDashboardData = async (req, res) => {
  try {
    const bookings = await Booking.find({ isPaid: true });
    const activeShows = await Show.find({
      showDateTime: { $gte: new Date() },
    }).populate("movie");
    const totalUser = await User.countDocuments();
    const dashboardData = {
      totalBookings: bookings.length,
      totalRevenue: bookings.reduce((acc, booking) => acc + booking.amount, 0),
      activeShows,
      totalUser,
    };

    res.json({ success: true, dashboardData });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// API to get all shows
export const getAllShows = async (req, res) => {
  try {
    const shows = await Show.find({ showDateTime: { $gte: new Date() } })
      .populate("movie")
      .sort({ showDateTime: 1 });
    res.json({ success: true, shows });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// API to get all bookings - ✅ ĐÃ CẬP NHẬT
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({})
      .populate({
        path: "show",
        populate: { path: "movie" },
      })
      .sort({ createdAt: -1 });

    // ⭐ Format lại để frontend dùng được (lấy userName và userEmail từ DB)
    const formattedBookings = bookings.map((booking) => ({
      ...booking.toObject(),
      user: {
        _id: booking.user,
        name: booking.userName || "N/A",
        email: booking.userEmail || "N/A",
      },
    }));

    res.json({ success: true, bookings: formattedBookings });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.json({ success: false, message: error.message });
  }
};

export const migrateOldBookings = async (req, res) => {
  try {
    // Tìm các booking chưa có userName
    const oldBookings = await Booking.find({
      $or: [
        { userName: { $exists: false } },
        { userName: null },
        { userName: "" },
      ],
    });

    console.log(`🔍 Found ${oldBookings.length} bookings to update`);

    if (oldBookings.length === 0) {
      return res.json({
        success: true,
        message:
          "No bookings need updating. All bookings already have userName.",
        total: 0,
        updated: 0,
        failed: 0,
      });
    }

    let updated = 0;
    let failed = 0;
    const errors = [];

    for (const booking of oldBookings) {
      try {
        // Lấy thông tin user từ Clerk
        const clerkUser = await clerkClient.users.getUser(booking.user);

        const fullName = `${clerkUser.firstName || ""} ${
          clerkUser.lastName || ""
        }`.trim();
        const userName =
          fullName ||
          clerkUser.username ||
          clerkUser.emailAddresses[0]?.emailAddress.split("@")[0] ||
          "User";

        // Cập nhật booking
        booking.userName = userName;
        booking.userEmail = clerkUser.emailAddresses[0]?.emailAddress || "";
        await booking.save();

        updated++;
        console.log(`✅ Updated booking ${booking._id} - User: ${userName}`);
      } catch (error) {
        failed++;
        const errorMsg = `Booking ${booking._id}: ${error.message}`;
        console.error(`❌ ${errorMsg}`);
        errors.push(errorMsg);

        // Nếu không lấy được từ Clerk, đặt giá trị mặc định
        booking.userName = `User ${booking.user.slice(-8)}`;
        booking.userEmail = "N/A";
        await booking.save();
      }
    }

    res.json({
      success: true,
      message: `Migration completed: ${updated} updated successfully, ${failed} failed`,
      total: oldBookings.length,
      updated,
      failed,
      errors: failed > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error("❌ Migration error:", error);
    res.json({ success: false, message: error.message });
  }
};
