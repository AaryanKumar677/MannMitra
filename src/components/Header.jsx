import { useLocation } from "react-router-dom";
import { disablePageScroll, enablePageScroll } from "scroll-lock";

import { MannMitra } from "../assets";
import { navigation } from "../constants";
import Button from "./Button";
import MenuSvg from "../assets/svg/MenuSvg";
import { HamburgerMenu } from "./design/Header";
import { useState } from "react";


import Signup from "../pages/Signup";
import Login from "../pages/Login";
import Profile from "../pages/Profile";
import { useAuth } from "../context/AuthContext";
import { User } from "lucide-react";

const Header = () => {
  const pathname = useLocation();
  const [openNavigation, setOpenNavigation] = useState(false);

  const [showSignup, setShowSignup] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  
  const [showProfile, setShowProfile] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const { user, profile } = useAuth();

  const toggleNavigation = () => {
    if (openNavigation) {
      setOpenNavigation(false);
      enablePageScroll();
    } else {
      setOpenNavigation(true);
      disablePageScroll();
    }
  };

  const handleClick = () => {
    if (!openNavigation) return;

    enablePageScroll();
    setOpenNavigation(false);
  };

  return (
    <>
      <div
        className={`fixed top-0 left-0 w-full z-50 border-b border-n-6 lg:bg-n-8/90 lg:backdrop-blur-sm ${
          openNavigation ? "bg-n-8" : "bg-n-8/90 backdrop-blur-sm"
        }`}
      >
        <div className="flex items-center px-5 lg:px-7.5 xl:px-10 max-lg:py-4">
          <a className="block w-[12rem] xl:mr-8" href="#hero">
            <img src={MannMitra} width={190} height={40} alt="MannMitra" />
          </a>

          <nav
            className={`${
              openNavigation ? "flex" : "hidden"
            } fixed top-[5rem] left-0 right-0 bottom-0 bg-n-8 lg:static lg:flex lg:mx-auto lg:bg-transparent`}
          >
            <div className="relative z-2 flex flex-col items-center justify-center m-auto lg:flex-row">
              {navigation.map((item) => (
                <a
                  key={item.id}
                  href={item.url}
                  onClick={handleClick}
                  className={`block relative font-code text-2xl uppercase text-n-1 transition-colors hover:text-color-1 ${
                    item.onlyMobile ? "lg:hidden" : ""
                  } px-6 py-6 md:py-8 lg:-mr-0.25 lg:text-xs lg:font-semibold ${
                    item.url === pathname.hash
                      ? "z-2 lg:text-n-1"
                      : "lg:text-n-1/50"
                  } lg:leading-5 lg:hover:text-n-1 xl:px-12`}
                >
                  {item.title}
                </a>
              ))}
            </div>

            <HamburgerMenu />
          </nav>

          {/* Right side container - Fixed width to prevent layout shift when logging in */}
          <div className="hidden lg:flex items-center justify-end w-[18rem] relative">
            {!user ? (
              <>
                <button
                  onClick={() => setShowSignup(true)}
                  className="button mr-8 text-n-1/50 transition-colors hover:text-n-1"
                >
                  New account
                </button>

                <Button onClick={() => setShowLogin(true)}>
                  Sign in
                </Button>
              </>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown((prev) => !prev)}
                  className="w-10 h-10 rounded-full border-2 border-transparent hover:border-teal-500 transition-all overflow-hidden bg-n-7 flex items-center justify-center cursor-pointer"
                  title="Account menu"
                  id="profile-menu-button"
                >
                  {profile?.photo_url || user?.photoURL ? (
                    <img 
                      src={profile?.photo_url || user?.photoURL} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User size={20} className="text-n-1" />
                  )}
                </button>
                
                {/* Dropdown Menu */}
                {showDropdown && (
                  <div className="absolute top-12 right-0 w-48 bg-n-8 border border-n-6 rounded-xl shadow-2xl py-2 z-50 animate-fade-in">
                    <button
                      onClick={() => {
                        setShowDropdown(false);
                        setShowProfile(true);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-n-1 hover:bg-n-7 transition-colors flex items-center gap-2"
                    >
                      <User size={16} /> Profile Settings
                    </button>
                    <div className="w-full h-px bg-n-6 my-1"></div>
                    <button
                      onClick={async () => {
                        setShowDropdown(false);
                        try {
                          // The `signOut` function comes from useAuth() context at the top
                          await signOut();
                          window.location.reload();
                        } catch (e) {
                          console.error(e);
                        }
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-n-7 transition-colors flex items-center gap-2"
                    >
                      Log out
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <Button
            className="ml-auto lg:hidden"
            px="px-3"
            onClick={toggleNavigation}
          >
            <MenuSvg openNavigation={openNavigation} />
          </Button>
        </div>
      </div>

      {showSignup && <Signup onClose={() => setShowSignup(false)} />}
      {showLogin && <Login onClose={() => setShowLogin(false)} />}
      {showProfile && <Profile onClose={() => setShowProfile(false)} />}
    </>
  );
};

export default Header;
