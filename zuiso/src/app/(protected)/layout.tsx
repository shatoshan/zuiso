import AuthGuard from "@/components/auth/AuthGuard";
import NavBar from "@/components/layout/NavBar";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        {children}
      </div>
    </AuthGuard>
  );
}
