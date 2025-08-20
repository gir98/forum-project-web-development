import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

export default function Home() {
  const [threads, setThreads] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // fetch threads
    api.get("/threads").then((res) => setThreads(res.data));

    // fetch logged in user (if token exists)
    const token = localStorage.getItem("token");
    if (token) {
      api
        .get("/auth/me", { headers: { Authorization: `Bearer ${token}` } })
        .then((res) => setUser(res.data))
        .catch(() => setUser(null));
    }
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this thread?")) return;

    try {
      await api.delete(`/threads/${id}`);
      setThreads((prev) => prev.filter((t) => t._id !== id)); // update UI
    } catch (err) {
      alert("Failed to delete thread");
    }
  };

  return (
    <div>
      <h2>Forum Threads</h2>
      <ul>
        {threads.map((thread) => (
          <li key={thread._id}>
            <Link to={`/threads/${thread._id}`}>{thread.title}</Link> —{" "}
            {thread.author?.username}
            {user && user.id === thread.author?._id && (
              <button onClick={() => handleDelete(thread._id)}>🗑️ Delete</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
