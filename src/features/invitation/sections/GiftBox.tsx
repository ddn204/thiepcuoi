import { useState } from "react";
import { motion } from "motion/react";
import type { InvitationData } from "@/types/invitation";
import { GiftDrawer } from "../overlays/GiftDrawer";
import { Reveal } from "../ui/Reveal";
import { SectionTitle } from "../ui/SectionTitle";

const SPARKLES = [
  { top: "5%", left: "8%", delay: 0 },
  { top: "12%", left: "88%", delay: 0.6 },
  { top: "78%", left: "6%", delay: 1.1 },
  { top: "85%", left: "90%", delay: 1.6 },
];

export function GiftBox({ data }: { data: InvitationData }) {
  const [open, setOpen] = useState(false);
  const [opening, setOpening] = useState(false);

  if (!data.gift.enabled || data.gift.accounts.length === 0) return null;

  const handleOpen = () => {
    setOpening(true);
    window.setTimeout(() => {
      setOpen(true);
      setOpening(false);
    }, 450);
  };

  return (
    <section
      className=" relative flex flex-col items-center overflow-x-clip px-6 py-12 text-[#f5e6d3]"
      style={{ backgroundColor: "#5c0a16" }}
    >
      <Reveal>
        <SectionTitle className="text-[#f5e6d3]">{data.gift.title}</SectionTitle>
      </Reveal>

      <Reveal delay={0.1}>
        <button
          type="button"
          onClick={handleOpen}
          aria-label="Mở lì xì mừng cưới"
          className="relative mt-8 flex flex-col items-center px-6 pt-4 text-[#f5e6d3]"
        >
          {SPARKLES.map((sparkle, index) => (
            <motion.span
              key={index}
              className="absolute text-xl text-gold"
              style={{ top: sparkle.top, left: sparkle.left }}
              animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.2, 0.8] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: sparkle.delay,
              }}
              aria-hidden
            >
              ✦
            </motion.span>
          ))}

          {/* 1 ảnh lì xì — đung đưa nhẹ */}
          <motion.img
            src="/decor/lixi.svg"
            alt="Lì xì"
            className="ml-4 w-[130px] drop-shadow-lg sm:w-[150px]"
            draggable={false}
            style={{ transformOrigin: "center bottom" }}
            animate={
              opening
                ? { y: -24, rotate: 0, scale: 1.08 }
                : { rotate: [-4, 4, -4], y: [0, -4, 0] }
            }
            transition={
              opening
                ? { duration: 0.45, ease: "easeOut" }
                : {
                    rotate: { duration: 2.8, repeat: Infinity, ease: "easeInOut" },
                    y: { duration: 2.8, repeat: Infinity, ease: "easeInOut" },
                  }
            }
          />

          <motion.span
            className="mt-5 font-serif text-lg italic"
            animate={{ opacity: [0.55, 1, 0.55] }}
            transition={{ duration: 1.8, repeat: Infinity }}
          >
            Nhấn để mở
          </motion.span>
        </button>
      </Reveal>

      <GiftDrawer data={data} open={open} onOpenChange={setOpen} />
    </section>
  );
}