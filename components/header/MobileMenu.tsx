"use client";
import React, { useState } from "react";
import { navItems } from "../dashboard/Sidebar";
import Logo from "./Logo";
import { usePathname, useRouter } from "next/navigation";

interface MobileMenuProps {
  user: {
    role: string;
  };
}

function MobileMenu({ user }: MobileMenuProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [openSubMenus, setOpenSubMenus] = useState<{ [key: string]: boolean }>(
    {}
  );

  // Filter navItems based on user role
  const filteredNavItems = navItems.filter((item) =>
    item.roles.includes(user.role)
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
          className={`hover:bg-red-100 hover:text-red-800 dark:hover:bg-white dark:hover:text-black p-4 mb-2 rounded-lg cursor-pointer transition-all duration-100 ${
            item.path === pathname
              ? "border-r-2 border-red-600 dark:border-white bg-red-200 text-red-800"
              : ""
          }`}
        >
          <div className={`flex items-center font-medium gap-x-4`}>
            {item.icon}
            <p>{item.label}</p>
          </div>
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

  return (
    <div>
      <Logo route="/dashboard" />
      {renderNavItems()}
    </div>
  );
}

export default MobileMenu;
