import AuthGuard from "@/components/AuthGuard";
import Navbar from "@/components/Navigation";

export default function ProtectedLayout({ children }) {
  return (
    <AuthGuard>
      <Navbar />
      {children}
    </AuthGuard>
  );
}
