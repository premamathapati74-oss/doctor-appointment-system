import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import TopBar from "./TopBar";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "../styles/layout.css";

export default function Layout() {
    const { user, profile, loading } = useAuth();
    // Login ho gaya par profile nahi bani => pehle profile banwao
    if (!loading && user && !profile) return <Navigate to="/profile-setup" replace />;

    return (
        <div className="site">
            <TopBar />
            <Navbar />
            <main className="main"><Outlet /></main>
            <Footer />
        </div>
    );
}
