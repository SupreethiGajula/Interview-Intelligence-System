import { useState, useEffect } from "react";
import AddCandidate from "./components/AddCandidate";
import CandidateList from "./components/CandidateList";

function App() {

  const [candidates, setCandidates] = useState([]);

  const fetchCandidates = async () => {
    const res = await fetch("http://localhost:5001/candidates");
    const data = await res.json();

    setCandidates(data);
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  return (
    <div style={{ padding: "40px" }}>
      <h1>Interview Intelligence System</h1>

      <AddCandidate refreshCandidates={fetchCandidates} />

      <CandidateList candidates={candidates} refreshCandidates={fetchCandidates} />
    </div>
  );
}

export default App;