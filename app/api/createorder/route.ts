import connectToDatabase from "@/app/libs/mongodb";
import { getCurrentUser } from "@/app/libs/session";
import OrderModel from "@/app/models/Order";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import ProductModel from "@/app/models/Products";

export async function POST(request: any) {
  //this creates a transaction for the database connection
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const data = await request.json();
    const user = await getCurrentUser();

    await connectToDatabase();

    // Check stock and reduce quantity
    for (const item of data.cart) {
      const product = await ProductModel.findById(item.productId).session(
        session
      );

      //if product is not found end session and send cannot be found response
      if (!product) {
        await session.abortTransaction();
        session.endSession();
        return NextResponse.json({
          message: `Product with ID ${item.productId} not found`,
          status: false,
        });
      }

      //if quantity is less than the required amount end session and send insufficient stock response
      if (product.quantity < item.quantity) {
        await session.abortTransaction();
        session.endSession();
        return NextResponse.json({
          message: `Not enough stock for product ${product.name}`,
          status: false,
        });
      }

      //reduce quantity by the required amount and save product
      product.quantity -= item.quantity;
      //if product quantity is 0 change instock boolean to false
      if (product.quantity === 0) {
        product.inStock = false;
      }
      await product.save({ session });
    }

    const orderData: any = {
      customerName: data.customerName,
      paymentMethod: data.paymentMethod,
      taxAmount: data.taxAmount,
      totalDiscount: data.totalDiscount,
      finalTotal: data.finalTotal,
      cashierId: user.id,
      cart: data.cart,
      orderStatus: "success",
    };

    // Only add paymentId if the payment method is not "cash"
    if (data.paymentMethod !== "cash") {
      orderData.paymentId = data.paymentId;
    }

    const newOrder = new OrderModel(orderData);
    await newOrder.save({ session });

    //commit the transaction and end session
    await session.commitTransaction();
    session.endSession();

    return NextResponse.json(
      {
        message: "Order created successfully",
        status: true,
      },
      { status: 200 }
    );
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();
    console.error("Error creating order:", error);
    return NextResponse.json(
      {
        message: error.message,
        status: false,
      },
      { status: 500 }
    );
  }
}
