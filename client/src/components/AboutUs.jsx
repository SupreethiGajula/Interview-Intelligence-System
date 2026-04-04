// src/components/AboutUs.jsx
function AboutUs() {
  return (
    <div
      className="min-h-screen bg-cover bg-center p-10 flex flex-col items-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1551822620-ac3afd8acd1f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
      }}
    >
      
      {/* Page Header */}
      <h1 className="text-4xl font-bold text-gray-50 mb-6 drop-shadow-lg">
        About Us
      </h1>
      <p className="text-gray-100 max-w-3xl text-center mb-10 drop-shadow">
       Interview Intelligence is your trusty sidekick in the world of hiring and job applications! 🕵️‍♂️  
    Recruiters can quickly evaluate candidates without drowning in spreadsheets, and candidates can 
    track their scores and progress transparently—no more guessing games.  
    It’s like giving both sides a GPS for recruitment: clear, efficient, and stress-free! 🚀
      </p>
      {/* Optional Vision/Mission Section */}
      <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-md max-w-2xl w-full ">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Our Mission</h2>
        <p className="text-gray-700">
          Our mission? Simple: make recruitment smarter, faster, and a bit more fun! 🎯  
    No more endless spreadsheets or confusing emails — just a smooth ride for
    candidates and recruiters alike. Think of it as a matchmaking app for jobs,
    but with less awkward small talk and more clarity on skills and scores. 😉
        </p>
      </div>
      {/* About the Developer */}
      <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-md max-w-2xl w-full mt-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          About the Developer
        </h2>
        <p className="text-gray-700">
          Meet <span className="font-semibold">Supreethi</span> — the one-person army behind
    this platform! 💪 Built this app from scratch, fueled by coffee ☕, a sprinkle
    of magic ✨, and an unhealthy obsession with coding. If it works, thank Supreethi;
    if it breaks… well, still blame Supreethi 😅.  
    This app exists to make recruitment smarter, easier, and a little more fun!
        </p>
      </div>

      

    </div>
  );
}

export default AboutUs;