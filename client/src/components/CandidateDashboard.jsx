import { useEffect, useState } from "react";
import ScoreChart from "./ScoreChart";

function CandidateDashboard({ user }) {
  const [candidate, setCandidate] = useState(null);

  const fetchMyData = async () => {
    const res = await fetch("http://localhost:5001/candidates/me", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const data = await res.json();
    setCandidate(data);
  };

  useEffect(() => {
    fetchMyData();
  }, []);

  if (!candidate) return <h3 className="p-6">Loading...</h3>;

  return (
    <div
      className="min-h-screen p-6 space-y-6 bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://plus.unsplash.com/premium_photo-1681399975135-252eab5fd2db?q=80&w=1674&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
      }}
    >

      {/* Top Card */}
      <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-8 flex flex-col items-center text-center text-gray-800 space-y-2">
        <h1 className="text-2xl font-bold">{candidate.name}</h1>
        <p><b>Email:</b> {candidate.email}</p>
        <p><b>Experience:</b> {candidate.experience} years</p>
        <p><b>Target Role:</b> {candidate.targetRole}</p>
        <p className="text-xl font-semibold mt-2">
          Application Status: {candidate.status}
        </p>
      </div>

      {/* Bottom Card */}
      <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-6 flex flex-col md:flex-row gap-6">
        
        {/* Left: Scores */}
        <div className="flex-1 space-y-2 text-gray-800">
          <h2 className="text-xl font-semibold mb-2">Your Scores</h2>
          <p><b>DSA:</b> {candidate.dsaScore}</p>
          <p><b>System Design:</b> {candidate.systemDesignScore}</p>
          <p><b>Projects:</b> {candidate.projectScore}</p>
          <p><b>HR:</b> {candidate.hrScore}</p>
          <h3 className="mt-2 font-semibold">
            Final Score: {candidate.finalScore}
          </h3>
        </div>

        {/* Right: Chart */}
        <div className="flex-1 flex items-center justify-center">
          <ScoreChart candidate={candidate} />
        </div>

      </div>
    </div>
  );
}

export default CandidateDashboard;