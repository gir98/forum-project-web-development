import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Signup(){
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { register } = useAuth();
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try { await register(username, email, password); nav("/"); }
    catch(err){ setError(err.response?.data?.error || "Signup failed"); }
  };

  return (
    <form onSubmit={submit} style={{display:"grid",gap:8,maxWidth:360}}>
      <h2>Sign up</h2>
      <input placeholder="Username" value={username} onChange={e=>setUsername(e.target.value)} />
      <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
      <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
      {error && <div style={{color:"crimson"}}>{error}</div>}
      <button>Create account</button>
    </form>
  );
}
