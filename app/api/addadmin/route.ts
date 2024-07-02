import connectToDatabase from "@/app/libs/mongodb";
import UserModel from "@/app/models/User";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function POST(request: any) {
  try {
    const data = await request.json();

    await connectToDatabase();

    const user = await UserModel.findOne({ email: data.email });

    if (user) {
      return NextResponse.json(
        {
          message: "user already exists",
          status: false,
        },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(data.password, 10); // Hash the password

    const newUser = new UserModel({
      name: data.name,
      username: data.username,
      password: hashedPassword,
      role: data.role,
      phone: data.phone,
      email: data.email,
      supermarketId: data.companyId,
    });

    newUser.save();

    return NextResponse.json(
      {
        message: "admin created successfuly",
        status: true,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error creating user:", error);
    return NextResponse.json(error.message, { status: 500 });
  }
}
