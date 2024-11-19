"use client";
import { useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import axios from "axios";
import Link from "next/link";

const formSchema = z.object({
  email: z.string(),
});

export default function MyForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await axios.post("/api/forgot-password", values);
      if (response.data.status) {
        form.reset();
        form.setValue("email", "");
        toast.success("Reset link has been sent to your email.");
      }
    } catch (error: any) {
      console.error("Form submission error", error);
      toast.error(error);
    }
  }

  return (
    <div className="flex h-[100dvh] items-center justify-center gap-40 border-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8  mx-auto p-5 rounded border"
        >
          <div className="">
            <div className="col-span-4">
              <h1 className="text-lg font-bold">Forgot your password</h1>
              <p className="text-sm pb-4 pt-1">
                Please enter the email address you registered with.
              </p>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Please enter your email"
                        type="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <Button disabled={form.formState.isSubmitting} type="submit">
            {form.formState.isSubmitting
              ? "Requesting..."
              : " Request reset link"}
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
