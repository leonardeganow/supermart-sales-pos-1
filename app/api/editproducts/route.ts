import uploadToCloudinary from "@/app/libs/cloudinary";
import connectToDatabase from "@/app/libs/mongodb";
import { getCurrentUser } from "@/app/libs/session";
import { checkAdminRole } from "@/app/middlewares/authMiddleware";
import ProductModel from "@/app/models/Products";
import { NextResponse } from "next/server";

export async function PUT(request: Request) {
  try {
    const data = await request.json();


    const imageUrl = await uploadToCloudinary(data.imageBase64);

    const currentUser = await getCurrentUser();
    if (currentUser) {
      const middlewareResponse = await checkAdminRole({ body: currentUser });
      if (middlewareResponse) return middlewareResponse;
    }

    await connectToDatabase();
    const product = await ProductModel.findOne({ _id: data.productId });

    if (!product) {
      return NextResponse.json(
        { message: "product not found" },
        { status: 404 }
      );
    }

    if (data.image.includes("https")) {
      // Update the user details
      if (data.name) product.name = data.name;
      if (data.quantity) product.quantity = data.quantity;
      if (data.category) product.category = product.category;
      if (data.currency) product.currency = data.currency;
      if (data.basePrice) product.basePrice = data.basePrice;
      if (data.sellingPrice) product.sellingPrice = data.sellingPrice;
      if (data.barcode) product.barcode = data.barcode;
    } else {
      // Update the user details
      if (data.name) product.name = data.name;
      if (data.quantity) product.quantity = data.quantity;
      if (data.category) product.category = product.category;
      if (data.currency) product.currency = product.currency;
      if (data.basePrice) product.basePrice = data.basePrice;
      if (data.sellingPrice) product.sellingPrice = data.sellingPrice;
      if (data.barcode) product.barcode = data.barcode;
      if (data.image) product.image = imageUrl;
    }

    await product.save();

    return NextResponse.json(
      {
        message: "product updated successfully",
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
