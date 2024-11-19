"use client";
import { useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useSearchParams } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import Link from "next/link";
import axios from "axios";

const formSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match.",
    path: ["confirmPassword"],
  });

export default function ResetPassword() {
  const searchParams = useSearchParams();
  const token: any = searchParams.get("token");

  let email = "";
  try {
    const { email: decodedEmail }: any = jwtDecode(token);
    email = decodedEmail;
  } catch (error) {
    console.error("Invalid token", error);
    toast.error("Invalid or expired token.");
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await axios.post("/api/resetpassword", {
        email,
        password: values.password,
      });

      if (response.data.status) {
        toast.success("Password reset successful. You can now log in.");
        // Redirect to login page
        window.location.href = "/login";
      } 
    } catch (error: any)  {
      console.error("Form submission error", error);
      toast.error(error.response.data.message);
    }
  }

  return (
    <div className="grid place-content-center h-screen">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 border rounded-lg p-10"
        >
          <h1 className="text-3xl font-bold">Reset Password</h1>
          <p className="text-sm">Enter your new password for {email}</p>

          {/* Password Field */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your password"
                    type="password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Confirm Password Field */}
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Confirm your password"
                    type="password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button disabled={form.formState.isSubmitting} type="submit">
            {form.formState.isSubmitting ? "Resetting..." : "Reset Password"}
          </Button>
          <Link
            href="/login"
            className="block capitalize text-blue-500 font-semibold"
          >
            Back to login
          </Link>
        </form>
      </Form>
    </div>
  );
}
