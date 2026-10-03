"use client";
import Link from "next/link";
import { HiOutlineEnvelope } from "react-icons/hi2";
import { FaLinkedinIn, FaXTwitter, FaFacebookF } from "react-icons/fa6";
import { homePage } from "@/data/Ar";
import Logo from "./Logo";
import { motion } from "framer-motion";

const Footer = () => {
  const content = homePage.footerData;

  return (
    <motion.footer
      id="contact-us"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0, transition: { duration: 0.5 } }}
      viewport={{ amount: 0.3, once: true }}
      className="bg-footer text-white py-16"
    >
      <div className="container mx-auto px-4">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12 border-b border-footer-border pb-12">
          {/* Brand Info Column */}
          <div className="flex flex-col gap-4">
            <Logo
              titleStyle="text-primary-foreground! text-4xl!"
              iconProps={{ size: "55", className: "text-primary-foreground!" }}
            />
          </div>

          {/* Quick Links Column */}
          <div>
            <h3 className="text-primary-foreground mb-4">
              {content.columns[0].title}
            </h3>
            <ul className="flex flex-col gap-3">
              {content.columns[0].links?.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-300 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h3 className="text-primary-foreground mb-4">
              {content.columns[1].title}
            </h3>
            <ul className="flex flex-col gap-3">
              {content.columns[1].links?.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-300 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Socials Column */}
          <div>
            <h3 className="text-primary-foreground mb-4">
              {content.columns[2].title}
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-300 mb-6">
              <HiOutlineEnvelope className="size-5 text-primary" />
              <a
                href={`mailto:${content.columns[2].contact?.email}`}
                className="hover:text-white transition-colors"
              >
                {content.columns[2].contact?.email}
              </a>
            </div>

            {/* Social Media Icons */}
            <div className="flex items-center gap-3">
              {content.columns[2].socials?.map((social, index) => {
                return (
                  <a
                    key={index}
                    href={social.href}
                    aria-label={social.name}
                    className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-primary transition-colors"
                  >
                    {social.name === "LinkedIn" && (
                      <FaLinkedinIn className="size-4" />
                    )}
                    {social.name === "X" && <FaXTwitter className="size-4" />}
                    {social.name === "Facebook" && (
                      <FaFacebookF className="size-4" />
                    )}
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Copyright Bottom Bar */}
        <div className="text-center text-sm text-gray-400">
          <p className="mx-auto text-center">{content.copyright}</p>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
