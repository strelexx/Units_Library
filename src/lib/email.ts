import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";

const LOG_FILE = path.join(process.cwd(), "smtp.log");

function log(message: string) {
  const timestamp = new Date().toISOString();
  const line = `[${timestamp}] ${message}\n`;
  fs.appendFileSync(LOG_FILE, line);
}

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
  logger: false,
  debug: false,
});

export async function sendWelcomeEmail(
  to: string,
  name: string,
  password: string
) {
  log(`SEND START | to=${to} | subject="Your Units Library Account"`);

  try {
    const info = await transporter.sendMail({
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

    log(`SEND OK    | to=${to} | messageId=${info.messageId} | response="${info.response}"`);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    log(`SEND FAIL  | to=${to} | error="${message}"`);
    throw err;
  }
}
