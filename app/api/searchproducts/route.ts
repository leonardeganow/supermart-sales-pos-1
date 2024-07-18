import connectToDatabase from "@/app/libs/mongodb";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/app/libs/session";
import ProductModel from "@/app/models/Products";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const { keyword } = await request.json();

    await connectToDatabase();

    const user = await getCurrentUser();
    const supermarketId = user.supermarketId;

    if (!keyword) {
      return NextResponse.json({
        message: "Please provide a keyword to search for a product",
        status: false,
      });
    }

    // Search for products by keyword and supermarketId
    const queryConditions: any = { supermarketId };

    if (keyword !== "All Products") {
      queryConditions.$or = [
        { name: { $regex: keyword, $options: "i" } },
        { category: { $regex: keyword, $options: "i" } },
        { barcode: { $regex: keyword, $options: "i" } },
      ];
    }

    const products = await ProductModel.find(queryConditions);

    const message =
      keyword === "All Products"
        ? "All products fetched successfully"
        : "Products fetched successfully";

    return NextResponse.json(
      {
        message,
        products,
        status: true,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        message: "Internal Server Error",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
