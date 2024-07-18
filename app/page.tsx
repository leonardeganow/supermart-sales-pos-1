"use client";
import OnboardingRight from "@/components/OnboardingRight";
import SignupMultistepIndex from "@/components/registrationMultistep/SignupMultistepIndex";
import { Metadata } from "next";
import { useTheme } from "next-themes";
import { useEffect } from "react";

// export const metadata: Metadata = {
//   title: "Quickmart - Onboarding",
// };
export default function Home() {
  const { setTheme } = useTheme();

  useEffect(() => {
    setTheme("light");
  }, []);
  return (
    <div className="">
      <main className="flex h-[100dvh] items-center gap-40 justify-center ">
        <SignupMultistepIndex />
        <OnboardingRight
          heading="Already have an account?"
          subtext="Sign in to access all the features"
          href="/login"
          buttontext="Sign in now"
        />
      </main>
    </div>
  );
}
