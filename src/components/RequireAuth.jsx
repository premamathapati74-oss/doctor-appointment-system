import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RequireAuth({ children }) {
    const { user, profile, loading } = useAuth();
    if (loading) return <div className="center">Loading...</div>;
    if (!user) return <Navigate to="/login" replace />;
    if (!profile) return <Navigate to="/profile-setup" replace />;
    return children;
}
