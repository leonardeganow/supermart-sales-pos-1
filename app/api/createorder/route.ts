import connectToDatabase from "@/app/libs/mongodb";
import { getCurrentUser } from "@/app/libs/session";
import OrderModel from "@/app/models/Order";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import ProductModel from "@/app/models/Products";
import UserModel from "@/app/models/User";

export async function POST(request: any) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const data = await request.json();
    const user = await getCurrentUser();

    const supermarketId = user.supermarketId;

    await connectToDatabase();

    const superMarket = await UserModel.findById(user.id).populate(
      "supermarketId"
    );

    if (!superMarket || !superMarket.supermarketId) {
      await session.abortTransaction();
      session.endSession();
      return NextResponse.json({
        message: "Supermarket not found",
        status: false,
      });
    }

    // Check stock and reduce quantity
    for (const item of data.cart) {
      const product = await ProductModel.findById(item.productId).session(
        session
      );

      if (!product) {
        await session.abortTransaction();
        session.endSession();
        return NextResponse.json({
          message: `Product with ID ${item.productId} not found`,
          status: false,
        });
      }

      if (product.quantity < item.quantity) {
        await session.abortTransaction();
        session.endSession();
        return NextResponse.json({
          message: `Not enough stock for product ${product.name}`,
          status: false,
        });
      }

      product.quantity -= item.quantity;
      if (product.quantity === 0) {
        product.inStock = false;
      }
      await product.save({ session });
    }

    const orderData: any = {
      customerName: data.customerName,
      paymentMethod: data.paymentMethod,
      supermarketId: supermarketId,
      taxAmount: data.taxAmount,
      totalDiscount: data.totalDiscount,
      finalTotal: data.finalTotal,
      cashierId: user.id,
      cart: data.cart,
      orderStatus: "success",
    };

    if (data.paymentMethod !== "cash") {
      orderData.paymentId = data.paymentId;
    }

    const newOrder = new OrderModel(orderData);
    await newOrder.save({ session });

    await session.commitTransaction();
    session.endSession();

    return NextResponse.json({
      message: "Order created successfully",
      status: true,
      order: newOrder,
      supermarketName: superMarket.supermarketId.name,
      supermarketLocation: superMarket.supermarketId.location,
      supermarketNumber: superMarket.supermarketId.phone,
      cashierName: superMarket.name,
    });
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
