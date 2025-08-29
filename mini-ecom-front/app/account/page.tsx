"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";

export default function AccountPage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  if (!user) {
    router.push("/login");
    return null;
  }

  async function handleLogout() {
    await logout();
    router.push("/");
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl mb-4">{user.email}</h1>
      <Button onClick={handleLogout}>Log out</Button>
    </div>
  );
}