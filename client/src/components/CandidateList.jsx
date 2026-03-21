// src/components/CandidateList.jsx
import { useState, useEffect } from "react";

function CandidateList({ candidates, refreshCandidates }) {
    const [scores, setScores] = useState({});
    const [selectedRole, setSelectedRole] = useState("");
    const [roles, setRoles] = useState([]);
    const [sortOrder, setSortOrder] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    // Fetch roles for filter dropdown
    useEffect(() => {
        fetch("http://localhost:5001/roleweights")
            .then((res) => res.json())
            .then((data) => setRoles(data))
            .catch((err) => console.error(err));
    }, []);

    // Filtering and sorting
    let filteredCandidates = selectedRole
        ? candidates.filter((c) => c.targetRole === selectedRole)
        : candidates;

    filteredCandidates = filteredCandidates.filter(
        (c) =>
            c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (sortOrder === "asc") {
        filteredCandidates = [...filteredCandidates].sort(
            (a, b) => (a.finalScore || 0) - (b.finalScore || 0)
        );
    }
    if (sortOrder === "desc") {
        filteredCandidates = [...filteredCandidates].sort(
            (a, b) => (b.finalScore || 0) - (a.finalScore || 0)
        );
    }

    // Handle input changes
    const handleChange = (id, field, value) => {
        setScores((prev) => ({
            ...prev,
            [id]: {
                ...prev[id],
                [field]: Number(value), // Convert input to number
            },
        }));
    };

    // Submit scores
    const submitScores = async (id) => {
        const candidateScores = {
            dsaScore: Number(scores[id]?.dsaScore || 0),
            systemDesignScore: Number(scores[id]?.systemDesignScore || 0),
            projectScore: Number(scores[id]?.projectScore || 0),
            hrScore: Number(scores[id]?.hrScore || 0)
        };
        if (!candidateScores) {
            alert("Please enter at least one score.");
            return;
        }

        try {
            const res = await fetch(`http://localhost:5001/candidates/${id}/scores`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify(candidateScores),
            });

            if (!res.ok) throw new Error("Failed to update scores");

            alert("Scores updated successfully!");
            refreshCandidates();
        } catch (err) {
            console.error(err);
            alert("Error updating scores");
        }
    };
    const updateStatus = async (id, status) => {
        try {
            const res = await fetch(`http://localhost:5001/candidates/${id}/status`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({ status }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || "Failed to update status");
            }

            const updatedCandidate = await res.json();
            console.log("Updated candidate:", updatedCandidate);
            alert(`Status updated to "${status}"`);
            refreshCandidates(); // refresh list to show updated status
        } catch (err) {
            console.error(err);
            alert(`Error: ${err.message}`);
        }
    };

    return (
        <div className="space-y-4">
            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 items-center">
                <div>
                    <label className="font-semibold mr-2">Filter by Role:</label>
                    <select
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value)}
                        className="border rounded-lg p-2"
                    >
                        <option value="">All Roles</option>
                        {roles.map((role) => (
                            <option key={role._id} value={role.role}>
                                {role.role}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="font-semibold mr-2">Sort by Final Score:</label>
                    <select
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                        className="border rounded-lg p-2"
                    >
                        <option value="">No Sorting</option>
                        <option value="desc">Highest First</option>
                        <option value="asc">Lowest First</option>
                    </select>
                </div>

                <div className="flex-1">
                    <input
                        type="text"
                        value={searchTerm}
                        placeholder="Search by name or email"
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full border rounded-lg p-2"
                    />
                </div>
            </div>

            {/* Candidate Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white/80 backdrop-blur-md rounded-xl shadow-md">
                    <thead className="bg-gray-200/70">
                        <tr>
                            {[
                                "Name",
                                "Email",
                                "Experience",
                                "Role",
                                "DSA",
                                "System Design",
                                "Projects",
                                "HR",
                                "Final Score",
                                "Status",
                                "Action",
                            ].map((header) => (
                                <th
                                    key={header}
                                    className="text-left px-4 py-2 text-gray-700 font-medium"
                                >
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filteredCandidates.map((c) => (
                            <tr
                                key={c._id}
                                className="border-b last:border-b-0 hover:bg-gray-100/50 transition"
                            >
                                <td className="px-4 py-2">{c.name}</td>
                                <td className="px-4 py-2">{c.email}</td>
                                <td className="px-4 py-2">{c.experience}</td>
                                <td className="px-4 py-2">{c.targetRole}</td>

                                {/* Score Inputs */}
                                {["dsaScore", "systemDesignScore", "projectScore", "hrScore"].map(
                                    (field) => (
                                        <td key={field} className="px-2 py-1">
                                            <input
                                                type="number"
                                                value={
                                                    scores[c._id]?.[field] !== undefined
                                                        ? scores[c._id][field]
                                                        : 0 // default to 0 if not yet set
                                                }
                                                onChange={(e) =>
                                                    handleChange(c._id, field, e.target.value)
                                                }
                                                className="w-16 p-1 border rounded-lg text-center"
                                                min="0"
                                            />
                                        </td>
                                    )
                                )}

                                <td className="px-4 py-2">{c.finalScore}</td>
                                <td>
                                    <select
                                        value={c.status}
                                        onChange={(e) => updateStatus(c._id, e.target.value)}
                                        className="border p-1 rounded"
                                    >
                                        <option value="Applied">Applied</option>
                                        <option value="Interviewed">Interviewed</option>
                                        <option value="Selected">Hired</option>
                                        <option value="Rejected">Rejected</option>
                                    </select>
                                </td>

                                <td className="px-4 py-2">
                                    <button
                                        onClick={() => submitScores(c._id)}
                                        className="bg-indigo-600 text-white px-3 py-1 rounded-lg hover:bg-indigo-700 transition text-sm"
                                    >
                                        Update
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default CandidateList;