"use client";
import { LoginForm } from "@/components/LoginForm/LoginForm";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const credentialsAction = (formData: FormData) => {
    signIn("credentials", {
      redirectTo: "/tickets",
      email: formData.get("email"),
      password: formData.get("password"),
    }).then(console.log);
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm credentialsAction={credentialsAction} />
      </div>
    </div>
  );
}
