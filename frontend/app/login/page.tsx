import { LoginForm } from './sections/login-form';

export default function LoginPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-[linear-gradient(180deg,#fff7ed_0%,#fff_38%,#f8fafc_100%)] p-6 md:p-10">
      <div className="w-full max-w-6xl">
        <LoginForm />
      </div>
    </div>
  );
}

