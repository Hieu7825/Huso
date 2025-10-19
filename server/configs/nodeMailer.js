// configs/nodemailer.js
import nodemailer from "nodemailer";

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      pool: true, // Sử dụng connection pool
      maxConnections: 5,
      maxMessages: 100,
    });

    // Verify transporter khi khởi tạo
    this.verifyConnection();
  }

  async verifyConnection() {
    try {
      await this.transporter.verify();
      console.log("✅ SMTP connection verified successfully");
    } catch (error) {
      console.error("❌ SMTP connection failed:", error.message);
    }
  }

  // Template wrapper để tạo HTML email đẹp hơn
  wrapEmailTemplate(body, title = "") {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: Arial, sans-serif;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="padding: 30px; background: linear-gradient(135deg, #F84565 0%, #FF6B88 100%); border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; text-align: center;">🎬 Huso Cinema</h1>
            </td>
          </tr>
          
          <!-- Body -->
          <tr>
            <td style="padding: 40px 30px;">
              ${body}
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 20px 30px; background-color: #f8f9fa; border-radius: 0 0 8px 8px; text-align: center;">
              <p style="margin: 0; color: #6c757d; font-size: 12px;">
                © ${new Date().getFullYear()} Huso Cinema. All rights reserved.
              </p>
              <p style="margin: 10px 0 0 0; color: #6c757d; font-size: 12px;">
                📧 Need help? <a href="mailto:support@huso.com" style="color: #F84565; text-decoration: none;">Contact Support</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim();
  }

  // Hàm retry với exponential backoff
  async sendWithRetry(mailOptions, maxRetries = 3) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const info = await this.transporter.sendMail(mailOptions);
        console.log(`✅ Email sent successfully to ${mailOptions.to}`);
        return {
          success: true,
          messageId: info.messageId,
          response: info.response,
        };
      } catch (error) {
        console.error(
          `❌ Attempt ${attempt}/${maxRetries} failed:`,
          error.message
        );

        if (attempt === maxRetries) {
          return {
            success: false,
            error: error.message,
            to: mailOptions.to,
          };
        }

        // Exponential backoff: 1s, 2s, 4s
        const delay = Math.pow(2, attempt - 1) * 1000;
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  // Validate email
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Main send function
  async sendEmail({ to, subject, body, attachments = [], useTemplate = true }) {
    // Validation
    if (!to || !subject || !body) {
      throw new Error("Missing required fields: to, subject, or body");
    }

    if (!this.isValidEmail(to)) {
      throw new Error(`Invalid email address: ${to}`);
    }

    const mailOptions = {
      from: `"Huso Cinema" <${process.env.SENDER_EMAIL}>`,
      to,
      subject,
      html: useTemplate ? this.wrapEmailTemplate(body, subject) : body,
      attachments,
    };

    return await this.sendWithRetry(mailOptions);
  }

  // Bulk email với rate limiting
  async sendBulkEmails(emails, { delayBetween = 100 } = {}) {
    const results = [];

    for (const emailData of emails) {
      const result = await this.sendEmail(emailData);
      results.push(result);

      // Delay giữa các email để tránh rate limit
      if (delayBetween > 0) {
        await new Promise((resolve) => setTimeout(resolve, delayBetween));
      }
    }

    const successful = results.filter((r) => r.success).length;
    const failed = results.length - successful;

    return {
      total: results.length,
      successful,
      failed,
      results,
    };
  }

  // Đóng kết nối
  close() {
    this.transporter.close();
  }
}

// Export singleton instance
const emailService = new EmailService();

// Export function tương thích với code cũ
const sendEmail = async ({
  to,
  subject,
  body,
  attachments,
  useTemplate = true,
}) => {
  return await emailService.sendEmail({
    to,
    subject,
    body,
    attachments,
    useTemplate,
  });
};

export default sendEmail;
export { emailService };
