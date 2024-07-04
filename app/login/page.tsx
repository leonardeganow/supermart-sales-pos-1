"use client";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import registrationSvg from "../../public/registration.svg";
import Logo from "@/components/Logo";
import OnboardingRight from "@/components/OnboardingRight";

function Page() {
  const router = useRouter();
  const { toast } = useToast();

  const formSchema = z.object({
    username: z.string().min(1, { message: "Username is required" }),
    password: z.string().min(1, { message: "Password is required" }),
  });

  const defaultValues: Login = {
    username: "",
    password: "",
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const { username, password } = values;
      const response: any = await signIn("credentials", {
        redirect: false,
        username,
        password,
      });

      if (!response.error) {
        router.push("/dashboard");
      } else {
        // handle error
        toast({
          description: response.error,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="flex min-h-screen items-center justify-center gap-40 ">
      <div className="w-[80%] md:w-[50%] lg:w-[30%]   border p-5 rounded-lg flex flex-col gap-y-5">
        <Logo />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="enter username" {...field} />
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
                  <FormLabel>password</FormLabel>
                  <FormControl>
                    <Input placeholder="******" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-center">
              <Button
                disabled={form.formState.isSubmitting}
                className="flex justify-center "
                type="submit"
              >
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
          </form>
        </Form>
      </div>
      <OnboardingRight
        heading="Dont have an account?"
        subtext="Sign up for free to access all the features"
        href="/"
        buttontext="Sign up now"
      />
    </div>
  );
}

export default Page;
