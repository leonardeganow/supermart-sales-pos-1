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
import { ChevronDown, ChevronUp } from "lucide-react";

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
    roles: [USER_ROLES.ADMIN, USER_ROLES.MANAGER, USER_ROLES.CASHIER],
  },
  {
    label: "Products",
    path: "/dashboard/products",
    icon: <BsBoxes size={20} />,
    roles: [USER_ROLES.ADMIN, USER_ROLES.MANAGER],
  },
  {
    label: "Pos",
    path: "/dashboard/pos",
    icon: <AiOutlineShoppingCart size={20} />,
    roles: [USER_ROLES.ADMIN, USER_ROLES.CASHIER, USER_ROLES.MANAGER],
  },
  {
    label: "Suppliers",
    path: "/dashboard/suppliers",
    icon: <PiVan size={20} />,
    roles: [USER_ROLES.ADMIN, USER_ROLES.MANAGER],
  },
  {
    label: "Reports",
    path: "/dashboard/reports",
    icon: <AiOutlineReconciliation size={20} />,
    subMenu: [
      {
        label: "Sales",
        path: "/dashboard/reports/sales",
        roles: [USER_ROLES.ADMIN, USER_ROLES.CASHIER, USER_ROLES.MANAGER],
      },
      {
        label: "Products",
        path: "/dashboard/reports/products",
        roles: [USER_ROLES.ADMIN, USER_ROLES.CASHIER, USER_ROLES.MANAGER],
      },
    ],
    roles: [USER_ROLES.ADMIN, USER_ROLES.CASHIER, USER_ROLES.MANAGER],
  },
  {
    label: "Users",
    path: "/dashboard/users",
    icon: <AiOutlineTeam size={20} />,
    roles: [USER_ROLES.ADMIN],
  },
  {
    label: "Settings",
    path: "/dashboard/settings",
    icon: <AiOutlineSetting size={20} />,
    roles: [USER_ROLES.ADMIN, USER_ROLES.CASHIER, USER_ROLES.MANAGER],
  },
];

interface SidebarProps {
  user: {
    role: string;
  };
}

function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isClosed, setIsClosed] = useState<boolean>(false);
  const [openSubMenus, setOpenSubMenus] = useState<{ [key: string]: boolean }>(
    {}
  );

  // Filter navItems based on user role
  const filteredNavItems = navItems.filter((item) =>
    item.roles.includes(user?.role)
  );

  const handleSubMenuToggle = (label: string) => {
    setOpenSubMenus((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  const renderNavItems = () => {
    return filteredNavItems.map((item) => (
      <div key={item.label}>
        <div
          onClick={() =>
            item.subMenu
              ? handleSubMenuToggle(item.label)
              : router.push(item.path)
          }
          className={`hover:bg-red-100 hover:text-red-800 dark:hover:bg-white flex justify-between items-center dark:hover:text-black p-4 mb-2 rounded-lg cursor-pointer transition-all duration-100 ${
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
            <p className={`${isClosed && "hidden"} duration-200`}>
              {item.label}
            </p>
          </div>

          {item.subMenu && openSubMenus[item.label] ? (
            <ChevronUp className="text-gray-500" />
          ) : item.subMenu && !openSubMenus[item.label] ? (
            <ChevronDown className="text-gray-500" />
          ) : null}
        </div>
        {item.subMenu && (
          <div
            className={`pl-8 overflow-hidden transition-all duration-300 ${
              openSubMenus[item.label] ? "max-h-screen" : "max-h-0"
            }`}
          >
            {item.subMenu.map((subItem) => (
              <div
                onClick={() => router.push(subItem.path)}
                key={subItem.label}
                className={`hover:bg-red-100 hover:text-red-800 dark:hover:bg-white dark:hover:text-black p-4 mb-2 rounded-lg cursor-pointer transition-all duration-100 ${
                  subItem.path === pathname
                    ? "border-r-2 border-red-600 dark:border-white bg-red-200 text-red-800"
                    : ""
                }`}
              >
                <div className="flex items-center font-medium gap-x-4">
                  <p>- {subItem.label}</p>
                </div>
              </div>
            ))}
          </div>
        )}
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
