// import { useState, useEffect } from "react";
// import AddCandidate from "./components/AddCandidate";
// import CandidateList from "./components/CandidateList";

// function App() {

//   const [candidates, setCandidates] = useState([]);

//   const fetchCandidates = async () => {
//     const res = await fetch("http://localhost:5001/candidates");
//     const data = await res.json();

//     setCandidates(data);
//   };

//   useEffect(() => {
//     fetchCandidates();
//   }, []);

//   return (
//     <div style={{ padding: "40px" }}>
//       <h1>Interview Intelligence System</h1>

//       <AddCandidate refreshCandidates={fetchCandidates} />

//       <CandidateList candidates={candidates} refreshCandidates={fetchCandidates} />
//     </div>
//   );
// }

// export default App;
import { useState, useEffect } from "react";
import Login from "./components/Login";
import Register from "./components/Register";
import RecruiterDashboard from "./components/RecruiterDashboard";
import CandidateDashboard from "./components/CandidateDashboard";

function App() {

  const [user, setUser] = useState(null);
  const [showRegister, setShowRegister] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      // optionally call backend to verify token
      console.log("User already logged in");
    }
  }, []);

  if (!user) {
    return (
      <div>

        {showRegister ? (
          <Register setUser={setUser} />
        ) : (
          <Login setUser={setUser} />
        )}

        <button onClick={() => setShowRegister(!showRegister)}>
          {showRegister ? "Go to Login" : "Go to Register"}
        </button>

      </div>
    );

  }
  if (user.role === "recruiter") {
    return <RecruiterDashboard user={user} />;
  }

  if (user.role === "candidate") {
    return <CandidateDashboard user={user} />;
  }

  return <h2>Welcome {user.name}</h2>;

}

export default App;