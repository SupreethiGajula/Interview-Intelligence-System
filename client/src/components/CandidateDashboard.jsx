import { useEffect, useState } from "react";
import ScoreChart from "./ScoreChart";

function CandidateDashboard({ user }) {

  const [candidate, setCandidate] = useState(null);

  const fetchMyData = async () => {

    const res = await fetch("http://localhost:5001/candidates/me", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    });

    const data = await res.json();
    setCandidate(data);
  };

  useEffect(() => {
    fetchMyData();
  }, []);

  if (!candidate) return <h3>Loading...</h3>;

  return (
    <div style={{ padding: "40px" }}>

      <h1>Welcome {user.name}</h1>

      <button onClick={() => {
        localStorage.clear();
        window.location.reload();
      }}>
        Logout
      </button>

      <h2>Your Application</h2>

      <p><b>Name:</b> {candidate.name}</p>
      <p><b>Email:</b> {candidate.email}</p>
      <p><b>Experience:</b> {candidate.experience} years</p>
      <p><b>Role:</b> {candidate.targetRole}</p>

      <h3>Status: {candidate.status}</h3>

      <h2>Scores</h2>

      <p>DSA: {candidate.dsaScore}</p>
      <p>System Design: {candidate.systemDesignScore}</p>
      <p>Projects: {candidate.projectScore}</p>
      <p>HR: {candidate.hrScore}</p>

      <h3>Final Score: {candidate.finalScore}</h3>

      <ScoreChart candidate={candidate} />

    </div>
  );
}

export default CandidateDashboard;