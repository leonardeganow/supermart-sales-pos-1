import bcrypt from "bcrypt";
import UserModel from "@/app/models/User";
import { transporter } from "@/app/libs/nodemailer";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password } = body;

        // Check if email and password are provided
        if (!email || !password) {
            return new Response(
                JSON.stringify({ error: "Email and password are required" }),
                { status: 400 }
            );
        }

        // Check for minimum password length
        if (password.length < 6) {
            return new Response(
                JSON.stringify({ error: "Password must be at least 6 characters long" }),
                { status: 400 }
            );
        }

        // Find user by email
        const user = await UserModel.findOne({ email });
        if (!user) {
            return new Response(
                JSON.stringify({ message: "User not found", status: false }),
                { status: 404 }
            );
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;

        // Save updated user details
        await user.save();

        // Send confirmation email
        try {
            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: email,
                subject: "Password Reset Successful",
                html: `
                    <p>Hi ${user.name || "User"},</p>
                    <p>You have successfully reset your password.</p>
                    <p>If you did not make this request, please contact us immediately.</p>
                `,
            });
        } catch (emailError) {
            console.error("Failed to send email:", emailError);
        }

        return new Response(
            JSON.stringify({ message: "Password changed successfully", status: true }),
            { status: 200 }
        );
    } catch (error) {
        console.error("Error resetting password:", error);
        return new Response(
            JSON.stringify({ error: "Failed to reset password", status: false }),
            { status: 500 }
        );
    }
}
