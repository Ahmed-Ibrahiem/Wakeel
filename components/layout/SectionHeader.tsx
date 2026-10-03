"use client";
import { motion } from "framer-motion";
const SectionHeader = ({ title, desc }: { title: string; desc?: string }) => {
  return (
    <div className="flex-col-center gap-1.5 text-center mb-10">
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0, transition: { duration: 0.5 } }}
        viewport={{ amount: 0.8, once: true }}
        className="text-text-heading max-w-[90%]"
      >
        {title}
      </motion.h2>
      {desc && (
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0, transition: { duration: 0.5 } }}
          viewport={{ amount: 1, once: true }}
          className="text-text-body max-w-[90%]"
        >
          {desc}
        </motion.p>
      )}
    </div>
  );
};

export default SectionHeader;
