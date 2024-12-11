"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const Feedback = () => {
  const [text, setText] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [feedbackId, setFeedbackId] = useState(null);

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const feedbackIdFromParams = searchParams.get("id");
    if (feedbackIdFromParams) {
      setIsEditing(true);
      setFeedbackId(feedbackIdFromParams);
      fetchFeedbackById(feedbackIdFromParams); 
    }
  }, [searchParams]);

  const fetchFeedbackById = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/feedback/${id}`);
      const data = await response.json();
      setText(data.text);
    } catch (error) {
      console.log("Error fetching feedback:", error);
      alert("Error fetching feedback for editing.");
    }
  };

  const handleSubmit = async () => {
    try {
      const url = isEditing
        ? `http://localhost:5000/api/feedback/${feedbackId}`
        : "http://localhost:5000/api/feedback";
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        alert("Failed to submit feedback");
        return;
      }

      const data = await response.json();
      alert(isEditing ? "Feedback updated!" : "Feedback submitted successfully!");
      router.push("/dashboard");
    } catch (error) {
      alert("An error occurred while submitting feedback");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-center min-h-screen shadow-2xl bg-gray-300">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <h1 className="text-2xl font-bold py-2 text-center">
            {isEditing ? "Edit Feedback" : "Add Feedback"}
          </h1>
          <div className="flex justify-evenly gap-2">
            <button
              onClick={() => {
                setIsEditing(false);
                setText("");
              }}
              className={`px-7 py-3 rounded-md mt-2 ${!isEditing ? " bg-gray-300" : "border-2"}`}
            >
              Add Feedback
            </button>
            <button
              onClick={() => {
                setIsEditing(true);
                
              }}
              className={`px-7 py-3 rounded-md mt-2 ${isEditing ? " bg-gray-300" : "border-2"}`}
            >
              Edit Feedback
            </button>
          </div>
          <div className="ml-7 py-2">
            <p>Your Feedback</p>
            <input
              placeholder="Write your feedback here"
              type="text"
              onChange={(e) => setText(e.target.value)}
              value={text}
              className="w-80 h-40 border-2 rounded-md"
            />
          </div>
          <div className="text-center px-8">
            <button
              onClick={handleSubmit}
              className="bg-gray-300 w-full py-2 rounded-md mt-2"
            >
              {isEditing ? "Update Feedback" : "Submit Feedback"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feedback;
