"use client";

import SectionHeader from "@/components/layout/SectionHeader";
import { Button } from "@/components/ui/button";
import { homePage } from "@/data/Ar";
import Image from "next/image";
import { FaArrowDown, FaBell, FaCode } from "react-icons/fa6";
import { RiFlashlightLine } from "react-icons/ri";
import { motion, Variants } from "framer-motion";

// Map icon names to actual icon components for localization readiness
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  FaCode,
  FaBell,
  RiFlashlightLine,
};

// Animation variants for staggered appearance
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2, 
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const WhyUsSection = () => {
  // Fetching content dynamically from data object
  const content = homePage.whyUs;

  return (
    <section className="bg-accent/30 section relative overflow-hidden">
      <div className="container flex-col-start gap-6 relative z-10">
        {/* Top Grid Section */}
        <div className="grid md:grid-cols-2 gap-5 w-full items-center">
          {/* Right Part with Smooth Entrance */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.7 }} 
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="flex-col-start gap-5"
          >
            <h1>{content.mainTitle}</h1>
            <p className="max-w-100">{content.subtitle}</p>
            <Button variant={"secondary"}>
              <FaArrowDown />
              <span>{content.ctaText}</span>
            </Button>
          </motion.div>

          {/* Left Part with Smooth Entrance */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.7 }} 
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="h-full flex-center hidden md:flex"
          >
            <div className="rounded-sm overflow-hidden shadow-sm">
              <Image
                src={"/images/admin/case.png"}
                alt="Admin Cases Image"
                width={400}
                height={300}
              />
            </div>
          </motion.div>
        </div>

        {/* System Capabilities Box */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.8 }} 
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="w-full rounded-sm bg-accent p-5 relative"
        >
          <SectionHeader title={content.systemCapabilitiesTitle} />

          {/* Capabilities Grid with Staggered Animations */}
          <motion.ul
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.7 }}
            className="grid md:grid-cols-3"
          >
            {content.capabilities.map((item, index) => {
              // Dynamically get the icon component based on iconName string
              const IconComponent = iconMap[item.iconName];

              return (
                <motion.li
                  key={item.id}
                  variants={itemVariants}
                  className={`flex-col-center p-5 justify-start gap-3.5 text-center ${
                    index === 1 ? "border-y-2 md:border-y-0 md:border-x-2" : ""
                  }`}
                >
                  {IconComponent && (
                    <IconComponent className="text-3xl text-primary" />
                  )}
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </motion.li>
              );
            })}
          </motion.ul>

          {/* Inner Decoration */}
          <div className="absolute top-10 left-10">
            <Image
              src={"/images/decorations/decoration5.png"}
              alt="Decoration 5"
              width={50}
              height={50}
              className="opacity-70"
            />
          </div>
        </motion.div>
      </div>

      {/* Background Decorations */}
      <div className="absolute top-5 right-10">
        <Image
          src={"/images/decorations/decoration6.png"}
          alt="Decoration 6"
          width={50}
          height={50}
          className="opacity-70"
        />
      </div>
      <div className="absolute top-10 left-10">
        <Image
          src={"/images/decorations/decoration4.png"}
          alt="Decoration 4"
          width={50}
          height={50}
          className="opacity-50"
        />
      </div>
    </section>
  );
};

WhyUsSection.displayName = "WhyUsSection";

export default WhyUsSection;
