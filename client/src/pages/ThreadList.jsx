import { useEffect, useState } from "react";
import api from "../api";

export default function ThreadList() {
  const [threads, setThreads] = useState([]);

  useEffect(() => {
    api.get("/threads")
      .then((res) => setThreads(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div style={{ maxWidth: "600px", margin: "50px auto" }}>
      <h2>Forum Threads</h2>
      <ul>
        {threads.map((t) => (
          <li key={t._id}>
            <h3>{t.title}</h3>
            <p>{t.description}</p>
            <small>Category: {t.category} | Tags: {t.tags.join(", ")}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}
