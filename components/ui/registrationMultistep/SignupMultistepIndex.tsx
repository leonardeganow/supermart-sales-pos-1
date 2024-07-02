"use client";
import React, { useState } from "react";
import CompanySignupStep from "./CompanySignupStep";
import ManagerSignUpStep from "./ManagerSignUpStep";

function SignupMultistepIndex() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [companyId, setCompanyId] = useState<string>("");

  const handleNext = (page: number) => {
    setCurrentStep((prevStep) => prevStep + page);
  };

  const renderForm = () => {
    switch (currentStep) {
      case 1:
        return (
          <CompanySignupStep
            handleNext={handleNext}
            setCompanyId={setCompanyId}
          />
        );
      case 2:
        return (
          <ManagerSignUpStep handleNext={handleNext} companyId={companyId} />
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-[80%] md:w-[50%] lg:w-[30%] border p-5 rounded-lg">
      {renderForm()}
    </div>
  );
}

export default SignupMultistepIndex;
