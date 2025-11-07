import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

export default function Home() {
  const [threads, setThreads] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // fetch threads
    api.get("/threads").then((res) => setThreads(res.data));

    // fetch logged in user
    const token = localStorage.getItem("token");
    if (token) {
      api
        .get("/auth/me", { headers: { Authorization: `Bearer ${token}` } })
        .then((res) => setUser(res.data))
        .catch(() => setUser(null));
    }
  }, []);

  return (
    <div>
      <h2>Forum Threads</h2>
      <ul>
        {threads.map((thread) => (
          <li key={thread._id}>
            <Link to={`/threads/${thread._id}`}>{thread.title}</Link> — {thread.author?.username}
          </li>
        ))}
      </ul>
    </div>
  );
}
