import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendEmail(to: string, subject: string, text: string) {
  if (!process.env.SMTP_USER) {
    throw new Error("SMTP_USER is not defined in environment variables.");
  }
  await transporter.sendMail({
    from: `"Aplikasi Test Backend Knitto" <${process.env.SMTP_USER}>`,
    to,
    subject,
    text,
  });
}
