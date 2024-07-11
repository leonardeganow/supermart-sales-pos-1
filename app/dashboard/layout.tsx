import DashboardHeader from "@/components/dashboard/DashboardHeader";
import Sidebar from "@/components/dashboard/Sidebar";
import React from "react";
import { getCurrentUser } from "../libs/session";
import { Metadata } from "next";

interface MyComponentProps {
  children: React.ReactNode;
}

export const metadata: Metadata = {
  title: "Quickmart - Dashboard",
};
async function DashboardLayout({ children }: MyComponentProps) {
  const user: CurrentUser = await getCurrentUser();
  console.log(user);
  
  return (
    <div className="flex">
      <Sidebar user={user} />
      <div className="flex-1 h-[100dvh]">
        <DashboardHeader user={user} />
        <div className="p-5  flex-1 overflow-y-scroll h-[92dvh] ">
          {children}
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;
