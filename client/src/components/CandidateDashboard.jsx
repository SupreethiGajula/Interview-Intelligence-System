function CandidateDashboard({ user }) {
    return (
        <div>
            <h2>Candidate Dashboard</h2>
            <p>Welcome {user.name}</p>
            <p>Here you can view your application status.</p>
            <button onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                window.location.reload();
            }}>
                Logout
            </button>
        </div>
    );
}

export default CandidateDashboard;