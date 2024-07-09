import uploadToCloudinary from "@/app/libs/cloudinary";
import connectToDatabase from "@/app/libs/mongodb";
import { getCurrentUser } from "@/app/libs/session";
import { checkAdminRole } from "@/app/middlewares/authMiddleware";
import ProductModel from "@/app/models/Products";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const data = await request.json();

    const currentUser = await getCurrentUser();

    const imageUrl = await uploadToCloudinary(data.imageBase64);

    await connectToDatabase();

    if (currentUser) {
      const middlewareResponse = await checkAdminRole({ body: currentUser });
      if (middlewareResponse) return middlewareResponse;
    }

    const newProduct = new ProductModel({
      name: data.name,
      quantity: data.quantity,
      inStock: true,
      category: data.category,
      image: imageUrl,
      barcode: data.barcode,
      createdBy: currentUser.id,
      basePrice: parseInt(data.basePrice),
      sellingPrice: parseInt(data.sellingPrice),
    });

    await newProduct.save();

    return NextResponse.json(
      {
        message: "product created successfuly",
        status: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error adding  product:", error);
    return NextResponse.json(error.message, { status: 500 });
  }
}
