import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import registrationSvg from "../public/registration.svg";
import Image from "next/image";
function OnboardingRight({
  heading,
  subtext,
  href,
  buttontext,
}: OnboardingRightProps) {
  return (
    <div className="md:flex flex-col items-center gap-y-10 hidden ">
      <div className="text-center flex flex-col gap-y-2">
        <p className="text-2xl font-heading">{heading}</p>
        <p className="text-lg text-muted-foreground">{subtext}</p>
        <Link href={href}>
          <Button>{buttontext}</Button>
        </Link>
      </div>
      <Image src={registrationSvg} alt="Registration" width={300} />
    </div>
  );
}

export default OnboardingRight;
