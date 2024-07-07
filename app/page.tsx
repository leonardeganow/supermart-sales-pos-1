import OnboardingRight from "@/components/OnboardingRight";
import SignupMultistepIndex from "@/components/registrationMultistep/SignupMultistepIndex";
export default function Home() {
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
