// src/app/layout.tsx
import { Inter } from "next/font/google";
import "./globals.css";
import ClientAuthProvider from "@/components/auth/ClientAuthProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "zuiso - 日常のイメージを記録し、AIと振り返るライフログサービス",
  description:
    "AIで画像を分析し、ライフログとして記録・振り返りができるWebサービス",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <ClientAuthProvider>{children}</ClientAuthProvider>
      </body>
    </html>
  );
}
