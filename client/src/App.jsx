import { useState, useEffect } from "react";
import Login from "./components/Login";
import Register from "./components/Register";
import RecruiterDashboard from "./components/RecruiterDashboard";
import CandidateDashboard from "./components/CandidateDashboard";
import Home from "./components/Home";
import AboutUs from "./components/AboutUs";
import Navbar from "./components/Navbar";

function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("home");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Render content based on user & page
  const renderPage = () => {
    if (!user) {
      if (page === "home") return <Home setPage={setPage} />;
      if (page === "login") return <Login setUser={setUser} setPage={setPage} />;
      if (page === "register") return <Register setUser={setUser} setPage={setPage} />;
      if (page === "about") return <AboutUs setPage={setPage} />;
    } else {
      // if (page === "about") return <AboutUs setPage={setPage} />;

      // Show dashboards based on role
      return user.role === "recruiter"
        ? <RecruiterDashboard user={user} setUser={setUser} setPage={setPage} />
        : <CandidateDashboard user={user} setUser={setUser} setPage={setPage} />;
    }
  };

  return (
    <>
      <Navbar user={user} setUser={setUser} setPage={setPage} />
      {renderPage()}
    </>
  );
}

export default App;