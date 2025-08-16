import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../pages/landing/Home";
import About from "../pages/landing/About";
import Contact from "../pages/landing/Contact";
import SignIn from "../pages/auth/SignIn";
import SignUp from "../pages/auth/SignUp";
import Role from "../pages/auth/Role";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";
import ProtectedRoute from "./ProtectedRoute";
import RedirectIfAuthenticated from "./RedirectIfAuthenticated";
import worker_routes from "../routes/Worker.routes"
import userroutes from "../routes/User.routes";


const AppRoutes = () => {
  return (

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<RedirectIfAuthenticated><SignIn /></RedirectIfAuthenticated>} />
        <Route path="/register" element={<RedirectIfAuthenticated><SignUp /><ForgotPasswordPage/></RedirectIfAuthenticated>} />
        <Route path="/role" element={<Role />} />

        {userroutes.map(({ path, element }, index) => (
          <Route
            key={index}
            path={path}
            element={
              <ProtectedRoute requiredRole="user">
                {element}
              </ProtectedRoute>
            }
          />
        ))}
        {worker_routes.map(({ path, element }, index) => (
          <Route
            key={index}
            path={path}
            element={
              <ProtectedRoute requiredRole="worker">
                {element}
              </ProtectedRoute>
            }
          />
        ))}
      </Routes>

  );
};

export default AppRoutes;
