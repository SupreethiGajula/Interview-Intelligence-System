import { useState, useEffect } from "react";
import Login from "./components/Login";
import Register from "./components/Register";
import RecruiterDashboard from "./components/RecruiterDashboard";
import CandidateDashboard from "./components/CandidateDashboard";
import Home from "./components/Home"

function App() {

  const [user, setUser] = useState(null);
  const [showRegister, setShowRegister] = useState(false);
  const [page,setPage] = useState("home");
  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  if (!user) {
    if (page === "home") {
      return <Home setPage={setPage} />;
    }

    if (page === "login") {
      return <Login setUser={setUser} setPage={setPage} />;
    }

    if (page === "register") {
      return <Register setUser={setUser} setPage={setPage} />;
    }
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