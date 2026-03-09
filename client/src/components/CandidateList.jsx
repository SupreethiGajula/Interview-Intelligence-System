import { useState } from "react";

function CandidateList({ candidates, refreshCandidates }) {

  const [scores, setScores] = useState({});

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
          </tr>
        </thead>

        <tbody>
          {candidates.map((c) => (
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

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CandidateList;