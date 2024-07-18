import connectToDatabase from "@/app/libs/mongodb";
import UserModel from "@/app/models/User";
import { NextResponse } from "next/server";
import { checkAdminRole } from "@/app/middlewares/authMiddleware";
import { getCurrentUser } from "@/app/libs/session";
import ProductModel from "@/app/models/Products";

export const dynamic = "force-dynamic";
export async function GET() {
  try {
    const currentUser = await getCurrentUser();

    // console.log(currentUser);

    // Check if the requester is an admin
    const middlewareResponse = await checkAdminRole({ body: currentUser });
    if (middlewareResponse) return middlewareResponse;

    await connectToDatabase();

    // Fetch users created by the admin
    const products = await ProductModel.find({
      supermarketId: currentUser.supermarketId,
    });

    return NextResponse.json(
      {
        message: "Users fetched successfully",
        products,
        status: true,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      {
        message: "Internal Server Error",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
