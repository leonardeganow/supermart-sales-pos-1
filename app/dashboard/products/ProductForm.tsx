import React from "react";
import { useForm } from "react-hook-form";
import formSchema from "./validationSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import defaultValues from "./defaultValues";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const supermarketCategories = [
  "Fruits and Vegetables",
  "Dairy Products",
  "Bakery",
  "Meat and Seafood",
  "Pantry Staples",
  "Beverages",
  "Snacks",
  "Frozen Foods",
  "Health and Wellness",
  "Personal Care",
  "Household Essentials",
  "Baby Products",
  "Pet Supplies",
  "Baking and Cooking",
  "Breakfast Items",
  "International Foods",
  "Organic and Natural",
  "Prepared Foods",
  "Baking Supplies",
  "Miscellaneous",
];
function ProductForm(props: UserFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);
  };
  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
          <FormField
            control={form.control}
            name="barcode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bar code</FormLabel>
                <FormControl>
                  <Input placeholder="Enter bar code" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-between  items-center ">
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter quantity"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />{" "}
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue
                        placeholder="Category"
                        // placeholder={
                        //   props.type === "edit"
                        //     ? form.getValues("role")
                        //     : "Roles"
                        // }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {supermarketCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-between gap-x-2 items-center">
            <FormField
              control={form.control}
              name="basePrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Base price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter base price"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sellingPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Selling price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter selling price"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image</FormLabel>
                <Input {...field} id="picture" type="file" />
                <FormMessage />
              </FormItem>
            )}
          />

          <Button disabled={form.formState.isSubmitting} type="submit">
            {form.formState.isSubmitting ? (
              <div className="flex justify-center items-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </div>
            ) : props.type === "edit" ? (
              "Save changes"
            ) : (
              "Submit"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default ProductForm;
