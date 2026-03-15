import { useState, useEffect } from "react";
import ScoreChart from "./ScoreChart";

function CandidateList({ candidates, refreshCandidates }) {

    const [scores, setScores] = useState({});
    const [selectedRole, setSelectedRole] = useState("");
    const [roles, setRoles] = useState([]);
    const [sortOrder, setSortOrder] = useState("");

    // fetch roles for filter dropdown
    useEffect(() => {
        fetch("http://localhost:5001/roleweights")
            .then(res => res.json())
            .then(data => setRoles(data))
            .catch(err => console.error(err));
    }, []);

    let filteredCandidates = selectedRole
        ? candidates.filter(c => c.targetRole === selectedRole)
        : candidates;

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

    const handleChange = (id, field, value) => {
        setScores({
            ...scores,
            [id]: {
                ...scores[id],
                [field]: value
            }
        });
    };

    const submitScores = async (id) => {

        const candidateScores = scores[id];

        const res = await fetch(`http://localhost:5001/candidates/${id}/scores`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(candidateScores)
        });

        const data = await res.json();
        console.log(data);

        alert("Scores updated successfully!");

        refreshCandidates();
    };

    return (
        <div>

            <h3>Filter by Role</h3>

            <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
            >
                <option value="">All Roles</option>

                {roles.map((role) => (
                    <option key={role._id} value={role.role}>
                        {role.role}
                    </option>
                ))}
            </select>

            <br /><br />
            <h3>Sort by Final Score</h3>

            <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
            >
                <option value="">No Sorting</option>
                <option value="desc">Highest Score First</option>
                <option value="asc">Lowest Score First</option>
            </select>

            <br /><br />

            <h2>Candidate List</h2>

            <table border="1" cellPadding="10">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Experience</th>
                        <th>Role</th>
                        <th>DSA</th>
                        <th>System Design</th>
                        <th>Projects</th>
                        <th>HR</th>
                        <th>Final Score</th>
                        <th>Action</th>
                        <th>Score Chart</th>
                    </tr>
                </thead>

                <tbody>
                    {filteredCandidates.map((c) => (
                        <tr key={c._id}>

                            <td>{c.name}</td>
                            <td>{c.email}</td>
                            <td>{c.experience}</td>
                            <td>{c.targetRole}</td>

                            <td>
                                <input
                                    type="number"
                                    onChange={(e) =>
                                        handleChange(c._id, "dsaScore", e.target.value)
                                    }
                                />
                            </td>

                            <td>
                                <input
                                    type="number"
                                    onChange={(e) =>
                                        handleChange(c._id, "systemDesignScore", e.target.value)
                                    }
                                />
                            </td>

                            <td>
                                <input
                                    type="number"
                                    onChange={(e) =>
                                        handleChange(c._id, "projectScore", e.target.value)
                                    }
                                />
                            </td>

                            <td>
                                <input
                                    type="number"
                                    onChange={(e) =>
                                        handleChange(c._id, "hrScore", e.target.value)
                                    }
                                />
                            </td>

                            <td>{c.finalScore}</td>

                            <td>
                                <button onClick={() => submitScores(c._id)}>
                                    Add Scores
                                </button>
                            </td>

                            <td>
                                <ScoreChart candidate={c} />
                            </td>

                        </tr>
                    ))}
                </tbody>
            </table>

        </div>
    );
}

export default CandidateList;