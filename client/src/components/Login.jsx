import { useState } from "react";
import { Eye, EyeClosed } from "lucide-react";

function Login({ setUser, setPage }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("http://localhost:5001/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
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
      className="min-h-screen relative flex items-center justify-end pr-60  bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1497864149936-d3163f0c0f4b?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
      }}
    >

      {/* Login Card */}
      <div className="relative z-10 bg-white p-8 rounded-2xl shadow-2xl w-96">
        <h2 className="text-3xl font-bold text-center mb-2 text-gray-800">
          Welcome Back 👋
        </h2>
        <p className="text-gray-500 text-center mb-6">Login to your account</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          {/* Password */}
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

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 transition"
          >
            Login
          </button>
        </form>

        {/* Switch to Register */}
        <p className="text-sm text-gray-500 mt-4 text-center">
          Don’t have an account?
          <button
            type="button"
            onClick={() => setPage("register")}
            className="text-indigo-600 hover:underline ml-1"
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
}

export default Login;