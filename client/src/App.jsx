import { useState, useEffect } from "react";
import Login from "./components/Login";
import Register from "./components/Register";
import RecruiterDashboard from "./components/RecruiterDashboard";
import CandidateDashboard from "./components/CandidateDashboard";

function App() {

  const [user, setUser] = useState(null);
  const [showRegister, setShowRegister] = useState(false);
  useEffect(() => {
  const storedUser = localStorage.getItem("user");

  if (storedUser) {
    setUser(JSON.parse(storedUser));
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