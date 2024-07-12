import uploadToCloudinary from "@/app/libs/cloudinary";
import connectToDatabase from "@/app/libs/mongodb";
import { getCurrentUser } from "@/app/libs/session";
import { checkAdminRole } from "@/app/middlewares/authMiddleware";
import ProductModel from "@/app/models/Products";
import { NextResponse } from "next/server";

export async function PUT(request: Request) {
  try {
    const data = await request.json();

    const currentUser = await getCurrentUser();
    if (currentUser) {
      const middlewareResponse = await checkAdminRole({ body: currentUser });
      if (middlewareResponse) return middlewareResponse;
    }

    await connectToDatabase();
    const product = await ProductModel.findOne({ _id: data.productId });

    if (!product) {
      return NextResponse.json({ message: "Product not found" });
    }

    // Update image if it's not an existing URL
    if (!data.image.includes("https") && data.imageBase64) {
      const imageUrl = await uploadToCloudinary(data.imageBase64);
      product.image = imageUrl;
    }

    // Update other product fields
    if (data.name) product.name = data.name;
    //update instock boolean if product quantity is greater than 0
    if (data.quantity !== undefined) {
      product.quantity = data.quantity;
      product.inStock = data.quantity > 0;
    }
    if (data.category) product.category = data.category;
    if (data.currency) product.currency = data.currency;
    if (data.basePrice) product.basePrice = data.basePrice;
    if (data.sellingPrice) product.sellingPrice = data.sellingPrice;
    if (data.barcode) product.barcode = data.barcode;

    await product.save();

    return NextResponse.json(
      {
        message: "Product updated successfully",
        status: true,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      {
        message: "Internal Server Error",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
