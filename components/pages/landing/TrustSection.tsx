"use client";

import Image from "next/image";
import { FaShieldHalved } from "react-icons/fa6";
import { motion, Variants } from "framer-motion";
import { homePage } from "@/data/Ar";

// Animation variants for smooth entrance
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

const TrustSection = () => {
  // Fetching content dynamically from trust section data
  const content = homePage.trustSectionData;

  return (
    <section className="trust-section section bg-accent">
      <div className="container">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.7 }}
          className="grid lg:grid-cols-2 gap-12 items-center"
        >
          {/* Right Column: Text & Features */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col items-start text-right gap-6"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <FaShieldHalved className="text-base" />
              <span>خصوصية مطلقة</span>
            </div>

            <div className="space-y-3">
              <h2 className="text-3xl lg:text-4xl font-bold text-heading">
                {content.title}
              </h2>
              <p className="text-muted-foreground text-base leading-relaxed">
                {content.description}
              </p>
            </div>

            {/* Feature bullets or highlights */}
            <ul className="space-y-3 w-full">
              {content.features.map((feature, index) => (
                <motion.li
                  key={index}
                  variants={itemVariants}
                  className="flex items-center gap-3 text-sm font-medium text-heading"
                >
                  <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    ✓
                  </div>
                  <span>{feature}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Left Column: Visual Image / Preview */}
          <motion.div
            variants={itemVariants}
            className="relative flex justify-center"
          >
            <div className="relative rounded-lg overflow-hidden shadow-xl border border-border bg-card">
              <Image
                src={content.image}
                alt={content.alt}
                width={400}
                height={400}
                className="w-full h-auto object-cover"
              />
            </div>
          </motion.div>

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
        </motion.div>
      </div>
    </section>
  );
};

TrustSection.displayName = "TrustSection";

export default TrustSection;
