import SignupMultistepIndex from "@/components/ui/registrationMultistep/SignupMultistepIndex";
import registrationSvg from "../public/registration.svg";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import OnboardingRight from "@/components/OnboardingRight";
export default function Home() {
  return (
    <div className="">
      <main className="flex min-h-screen items-center gap-40 justify-center ">
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
