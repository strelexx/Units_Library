import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

export async function sendWelcomeEmail(
  to: string,
  name: string,
  password: string
) {
  await transporter.sendMail({
    from: `"Units Library" <${process.env.SMTP_FROM}>`,
    to,
    subject: "Your Units Library Account",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Welcome to Units Library</h2>
        <p>Hello ${name},</p>
        <p>Your account has been created. Here are your login credentials:</p>
        <div style="background: #f5f5f5; padding: 16px; border-radius: 8px; margin: 16px 0;">
          <p style="margin: 4px 0;"><strong>Email:</strong> ${to}</p>
          <p style="margin: 4px 0;"><strong>Password:</strong> ${password}</p>
        </div>
        <p>Please change your password after your first login.</p>
        <p>Best regards,<br/>Units Library Team</p>
      </div>
    `,
  });
}
