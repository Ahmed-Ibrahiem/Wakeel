"use client";
import { Button } from "@/components/ui/button";
import { homePage } from "@/data/Ar";
import Image from "next/image";
import { FaRegCirclePlay } from "react-icons/fa6";
import { motion } from "framer-motion";

const HeroSection = () => {
  const content: {
    title: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
    heighLight: string;
    wakeel: string;
  } = homePage.hero;

  return (
    <section
      id="hero-section"
      className="section bg-linear-to-t from-accent from-50 py-20 relative overflow-hidden"
    >
      <div className="container grid grid-cols-1 lg:grid-cols-2 gap-8">
        <RightPart content={content} />
        <LeftPart />
      </div>

      {/* Floating Decorations with subtle animation */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 0.7, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="absolute top-5 right-10"
      >
        <Image
          src={"/images/decorations/decoration1.png"}
          alt="Decoration 1"
          width={30}
          height={30}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 0.8, x: 0 }}
        transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
        className="absolute top-15 left-15"
      >
        <Image
          src={"/images/decorations/decoration2.png"}
          alt="Decoration 2"
          width={50}
          height={50}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.8, scale: 1 }}
        transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
        className="absolute bottom-10 left-[50%] translate-x-[-50%]"
      >
        <Image
          src={"/images/decorations/decoration3.png"}
          alt="Decoration 3"
          width={30}
          height={30}
        />
      </motion.div>
    </section>
  );
};

const RightPart = ({
  content,
}: {
  content: {
    title: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
    heighLight: string;
    wakeel: string;
  };
}) => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.15,
          },
        },
      }}
      className="flex-col-start items-center
       max-w-[95%] mx-auto lg:mx-0 lg:max-w-full lg:items-start!
        text-center lg:text-start gap-8 relative z-10"
    >
      {/* Badge Animation */}
      <motion.span
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: "easeOut" },
          },
        }}
        className="text-primary-dark bg-accent px-5 py-1 rounded-full font-bold text-sm"
      >
        {content.heighLight}
      </motion.span>

      {/* Title Animation */}
      <motion.h1
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: "easeOut" },
          },
        }}
        className="text-text-heading font-extrabold max-w-90"
      >
        {content.title.slice(0, content.title.indexOf(content.wakeel))}
        <span className="text-primary">{content.wakeel}</span>
        {content.title.slice(
          content.title.indexOf(content.wakeel) + content.wakeel.length,
        )}
      </motion.h1>

      {/* Subtitle Animation */}
      <motion.p
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: "easeOut" },
          },
        }}
        className="max-w-100"
      >
        {content.subtitle}
      </motion.p>

      {/* Buttons Animation */}
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: "easeOut" },
          },
        }}
        className="flex-start justify-center lg:justify-start! gap-5 flex-wrap w-full lg:w-auto"
      >
        <Button>{content.ctaPrimary}</Button>
        <Button variant={"secondary"}>
          <FaRegCirclePlay className="size-5" />
          <span className="font-bold">{content.ctaSecondary}</span>
        </Button>
      </motion.div>
    </motion.div>
  );
};

const LeftPart = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, x: 30 }}
      animate={{ opacity: 1, scale: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
      className="relative h-full w-full hidden lg:block z-10"
    >
      {/* Background Rotating Shape with subtle pulse effect */}
      <div className="w-70 h-100 bg-accent rounded-full rotate-45 absolute top-[50%] left-[50%] translate-[-50%] animate-pulse"></div>

      {/* Dashboard Image Card with hover lift effect */}
      <motion.div
        transition={{ duration: 0.3 }}
        className="w-110 rounded-sm overflow-hidden shadow-lg z-2 absolute top-[50%] left-[50%] translate-[-50%]"
      >
        <Image
          src={"/images/admin/dashboard.png"}
          alt="Admin Dashboard"
          width={700}
          height={700}
        />
      </motion.div>
    </motion.div>
  );
};

export default HeroSection;
