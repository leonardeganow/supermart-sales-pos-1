import React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/app/libs/session";
import getInitials from "@/app/helpers";
import LogoutButton from "./LogoutButton";
import { LiaHamburgerSolid } from "react-icons/lia";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import MobileMenu from "./MobileMenu";

async function DashboardHeader() {
  const user: ManagerSignup = await getCurrentUser();

  if (!user) {
    redirect("/login");
    return null;
  }

  return (
    <div className="p-5 flex justify-between border items-center gap-x-8 h-[8dvh] ">
      <Sheet>
        <SheetTrigger>
          {" "}
          <LiaHamburgerSolid
            size={20}
            className="cursor-pointer hover:text-red-500 block sm:hidden"
          />
        </SheetTrigger>
        <SheetContent side="left">
          <MobileMenu />
        </SheetContent>
      </Sheet>

      <div className="flex items-center gap-x-5">
        <LogoutButton />
        <div className="flex flex-col">
          <p>{user.username}</p>
          <p className="text-sm text-muted-foreground">{user.role}</p>
        </div>
        <Avatar>
          <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
}

export default DashboardHeader;
