//@ts-nocheck
import { getServerSession } from "next-auth/next";
import authOptions from "./auth";

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  const user:ManagerSignup = session?.user
  return user;
}
