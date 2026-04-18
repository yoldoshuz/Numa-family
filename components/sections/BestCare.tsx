"use client";

import { motion } from "motion/react";
import Image from "next/image";
import type { Dictionary } from "@/lib/i18n/getDictionary";

interface BestCareProps {
  dict: Dictionary;
}

const doctors: Array<{ image: string; aspect: string }> = [
  { image: "/images/image 16.png", aspect: "aspect-[3/4]" },
  { image: "/images/image 17.png", aspect: "aspect-[3/4]" },
  { image: "/images/image 18.png", aspect: "aspect-[3/4]" },
  { image: "/images/image 19.png", aspect: "aspect-[3/4]" },
  { image: "/images/image 20.png", aspect: "aspect-[3/4]" },
  { image: "/images/image 21.png", aspect: "aspect-[3/4]" },
  { image: "/images/image 22.png", aspect: "aspect-[3/4]" },
  { image: "/images/image 23.png", aspect: "aspect-[3/4]" },
];

export function BestCare({ dict }: BestCareProps) {
  return (
    <section className="py-14 md:py-20 lg:py-28 bg-white overflow-hidden">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-medium text-text-primary leading-[1.1] tracking-tight">
            {dict.bestCare.title}
            <br />
            <span className="text-teal-700 italic font-light">
              {dict.bestCare.subtitle}
            </span>
          </h2>
          <p className="mt-5 sm:mt-7 text-text-secondary text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            {dict.bestCare.description}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mt-10 sm:mt-14 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4"
        >
          {doctors.map((doctor, i) => (
            <div
              key={i}
              className={`relative ${doctor.aspect} rounded-2xl overflow-hidden bg-teal-50 group`}
            >
              <Image
                src={doctor.image}
                alt="Medical specialist"
                fill
                sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 25vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
