"use client";

import SectionHeader from "@/components/layout/SectionHeader";
import { homePage } from "@/data/Ar";
import { motion, Variants } from "framer-motion";
import {
  HiOutlineCalendar,
  HiOutlineChartBar,
  HiOutlineCog6Tooth,
  HiOutlineCurrencyDollar,
  HiOutlineFolder,
  HiOutlineMagnifyingGlass,
  HiOutlinePaperClip,
  HiOutlineUser,
} from "react-icons/hi2";

// Map icon names to actual icon components for localization readiness
const iconMap: Record<string, React.ComponentType<{ size?: number }>> = {
  HiOutlineUser,
  HiOutlineFolder,
  HiOutlineCalendar,
  HiOutlineChartBar,
  HiOutlineCog6Tooth,
  HiOutlineCurrencyDollar,
  HiOutlineMagnifyingGlass,
  HiOutlinePaperClip,
};

// Animation variants for the container to stagger children
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

// Animation variants for individual cards
const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const FeaturesSection = () => {
  // Fetching content dynamically from data object
  const content = homePage.features;

  return (
    <section className="section" id="features">
      <div className="container">
        {/* Section Header with smooth entrance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <SectionHeader title={content.title} desc={content.desc} />
        </motion.div>

        {/* Features Grid with Staggered Animations */}
        <motion.ul
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          className="features-grid grid sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {content.items.map((item, index) => {
            // Dynamically select the icon component based on iconName string
            const IconComponent = iconMap[item.iconName];

            return (
              <motion.li
                key={index}
                variants={cardVariants}
                className="feature-card card flex flex-col items-center text-center"
              >
                {/* Icon Wrapper */}
                <div className="icon-wrapper w-16 h-16 rounded-full flex-center bg-accent text-primary mb-4">
                  {IconComponent && <IconComponent size={25} />}
                </div>

                {/* Feature Title */}
                <h3 className="mb-2 font-bold">{item.title}</h3>

                {/* Feature Description */}
                <p className="max-w-50 text-center">{item.description}</p>
              </motion.li>
            );
          })}
        </motion.ul>
      </div>
    </section>
  );
};

FeaturesSection.displayName = "FeaturesSection";

export default FeaturesSection;
