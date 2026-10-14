import { motion } from "motion/react";
import type { InvitationData } from "@/types/invitation";

interface CoverScreenProps {
  data: InvitationData;
  guestName?: string;
  onOpen: () => void;
}

export function CoverScreen({ data, onOpen }: CoverScreenProps) {
  const envelopeSrc = data.assets.coverEnvelope || "/decor/thiep-moi.png";

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden px-3"
      style={{ backgroundColor: "#5c0a16" }}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.6 } }}
    >
      <motion.button
        type="button"
        onClick={onOpen}
        className="relative cursor-pointer border-0 bg-transparent p-0 outline-none"
        style={{ width: "min(92vw, 420px)" }}
        initial={{ opacity: 0, scale: 1.6 }}
        animate={{
          opacity: 1,
          scale: 2,
          transition: { delay: 0.2, duration: 0.7 },
        }}
        whileTap={{ scale: 1.9 }}
        aria-label="Mở thiệp"
      >
        <img
          src={envelopeSrc}
          alt="Thiệp mời"
          className="h-auto w-full drop-shadow-2xl"
          draggable={false}
        />
      </motion.button>
    </motion.div>
  );
}