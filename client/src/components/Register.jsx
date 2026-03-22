import { useState, useEffect } from "react";
import { Eye, EyeClosed } from "lucide-react";

function Register({ setUser, setPage }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("candidate");
  const [showPassword, setShowPassword] = useState(false);
  const [targetRole, setTargetRole] = useState("");
  const [roles, setRoles] = useState([]);
  const [experience,setExperience] = useState("");

  useEffect(() => {
    fetch("http://localhost:5001/roleweights")
      .then(res => res.json())
      .then(data => setRoles(data))
      .catch(err => console.error(err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("http://localhost:5001/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role, targetRole,experience }),
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
      setPage("dashboard");
    } else {
      alert(data.message);
    }
  };

  return (
    <div
      className="min-h-screen relative flex items-center justify-end pr-40 bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1497864149936-d3163f0c0f4b?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
      }}
    >

      {/* Register Card */}
      <div className="relative z-10 bg-white p-8 rounded-2xl shadow-2xl w-110">
        <h2 className="text-3xl font-bold text-center mb-2 text-gray-800">
          Create Account ✨
        </h2>
        <p className="text-gray-500 text-center mb-6">Register to get started</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          {/* Email */}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          {/* Password with eye toggle */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <span
              className="absolute right-3 top-3 cursor-pointer text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <Eye size={20} /> : <EyeClosed size={20} />}
            </span>
          </div>

          {/* Role select */}
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="candidate">Candidate</option>
            <option value="recruiter">Recruiter</option>
          </select>
          {/* Conditionally show target role only for candidates */}
          {role === "candidate" && (
            <>
              <select
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full mb-6 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select Target Role</option>
                {roles.map((role) => (
                  <option key={role._id} value={role.role}>
                    {role.role}
                  </option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Experience (in years)"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="w-full p-3 border rounded-lg"
                min="0"
              />
            </>
          )}
          {/* Register Button */}
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 transition"
          >
            Register
          </button>
        </form>

        {/* Switch to Login */}
        <p className="text-sm text-gray-500 mt-4 text-center">
          Already have an account?
          <button
            type="button"
            onClick={() => setPage("login")}
            className="text-indigo-600 hover:underline ml-1"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
}

export default Register;