// app/api/sendEmail/route.ts
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export const runtime = 'edge';
export async function POST(req: Request) {
  const { name, email, message } = await req.json();
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"${name}" <${email}>`,
      to: 'zvielkoren@gmail.com',
      subject: 'New Contact Form Submission',
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
      html: `<div style="font-family: Arial, sans-serif; color: #333;">
    <h2 style="color: #2e7d32;">New Contact Form Submission</h2>
    <p><strong style="color: #388e3c;">Name:</strong> ${name}</p>
    <p><strong style="color: #388e3c;">Email:</strong> ${email}</p>
    <p><strong style="color: #388e3c;">Message:</strong> ${message}</p>
    <hr style="border: 1px solid #4caf50;" />
    <p style="color: #4caf50;">Thank you for reaching out!</p>
  </div>`,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
