"use client";
import React, { useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import defaultValues from "./defaultValues";
import formSchema from "./validationSchema";

function UsersForm(props: UserFormProps) {
  const [loader, setLoader] = React.useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (props.type === "") {
      try {
        const data = {
          ...values,
        };

        const response = await axios.post("/api/addadmin", data);

        if (response.data.status) {
          props.refetch();
          props.setShowModal(false);
          form.reset();
          form.setValue("role", "");
          toast({ description: response.data.message });
        } else {
          toast({ description: response.data.message });
        }
      } catch (error) {
        console.error(error);
      }
    }

    if (props.type === "edit") {
      try {
        const data = {
          userId: props.userData._id,
          ...values,
        };

        const response = await axios.put("/api/editusers", data);

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

    if (props.type === "delete") {
      setLoader(true);
      try {
        const data: any = {
          userId: props.userData,
        };

        console.log(data);

        const response = await axios.delete("/api/deleteuser", data);
        console.log(response);

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

  const deleteUser = async () => {
    if (props.type === "delete") {
      setLoader(true);
      try {
        const data: any = {
          userId: props.userData,
        };

        const response = await axios.delete("/api/deleteuser", { data });

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

  useEffect(() => {
    if (props.userData) {
      form.setValue("name", props.userData.name);
      form.setValue("phone", props.userData.phone);
      form.setValue("email", props.userData.email);
      form.setValue("username", props.userData.username);
      form.setValue("password", props.userData.password);
      form.setValue("role", props.userData.role);
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
                  <FormLabel>Full name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-x-4">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telephone</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your telephone number"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter a username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>User Role</FormLabel>
                  <Select onValueChange={field.onChange}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue
                        placeholder={
                          props.type === "edit"
                            ? form.getValues("role")
                            : "Roles"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="cashier">Cashier</SelectItem>
                    </SelectContent>
                  </Select>
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

export default UsersForm;
