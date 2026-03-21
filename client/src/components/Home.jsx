function Home({ setPage }) {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center relative"
      style={{
        backgroundImage: "url('https://plus.unsplash.com/premium_photo-1661779134041-9d618ec4c812?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')"
      }}
    >
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-6 max-w-2xl">
        <h1 className="text-5xl font-extrabold mb-4 drop-shadow-lg">
          Interview Intelligence System
        </h1>

        <p className="text-lg mb-8 drop-shadow-md">
          Boost your confidence, practice smarter, and land your dream job with powerful insights.
        </p>

        <div className="flex gap-4 justify-center flex-wrap">
          <button
            onClick={() => setPage("login")}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition shadow-lg"
          >
            Login
          </button>

          <button
            onClick={() => setPage("register")}
            className="bg-white text-indigo-600 px-6 py-3 rounded-lg border border-white hover:bg-indigo-50 transition shadow-lg"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;