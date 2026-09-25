import useAuth from "../hooks/useAuth";
import { Navigate } from "react-router-dom";
import useAutoLogout from "../hooks/useAutoLogout";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, profile, loading } = useAuth();

  console.log("ProtectedRoute → loading:", loading);
  console.log("ProtectedRoute → user:", user);

  useAutoLogout(5)

  if (loading) return <div>Loading session...</div>;

  if (!user) {
    console.log("No user, redirecting...");
    return <Navigate to="/" replace />;
  }

  if (!profile || profile.is_active === false) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(profile.role)) {
    const destination = {
      admin: "/admin",
      staff: "/staff",
      faculty: "/faculty",
      student: "/student",
    }[profile.role] || "/";
    return <Navigate to={destination} replace />;
  }

  console.log("User verified, showing protected page.");
  return children;
}
