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
import { useState } from "react";
import Login from "./components/Login";
import Register from "./components/Register";

function App() {

  const [user, setUser] = useState(null);
  const [showRegister, setShowRegister] = useState(false);

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

  return <h2>Welcome {user.name}</h2>;
}

export default App;