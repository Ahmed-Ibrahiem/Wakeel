import LoginSection from "@/components/auth/LoginSection";
import LoginPanel from "@/components/auth/LoginPanel";

const LoginPage = () => {
  return (
    <main className="w-full min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Login form */}
      <LoginSection />

      {/* Login Panel */}
      <LoginPanel />
    </main>
  );
};

export default LoginPage;
