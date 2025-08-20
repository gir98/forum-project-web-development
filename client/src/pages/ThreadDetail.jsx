import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";

export default function ThreadDetail() {
  const { id } = useParams();
  const [thread, setThread] = useState(null);
  const [reply, setReply] = useState("");

  const fetchThread = async () => {
    try {
      const res = await api.get(`/threads/${id}`);
      setThread(res.data);
    } catch (err) {
      console.error("❌ Fetch thread error:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchThread();
  }, [id]);

  const handleReply = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post(`/threads/${id}/replies`, { text: reply });
      setThread(res.data); // ✅ updated thread from backend
      setReply("");
    } catch (err) {
      console.error("❌ Reply error:", err.response?.data || err.message);
      alert(err.response?.data?.error || "Failed to add reply");
    }
  };

  if (!thread) return <p>Loading...</p>;

  return (
    <div>
      <h2>{thread.title}</h2>
      <p>{thread.description}</p>
      <p>
        <strong>Author:</strong> {thread.author?.username}
      </p>
      <hr />
      <h3>Replies</h3>
      <ul>
        {thread.replies.length > 0 ? (
          thread.replies.map((r, i) => (
            <li key={i}>
              {r.text} — <em>{r.author?.username || "Unknown"}</em>
            </li>
          ))
        ) : (
          <p>No replies yet.</p>
        )}
      </ul>
      <form onSubmit={handleReply}>
        <input
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          placeholder="Write a reply..."
          required
        />
        <button type="submit">Reply</button>
      </form>
    </div>
  );
}
