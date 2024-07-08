import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  username: z.string().min(1, { message: "Username is required" }),
  email: z
    .string()
    .email({ message: "Invalid email address" })
    .min(1, { message: "Email is required" }),
  phone: z
    .string()
    .min(10, { message: "Phone number should be at least 10 characters" })
    .max(15, { message: "Phone number should not exceed 15 characters" }),
  password: z
    .string()
    .min(8, { message: "Password should be at least 8 characters" }),

  role: z.string().min(1, { message: "Role is required" }),
});

export default formSchema;
