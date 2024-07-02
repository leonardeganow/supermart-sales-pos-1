import connectToDatabase from "@/app/libs/mongodb";
import SupermartModel from "@/app/models/Supermarket";
import { NextResponse } from "next/server";

export async function POST(request: any) {
  try {
    const data = await request.json();

    await connectToDatabase();

    const supermarket = await SupermartModel.findOne({ email: data.email });

    if (supermarket) {
      return NextResponse.json(
        {
          message: "supermarket already exists",
          status: false,
        },
        { status: 400 }
      );
    }

    const newSupermart = new SupermartModel({
      name: data.name,
      location: data.location,
      phone: data.phone,
      email: data.email,
    });

    const savedSupermart = await newSupermart.save();

    return NextResponse.json(
      {
        message: "supermart created successfuly",
        status: true,
        id: savedSupermart._id
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error creating supermart:", error);
    return NextResponse.json(error.message, { status: 500 });
  }
}
