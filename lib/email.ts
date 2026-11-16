import "server-only";
import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

type Mail = { to: string; subject: string; text: string; html: string };

// Returns true when the message was handed to Resend (or logged in dev),
// false when Resend rejected it. Auth callers can keep ignoring the result.
export async function sendEmail({
  html,
  subject,
  text,
  to,
}: Mail): Promise<boolean> {
  if (!resend) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("RESEND_API_KEY missing");
    } else {
      console.log(`\n[DEV EMAIL] to: ${to}\n${subject}\n${text}\n`);
      return true;
    }
  }

  const { error } = await resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to,
    html,
    subject,
    text,
  });

  if (error) {
    console.error("sendEmail failed:", error);
    return false;
  }

  return true;
}
