"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { FaArrowLeft } from "react-icons/fa6";
import { homePage } from "@/data/Ar";

// CTA Banner data supporting localization readiness
const CtaBanner = () => {
  const content = homePage.ctaData;

  return (
    <section className="section">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.7 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative rounded-sm overflow-hidden shadow-sm
           bg-primary p-8 md:p-12 flex-col-center text-center"
        >
          {/* Background Image / Pattern Overlay */}
          <div className="absolute w-full h-full inset-0 z-10 opacity-30 ">
            <Image
              src={"/images/decorations/cta-banner.png"}
              alt={content.alt}
              fill
              className="object-cover"
            />
          </div>

          {/* Content Wrapper */}
          <div className="relative z-10 max-w-2xl flex flex-col items-center gap-4">
            <h2 className="text-primary-foreground">{content.title}</h2>
            <p className="text-white/80">{content.subtitle}</p>

            <div className="pt-2">
              <button
                className="bg-white text-primary hover:bg-white/90
               font-medium px-8 py-2.5 rounded-sm shadow-md transition-all duration-300 hover:scale-105 cursor-pointer"
              >
                <a
                  href={content.buttonLink}
                  className="flex items-center gap-2"
                >
                  <span>{content.buttonText}</span>
                  <FaArrowLeft className="text-sm rtl:rotate-180" />
                </a>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

CtaBanner.displayName = "CtaBanner";

export default CtaBanner;
