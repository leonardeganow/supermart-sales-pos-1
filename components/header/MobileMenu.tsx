"use client";
import React from "react";
import { navItems } from "../dashboard/Sidebar";
import Logo from "./Logo";

function MobileMenu() {
  const renderNavItems = () => {
    return navItems.map((item) => (
      <div
        key={item.label}
        className={`hover:bg-red-100 hover:text-red-800 dark:hover:bg-white dark:hover:text-black   p-4 mb-2 rounded-lg cursor-pointer transition-all duration-100 `}
      >
        <div className={`flex items-center  font-medium gap-x-4`}>
          {item.icon}
          <p>{item.label}</p>{" "}
        </div>
      </div>
    ));
  };
  return (
    <div>
      <Logo route="/dashboard"/>
      {renderNavItems()}
    </div>
  );
}

export default MobileMenu;
