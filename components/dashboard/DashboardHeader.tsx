import React from "react";
import { redirect } from "next/navigation";
import { LiaHamburgerSolid } from "react-icons/lia";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import MobileMenu from "../header/MobileMenu";

import DarkModeToggler from "./DarkModeToggler";
import AvatarDropdown from "../header/AvatarDropdown";

interface DashboardHeaderProps {
  user: CurrentUser;
}
async function DashboardHeader(props: DashboardHeaderProps) {
  if (!props.user) {
    redirect("/login");
    return null;
  }

  return (
    <div className="p-5 flex justify-between border items-center gap-x-8 h-[8dvh] ">
      <Sheet>
        <SheetTrigger>
          {" "}
          <LiaHamburgerSolid
            size={22}
            className="cursor-pointer hover:text-red-500 block sm:hidden"
          />
        </SheetTrigger>
        <SheetContent side="left">
          <MobileMenu  user={props.user}/>
        </SheetContent>
      </Sheet>

      <DarkModeToggler />
      <div className="flex items-center gap-x-5">
        {/* <LogoutButton /> */}
        <div className="sm:flex flex-col hidden">
          <p className="capitalize">{props.user.name}</p>
          <p className="text-sm text-muted-foreground capitalize">
            {props.user.role}
          </p>
        </div>

        <AvatarDropdown user={props.user} />
      </div>
    </div>
  );
}

export default DashboardHeader;
