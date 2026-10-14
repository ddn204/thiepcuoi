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
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
      style={{ backgroundColor: "#5c0a16" }}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.6 } }}
    >
      {/* Chỉ ảnh thiệp — click để mở */}
      <motion.button
        type="button"
        onClick={onOpen}
        className="relative w-[70%] max-w-[880px] cursor-pointer border-0 bg-transparent p-0 outline-none"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{
          opacity: 1,
          scale: 1,
          transition: { delay: 0.2, duration: 0.7 },
        }}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        aria-label="Mở thiệp"
      >
        <img
          src={envelopeSrc}
          alt="Thiệp mời"
          className="w-full drop-shadow-2xl"
          draggable={false}
        />
      </motion.button>
    </motion.div>
  );
}
