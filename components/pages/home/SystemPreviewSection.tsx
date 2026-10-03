"use client";

import SectionHeader from "@/components/layout/SectionHeader";
import { homePage } from "@/data/Ar";
import Image from "next/image";
import { motion, Variants } from "framer-motion";

// Animation variants for staggered appearance
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2, // Delay between each preview card
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

const SystemPreviewSection = () => {
  // Fetching content dynamically from data object
  const content = homePage.screenshots;

  return (
    <section className="system-preview-section section">
      <div className="container">
        {/* Section Header with smooth entrance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.7 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <SectionHeader title={content.title} desc={content.subtitle} />
        </motion.div>

        {/* Preview Grid with Staggered Animations */}
        <motion.ul
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.7 }} // Triggers when 70% of the grid is visible
          className="preview-grid grid sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {content.items.map((item) => (
            <motion.li
              key={item.id}
              variants={cardVariants}
              className="preview-card flex-col-center gap-6 text-center"
            >
              {/* Preview Image Wrapper */}
              <div className="preview-image rounded-sm overflow-hidden shadow-sm">
                <Image
                  src={item.image}
                  alt={item.alt}
                  width={290}
                  height={200}
                />
              </div>

              {/* Preview Info */}
              <div className="preview-info flex-col-center gap-1.5">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
};

SystemPreviewSection.displayName = "SystemPreviewSection";

export default SystemPreviewSection;
