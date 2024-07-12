"use client";
import { usePathname, useRouter } from "next/navigation";
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
import Logo from "../header/Logo";

// Example user roles
const USER_ROLES = {
  ADMIN: "admin",
  CASHIER: "cashier",
  MANAGER: "manager",
};

// Define navItems with roles
export const navItems = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: <AiOutlineDashboard size={20} />,
    roles: [USER_ROLES.ADMIN, USER_ROLES.MANAGER, USER_ROLES.CASHIER], // Both admin and user can see this
  },
  {
    label: "Products",
    path: "/dashboard/products",
    icon: <BsBoxes size={20} />,
    roles: [USER_ROLES.ADMIN, USER_ROLES.MANAGER], // Only admin can see this
  },
  {
    label: "Pos",
    path: "/dashboard/pos",
    icon: <AiOutlineShoppingCart size={20} />,
    roles: [USER_ROLES.ADMIN, USER_ROLES.CASHIER, USER_ROLES.MANAGER], // Both admin and user can see this
  },
  {
    label: "Suppliers",
    path: "/dashboard/suppliers",
    icon: <PiVan size={20} />,
    roles: [USER_ROLES.ADMIN, USER_ROLES.MANAGER], // Only admin can see this
  },
  {
    label: "Reports",
    path: "/dashboard/reports",
    icon: <AiOutlineReconciliation size={20} />,
    roles: [USER_ROLES.ADMIN, USER_ROLES.CASHIER, USER_ROLES.MANAGER], // Only admin can see this
  },
  {
    label: "Users",
    path: "/dashboard/users",
    icon: <AiOutlineTeam size={20} />,
    roles: [USER_ROLES.ADMIN], // Only admin can see this
  },
  {
    label: "Settings",
    path: "/dashboard/settings",
    icon: <AiOutlineSetting size={20} />,
    roles: [USER_ROLES.ADMIN, USER_ROLES.CASHIER, USER_ROLES.MANAGER], // Both admin and user can see this
  },
];

interface SidebarProps {
  user: CurrentUser;
}

function Sidebar(props: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isClosed, setIsClosed] = useState<boolean>(false);

  // Filter navItems based on user role
  const filteredNavItems = navItems.filter((item) =>
    item.roles.includes(props?.user?.role)
  );

  const renderNavItems = () => {
    return filteredNavItems.map((item) => (
      <div
        onClick={() => router.push(item.path)}
        key={item.label}
        className={`hover:bg-red-100 hover:text-red-800 dark:hover:bg-white dark:hover:text-black p-4 mb-2 rounded-lg cursor-pointer transition-all duration-100 ${
          item.path === pathname
            ? "border-r-2 border-red-600 dark:border-white bg-red-200 text-red-800"
            : ""
        }`}
      >
        <div
          className={`flex items-center ${
            isClosed ? "justify-center" : ""
          } font-medium gap-x-4`}
        >
          {item.icon}
          <p className={`${isClosed && "hidden"} duration-200`}>{item.label}</p>
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
        isClosed ? "w-28" : "w-64"
      } transition-all duration-500 h-[100dvh] shadow border sm:flex flex-col justify-between hidden`}
    >
      <div>
        <div className="h-[8dvh] border-b flex flex-col justify-center">
          <Logo isClosed={isClosed} route="/dashboard" />
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
        className={`flex justify-end border-t pt-2 px-2 ${
          isClosed ? "justify-center" : "gap-10"
        }`}
      >
        {isClosed ? (
          <AiOutlineRight
            size={22}
            className="cursor-pointer mb-2 text-muted-foreground hover:text-red-500"
            onClick={() => setIsClosed((prev) => !prev)}
          />
        ) : (
          <AiOutlineLeft
            size={22}
            className="cursor-pointer mb-2 text-muted-foreground hover:text-red-500"
            onClick={handleSidebarToggle}
          />
        )}
      </div>
    </div>
  );
}

export default Sidebar;
