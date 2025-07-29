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

// API to get all bookings - SỬA ĐỂ XỬ LÝ USER ID DẠNG STRING
export const getAllBookings = async (req, res) => {
  try {
    // Lấy bookings trước
    const rawBookings = await Booking.find({})
      .populate({
        path: "show",
        populate: { path: "movie" },
      })
      .sort({ createdAt: -1 });

    // Xử lý populate user thủ công vì user ID là string
    const bookingsWithUser = await Promise.all(
      rawBookings.map(async (booking) => {
        let userInfo = null;

        try {
          // Thử tìm user với string ID (cho Clerk users)
          userInfo = await User.findOne({
            $or: [
              { _id: booking.user }, // Thử ObjectId
              { clerkId: booking.user }, // Thử Clerk ID nếu bạn có field này
              { userId: booking.user }, // Hoặc field khác bạn dùng để lưu Clerk ID
            ],
          });

          // Nếu không tìm thấy, tạo object user giả với thông tin cơ bản
          if (!userInfo) {
            userInfo = {
              _id: booking.user,
              name: `User ${booking.user.slice(-8)}`, // Lấy 8 ký tự cuối làm tên
              email: null,
            };
          }
        } catch (error) {
          console.warn(`Cannot populate user ${booking.user}:`, error.message);
          userInfo = {
            _id: booking.user,
            name: `User ${booking.user.slice(-8)}`,
            email: null,
          };
        }

        return {
          ...booking.toObject(),
          user: userInfo,
        };
      })
    );

    res.json({ success: true, bookings: bookingsWithUser });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.json({ success: false, message: error.message });
  }
};
