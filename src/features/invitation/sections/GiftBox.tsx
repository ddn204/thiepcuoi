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
    <section className="relative w-full overflow-hidden text-[#5c0a16] flex justify-center items-center py-10 px-6">
      {/* Ảnh nền full — quyết định height của section */}
      <img
        src="/decor/back-lixi.svg"
        alt=""
        aria-hidden
        className="block h-[90%] w-[90%] object-cover sm:h-[92%] sm:w-[92%]"
        draggable={false}
      />

      {/* Nội dung đè lên giữa ảnh */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <Reveal>
          <SectionTitle className="text-[#5c0a16]">
            {data.gift.title}
          </SectionTitle>
        </Reveal>

        <Reveal delay={0.1}>
          <button
            type="button"
            onClick={handleOpen}
            aria-label="Mở lì xì mừng cưới"
            className="relative mt-6 flex flex-col items-center text-[#5c0a16]"
          >
            {SPARKLES.map((sparkle, index) => (
              <motion.span
                key={index}
                className="absolute text-2xl text-[#c9a24a]"
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

            <motion.img
              src="/decor/lixi.svg"
              alt="Lì xì"
              className="w-[180px] drop-shadow-lg sm:w-[210px]"
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
                      rotate: {
                        duration: 2.8,
                        repeat: Infinity,
                        ease: "easeInOut",
                      },
                      y: {
                        duration: 2.8,
                        repeat: Infinity,
                        ease: "easeInOut",
                      },
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
      </div>

      <GiftDrawer data={data} open={open} onOpenChange={setOpen} />
    </section>
  );
}