"use client";

import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export default function LogOutButton() {
  return (
    <Button onClick={() => signOut()} variant="ghost">
      <LogOut className="ml-auto stroke-destructive w-[16px] h-[16px]" />
    </Button>
  );
}
