import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { ObjectId } from "mongodb";
import connectToDatabase from "@/app/libs/mongodb";
import UserModel from "@/app/models/User";

interface Login {
  email: string;
  password: string;
}

interface ManagerSignup {
  _id: ObjectId;
  email: string;
  name: string;
  username: string;
  phone: string;
  password: string;
  role: string;
  supermarketId: string;
}

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) {
          throw new Error("Credentials are required");
        }

        const { email, password } = credentials as Login;

        await connectToDatabase();

        const user: ManagerSignup | null = await UserModel.findOne({
          email,
        }).lean();
        if (!user) {
          throw new Error("No user found with the provided username.");
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
          throw new Error("Incorrect password.");
        }

        const { _id, username, phone, name, role, supermarketId } = user;

        return {
          id: _id.toString(),
          email,
          name,
          username,
          phone,
          role,
          supermarketId: supermarketId.toString(),
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.username = user.username;
        token.phone = user.phone;
        token.role = user.role;
        token.supermarketId = user.supermarketId;
      } else {
        await connectToDatabase();
        const dbUser: any = await UserModel.findById(
          new ObjectId(token.id)
        ).lean();
        if (dbUser) {
          token.id = dbUser._id.toString();
          token.email = dbUser.email;
          token.name = dbUser.name;
          token.phone = dbUser.phone;
          token.username = dbUser.username;
          token.role = dbUser.role;
          token.supermarketId = dbUser.supermarketId.toString();
        }
      }
      return token;
    },
    async session({ session, token }: any) {
      session.user.id = token.id;
      session.user.name = token.name;
      session.user.username = token.username;
      session.user.phone = token.phone;
      session.user.role = token.role;
      session.user.supermarketId = token.supermarketId;
      return session;
    },
  },
};

export default authOptions;
