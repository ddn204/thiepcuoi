import type { InvitationData } from "@/types/invitation";
import { Reveal } from "../ui/Reveal";

/** Lễ Vu Quy: ảnh card trên nền đỏ (chỉ section này, không đỏ cả trang) */
export function CeremonyInfo({ data }: { data: InvitationData }) {
  const { assets } = data;
  const imgSrc = assets.ceremonyImage || "/decor/le-vu-quy.png";

  return (
    <section
      className="relative mx-auto  w-full max-w-[480px] overflow-hidden"
      style={{ backgroundColor: "#5c0a16" }} // đỏ chỉ quanh khung này
    >
      <Reveal className="px-4">
        <img
          src={imgSrc}
          alt="Lễ Vu Quy"
          className="mx-auto h-full w-full max-w-[400px] rounded-sm "
          draggable={false}
        />
      </Reveal>
    </section>
  );
}
