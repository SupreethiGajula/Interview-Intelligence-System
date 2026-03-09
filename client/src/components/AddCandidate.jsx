import {useState} from "react";
function AddCandidate({refreshCandidates}){
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [experience, setExperience] = useState("");
  const [skills, setSkills] = useState("");
  const [targetRole, setTargetRole] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const candidate = {
      name,
      email,
      experience: Number(experience),
      skills: skills.split(","),
      targetRole
         };
    

    const res = await fetch("http://localhost:5001/candidates", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(candidate)
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
    //we are clearing the inputs after the form submit
  }

  return (
    <div style={{ marginBottom: "40px" }}>
      <h2>Add Candidate</h2>

      <form onSubmit={handleSubmit}>

        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <br /><br />

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <br /><br />

        <input
          placeholder="Experience"
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
        />

        <br /><br />

        <input
          placeholder="Skills (comma separated)"
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
        />

        <br /><br />

        <input
          placeholder="Target Role"
          value={targetRole}
          onChange={(e) => setTargetRole(e.target.value)}
        />

        <br /><br />

        <button type="submit">
          Add Candidate
        </button>

      </form>
    </div>
  );
}

export default AddCandidate;
