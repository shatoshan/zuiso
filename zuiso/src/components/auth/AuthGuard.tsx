"use client";

import { useAuthContext } from "@/lib/firebase/authContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuthContext();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // ログイン処理中は何もしない
    if (loading) return;

    // ユーザーがログインしていない場合、ログインページにリダイレクト
    if (!user) {
      router.push(`/login?returnUrl=${encodeURIComponent(pathname)}`);
    }
  }, [user, loading, router, pathname]);

  // ロード中またはユーザーがログインしていない場合は何も表示しない
  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  // ユーザーがログインしている場合は子コンポーネントを表示
  return <>{children}</>;
}
