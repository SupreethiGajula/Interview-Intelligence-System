function CandidateDashboard({ user }) {
  return (
    <div>
      <h2>Candidate Dashboard</h2>
      <p>Welcome {user.name}</p>
      <p>Here you can view your application status.</p>
    </div>
  );
}

export default CandidateDashboard;