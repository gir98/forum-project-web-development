import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";

const ThreadDetail = () => {
  const { id } = useParams();
  const [thread, setThread] = useState(null);
  const [newReply, setNewReply] = useState("");

  // Fetch thread details
  useEffect(() => {
    const fetchThread = async () => {
      try {
        const res = await api.get(`/threads/${id}`);
        setThread(res.data);
      } catch (error) {
        console.error("Error fetching thread:", error);
      }
    };
    fetchThread();
  }, [id]);

  // Handle top-level reply
  const handleReply = async (parentReplyId = null) => {
    if (!newReply.trim()) return;
    try {
      await api.post(`/threads/${id}/replies`, { content: newReply, parentReplyId });
      setNewReply("");
      const res = await api.get(`/threads/${id}`);
      setThread(res.data);
    } catch (error) {
      console.error("Error posting reply:", error);
    }
  };

  // Nested reply component
  const Reply = ({ reply, depth = 0 }) => {
    const [showForm, setShowForm] = useState(false);
    const [replyText, setReplyText] = useState("");

    const handleNestedReply = async () => {
      if (!replyText.trim()) return;
      try {
        await api.post(`/threads/${id}/replies`, { content: replyText, parentReplyId: reply._id });
        setReplyText("");
        setShowForm(false);
        const res = await api.get(`/threads/${id}`);
        setThread(res.data);
      } catch (error) {
        console.error("Error posting nested reply:", error);
      }
    };

    return (
      <div
        style={{
          marginLeft: depth * 20,
          borderLeft: "1px solid #444",
          paddingLeft: 10,
          marginTop: 10,
        }}
      >
        <p>
          <b>{reply.author?.username || "Anonymous"}:</b> {reply.content}
        </p>

        <button onClick={() => setShowForm(!showForm)}>Reply</button>

        {showForm && (
          <div style={{ marginTop: 8 }}>
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write a reply..."
              style={{ width: "100%", height: "60px" }}
            />
            <button onClick={handleNestedReply}>Send</button>
          </div>
        )}

        {reply.children && reply.children.map((child) => (
          <Reply key={child._id} reply={child} depth={depth + 1} />
        ))}
      </div>
    );
  };

  if (!thread) return <div>Loading thread...</div>;

  return (
    <div className="thread-detail" style={{ maxWidth: "700px", margin: "auto", padding: 20 }}>
      <h2>{thread.title}</h2>
      <p>{thread.description}</p>
      <p><b>Tags:</b> {thread.tags?.join(", ")}</p>
      <hr />

      <h3>Replies</h3>
      {thread.replies.length === 0 ? (
        <p>No replies yet. Be the first to reply!</p>
      ) : (
        thread.replies.map((reply) => <Reply key={reply._id} reply={reply} />)
      )}

      <div className="reply-box" style={{ marginTop: 20 }}>
        <h4>Add a Reply</h4>
        <textarea
          value={newReply}
          onChange={(e) => setNewReply(e.target.value)}
          placeholder="Write your reply..."
          style={{ width: "100%", height: "80px" }}
        />
        <button onClick={() => handleReply(null)}>Submit</button>
      </div>
    </div>
  );
};

export default ThreadDetail;
