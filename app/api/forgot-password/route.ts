import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import { transporter } from "@/app/libs/nodemailer";

const secret = process.env.JWT_SECRET;
const appBaseUrl = process.env.APP_BASE_URL;

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email } = body;

        if (!email) {
            return new Response(JSON.stringify({ error: "Email is required" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        // Generate reset token
        const resetToken = jwt.sign({ email }, secret!, { expiresIn: "300s" });


        const resetLink = `${appBaseUrl}/forgot-password?token=${resetToken}`;

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Password Reset",
            html: `<p>You requested a password reset. Click the link below to reset your password:</p>
             <a href="${resetLink}">Reset Password</a>`,
        });

        return new Response(
            JSON.stringify({ message: "Reset email sent" , status: true}),
            { status: 200 }
        );
    } catch (error) {
        console.error("Error sending email:", error);
        return new Response(
            JSON.stringify({ error: "Failed to send reset email" , status: false}),
            { status: 500 }
        );
    }
}
