import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

export default function ThreadList() {
  const [threads, setThreads] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchThreads = async () => {
      try {
        const res = await api.get("/threads");
        setThreads(res.data);
      } catch (err) {
        console.error("Error fetching threads:", err);
      }
    };

    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const res = await api.get("/auth/me");
        setUser(res.data);
      } catch {
        setUser(null);
      }
    };

    fetchThreads();
    fetchUser();
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
