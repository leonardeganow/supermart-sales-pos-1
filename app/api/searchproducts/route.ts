import connectToDatabase from "@/app/libs/mongodb";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/app/libs/session";
import ProductModel from "@/app/models/Products";

export const dynamic = "force-dynamic";
export async function POST(request: Request) {
  try {
    const { keyword } = await request.json();

    await connectToDatabase();
    // console.log(keyword);
    if (!keyword) {
      return NextResponse.json({
        message: "search for a product",
        status: false,
      });
    }

    // Search for products by keyword
    if (keyword !== "All Products") {
      const products = await ProductModel.find({
        $or: [
          { name: { $regex: keyword, $options: "i" } },
          { category: { $regex: keyword, $options: "i" } },
          { barcode: { $regex: keyword, $options: "i" } },
        ],
      });
      return NextResponse.json(
        {
          message: "Products fetched successfully",
          products,
          status: true,
        },
        { status: 200 }
      );
    }

    if (keyword === "All Products") {
      const products = await ProductModel.find();
      return NextResponse.json({
        message: "all products",
        products,
        status: true,
      });
    }
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
