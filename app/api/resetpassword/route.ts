import nodemailer from "nodemailer";
import bcrypt from "bcrypt";
import UserModel from "@/app/models/User";
import { transporter } from "@/app/libs/nodemailer";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password } = body;

        if (!email || !password) {
            return new Response(
                JSON.stringify({ error: "Email and password are required" }),
                { status: 400 }
            );
        }

        const user = await UserModel.findOne({ email: email })

        if (!user) {
            return { message: "User not found", status: false };
        }

        //hash the new password
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;

        await user.save();



        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Password Reset Successfull",
            html: `<p>You have successfully reset your password</p>
                `,
        });

        return new Response(
            JSON.stringify({ message: "Password changed successfully" }),
            { status: 200 }
        );
    } catch (error) {
        console.error("Error resetting password:", error);
        return new Response(
            JSON.stringify({ error: "Failed to reset passwor" }),
            { status: 500 }
        );
    }
}
