import Header from "@/components/layout/header";
import { LoginForm } from "@/components/login-form";

const Login = () => {
  return (
    <>
      <Header />
      <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10 w-full">
        <div className="w-full max-w-sm md:max-w-4xl">
          <LoginForm />
        </div>
      </div>
    </>
  );
};

export default Login;
