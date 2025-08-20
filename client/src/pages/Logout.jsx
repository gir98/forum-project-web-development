import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("token");   // clear token
    api.post("/auth/logout").finally(() => {
      navigate("/login");  // redirect
    });
  }, [navigate]);

  return <p>Logging out...</p>;
}
