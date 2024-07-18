"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSession } from "next-auth/react";
import axios from "axios";
import { toast } from "sonner";
import { changePassword, editAccountInfo } from "@/app/actions";
import { Loader2 } from "lucide-react";

export default function Page() {
  const { data: session, refetch }: any = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [accountInfo, setAccountInfo] = useState({
    name: "",
    username: "",
    phone: "",
  });
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
  });

  const handleAccountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAccountInfo({ ...accountInfo, [e.target.id]: e.target.value });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswords({ ...passwords, [e.target.id]: e.target.value });
  };

  const handleAccountSave = async () => {
    setIsLoading(true);
    try {
      const response: any = await editAccountInfo(accountInfo);
      if (response.status) {
        setIsLoading(false);
        toast.success(response.message);
      } else {
        setIsLoading(false);

        toast(response.message);
      }
    } catch (error) {
      setIsLoading(false);

      console.error(error);
      toast("Failed to update account information");
    }
  };

  const handlePasswordSave = async () => {
    setIsLoading(true);
    try {
      const response = await changePassword(passwords);
      if (response.status) {
        setIsLoading(false);
        setPasswords({
          current: "",
          new: "",
        });
        // refetch();
        toast.success(response.message);
      } else {
        // refetch();
        toast.error(response.message);
        setIsLoading(false);
      }
    } catch (error) {
      // refetch();
      setIsLoading(false);
      toast.error("an error occured");
    }
  };

  useEffect(() => {
    if (session) {
      setAccountInfo({
        name: session.user.name,
        username: session.user.username,
        phone: session.user.phone,
      });
    }
  }, [session]);

  return (
    <Tabs defaultValue="account" className="w-[400px]">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>
              Make changes to your account here. Click save when you are done.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={accountInfo.name}
                onChange={handleAccountChange}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={accountInfo.username}
                onChange={handleAccountChange}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input disabled id="email" defaultValue={session?.user?.email} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="phone">Telephone number</Label>
              <Input
                id="phone"
                value={accountInfo.phone}
                onChange={handleAccountChange}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button disabled={isLoading} onClick={handleAccountSave}>
              {" "}
              {isLoading ? (
                <div className="flex justify-center items-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </div>
              ) : (
                "Save changes"
              )}
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="password">
        <Card>
          <CardHeader>
            <CardTitle>Password</CardTitle>
            <CardDescription>Change your password here.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="current">Current password</Label>
              <Input
                id="current"
                type="password"
                value={passwords.current}
                onChange={handlePasswordChange}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="new">New password</Label>
              <Input
                id="new"
                type="password"
                value={passwords.new}
                onChange={handlePasswordChange}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button disabled={isLoading} onClick={handlePasswordSave}>
              {" "}
              {isLoading ? (
                <div className="flex justify-center items-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </div>
              ) : (
                "Save changes"
              )}
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
