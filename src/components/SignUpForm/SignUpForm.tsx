import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type ComponentProps } from "react";
import Link from "next/link";
import OAuthBlock from "@/components/OAuthBlock";

interface Props extends ComponentProps<"div"> {
  credentialsAction(formData: FormData): void;
  oauthAction(provider: string): void;
}

export default function SignUpForm({ credentialsAction, oauthAction }: Props) {
  return (
    <Card>
      <CardHeader className="flex justify-center">
        <CardTitle>Get started for free!</CardTitle>
      </CardHeader>

      <CardContent>
        <form action={credentialsAction}>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
                autoComplete={"email"}
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="fullname">Full Name</Label>
              <Input
                id="fullname"
                name="fullname"
                placeholder="John Doe"
                autoComplete={"name"}
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete={"new-password"}
                required
              />
            </div>
          </div>
          <Button type="submit" className="w-full mt-4 mb-3 cursor-pointer">
            Sign Up
          </Button>

          <div className={"text-center mb-4 text-muted-foreground"}>
            or sign up with
          </div>
          <OAuthBlock oauthAction={oauthAction} />
        </form>
        <div className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link href="/auth/login" className="underline underline-offset-4">
            Log in
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
