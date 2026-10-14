import type { InvitationData } from "@/types/invitation";
import { Reveal } from "../ui/Reveal";

export function Footer({ data }: { data: InvitationData }) {
  // data giữ lại nếu sau này cần, hiện chỉ dùng ảnh sẵn
  void data;

  return (
    <footer className="relative mx-auto w-full max-w-[480px] overflow-hidden">
      <Reveal className="w-full">
        <img
          src="/decor/anh cuoi.svg"
          alt="Thank You"
          className="w-full object-contain"
          draggable={false}
        />
      </Reveal>
    </footer>
  );
}