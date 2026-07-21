import nodemailer from "nodemailer";

/**
 * SMTP email service with a graceful no-op fallback: if SMTP isn't
 * configured, emails are logged to the console instead of failing the
 * request that triggered them (registration, checkout, etc. still work).
 * This mirrors the standard pattern for small-business apps that may not
 * have SMTP set up on day one.
 */
let transporter: nodemailer.Transporter | null = null;
let warnedNoSmtp = false;

function getTransporter(): nodemailer.Transporter | null {
  if (transporter) return transporter;
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    if (!warnedNoSmtp) {
      console.warn(
        "[email] SMTP_USER/SMTP_PASS not set — emails will be logged to the console instead of sent. " +
          "See backend/.env.example for Gmail App Password setup."
      );
      warnedNoSmtp = true;
    }
    return null;
  }
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === "true",
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
  return transporter;
}

interface SendEmailInput {
  to: string;
  subject: string;
  html: string;
  text: string; // plain-text alternative — required for spam-filter friendliness
}

export async function sendEmail({ to, subject, html, text }: SendEmailInput): Promise<void> {
  const fromName = process.env.EMAIL_FROM_NAME || "GLOW 'N' GO Beauty & Cosmetics";
  const fromAddr = process.env.EMAIL_FROM_ADDR || process.env.SMTP_USER || "noreply@example.com";
  const t = getTransporter();

  if (!t) {
    console.log(`[email:console-fallback] To: ${to} | Subject: ${subject}\n${text}`);
    return;
  }

  try {
    await t.sendMail({
      from: `"${fromName}" <${fromAddr}>`,
      to,
      subject,
      text,
      html,
      // Anti-spam headers — a plain-text alternative, a real From domain,
      // and marking the message as transactional (not bulk marketing)
      // all reduce the chance of landing in spam.
      headers: {
        "List-Unsubscribe": `<mailto:${fromAddr}>`,
        Precedence: "transactional",
      },
    });
  } catch (err: any) {
    // Don't let an email provider outage break registration/checkout —
    // log it and let the caller continue.
    console.error(`[email] Failed to send to ${to}:`, err.message);
  }
}

export async function sendVerificationEmail(to: string, firstName: string, code: string): Promise<void> {
  await sendEmail({
    to,
    subject: "Verify your GLOW 'N' GO account",
    text: `Hi ${firstName},\n\nYour verification code is: ${code}\nIt expires in 15 minutes.\n\nIf you didn't create an account, ignore this email.`,
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:auto">
        <h2 style="color:#B76E79">GLOW 'N' GO Beauty &amp; Cosmetics</h2>
        <p>Hi ${firstName},</p>
        <p>Your verification code is:</p>
        <p style="font-size:28px;letter-spacing:6px;font-weight:700">${code}</p>
        <p style="color:#666">This code expires in 15 minutes. If you didn't create an account, you can ignore this email.</p>
      </div>`,
  });
}

export async function sendOrderFeedbackEmail(to: string, firstName: string, orderId: string): Promise<void> {
  const feedbackUrl = `${process.env.CORS_ORIGIN || "http://localhost:3000"}/feedback?order=${orderId}`;
  await sendEmail({
    to,
    subject: "How did we do? Tell us about your GLOW 'N' GO order",
    text: `Hi ${firstName},\n\nThanks for shopping with GLOW 'N' GO! We'd love your feedback on order ${orderId}: ${feedbackUrl}`,
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:auto">
        <h2 style="color:#B76E79">Thanks for shopping with us!</h2>
        <p>Hi ${firstName},</p>
        <p>We'd love a quick rating and any suggestions on order <strong>${orderId}</strong>.</p>
        <p><a href="${feedbackUrl}" style="background:#B76E79;color:#fff;padding:10px 20px;border-radius:24px;text-decoration:none">Leave feedback</a></p>
      </div>`,
  });
}
