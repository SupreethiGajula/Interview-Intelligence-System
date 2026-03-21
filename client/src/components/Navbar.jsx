import { LampDesk } from "lucide-react";

function Navbar({ user, setUser, setPage }) {
  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    setPage("home");
  };

  return (
    <nav className="w-full bg-white/70 backdrop-blur-sm shadow-sm px-6 py-3 flex justify-between items-center text-sm">
  {/* App Name with Icon */}
  <div className="flex items-center text-gray-700 font-semibold text-lg space-x-2">
    <LampDesk size={24} />   {/* Icon to the left */}
    <span>Interview Intelligence</span>
  </div>

      {/* Links */}
      <div className="flex gap-4 items-center">
        
        <div className="flex gap-4 items-center">

  {!user && (
    <>
      <button
        onClick={() => setPage("home")}
        className="text-violet-900 hover:text-pink-900 transition"
      >
        Home
      </button>

      <button
        onClick={() => setPage("about")}
        className="text-violet-900 hover:text-pink-900 transition"
      >
        About Us
      </button>
    </>
  )}

</div>
        {user && (
          <button
            onClick={handleLogout}
            className="text-violet-900 hover:text-pink-900 transition text-sm"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;