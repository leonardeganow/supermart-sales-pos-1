import connectToDatabase from "@/app/libs/mongodb";
import { getCurrentUser } from "@/app/libs/session";
import { checkAdminRole } from "@/app/middlewares/authMiddleware";
import UserModel from "@/app/models/User";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function PUT(request: Request) {
  try {
    const data = await request.json();


    const currentUser = await getCurrentUser();
    if (currentUser) {
      const middlewareResponse = await checkAdminRole({ body: currentUser });
      if (middlewareResponse) return middlewareResponse;
    }

    await connectToDatabase();
    const user = await UserModel.findOne({ _id: data.userId });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Update the user details
    if (data.name) user.name = data.name;
    if (data.username) user.username = data.username;
    if (data.password) user.password = await bcrypt.hash(data.password, 10);
    if (data.role) user.role = data.role;
    if (data.phone) user.phone = data.phone;
    if (data.email) user.email = data.email;

    await user.save();

    return NextResponse.json(
      {
        message: "User updated successfully",
        status: true,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      {
        message: "Internal Server Error",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
