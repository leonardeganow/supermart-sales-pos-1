import React, { useEffect } from "react";
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
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { createSupplier, deleteSupplier, editSupplier } from "@/app/actions";

function SupplierForm(props: UserFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });
  const [loader, setLoader] = React.useState(false);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (props.type === "") {
      try {
        const response = await createSupplier(values);

        console.log(response);

        if (response.status) {
          props.refetch();
          props.setShowModal(false);
          form.reset();
          toast.success(response.message);
        } else {
          toast.error(response.message);
        }
      } catch (error) {
        console.log(error);
      }
    }

    if (props.type === "edit") {
      try {
        const data = {
          supplierId: props.userData._id,
          ...values,
        };

        const response: any = await editSupplier(data);

        if (response.status) {
          props.setShowModal(false);
          props.refetch();
          form.reset();
          toast.success(response.message);
        } else {
          toast.error(response.message);
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
          supplierId: props.userData,
        };
        console.log(data);

        const response: any = await deleteSupplier(data);

        if (response.status) {
          setLoader(false);
          props.setShowModal(false);
          props.refetch();
          toast.success(response.message);
        } else {
          setLoader(false);
          toast.error(response.message);
        }
      } catch (error) {
        setLoader(false);
        console.error(error);
      }
    }
  };

  useEffect(() => {
    if (props.type === "edit") {
      form.setValue("name", props.userData.name);
      form.setValue("location", props.userData.location);
      form.setValue("telephone", props.userData.telephone);
      form.setValue("product", props.userData.product);
    } else {
      form.reset();
    }
  }, []);

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
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Supplier name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="telephone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter telephone" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Enter location"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />{" "}
            <FormField
              control={form.control}
              name="product"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Enter product" {...field} />
                  </FormControl>
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
      )}
    </div>
  );
}

export default SupplierForm;
