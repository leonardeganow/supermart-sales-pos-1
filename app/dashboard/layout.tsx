import DashboardHeader from "@/components/DashboardHeader";
import Sidebar from "@/components/Sidebar";
import React from "react";

interface MyComponentProps {
  children: React.ReactNode;
}
function DashboardLayout({ children }: MyComponentProps) {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 h-[100dvh]">
        <DashboardHeader />
        <div className="p-5  flex-1 overflow-y-scroll h-[92dvh] ">
          {children}
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;
