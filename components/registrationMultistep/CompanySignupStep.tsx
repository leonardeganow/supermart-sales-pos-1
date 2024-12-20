import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

function CompanySignupStep(props: CompanySignupStepProps) {
  const formSchema = z.object({
    name: z.string().min(1, { message: "company name is required" }),
    email: z.string().email().min(1, { message: "email is required" }),
    phone: z.string().min(10).max(15),
    location: z.string().min(1, { message: "location is required" }),
  });

  const defaultValues: CompanySignup = {
    name: "",
    email: "",
    phone: "",
    location: "",
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await fetch("/api/createsupermart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      const newResponse = await response.json();

      if (newResponse.status) {
        toast.success(newResponse.message);
        props.setCompanyId(newResponse.id);
        props.handleNext(1);
      }

      // toast(newResponse.message);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className=" ">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company name</FormLabel>
                <FormControl>
                  <Input placeholder="enter your company name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="enter your email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telephone</FormLabel>
                <FormControl>
                  <Input placeholder="enter your telephone number" {...field} />
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
                  <Input placeholder="enter your location" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-center">
            <Button
              className="flex justify-center items-center"
              disabled={form.formState.isSubmitting}
              type="submit"
            >
              {form.formState.isSubmitting ? (
                <div className="flex justify-center items-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </div>
              ) : (
                "submit"
              )}
            </Button>
          </div>
        </form>
      </Form>
      <div className="text-xs block sm:hidden text-center text-muted-foreground pt-3">
        Already have an account?{" "}
        <Link href={"/login"} className=" font-bold">
          Sign in
        </Link>{" "}
      </div>
    </div>
  );
}

export default CompanySignupStep;
