import connectToDatabase from "@/app/libs/mongodb";
import { getCurrentUser } from "@/app/libs/session";
import { checkAdminRole } from "@/app/middlewares/authMiddleware";
import UserModel from "@/app/models/User";
import { NextResponse } from "next/server";

export async function DELETE(request: Request) {
  try {
    const data = await request.json();

    const currentUser = await getCurrentUser();
    if (currentUser) {
      const middlewareResponse = await checkAdminRole({ body: currentUser });
      if (middlewareResponse) return middlewareResponse;
    }

    await connectToDatabase();

    // Find and delete the user
    const userToDelete = await UserModel.findById(data.userId);
    if (!userToDelete) {
      return NextResponse.json(
        {
          message: "User not found",
          status: false,
        },
        { status: 404 }
      );
    }

    await UserModel.findByIdAndDelete(data.userId);

    return NextResponse.json(
      {
        message: "User deleted successfully",
        status: true,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      {
        message: "Internal Server Error",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
