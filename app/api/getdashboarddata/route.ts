import connectToDatabase from "@/app/libs/mongodb";
import { getCurrentUser } from "@/app/libs/session";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const user = await getCurrentUser();

    await connectToDatabase();

    return NextResponse.json(
      {
        message: "success",
        status: true,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching data:", error);
    return NextResponse.json(error.message, { status: 500 });
  }
}
