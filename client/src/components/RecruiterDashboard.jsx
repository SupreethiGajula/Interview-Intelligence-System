// src/components/RecruiterDashboard.jsx
import { useState, useEffect } from "react";
import AddCandidate from "./AddCandidate";
import CandidateList from "./CandidateList";

function RecruiterDashboard({ user }) {
    const [candidates, setCandidates] = useState([]);

    // Fetch candidates from backend
    const fetchCandidates = async () => {
        try {
            const res = await fetch("http://localhost:5001/candidates");
            const data = await res.json();
            setCandidates(data);
        } catch (err) {
            console.error("Error fetching candidates:", err);
        }
    };

    // Fetch candidates on component mount
    useEffect(() => {
        fetchCandidates();
    }, []);

    return (
        <div style={{ padding: "40px" }}>
            <h1>Welcome {user.name} (Recruiter)</h1>

            {/* Add Candidate Form */}
            <AddCandidate refreshCandidates={fetchCandidates} />

            <hr />

            {/* Candidate List */}
            <CandidateList
                candidates={candidates}
                refreshCandidates={fetchCandidates}
            />
            <button onClick={() => {
                localStorage.removeItem("token");
                window.location.reload();
            }}>
                Logout
            </button>
        </div>

    );
}

export default RecruiterDashboard;