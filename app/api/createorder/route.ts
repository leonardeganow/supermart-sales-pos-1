import connectToDatabase from "@/app/libs/mongodb";
import { getCurrentUser } from "@/app/libs/session";
import OrderModel from "@/app/models/Order";
import { NextResponse } from "next/server";

export async function POST(request: any) {
  try {
    const data = await request.json();

    const user = await getCurrentUser();

    await connectToDatabase();

    const newOrder = new OrderModel({
      customerName: data.customerName,
      paymentMethod: data.paymentMethod,
      taxAmount: data.taxAmount,
      totalDiscount: data.totalDiscount,
      finalTotal: data.finalTotal,
      cashierId: user.id,
      cart: data.cart,
      orderStatus: "success",
    });

    console.log(newOrder);
    

    await newOrder.save();

    return NextResponse.json(
      {
        message: "order created successfuly",
        status: true,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error creating order:", error);
    return NextResponse.json(error.message, { status: 500 });
  }
}
