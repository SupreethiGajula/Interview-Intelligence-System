// src/components/RecruiterDashboard.jsx
import { useState, useEffect } from "react";
import AddCandidate from "./AddCandidate";
import CandidateList from "./CandidateList";

function RecruiterDashboard({ user }) {
  const [candidates, setCandidates] = useState([]);

  const fetchCandidates = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/candidates`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await res.json();
      setCandidates(data);
    } catch (err) {
      console.error("Error fetching candidates:", err);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  return (
    <div
      className="min-h-screen p-6 space-y-6 bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://plus.unsplash.com/premium_photo-1681399975135-252eab5fd2db?q=80&w=1674&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
      }}
    >
      {/* Header Card */}
      <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-6 text-gray-800">
        <h1 className="text-3xl font-semibold">
          Welcome, {user.name} 👋
        </h1>
        <p className="text-gray-600 mt-1">
          Manage candidates and evaluate their performance
        </p>
      </div>

      {/* Add Candidate */}
      <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-6">
        <AddCandidate refreshCandidates={fetchCandidates} />
      </div>

      {/* Candidate List */}
      <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-6 overflow-x-auto">
        <CandidateList
          candidates={candidates}
          refreshCandidates={fetchCandidates}
        />
      </div>
    </div>
  );
}

export default RecruiterDashboard;