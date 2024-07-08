//@ts-nocheck
import { getServerSession } from "next-auth/next";
import authOptions from "./auth";

interface CurrentUser {
  name: string;
  email: string;
  image: string;
  id: string;
  username: string;
  role: string;
  supermarketId: string;
}
export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  const user: CurrentUser = session?.user;
  return user;
}
