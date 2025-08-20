import React, { useState, useEffect } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

export default function CreateThread() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [category, setCategory] = useState("");
  const navigate = useNavigate();

  // ✅ redirect if not logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to create a thread!");
      navigate("/login");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await api.post(
        "/threads",
        { title, description, tags: tags.split(","), category },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Thread created!");
      navigate("/");
    } catch (err) {
      console.error("❌ Create thread error:", err.response?.data || err.message);
      alert("Failed to create thread");
    }
  };

  return (
    <div>
      <h2>Create Thread</h2>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          placeholder="Tags (comma separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
        <input
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <button type="submit">Create</button>
      </form>
    </div>
  );
}
  