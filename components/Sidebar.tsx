"use client";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import {
  AiOutlineDashboard,
  AiOutlineReconciliation,
  AiOutlineSetting,
  AiOutlineLeft,
  AiOutlineRight,
  AiOutlineShoppingCart,
  AiOutlineTeam,
} from "react-icons/ai";
import { BsBoxes } from "react-icons/bs";
import { PiVan } from "react-icons/pi";
import Logo from "./Logo";

export const navItems = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: <AiOutlineDashboard size={20} />,
  },
  {
    label: "Products",
    path: "/products",
    icon: <BsBoxes size={20} />,
  },
  {
    label: "Orders",
    path: "/orders",
    icon: <AiOutlineShoppingCart size={20} />,
  },
  {
    label: "Suppliers",
    path: "/suppliers",
    icon: <PiVan size={20} />,
  },
  {
    label: "Reports",
    path: "/reports",
    icon: <AiOutlineReconciliation size={20} />,
  },
  {
    label: "Users",
    path: "/users",
    icon: <AiOutlineTeam size={20} />,
  },
  {
    label: "Settings",
    path: "/settings",
    icon: <AiOutlineSetting size={20} />,
  },
];
function Sidebar() {
  const pathname = usePathname();
  const [isClosed, setIsClosed] = useState<boolean>(false);

  const renderNavItems = () => {
    return navItems.map((item) => (
      <div
        key={item.label}
        className={`hover:bg-red-100 hover:text-red-800 dark:hover:bg-white dark:hover:text-black   p-4 mb-2 rounded-lg cursor-pointer transition-all duration-100 ${
          item.path === pathname
            ? "border-r-2 border-red-600 dark:border-white bg-red-100 text-red-800"
            : ""
        }`}
      >
        <div
          className={`flex items-center ${
            isClosed ? "justify-center" : ""
          } font-medium gap-x-4`}
        >
          {item.icon}
          <p className={`${isClosed && "hidden"}  duration-200"}`}>
            {item.label}
          </p>{" "}
        </div>
      </div>
    ));
  };

  const handleSidebarToggle = () => {
    setIsClosed((prev) => !prev);
  };
  return (
    <div
      className={`${
        isClosed ? "w-28" : "w-64 "
      }  transition-all duration-500 h-[100dvh] shadow border sm:flex flex-col justify-between hidden`}
    >
      <div>
        <div className="h-[8dvh] border-b flex flex-col justify-center">
          <Logo />
        </div>

        <div className="pt-2 m-2">
          <h1
            className={`pb-2 font-semibold text-muted-foreground ${
              isClosed ? "text-sm" : "block"
            }`}
          >
            Menus
          </h1>
          {renderNavItems()}
        </div>
      </div>

      <div
        className={`flex justify-end border-t  pt-2 px-2 ${
          isClosed ? "justify-center" : "gap-10"
        }`}
      >
        {isClosed ? (
          <AiOutlineRight
            size={22}
            className="cursor-pointer  mb-2  text-muted-foreground hover:text-red-500"
            onClick={() => setIsClosed((prev) => !prev)}
          />
        ) : (
          <AiOutlineLeft
            size={22}
            className="cursor-pointer  mb-2 text-muted-foreground hover:text-red-500"
            onClick={handleSidebarToggle}
          />
        )}
      </div>
    </div>
  );
}

export default Sidebar;
