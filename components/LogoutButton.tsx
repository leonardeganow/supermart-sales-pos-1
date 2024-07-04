'use client'
import { signOut } from "next-auth/react";
import React from "react";
import { TbLogout2 } from "react-icons/tb";

function LogoutButton() {
  return (
    <div>
      <TbLogout2
        onClick={() => signOut()}
        size={22}
        className="hover:text-red-500 cursor-pointer"
      />
    </div>
  );
}

export default LogoutButton;
