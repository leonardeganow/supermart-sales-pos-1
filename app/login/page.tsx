"use client";
import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import Logo from "@/components/header/Logo";
import OnboardingRight from "@/components/OnboardingRight";
import Link from "next/link";
import { useTheme } from "next-themes";

const formSchema = z.object({
  username: z.string().min(1, { message: "Username is required" }),
  password: z.string().min(1, { message: "Password is required" }),
});

const defaultValues: z.infer<typeof formSchema> = {
  username: "",
  password: "",
};

function Page() {
  const router = useRouter();
  const [message, setMessage] = useState<String>();

  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user) {
      router.push("/dashboard");
    }
  }, [session, router]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setMessage("");
      const { username, password } = values;
      const response: any = await signIn("credentials", {
        redirect: false,
        username,
        password,
      });

      if (!response.error) {
        router.push("/dashboard");
      }
      if (response.status === 401) {
        setMessage(response.error);
      }
    } catch (error) {
      console.error(error);
      setMessage("An unexpected error occurred. Please try again.");
    }
  };

  if (session?.user) {
    return (
      <div className="h-[100dvh] grid place-items-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex h-[100dvh] items-center justify-center gap-40">
      <div className="w-[80%] md:w-[50%] lg:w-[30%] border p-5 rounded-lg flex flex-col gap-y-5">
        <Logo route="/login" />
        {message && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            {/* <AlertTitle>Error</AlertTitle> */}
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter username" {...field} />
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
                    <Input type="password" placeholder="******" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-center">
              <Button disabled={form.formState.isSubmitting} type="submit">
                {form.formState.isSubmitting ? (
                  <div className="flex justify-center items-center">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please wait
                  </div>
                ) : (
                  "Login"
                )}
              </Button>
            </div>
            <div className="text-xs block sm:hidden text-center text-muted-foreground">
              Dont have an account?{" "}
              <Link href={"/"} className=" font-bold">
                Sign up
              </Link>{" "}
            </div>
          </form>
        </Form>
      </div>
      <OnboardingRight
        heading="Don't have an account?"
        subtext="Sign up for free to access all the features"
        href="/"
        buttontext="Sign up now"
      />
    </div>
  );
}

export default Page;
