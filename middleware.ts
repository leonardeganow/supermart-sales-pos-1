import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const secret = process.env.NEXTAUTH_SECRET;
  const token = await getToken({ req: request, secret });

  const adminPaths = [
    "/dashboard/products",
    "/dashboard/users",
    "/dashboard/suppliers",
  ];

  const isAuthenticated = !!token;
  const isAdminPage = adminPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  if (
    !isAuthenticated &&
    request.nextUrl.pathname !== "/login" &&
    request.nextUrl.pathname !== "/" && request.nextUrl.pathname !== "/forgot-password"

  ) {
    // Redirect unauthenticated users to the login page
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isAdminPage && token?.role === "cashier") {
    // Redirect non-admin users to an unauthorized page
    return NextResponse.redirect(
      new URL("/dashboard/unauthorized", request.url)
    );
  }

  // Allow the request to proceed
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
