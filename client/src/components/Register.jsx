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
  const [experience, setExperience] = useState("");
  const [errors, setErrors] = useState({});

  // Fetch available roles for candidate dropdown
  useEffect(() => {
    fetch("http://localhost:5001/roleweights")
      .then((res) => res.json())
      .then((data) => setRoles(data))
      .catch((err) => console.error(err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    const nameRegex = /^[A-Za-z ]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

    // Name validation
    if (!nameRegex.test(name)) {
      newErrors.name = "Name should contain only alphabets";
    }

    // Email validation
    if (!emailRegex.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!passwordRegex.test(password)) {
      newErrors.password =
        "Password must be 8+ chars with uppercase, lowercase and number";
    }

    // Candidate-only validations
    if (role === "candidate") {
      if (!targetRole) {
        newErrors.targetRole = "Please select a target role";
      }

      if (experience === "" || Number(experience) < 0) {
        newErrors.experience = "Experience must be 0 or more";
      }
    }

    setErrors(newErrors);

    // Stop API call if errors exist
    if (Object.keys(newErrors).length > 0) return;

    const response = await fetch("http://localhost:5001/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
        role,
        targetRole,
        experience,
      }),
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
      <div className="relative z-10 bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-[440px]">
        <h2 className="text-3xl font-bold text-center mb-2 text-gray-800">
          Create Account ✨
        </h2>
        <p className="text-gray-500 text-center mb-6">
          Register to get started
        </p>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Name */}
          <div>
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setErrors({ ...errors, name: "" });
              }}
              className={`w-full p-3 border rounded-lg ${
                errors.name ? "border-red-500" : ""
              }`}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrors({ ...errors, email: "" });
              }}
              className={`w-full p-3 border rounded-lg ${
                errors.email ? "border-red-500" : ""
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrors({ ...errors, password: "" });
                }}
                className={`w-full p-3 border rounded-lg ${
                  errors.password ? "border-red-500" : ""
                }`}
              />
              <span
                className="absolute right-3 top-3 cursor-pointer text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <Eye size={20} /> : <EyeClosed size={20} />}
              </span>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {/* Role */}
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full p-3 border rounded-lg"
          >
            <option value="candidate">Candidate</option>
            <option value="recruiter">Recruiter</option>
          </select>

          {/* Candidate-only fields */}
          {role === "candidate" && (
            <>
              <div>
                <select
                  value={targetRole}
                  onChange={(e) => {
                    setTargetRole(e.target.value);
                    setErrors({ ...errors, targetRole: "" });
                  }}
                  className={`w-full p-3 border rounded-lg ${
                    errors.targetRole ? "border-red-500" : ""
                  }`}
                >
                  <option value="">Select Target Role</option>
                  {roles.map((roleItem) => (
                    <option key={roleItem._id} value={roleItem.role}>
                      {roleItem.role}
                    </option>
                  ))}
                </select>
                {errors.targetRole && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.targetRole}
                  </p>
                )}
              </div>

              <div>
                <input
                  type="number"
                  placeholder="Experience (in years)"
                  value={experience}
                  onChange={(e) => {
                    setExperience(e.target.value);
                    setErrors({ ...errors, experience: "" });
                  }}
                  className={`w-full p-3 border rounded-lg ${
                    errors.experience ? "border-red-500" : ""
                  }`}
                  min="0"
                />
                {errors.experience && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.experience}
                  </p>
                )}
              </div>
            </>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 transition"
          >
            Register
          </button>
        </form>

        {/* Login switch */}
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