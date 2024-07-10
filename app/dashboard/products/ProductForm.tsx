import React, { useEffect, useState } from "react";
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
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { convertImageToBase64 } from "@/app/utils";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import Image from "next/image";

export const supermarketCategories = [
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
  const { toast } = useToast();
  const [base64Image, setBase64Image] = useState();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [loader, setLoader] = React.useState(false);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (props.type === "") {
      try {
        const base64 = await convertImageToBase64(selectedFile);

        const formData = {
          ...values,
          imageBase64: base64,
        };
        const response = await axios.post("/api/addproduct", formData);

        if (response.data.status) {
          props.refetch();
          props.setShowModal(false);
          form.reset();
          form.setValue("category", "");
          toast({ description: response.data.message });
        } else {
          toast({ description: response.data.message });
        }
      } catch (error) {
        console.log(error);
      }
    }

    if (props.type === "edit") {
      try {
        const base64 = await convertImageToBase64(selectedFile);
        const data = {
          productId: props.userData._id,
          ...values,
          imageBase64: base64,
        };

        const response = await axios.put("/api/editproducts", data);

        if (response.data.status) {
          props.setShowModal(false);
          props.refetch();
          form.reset();
          toast({ description: response.data.message });
        } else {
          toast({ description: response.data.message });
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const deleteUser = async () => {
    if (props.type === "delete") {
      setLoader(true);
      try {
        const data: any = {
          productId: props.userData,
        };

        const response = await axios.delete("/api/deleteproduct", { data });

        if (response.data.status) {
          setLoader(false);
          props.setShowModal(false);
          props.refetch();
          toast({ description: response.data.message });
        } else {
          setLoader(false);
          toast({ description: response.data.message });
        }
      } catch (error) {
        setLoader(false);
        console.error(error);
      }
    }
  };

  console.log(props.userData);
  

  useEffect(() => {
    if (props.type === "edit") {
      form.setValue("name", props.userData.name);
      form.setValue("quantity", props.userData.quantity.toString());
      form.setValue("category", props.userData.category);
      form.setValue("currency", props.userData.currency);
      form.setValue("basePrice", props.userData.basePrice.toString());
      form.setValue("sellingPrice", props.userData.sellingPrice.toString());
      form.setValue("barcode", props.userData.barcode);
      form.setValue("image", props.userData.image);
    } else {
      form.reset();
    }
  }, []);

  const displayBase64Image = async () => {
    try {
      const base64: any = await convertImageToBase64(selectedFile);
      setBase64Image(base64);
    } catch (error) {
      console.error;
    }
  };

  useEffect(() => {
    displayBase64Image();
  }, [selectedFile, setSelectedFile]);

  return (
    <div>
      {props.type === "delete" ? (
        <div className="flex flex-col gap-y-4">
          <p>
            This action cannot be undone. This will permanently delete this
            users data from our servers.
          </p>

          <div onClick={deleteUser} className="flex justify-end gap-x-4">
            <Button>
              {" "}
              {loader ? (
                <div className="flex justify-center items-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </div>
              ) : (
                "Continue"
              )}
            </Button>
          </div>
        </div>
      ) : (
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

            <div className="flex justify-between gap-x-2 items-center ">
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
                          placeholder={
                            props.type === "edit"
                              ? form.getValues("category")
                              : "Category"
                          }
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
                name="currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Currency</FormLabel>
                    <Select onValueChange={field.onChange}>
                      <SelectTrigger className="">
                        <SelectValue
                          placeholder={
                            props.type === "edit"
                              ? form.getValues("currency")
                              : "Currency"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="GHS">cedi</SelectItem>
                        <SelectItem value="USD">dollars</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
            <div className="flex gap-x-4">
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image</FormLabel>
                    <Input
                      onChange={(e: any) => {
                        const file = e.target.files[0];
                        setSelectedFile(file);
                        field.onChange(e);
                      }}
                      type="file"
                      id="file-input"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              {base64Image && (
                <Image
                  className="rounded-lg"
                  src={base64Image}
                  width={70}
                  height={70}
                  alt=""
                />
              )}
              {props?.type === "edit" && !selectedFile && (
                <Image
                  className="rounded-lg"
                  src={props?.userData?.image}
                  width={70}
                  height={70}
                  alt=""
                />
              )}
            </div>

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
      )}
    </div>
  );
}

export default ProductForm;
