import React, { useState } from "react";
import logo from "../../assets/logoCircle.png";
import { NavLink, useNavigate } from "react-router-dom";
import { navLinks } from "../constants";
import Hamburger from "./Hamburger";
import { useAuthContext } from "../context/AuthContext";
import Button from "./Button";
import { useLogoutUser } from "../_api/@react-client-query/query";

const Navbar = () => {
  const [openNav, setOpenNav] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const logoutQuery = useLogoutUser();

  const toggleNav = () => {
    setOpenNav(!openNav);
  };

  const handleLogout = () => {
    logoutQuery.mutate(null, { onSuccess: () => navigate("/login") });
  };

  return (
    <div className="max-container flex justify-between items-center bg-white pt-4">
      <div className="w-12">
        <img src={logo} alt="logo" />
      </div>

      <ul
        className={`${
          openNav ? "translate-x-0" : "translate-x-full"
        } fixed top-0 right-0 bg-white shadow-md border-l-2 w-1/2 h-screen p-5 pt-40 items-center gap-12 flex flex-col transition-transform duration-300 md:translate-x-0 md:relative md:border-0 md:shadow-none md:flex-row md:h-full md:p-0 md:w-fit md:items-center md:justify-center md:gap-16`}
      >
        {navLinks.map((link, index) => (
          <NavLink
            key={index}
            to={link.path}
            onClick={() => setOpenNav(false)}
            className={`w-7 h-7 flex flex-col items-center relative ${link?.otherStye}`}
          >
            {({ isActive }) => (
              <>
                <img
                  className={`object-contain w-full h-full transition-all duration-300 ${isActive ? "translate-y-[-4px]" : ""}`}
                  src={link.icon}
                  alt={link.path}
                />
                {isActive && <div className="absolute w-2 h-2 -bottom-2 bg-secondary_blue rounded-full"></div>}
              </>
            )}
          </NavLink>
        ))}
      </ul>

      <div className="flex gap-4 items-center">
        <Button text="Sign out" otherStyle="bg-red-500" onClick={handleLogout} />
        <NavLink to={`/user/${user.userID}`} className="flex items-center gap-2 hover-opacity">
          <img className="w-12 h-12 rounded-full object-cover" src={user.profile_picture} alt="profile" />
        </NavLink>
        <Hamburger otherStyle="md:hidden " onClick={toggleNav} isOpen={openNav} />
      </div>
    </div>
  );
};

export default Navbar;
