// src/components/AddCandidate.jsx
import { useState, useEffect } from "react";

function AddCandidate({ refreshCandidates }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [experience, setExperience] = useState("");
  const [skills, setSkills] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [roles, setRoles] = useState([]);

  // fetch roles when component loads
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/roleweights`)
      .then((res) => res.json())
      .then((data) => setRoles(data))
      .catch((err) => console.error(err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const candidate = {
      name,
      email,
      experience: Number(experience),
      skills: skills.split(","),
      targetRole,
    };

    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/candidates`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(candidate),
    });

    const data = await res.json();
    console.log(data);

    alert("Candidate added successfully!");
    await refreshCandidates();

    setName("");
    setEmail("");
    setExperience("");
    setSkills("");
    setTargetRole("");
  };

  return (
    <div className="flex items-center justify-center">
      <div className="bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">
          Add New Candidate
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />

          {/* Email */}
          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />

          {/* Experience */}
          <input
            type="number"
            placeholder="Experience (years)"
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            min="0"
            required
          />

          {/* Skills */}
          <input
            placeholder="Skills (comma separated)"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />

          {/* Target Role */}
          <select
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          >
            <option value="">Select Target Role</option>
            {roles.map((role) => (
              <option key={role._id} value={role.role}>
                {role.role}
              </option>
            ))}
          </select>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 transition duration-200 font-semibold"
          >
            Add Candidate
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddCandidate;