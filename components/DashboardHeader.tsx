import React from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/app/libs/session";
import { LiaHamburgerSolid } from "react-icons/lia";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import MobileMenu from "./MobileMenu";

import DarkModeToggler from "./DarkModeToggler";
import AvatarDropdown from "./AvatarDropdown";
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

      <DarkModeToggler />
      <div className="flex items-center gap-x-5">
        {/* <LogoutButton /> */}
        <div className="sm:flex flex-col hidden">
          <p className="capitalize">{user.name}</p>
          <p className="text-sm text-muted-foreground capitalize">
            {user.role}
          </p>
        </div>

        <AvatarDropdown user={user} />
      </div>
    </div>
  );
}

export default DashboardHeader;
