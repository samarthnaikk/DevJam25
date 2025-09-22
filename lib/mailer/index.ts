import nodemailer from "nodemailer";

// Configure nodemailer with your email service provider
// For development/testing, you can use services like Mailtrap, Gmail, etc.
// For production, consider using dedicated services like SendGrid, Amazon SES, etc.

// Create a testing account on Ethereal for development
// This creates a temporary disposable email account for testing
const createTestAccount = async () => {
  const testAccount = await nodemailer.createTestAccount();
  return nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
};

// For production with Gmail
// Note: For Gmail, you might need to create an app-specific password
const createGmailTransport = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASSWORD,
    },
  });
};

// For SendGrid (if you prefer)
const createSendgridTransport = () => {
  return nodemailer.createTransport({
    service: "SendGrid",
    auth: {
      user: process.env.SENDGRID_USER,
      pass: process.env.SENDGRID_API_KEY,
    },
  });
};

// Create the appropriate transport based on environment
export const getMailTransport = async () => {
  // Check if FORCE_GMAIL is set in the environment
  const forceGmail = process.env.FORCE_GMAIL === "true";

  // Always use Gmail if FORCE_GMAIL is true and Gmail credentials are available
  if (
    forceGmail &&
    process.env.EMAIL_SERVICE === "gmail" &&
    process.env.GMAIL_USER &&
    process.env.GMAIL_PASSWORD
  ) {
    console.log("Using Gmail transport for sending email (forced)");
    return createGmailTransport();
  } else if (process.env.NODE_ENV === "production") {
    // Use your preferred production email service
    return process.env.EMAIL_SERVICE === "gmail"
      ? createGmailTransport()
      : createSendgridTransport();
  } else {
    // Use Ethereal for development/testing
    return await createTestAccount();
  }
};

// Send email with OTP
export const sendOtpEmail = async (
  to: string,
  otp: string,
  subject?: string
) => {
  const transport = await getMailTransport();

  const mailOptions = {
    from:
      process.env.EMAIL_FROM ||
      '"GPU Task Manager" <no-reply@gputaskmanager.com>',
    to,
    subject: subject || "Your Verification Code",
    text: `Your verification code is: ${otp}. This code will expire in 15 minutes.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4f46e5;">GPU Task Manager</h2>
        <p>Hello,</p>
        <p>Thank you for signing up! Please use the verification code below to complete your registration:</p>
        <div style="background-color: #f3f4f6; padding: 15px; text-align: center; margin: 20px 0;">
          <h1 style="font-size: 36px; letter-spacing: 5px; margin: 0; color: #4f46e5;">${otp}</h1>
        </div>
        <p>This code will expire in 15 minutes.</p>
        <p>If you didn't request this code, please ignore this email.</p>
        <p>Best regards,<br>The GPU Task Manager Team</p>
      </div>
    `,
  };

  // Send the email
  const info = await transport.sendMail(mailOptions);

  // For development, log the preview URL (for Ethereal emails)
  if (process.env.NODE_ENV !== "production") {
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  }

  return info;
};
