import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  quantity: z.string().min(1, { message: "quantity is required" }),
  category: z.string().min(1, { message: "category is required" }),
  basePrice: z.string().min(1, { message: "basePrice is required" }),
  sellingPrice: z.string().min(1, { message: "sellingPrice is required" }),
  image: z.string().min(1, { message: "image is required" }),
  barcode: z.string().min(1, { message: "barcode is required" }),
});

export default formSchema;
