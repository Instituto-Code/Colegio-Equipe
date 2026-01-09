import { Resend } from 'resend';
import dotenv from 'dotenv';
dotenv.config();

const resend = new Resend(process.env.RESEND_KEY);

export async function SendMail(to: string, subject: string, html: string) {
  resend.emails.send({
    from: 'onboarding@resend.dev',
    to: to,
    subject: subject,
    html: html,
  });
}
