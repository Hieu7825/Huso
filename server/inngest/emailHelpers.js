// server/inngest/emailHelpers.js
import sendEmail, { emailService } from "../configs/nodeMailer.js";

/**
 * Email template cho booking confirmation
 */
export const sendBookingConfirmation = async ({ booking }) => {
  const body = `
    <h2>Hi ${booking.user.name},</h2>
    <p>Your booking for <strong style="color: #F84565;">"${
      booking.show.movie.title
    }"</strong> is confirmed! 🎉</p>
    
    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <p style="margin: 5px 0;"><strong>🎬 Movie:</strong> ${
        booking.show.movie.title
      }</p>
      <p style="margin: 5px 0;"><strong>📅 Date:</strong> ${new Date(
        booking.show.showDateTime
      ).toLocaleDateString("en-US", { timeZone: "Asia/Kolkata" })}</p>
      <p style="margin: 5px 0;"><strong>🕐 Time:</strong> ${new Date(
        booking.show.showDateTime
      ).toLocaleTimeString("en-US", { timeZone: "Asia/Kolkata" })}</p>
      <p style="margin: 5px 0;"><strong>💺 Seats:</strong> ${booking.bookedSeats.join(
        ", "
      )}</p>
      <p style="margin: 5px 0;"><strong>💰 Total:</strong> $${
        booking.totalAmount || 0
      }</p>
    </div>
    
    <p style="font-size: 18px;">Enjoy the show! 🍿</p>
    <p>Thanks for booking with us!</p>
  `;

  return await sendEmail({
    to: booking.user.email,
    subject: `Payment Confirmation: "${booking.show.movie.title}" booked!`,
    body,
  });
};

/**
 * Email template cho show reminder
 */
export const sendShowReminder = async ({ user, movie, showTime }) => {
  const body = `
    <h2>Hello ${user.name},</h2>
    <p>This is a quick reminder that your movie is starting soon! ⏰</p>
    
    <div style="background-color: #fff3cd; padding: 20px; border-left: 4px solid #F84565; margin: 20px 0;">
      <h3 style="margin: 0 0 10px 0; color: #F84565;">"${movie.title}"</h3>
      <p style="margin: 5px 0;">
        <strong>📅 Date:</strong> ${new Date(showTime).toLocaleDateString(
          "en-US",
          { timeZone: "Asia/Kolkata" }
        )}
      </p>
      <p style="margin: 5px 0;">
        <strong>🕐 Time:</strong> ${new Date(showTime).toLocaleTimeString(
          "en-US",
          { timeZone: "Asia/Kolkata" }
        )}
      </p>
    </div>
    
    <p style="font-size: 16px; color: #856404; background-color: #fff3cd; padding: 15px; border-radius: 8px;">
      ⚠️ <strong>Starting in approximately 8 hours</strong> - make sure you're ready!
    </p>
    
    <p>See you at the cinema! 🎬</p>
  `;

  return await sendEmail({
    to: user.email,
    subject: `Reminder: Your movie "${movie.title}" starts soon!`,
    body,
  });
};

/**
 * Email template cho new show notification
 */
export const sendNewShowNotification = async ({
  user,
  movieTitle,
  movieDescription = "",
}) => {
  const body = `
    <h2>Hi ${user.name},</h2>
    <p>We've just added an exciting new show to our library! 🎉</p>
    
    <div style="background-color: #f8f9fa; padding: 25px; border-radius: 8px; margin: 20px 0; text-align: center;">
      <h3 style="color: #F84565; font-size: 24px; margin: 0 0 10px 0;">"${movieTitle}"</h3>
      ${
        movieDescription
          ? `<p style="color: #6c757d; margin: 10px 0;">${movieDescription}</p>`
          : ""
      }
    </div>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${process.env.WEBSITE_URL || "https://huso.com"}" 
         style="background-color: #F84565; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
        Book Now 🎟️
      </a>
    </div>
    
    <p style="color: #6c757d; font-size: 14px;">Don't miss out - book your tickets today!</p>
  `;

  return await sendEmail({
    to: user.email,
    subject: `🎬 New Show Added: ${movieTitle}`,
    body,
  });
};

/**
 * Gửi bulk notifications cho tất cả users
 */
export const sendBulkNewShowNotifications = async ({
  users,
  movieTitle,
  movieDescription,
}) => {
  const emails = users.map((user) => ({
    to: user.email,
    subject: `🎬 New Show Added: ${movieTitle}`,
    body: `
      <h2>Hi ${user.name},</h2>
      <p>We've just added an exciting new show to our library! 🎉</p>
      
      <div style="background-color: #f8f9fa; padding: 25px; border-radius: 8px; margin: 20px 0; text-align: center;">
        <h3 style="color: #F84565; font-size: 24px; margin: 0 0 10px 0;">"${movieTitle}"</h3>
        ${
          movieDescription
            ? `<p style="color: #6c757d; margin: 10px 0;">${movieDescription}</p>`
            : ""
        }
      </div>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${process.env.WEBSITE_URL || "https://huso.com"}" 
           style="background-color: #F84565; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
          Book Now 🎟️
        </a>
      </div>
      
      <p style="color: #6c757d; font-size: 14px;">Don't miss out - book your tickets today!</p>
    `,
  }));

  return await emailService.sendBulkEmails(emails, {
    delayBetween: 200, // 200ms giữa mỗi email
  });
};

/**
 * Email template cho booking cancellation
 */
export const sendBookingCancellation = async ({
  user,
  movieTitle,
  reason = "payment not completed",
}) => {
  const body = `
    <h2>Hi ${user.name},</h2>
    <p>We're sorry, but your booking for <strong style="color: #F84565;">"${movieTitle}"</strong> has been cancelled.</p>
    
    <div style="background-color: #f8d7da; padding: 20px; border-left: 4px solid #dc3545; margin: 20px 0;">
      <p style="margin: 0; color: #721c24;">
        <strong>Reason:</strong> ${reason}
      </p>
    </div>
    
    <p>Your seats have been released and are now available for other customers.</p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${process.env.WEBSITE_URL || "https://huso.com"}" 
         style="background-color: #F84565; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
        Book Again 🎟️
      </a>
    </div>
    
    <p style="color: #6c757d; font-size: 14px;">If you have any questions, please contact our support team.</p>
  `;

  return await sendEmail({
    to: user.email,
    subject: `Booking Cancelled: "${movieTitle}"`,
    body,
  });
};
