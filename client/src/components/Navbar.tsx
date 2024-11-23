import { useState } from "react";
import { Link } from "react-router-dom";
import { LuMenu, LuX, LuUser, LuLogOut } from "react-icons/lu";
import toast from "react-hot-toast";
import { axios, ENDPOINTS } from "../api";
import useAuth from "../hooks/useAuth";
import { defaultUserAvatar } from "../assets/images";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const { user, setUser } = useAuth();

  const navItems = user
    ? [
        { label: "Home", href: "/" },
        { label: "Create Article", href: "/article/create" },
      ]
    : [
        { label: "Register", href: "/register" },
        { label: "Login", href: "/login" },
      ];

  const handleLogout = async () => {
    try {
      const response = await axios.get(ENDPOINTS.AUTH.LOGOUT, {
        withCredentials: true,
      });

      // set user null in context
      setUser(null);
      // remove user from localstorage
      localStorage.removeItem("user");

      toast.success(response.data.message);
    } catch (err: any) {
      console.error(err);
      toast.error(err.response.data.message);
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-white/90 backdrop-blur-md shadow-sm z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* logo */}
        <div className="text-2xl font-bold text-gray-800">
          <Link to="/">MyBlog</Link>
        </div>

        {/* for large screens */}
        <div className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className="text-gray-600 hover:text-black transition-colors duration-300"
            >
              {item.label}
            </Link>
          ))}

          {/* user dropdown */}
          {user && (
            <div className="relative">
              <button
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                className="flex items-center space-x-2 text-gray-600 hover:text-black"
              >
                <img
                  src={
                    user.profileImg !== ""
                      ? `http://localhost:8000/${user.profileImg}`
                      : defaultUserAvatar
                  }
                  alt="User avatar"
                  className="w-full h-full object-cover rounded-full"
                  style={{ width: "24px", height: "24px" }}
                  onError={(e) => {
                    let target = e.target as HTMLImageElement;
                    target.src = defaultUserAvatar;
                  }}
                />
                <span>{user.name}</span>
              </button>

              {isUserDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg">
                  <Link
                    to="/profile"
                    className="flex items-center px-4 py-2 text-gray-600 hover:text-black hover:bg-gray-100"
                    onClick={() => setIsUserDropdownOpen(false)}
                  >
                    <LuUser className="mr-2" /> Profile
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left flex items-center px-4 py-2 text-gray-600 hover:text-red-700 hover:bg-gray-100"
                  >
                    <LuLogOut className="mr-2" /> Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* for mobile */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-gray-600 hover:text-black"
          >
            {isMenuOpen ? <LuX size={24} /> : <LuMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-md">
          <div className="px-4 pt-2 pb-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="block text-gray-600 hover:text-black py-2"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
