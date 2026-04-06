import { useEffect, useState } from "react";
import ScoreChart from "./ScoreChart";

function CandidateDashboard({ user }) {
  const [candidate, setCandidate] = useState(null);
  const [aiFeedback, setAiFeedback] = useState("");
  const [loadingFeedback, setLoadingFeedback] = useState(false);
  const [aiRoadmap, setAiRoadmap] = useState("");
  const [loadingRoadmap, setLoadingRoadmap] = useState(false);

  const fetchMyData = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/candidates/me`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const data = await res.json();
    setCandidate(data);
  };

  const getAIFeedback = async () => {
    try {
      setLoadingFeedback(true);

      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/candidates/me/ai-feedback`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await res.json();
      setAiFeedback(data.feedback);
    } catch (err) {
      console.error(err);
      setAiFeedback("Unable to generate feedback right now.");
    } finally {
      setLoadingFeedback(false);
    }
  };

  const getAIRoadmap = async () => {
    try {
      setLoadingRoadmap(true);

      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/candidates/me/ai-roadmap`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await res.json();
      setAiRoadmap(data.roadmap);
    } catch (error) {
      console.error("Error fetching AI roadmap:", error);
      setAiRoadmap("Unable to generate roadmap right now.");
    } finally {
      setLoadingRoadmap(false);
    }
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
        <p>
          <b>Email:</b> {candidate.email}
        </p>
        <p>
          <b>Experience:</b> {candidate.experience} years
        </p>
        <p>
          <b>Target Role:</b> {candidate.targetRole}
        </p>
        <p className="text-xl font-semibold mt-2">
          Application Status: {candidate.status}
        </p>
      </div>

      {/* Bottom Card */}
      <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-6 flex flex-col md:flex-row gap-6">
        {/* Left: Scores */}
        <div className="flex-1 space-y-2 text-gray-800">
          <h2 className="text-xl font-semibold mb-2">Your Scores</h2>
          <p>
            <b>DSA:</b> {candidate.dsaScore}
          </p>
          <p>
            <b>System Design:</b> {candidate.systemDesignScore}
          </p>
          <p>
            <b>Projects:</b> {candidate.projectScore}
          </p>
          <p>
            <b>HR:</b> {candidate.hrScore}
          </p>
          <h3 className="mt-2 font-semibold">
            Final Score: {candidate.finalScore}
          </h3>
        </div>

        {/* Right: Chart */}
        <div className="flex-1 flex items-center justify-center">
          {candidate.dsaScore > 0 ||
          candidate.systemDesignScore > 0 ||
          candidate.projectScore > 0 ||
          candidate.hrScore > 0 ? (
            <ScoreChart candidate={candidate} />
          ) : (
            <p className="text-gray-500 text-center">
              No scores yet — your performance chart will unlock after the
              first round 🚀
            </p>
          )}
        </div>
      </div>

      {/* AI Card */}
      <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-md p-6">
        <div className="flex justify-center gap-4 flex-wrap">
          <button
            onClick={getAIFeedback}
            className="bg-indigo-600 text-white px-5 py-2 rounded-xl hover:bg-indigo-700 transition"
          >
            {loadingFeedback ? "Generating..." : "Get AI Feedback 🦾"}
          </button>

          <button
            onClick={getAIRoadmap}
            className="bg-emerald-600 text-white px-5 py-2 rounded-xl hover:bg-emerald-700 transition"
          >
            {loadingRoadmap ? "Generating..." : "Get AI Roadmap 🗺️"}
          </button>
        </div>

        {aiFeedback && (
          <div className="mt-4 p-4 bg-gray-50 rounded-xl border">
            <h3 className="font-semibold text-lg mb-2 text-gray-700">
              AI Interview Feedback
            </h3>
            <p className="text-gray-600 whitespace-pre-line">
              {aiFeedback}
            </p>
          </div>
        )}

        {aiRoadmap && (
          <div className="mt-4 p-4 bg-emerald-50 rounded-xl border border-emerald-200">
            <h3 className="font-semibold text-lg mb-2 text-emerald-700">
              AI Learning Roadmap
            </h3>
            <p className="text-gray-700 whitespace-pre-line">
              {aiRoadmap}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default CandidateDashboard;