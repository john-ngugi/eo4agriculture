// NavBar component props interface
interface NavbarProps {
  currentView: "home" | "dashboard";
  onViewChange: (view: "home" | "dashboard") => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, onViewChange }) => {
  return (
    <nav className="bg-white shadow-md border-b border-gray-200 px-6 py-3 flex-shrink-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <div className="text-xl font-bold" style={{ color: "#017939" }}>
            AIMS
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => onViewChange("home")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                currentView === "home"
                  ? "text-white"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
              }`}
              style={{
                backgroundColor:
                  currentView === "home" ? "#efab24" : "transparent",
              }}
            >
              Home
            </button>
            <button
              onClick={() => onViewChange("dashboard")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                currentView === "dashboard"
                  ? "text-white"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
              }`}
              style={{
                backgroundColor:
                  currentView === "dashboard" ? "#efab24" : "transparent",
              }}
            >
              Dashboard
            </button>
          </div>
        </div>

        {/* Logo section on the right */}
        <div className="flex items-center space-x-4">
          {/* First Logo */}
          <div className="w-10 h-10 rounded-lg shadow-sm overflow-hidden">
            <img
              src="/data/muranga.png"
              alt="First Logo"
              className="w-full h-full object-contain"
            />
          </div>

          {/* Second Logo */}
          <div className="w-10 h-10 rounded-lg shadow-sm overflow-hidden">
            <img
              src="/data/ksa_logo.png"
              alt="Second Logo"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
