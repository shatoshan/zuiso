// src/components/auth/ClientAuthProvider.tsx
"use client";

import { AuthProvider } from "@/lib/firebase/authContext";

export default function ClientAuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthProvider>{children}</AuthProvider>;
}
