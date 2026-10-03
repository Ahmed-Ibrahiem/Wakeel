"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { HiMiniBars3 } from "react-icons/hi2";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import Logo from "./Logo";
import { FaXmark } from "react-icons/fa6";
import AuthButtons from "./AuthButtons";
import { homePage } from "@/data/Ar";

const Navbar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const navbarMenus = homePage.navbar;

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  return (
    <>
      <nav className="hidden md:block">
        <ul className="flex-center gap-5 font-bold max-md:text-sm">
          {navbarMenus.map((item, index) => {
            return (
              <li key={index}>
                <Link className={`text-foreground`} href={item.href}>
                  {item.title}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <Button
        onClick={() => setIsOpen(true)}
        variant={"default"}
        className={"md:hidden! text-white px-2! py-2.5!"}
      >
        <HiMiniBars3 className="size-5" />
      </Button>

      {typeof window !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {isOpen && (
              <>
                {/* Overlay */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsOpen(false)}
                  className="fixed inset-0 w-full h-full z-50 bg-accent md:hidden"
                >
                  {/* Drower */}
                  <motion.aside
                    role="dialog"
                    initial={{ x: "100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "100%" }}
                    transition={{
                      type: "tween",
                      duration: 0.35,
                      ease: "easeOut",
                    }}
                    className="h-full w-[80%] max-w-xs p-5 flex-col-start gap-5 bg-background"
                  >
                    {/* head */}
                    <div className="w-full flex-between gap-5 my-5">
                      <Logo />
                      <Button
                        className={
                          "rounded-full! w-10 h-10 cursor-pointer text-text-body hover:text-red-500"
                        }
                        variant={"outline"}
                      >
                        <FaXmark />
                      </Button>
                    </div>

                    {/* Body */}
                    <nav className="flex-col-start gap-1 w-full">
                      {navbarMenus.map((item) => {
                        const isActive =
                          item.href === "/"
                            ? pathname === "/" || pathname === "/home"
                            : pathname === item.href ||
                              pathname.startsWith(`${item.href}/`);
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            className={`w-full py-2.5 border-b-2 font-bold
                               ${
                                 isActive
                                   ? "border-primary text-primary"
                                   : "border-transparent text-text-body"
                               }`}
                          >
                            {item.title}
                          </Link>
                        );
                      })}
                    </nav>

                    <div className="mt-auto">
                      <AuthButtons />
                    </div>
                  </motion.aside>
                </motion.div>
              </>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
};

export default Navbar;
