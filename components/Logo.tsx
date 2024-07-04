import React from "react";
import { LiaShoppingCartSolid } from "react-icons/lia";

interface LogoProps {
  isClosed?: boolean;
  route?: string;
}
function Logo({ isClosed, route }: LogoProps) {
  return (
    <div className="flex justify-center items-center gap-1">
      {!isClosed && <LiaShoppingCartSolid size={40} className="" />}
      <h1
        className={`logo-font ${
          route === "/dashboard" ? "text-xl" : ""
        } text-3xl`}
      >
        QuickMart.
      </h1>
    </div>
  );
}

export default Logo;
