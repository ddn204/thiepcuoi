import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence } from "motion/react";
import type { InvitationData } from "@/types/invitation";
import { InvitationRuntimeContext } from "./invitation-context";
import { MusicPlayer } from "./overlays/MusicPlayer";
import { RsvpDialog } from "./overlays/RsvpDialog";
import { useAutoScroll } from "./overlays/useAutoScroll";
import { useScrollContainer } from "./scroll-container";
import { AlbumCarousel } from "./sections/AlbumCarousel";
import { CeremonyInfo } from "./sections/CeremonyInfo";
import { CoverScreen } from "./sections/CoverScreen";
import { Footer } from "./sections/Footer";
import { GiftBox } from "./sections/GiftBox";
import { HeroHeader } from "./sections/HeroHeader";
import { LoveStory } from "./sections/LoveStory";
import { PartyInfo } from "./sections/PartyInfo";
import { VenueMap } from "./sections/VenueMap";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export type InvitationMode = "live" | "preview";

interface InvitationViewProps {
  data: InvitationData;
  guestName?: string;
  invitationId?: string;
  guestId?: string;
  mode?: InvitationMode;
  showCover?: boolean;
}

function themeVars(theme: InvitationData["theme"]): React.CSSProperties {
  return {
    "--inv-primary": theme.primary,
    "--inv-primary-dark": theme.primaryDark,
    "--inv-cream": theme.cream,
    "--inv-paper": theme.paper,
    "--inv-gold": theme.gold,
  } as React.CSSProperties;
}

export function InvitationView({
  data,
  guestName,
  invitationId,
  guestId,
  mode = "live",
  showCover = true,
}: InvitationViewProps) {
  const [opened, setOpened] = useState(!showCover);
  const [playing, setPlaying] = useState(false);
  const [rsvpOpen, setRsvpOpen] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const scroller = useScrollContainer();
  const hasMusic = data.music.enabled && Boolean(data.music.url);

  useEffect(() => {
    if (mode !== "live") return;
    const root = document.documentElement;
    const vars = Object.entries(themeVars(data.theme)) as [string, string][];
    vars.forEach(([name, value]) => root.style.setProperty(name, value));
    return () => vars.forEach(([name]) => root.style.removeProperty(name));
  }, [mode, data.theme]);

  const runtime = useMemo(
    () => ({ invitationId, guestId, guestName, mode }),
    [invitationId, guestId, guestName, mode],
  );

  useAutoScroll(mode === "live" && opened && data.autoScroll, scroller);

  const playMusic = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio
      .play()
      .then(() => setPlaying(true))
      .catch(() => setPlaying(false));
  };

  const toggleMusic = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) playMusic();
    else {
      audio.pause();
      setPlaying(false);
    }
  };

  const handleOpen = () => {
    setOpened(true);
    if (hasMusic) playMusic();
  };

  const bgArt =
    typeof data.assets?.backgroundArt === "string"
      ? data.assets.backgroundArt.trim()
      : "";
  const isColorBg = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(bgArt);

  return (
    <InvitationRuntimeContext.Provider value={runtime}>
      {/* Ngoài: không đỏ (hai bên trang giữ nền mặc định) */}
      <div
        style={themeVars(data.theme)}
        className="min-h-full w-full font-body text-wine [font-variant-numeric:lining-nums]"
      >
        <AnimatePresence>
          {!opened && showCover && (
            <CoverScreen
              data={data}
              guestName={guestName}
              onOpen={handleOpen}
            />
          )}
        </AnimatePresence>

        {/* Chỉ cột thiệp đỏ — mọi section bên trong */}
        <main
          className="relative isolate mx-auto w-full max-w-[480px] overflow-hidden"
          style={isColorBg ? { backgroundColor: bgArt } : undefined}
        >
          {!isColorBg && bgArt && (
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 -z-10 bg-repeat-y opacity-[0.15]"
              style={{
                backgroundImage: `url(${bgArt})`,
                backgroundSize: "100% auto",
              }}
            />
          )}

          <HeroHeader data={data} />
          <LoveStory data={data} />
          <CeremonyInfo data={data} />
          <AlbumCarousel data={data} />
          <PartyInfo data={data} onRsvp={() => setRsvpOpen(true)} />
          <VenueMap data={data} />
          <GiftBox data={data} />
          <Footer data={data} />
        </main>

        {hasMusic && (
          <>
            <audio ref={audioRef} src={data.music.url} loop preload="none" />
            {opened && <MusicPlayer playing={playing} onToggle={toggleMusic} />}
          </>
        )}

        {data.rsvp.enabled && (
          <RsvpDialog
            key={guestName}
            open={rsvpOpen}
            onOpenChange={setRsvpOpen}
          />
        )}

        <Dialog open={qrOpen} onOpenChange={setQrOpen}>
          <DialogContent className="max-w-[320px] rounded-2xl border-none bg-paper p-6 text-center shadow-2xl">
            <DialogHeader>
              <DialogTitle className="font-display text-2xl text-wine">
                Mã QR
              </DialogTitle>
              <DialogDescription className="text-wine/70">
                Quét mã để xem thông tin
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4 flex flex-col items-center gap-4">
              <img
                src="/qr-cua-ban.png"
                alt="Mã QR"
                className="size-52 rounded-xl border border-wine/10 bg-white object-contain p-2 shadow-md"
              />
              <p className="text-sm text-wine/60">Cảm ơn bạn đã quan tâm</p>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </InvitationRuntimeContext.Provider>
  );
}
