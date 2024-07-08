import connectToDatabase from "@/app/libs/mongodb";
import UserModel from "@/app/models/User";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { checkAdminRole } from "@/app/middlewares/authMiddleware";
import { getCurrentUser } from "@/app/libs/session";

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();

    const data = await request.json();

    // Check if the user creating the new user is an admin

    if (currentUser) {
      const middlewareResponse = await checkAdminRole({ body: currentUser });
      if (middlewareResponse) return middlewareResponse;
    }

    await connectToDatabase();

    const existingUser = await UserModel.findOne({ email: data.email });
    const existingUsername = await UserModel.findOne({
      username: data.username,
    });

    if (existingUser) {
      return NextResponse.json({
        message: "User already exists",
        status: false,
      });
    }
    if (existingUsername) {
      return NextResponse.json({
        message: "Username already exists",
        status: false,
      });
    }

    const hashedPassword = await bcrypt.hash(data.password, 10); // Hash the password

    const newUser = new UserModel({
      name: data.name,
      username: data.username,
      password: hashedPassword,
      role: data.role,
      phone: data.phone,
      email: data.email,
      supermarketId: data.companyId
        ? data.companyId
        : currentUser.supermarketId,
      createdBy:
        currentUser && currentUser.role === "admin"
          ? currentUser.id
          : undefined, // Reference to the admin who created this user if the role is not "admin"
    });

    await newUser.save();

    return NextResponse.json(
      {
        message: "User created successfully",
        status: true,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      {
        message: "Internal Server Error",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
