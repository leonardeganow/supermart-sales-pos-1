import { NextResponse } from "next/server";

export async function checkAdminRole(req: any): Promise<NextResponse | null> {
  const { role } = req.body || req.query;

  try {
    if (role !== "admin") {
      return NextResponse.json({ message: "Access denied" });
    }

    return null; // Indicating success
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
