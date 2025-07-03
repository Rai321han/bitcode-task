import AuthGuard from "@/components/auth_components/AuthGuard";
import Navbar from "@/components/Navigation";

export default function ProtectedLayout({ children }) {
  return (
    <AuthGuard>
      <Navbar />
      {children}
    </AuthGuard>
  );
}
