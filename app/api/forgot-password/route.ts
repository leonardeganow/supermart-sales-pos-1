import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import { transporter } from "@/app/libs/nodemailer";
import { log } from "node:console";
import UserModel from "@/app/models/User";

const secret = process.env.JWT_SECRET;
const appBaseUrl = process.env.APP_BASE_URL;

export const dynamic = "force-dynamic";

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

        // Find user by email
        const user = await UserModel.findOne({ email });
        if (!user) {
            return new Response(
                JSON.stringify({ message: "User not found", status: false }),
                { status: 404 }
            );
        }

        // Generate reset token
        const resetToken = jwt.sign({ email }, secret!, { expiresIn: "300s" });
        const resetLink = `${appBaseUrl}/resetpassword?token=${resetToken}`;
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Password Reset",
            html: `<p>You requested a password reset. Click the link below to reset your password:</p>
             <a href="${resetLink}">Reset Password</a>`,
        });

        return new Response(
            JSON.stringify({ message: "Reset email sent", status: true }),
            { status: 200 }
        );
    } catch (error) {
        console.error("Error sending email:", error);
        return new Response(
            JSON.stringify({ error: "Failed to send reset email", status: false }),
            { status: 500 }
        );
    }
}
