"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Dictionary } from "@/lib/i18n/getDictionary";

interface EmailSignupProps {
  dict: Dictionary;
}

export function EmailSignup({ dict }: EmailSignupProps) {
  const [email, setEmail] = useState("");

  return (
    <section className="py-10 md:py-16 lg:py-20 bg-white overflow-hidden">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="relative rounded-[2rem] md:rounded-[2.5rem] overflow-hidden bg-linear-to-br from-teal-800 via-teal-900 to-teal-950"
        >
          {/* Decorative blurs */}
          <div className="pointer-events-none absolute -top-32 -left-24 w-96 h-96 rounded-full bg-teal-500/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-40 -right-32 w-[520px] h-[520px] rounded-full bg-teal-400/10 blur-3xl" />

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 items-center">
            <div className="p-8 sm:p-10 md:p-14 lg:p-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.75rem] font-medium text-white leading-[1.15] tracking-tight max-w-md">
                {dict.emailSignup.title}
              </h2>
              <p className="mt-4 text-white/70 text-sm sm:text-base leading-relaxed max-w-md">
                {dict.emailSignup.description}
              </p>

              <form
                onSubmit={(e) => e.preventDefault()}
                className="mt-7 flex flex-col sm:flex-row gap-3 max-w-md"
              >
                <Input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={dict.emailSignup.placeholder}
                  className="rounded-full h-12 px-5 bg-white/10 border-white/20 text-white placeholder:text-white/50 text-base focus-visible:bg-white/15 focus-visible:border-white/40"
                />
                <Button
                  type="submit"
                  className="rounded-full bg-white text-teal-900 hover:bg-white/95 h-12 px-7 text-sm font-semibold shrink-0 shadow-lg"
                >
                  {dict.emailSignup.cta}
                </Button>
              </form>

              <p className="mt-4 text-xs text-white/50 leading-relaxed max-w-sm">
                {dict.emailSignup.disclaimer}
              </p>
            </div>

            <div className="relative h-64 md:h-full min-h-[280px] md:min-h-[420px]">
              <Image
                src="/images/image 25.png"
                alt=""
                fill
                sizes="(max-width:768px) 100vw, 50vw"
                className="object-cover md:object-right-bottom"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
