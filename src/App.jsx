import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import RequireAuth from "./components/RequireAuth";
import Login from "./pages/Login";
import ProfileSetup from "./pages/ProfileSetup";
import Home from "./pages/Home";
import Doctors from "./pages/Doctors";
import Hospitals from "./pages/Hospitals";
import BookAppointment from "./pages/BookAppointment";
import Appointments from "./pages/Appointments";
import Reports from "./pages/Reports";
import Feedback from "./pages/Feedback";
import Departments from "./pages/Departments";
import HealthCheckup from "./pages/HealthCheckup";
import International from "./pages/International";
import Corporate from "./pages/Corporate";
import Blog from "./pages/Blog";
import SeedData from "./pages/SeedData";
import NotFound from "./pages/NotFound";
import "./styles/pages.css";
import Admin from "./pages/Admin";

const priv = (el) => <RequireAuth>{el}</RequireAuth>;

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/profile-setup" element={<ProfileSetup />} />

      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/book" element={<Doctors />} />
        <Route path="/hospitals" element={<Hospitals />} />
        <Route path="/departments" element={<Departments />} />
        <Route path="/health-checkup" element={<HealthCheckup />} />
        <Route path="/international" element={<International />} />
        <Route path="/corporate" element={<Corporate />} />
        <Route path="/blog" element={<Blog />} />

        {/* Login zaroori */}
        <Route path="/book/:id" element={priv(<BookAppointment />)} />
        <Route path="/appointments" element={priv(<Appointments />)} />
        <Route path="/reports" element={priv(<Reports />)} />
        <Route path="/feedback" element={priv(<Feedback />)} />

        <Route path="/seed" element={<SeedData />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
