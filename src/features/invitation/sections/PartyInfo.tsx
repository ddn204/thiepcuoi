import { useEffect, useState } from "react";
import type { InvitationData } from "@/types/invitation";
import { Reveal } from "../ui/Reveal";

interface PartyInfoProps {
  data: InvitationData;
  onRsvp?: () => void;
}

function useCountdown(targetDate: string, targetTime: string) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const [y, m, d] = targetDate.split("-").map(Number);
  const [hh, mm] = targetTime.split(":").map(Number);
  const target = Date.UTC(y, m - 1, d, hh - 7, mm);

  const diff = Math.max(0, target - now);
  const totalSec = Math.floor(diff / 1000);
  const days = Math.floor(totalSec / 86400);
  const hours = Math.floor((totalSec % 86400) / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);
  const seconds = totalSec % 60;

  return { days, hours, minutes, seconds, finished: diff <= 0 };
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export function PartyInfo({ data }: PartyInfoProps) {
  const { party, assets } = data;
  const cd = useCountdown(party.date, party.time);
  const imgSrc = assets.partyBg || "/decor/thongtintieccuoi.svg";

  return (
    <section
      className="p-5 relative mx-auto w-full max-w-[480px] overflow-hidden py-2"
      style={{ backgroundColor: "#5c0a16" }}
    >
      <Reveal className="relative w-full">
        <img
          src={imgSrc}
          alt="Thông tin tiệc cưới"
          className="w-full object-contain"
          draggable={false}
        />

        {/* Đếm ngược đè lên khoảng trống giữa "CÙNG ĐẾM NGƯỢC" và lịch */}
        <div
          className="pointer-events-none absolute left-0 right-0 flex justify-center"
          style={{ top: "50%" }}
        >
          {cd.finished ? (
            <p className="font-display text-xl text-[#5c0a16]">Đã đến ngày!</p>
          ) : (
            <div className="flex items-start gap-1.5 font-display text-2xl tabular-nums text-[#5c0a16] sm:gap-2 sm:text-3xl">
              <div className="flex min-w-[2.6rem] flex-col items-center">
                <span>{pad(cd.days)}</span>
                <span className="mt-0.5 font-serif text-[9px] tracking-wider uppercase opacity-70">
                  Ngày
                </span>
              </div>
              <span className="opacity-40">:</span>
              <div className="flex min-w-[2.6rem] flex-col items-center">
                <span>{pad(cd.hours)}</span>
                <span className="mt-0.5 font-serif text-[9px] tracking-wider uppercase opacity-70">
                  Giờ
                </span>
              </div>
              <span className="opacity-40">:</span>
              <div className="flex min-w-[2.6rem] flex-col items-center">
                <span>{pad(cd.minutes)}</span>
                <span className="mt-0.5 font-serif text-[9px] tracking-wider uppercase opacity-70">
                  Phút
                </span>
              </div>
              <span className="opacity-40">:</span>
              <div className="flex min-w-[2.6rem] flex-col items-center">
                <span>{pad(cd.seconds)}</span>
                <span className="mt-0.5 font-serif text-[9px] tracking-wider uppercase opacity-70">
                  Giây
                </span>
              </div>
            </div>
          )}
        </div>
      </Reveal>
    </section>
  );
}