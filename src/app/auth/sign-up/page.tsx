"use client";

import { useRouter } from "next/navigation";
import SignUpForm from "@/components/SignUpForm";
import { createUser } from "@/services/user";
import { toast } from "sonner";
import { signIn } from "next-auth/react";

export default function SignUpPage() {
  const router = useRouter();

  const credentialsAction = async (formData: FormData) => {
    try {
      const [firstName, lastName] = (formData.get("fullname") as string).split(
        " ",
      );
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;

      await createUser({
        firstName: firstName ?? "",
        lastName: lastName ?? "",
        email,
        password,
      });

      const response = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (!response.error) {
        router.push("/projects");
        return;
      }

      toast.error("Invalid credentials");
    } catch (e) {
      console.error(e);
      toast.error("Sign-up error.", {
        description: "Email is already taken.",
      });
    }
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <SignUpForm credentialsAction={credentialsAction} />
      </div>
    </div>
  );
}
