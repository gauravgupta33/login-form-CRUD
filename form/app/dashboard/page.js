"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const Dashboard = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [editingFeedback, setEditingFeedback] = useState(null);
  const router = useRouter();

  
  useEffect(() => {
    const fetchFeedbacks = async () => {
      const response = await fetch("http://localhost:5000/api/feedback");
      const data = await response.json();
      setFeedbacks(data);
    };

    fetchFeedbacks();
  }, []);

  
  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this feedback?");
    if (!confirmed) return;

    try {
      const response = await fetch(`http://localhost:5000/api/feedback/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setFeedbacks(feedbacks.filter((f) => f._id !== id));
        alert("Feedback deleted successfully");
      } else {
        alert("Failed to delete feedback");
      }
    } catch (error) {
      console.error("Error deleting feedback:", error);
      alert("An error occurred");
    }
  };

  
  const handleEdit = (feedback) => {
    setEditingFeedback(feedback);
  };

  
  const handleUpdate = async (updatedText) => {
    if (!editingFeedback) return;

    try {
      const response = await fetch(`http://localhost:5000/api/feedback/${editingFeedback._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: updatedText }),
      });
      if (response.ok) {
        const updatedFeedback = await response.json();
        setFeedbacks((prev) =>
          prev.map((f) => (f._id === updatedFeedback._id ? updatedFeedback : f))
        );
        setEditingFeedback(null);
        alert("Feedback updated successfully");
      } else {
        alert("Failed to update feedback");
      }
    } catch (error) {
      console.error("Error updating feedback:", error);
      alert("An error occurred");
    }
  };

  const handleLogout = () => {
    alert("Logged out");
    router.push("/login");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-300">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-xl w-full">
        <h1 className="text-center font-bold text-2xl py-3">
          Admin Feedback Dashboard
        </h1>
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th>ID</th>
              <th>Feedback</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {feedbacks.map((f, index) => (
              <tr key={f._id}>
                <td>{index + 1}</td>
                <td>{f.text}</td>
                <td>{new Date(f.date).toLocaleDateString()}</td>
                <td className="flex gap-2">
                  <button
                    onClick={() => alert(`Viewing: ${f.text}`)}
                    className="bg-gray-300 rounded-sm px-3"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleEdit(f)}
                    className="bg-gray-300 rounded-sm px-3"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(f._id)}
                    className="bg-gray-300 rounded-sm px-3"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {editingFeedback && (
          <div className="mt-4">
            <input
              type="text"
              defaultValue={editingFeedback.text}
              onChange={(e) =>
                setEditingFeedback({ ...editingFeedback, text: e.target.value })
              }
              className="w-full border p-2 rounded"
            />
            <button
              onClick={() => handleUpdate(editingFeedback.text)}
              className="mt-2 bg-blue-500 text-white py-1 px-4 rounded"
            >
              Save
            </button>
          </div>
        )}
        <div className="mt-4 text-center">
          <button onClick={handleLogout} className="text-blue-500 hover:text-blue-700">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
