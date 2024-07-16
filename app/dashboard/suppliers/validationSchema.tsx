import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  telephone: z.string().min(1, { message: "quantity is required" }),
  location: z.string().min(1, { message: "category is required" }),
  product: z.string().min(1, { message: "basePrice is required" }),
});

export default formSchema;
