"use client";
import Logo from "./Logo";
import Navbar from "./Navbar";
import AuthButtons from "./AuthButtons";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const Header = () => {
  const [isSticky, setIsSticky] = useState(false);
  useEffect(() => {
    const scrollHandling = () => {
      if (window.scrollY > 100) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };
    window.addEventListener("scroll", scrollHandling);

    return () => window.removeEventListener("scroll", scrollHandling);
  }, []);
  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 0.5 } }}
        className={`w-full fixed top-0 left-0 bg-background z-50 ${isSticky ? "shadow-sm border-b" : ""}`}
      >
        <div className="container flex-between py-5 mx-auto">
          <Logo />
          <Navbar />
          <div className="max-md:hidden">
            <AuthButtons />
          </div>
        </div>
      </motion.header>
      <div className="h-20"></div>
    </>
  );
};

export default Header;
