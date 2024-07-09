import connectToDatabase from "@/app/libs/mongodb";
import { getCurrentUser } from "@/app/libs/session";
import { checkAdminRole } from "@/app/middlewares/authMiddleware";
import { NextResponse } from "next/server";
import ProductModel from "@/app/models/Products";

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
    const productToDelete = await ProductModel.findById(data.productId);
    if (!productToDelete) {
      return NextResponse.json(
        {
          message: "Product not found",
          status: false,
        },
        { status: 404 }
      );
    }

    await ProductModel.findByIdAndDelete(data.productId);

    return NextResponse.json(
      {
        message: "User deleted successfully",
        status: true,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      {
        message: "Internal Server Error",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
