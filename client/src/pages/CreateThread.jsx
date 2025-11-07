import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

export default function CreateThread() {
  const [form, setForm] = useState({ title: "", description: "", tags: "" });
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/threads", { ...form, tags: form.tags.split(",").map(t => t.trim()) });
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Failed to create thread");
    }
  };

  return (
    <div>
      <h2>Create Thread</h2>
      <form onSubmit={handleSubmit}>
        <input name="title" placeholder="Title" onChange={handleChange} required />
        <textarea name="description" placeholder="Description" onChange={handleChange} required />
        <input name="tags" placeholder="Tags (comma separated)" onChange={handleChange} />
        <button type="submit">Create</button>
      </form>
    </div>
  );
}
