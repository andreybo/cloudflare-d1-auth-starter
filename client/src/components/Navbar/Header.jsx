// NavbarHeader.js
import { useState } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import { RiLogoutBoxRLine } from "react-icons/ri";
import useAuth from "../../hooks/auth/useAuth";
import useLogout from "../../hooks/auth/useLogout";

const NAV_ITEMS = [
  { name: "Home", path: "/" },
  { name: "RSS Feeds", path: "/rss-feeds" },
];

const NavbarHeader = () => {
  const { auth } = useAuth();
  const logout = useLogout();

  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <header className="flex shadow-md py-0 px-4 sm:px-10 bg-white min-h-[70px] tracking-wide relative z-50 w-full">
      <div className="container mx-auto flex justify-between items-center flex-wrap gap-5 w-full">
        <Link to="/" className="max-sm:hidden">
          <img
            src="/logo.svg"
            alt="toopost"
            className="w-36"
          />
        </Link>
        <Link to="/" className="hidden max-sm:block">
          <img
            src="/logo-short.svg"
            alt="Logo"
            className="w-9"
          />
        </Link>

        {/* Menu */}
        <div
          id="collapseMenu"
          className={`${
            menuOpen ? "block" : "hidden"
          } max-lg:fixed max-lg:bg-white max-lg:w-1/2 max-lg:min-w-[300px] max-lg:top-0 max-lg:left-0 max-lg:p-6 max-lg:h-full max-lg:shadow-md max-lg:overflow-auto lg:block`}
        >
          {/* Close Button */}
          <button
            onClick={toggleMenu}
            className="lg:hidden fixed top-2 right-4 z-[100] rounded-full bg-gray-900 w-12 h-12 flex items-center justify-center border"
          >
            <FaTimes className="text-white w-6 h-6" />
          </button>

          <ul className="lg:flex lg:items-center gap-x-5 max-lg:space-y-3">
            {NAV_ITEMS.map((item, index) => (
              <li
                key={index}
                className="max-lg:border-b border-gray-300 max-lg:py-3 px-3"
              >
                <Link
                  to={item.path}
                  className="block text-gray-500 hover:text-[#007bff]"
                  onClick={toggleMenu}
                >
                  {item.name}
                </Link>
              </li>
            ))}
            <li className="text-center py-4 lg:py-0">
              {auth?.user?.username ? (
                <button
                  className="bg-gray-100 text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-200 flex flex-row items-center gap-2"
                  onClick={logout}
                >
                  Log out
                  <RiLogoutBoxRLine/>
                </button>
              ) : (
                <Link
                  to="/login"
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex flex-row items-center gap-2"
                  onClick={toggleMenu}
                >
                  Log in
                </Link>
              )}
            </li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex max-lg:ml-auto space-x-4 lg:hidden">
          <button id="toggleOpen" className={`${menuOpen ? 'hidden' : ''}`} onClick={toggleMenu}>
            <FaBars className="text-black w-7 h-7" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default NavbarHeader;
