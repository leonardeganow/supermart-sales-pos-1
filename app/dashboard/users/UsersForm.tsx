"use client";
import React, { useEffect } from "react";
import { z } from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { useSession } from "next-auth/react";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";

interface UserFormProps {
  refetch: () => void;
  type: string;
  userData: any;
}
function UsersForm(props: UserFormProps) {
  const { data: session }: any = useSession();
  const { toast } = useToast();
  const defaultValues: ManagerSignup = {
    name: "",
    phone: "",
    email: "",
    username: "",
    password: "",
    role: "",
  };

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
          form.reset();
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

        const response = await axios.put("/api/deleteusers", data);

        if (response.data.status) {
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
        <div>delete form goes here</div>
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
                      <SelectValue placeholder="Roles" />
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
