// src/app/api/sendEmail/route.ts
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
    const { email, subject, message } = await req.json();

    const transporter = nodemailer.createTransport({
        // Configure your SMTP settings
        host: 'smtp.example.com',
        port: 587,
        auth: {
            user: 'zvielkoren@gmail.com',
            pass: 'mbms cnto tqht roff',
        },
    });

    const mailOptions = {
        from: email,
        to: 'zvielkoren@gmail.com',
        subject: subject,
        text: message,
    };

    try {
        await transporter.sendMail(mailOptions);
        return new Response('Email sent successfully', { status: 200 });
    } catch (error) {
        return new Response('Error sending email', { status: 500 });
    }
}
