type CompanySignup = {
  name: string;
  email: string;
  phone: string;
  location: string;
};
type Login = {
  username: string;
  password: string;
};

type ManagerSignup = {
  name: string;
  email: string;
  phone: string;
  username: string;
  password: string;
  role: string;
};

type CompanySignupStepProps = {
  handleNext: (page: number) => void;
  setCompanyId: (companyId: string) => void;
};
type ManagerSignUpStepProps = {
  handleNext: (page: number) => void;
  companyId: string;
};

interface OnboardingRightProps {
  heading: string;
  subtext: string;
  href: string;
  buttontext: string;
}