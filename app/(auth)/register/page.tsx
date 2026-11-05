import RegisterPanel from "@/components/auth/RegisterPanel";
import RegisterSection from "@/components/auth/RegisterSection";

const RegisterPage = () => {
  return (
    <main className="w-full min-h-screen grid grid-cols-1 lg:grid-cols-2">
      <RegisterSection />
      <RegisterPanel />
    </main>
  );
};

export default RegisterPage;
