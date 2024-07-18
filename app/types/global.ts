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

interface CurrentUser {
  name: string;
  email: string;
  image: string;
  id: string;
  username: string;
  role: string;
  supermarketId: string;
}

interface UserFormProps {
  refetch: () => void;
  setShowModal: any;
  type: string;
  userData: any;
}

type Payment = {
  id: string;
  username: string;
  fullname: string;
  email: string;
  password: string;
  type: string;
};

type Product = {
  name: string;
  quantity: number;
  inStock: boolean;
  category: string;
  basePrice: number;
  sellingPrice: number;
  image: string;
  barcode: string;
};
