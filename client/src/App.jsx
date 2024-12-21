import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { RequireAuth, RequireNotAuth } from "./components/RequireAuth";
import PersistLogin from "./components/PersistLogin";
import "./styles/main.css";
import AdminLayout from "./components/Layout/AdminLayout";
import { Home } from "./pages/Home";
import { Error } from "./pages/Error";
import { Register } from "./pages/LoginSystem/register";
import { Login } from "./pages/LoginSystem/login";

function App() {
  return (
    <Router>
      <Routes>
        {/* PersistLogin ensures authentication state is preserved */}
        <Route element={<PersistLogin />}>
          {/* Public Routes */}
          <Route element={<RequireNotAuth />}>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
          </Route>

          {/* Protected Routes */}
          <Route element={<AdminLayout />}>
            <Route path="/" element={<Home />} />
            <Route element={<RequireAuth allowedRoles={["user", "admin"]} />}>
              <Route path="/private" element={<h1>Private Page</h1>} />
            </Route>
            <Route element={<RequireAuth allowedRoles={["admin"]} />}>
              <Route path="/admin" element={<h1>Admin Page</h1>} />
            </Route>
          </Route>

          {/* Fallback for Undefined Routes */}
          <Route path="*" element={<Error code="404" />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
