"use client";

import SectionHeader from "@/components/layout/SectionHeader";
import {
  FaRegUser,
  FaRegFolder,
  FaRegBell,
  FaAngleLeft,
} from "react-icons/fa6";
import { motion, Variants } from "framer-motion";
import { homePage } from "@/data/Ar";

// Map icon names to actual icon components for localization readiness
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  FaRegUser,
  FaRegFolder,
  FaRegBell,
};

// Animation variants for staggered appearance
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2, // Delay between each step card
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const HowItWork = () => {
  // Fetching content dynamically from data object
  const content = homePage.howItWorks;

  return (
    <section className="section pb-0" id="how-it-work">
      <div className="container border-b pb-16">
        {/* Section Header with smooth entrance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.7 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <SectionHeader title={content.title} desc={content.desc} />
        </motion.div>

        {/* Steps Grid with Staggered Animations */}
        <motion.ul
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.7 }} // Triggers when 70% of the grid is visible
          className="grid md:grid-cols-3"
        >
          {content.steps.map((item) => {
            // Dynamically get the icon component based on iconName string
            const IconComponent = iconMap[item.iconName];

            return (
              <motion.li
                key={item.step}
                variants={cardVariants}
                className="flex-col-center justify-start gap-6 p-7 relative text-center bg-card"
              >
                {/* Step Icon */}
                <div className="flex-col-center">
                  <div
                    className="w-8 h-8 rounded-full flex-center text-white
                               bg-linear-to-b from-primary to-primary/80 z-10"
                  >
                    {item.step}
                  </div>
                  <div className="w-16 h-16 text-2xl rounded-full flex-center bg-accent -mt-2 text-primary">
                    {IconComponent && <IconComponent />}
                  </div>
                </div>

                <div className="flex-col-center gap-2.5">
                  {/* Label */}
                  <h3>{item.label}</h3>

                  {/* Desc */}
                  <p>{item.desc}</p>
                </div>

                {item.step !== 3 && (
                  <FaAngleLeft className="text-text-muted absolute max-md:-rotate-90 max-md:bottom-0 md:left-0 md:top-[50%] md:translate-y-[-50%]" />
                )}
              </motion.li>
            );
          })}
        </motion.ul>
      </div>
    </section>
  );
};

HowItWork.displayName = "HowItWork";

export default HowItWork;
