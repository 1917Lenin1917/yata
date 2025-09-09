"use client";
import { LoginForm } from "@/components/LoginForm/LoginForm";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();

  const credentialsAction = async (formData: FormData) => {
    const response = await signIn("credentials", {
      redirect: false,
      email: formData.get("email"),
      password: formData.get("password"),
    });

    if (!response.error) {
      router.push("/projects");
      return;
    }

    toast.error("Invalid credentials");
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm credentialsAction={credentialsAction} />
      </div>
    </div>
  );
}
