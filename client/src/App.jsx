import { Routes, Route, Link } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import CreateThread from "./pages/CreateThread";
import Home from "./pages/Home";
import Logout from "./pages/Logout"; 
import ThreadDetail from "./pages/ThreadDetail";   // ✅ import

export default function App() {
  return (
    <div>
      <nav>
        <Link to="/">Home</Link> | 
        <Link to="/login">Login</Link> | 
        <Link to="/register">Sign up</Link> | 
        <Link to="/create">Create Thread</Link> | 
        <Link to="/logout">Logout</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/create" element={<CreateThread />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/threads/:id" element={<ThreadDetail />} /> {/* ✅ new route */}
      </Routes>
    </div>
  );
}
