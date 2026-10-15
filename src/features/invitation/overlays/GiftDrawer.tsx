import { Copy, Download, X } from "lucide-react";
import { toast } from "sonner";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
} from "@/components/ui/drawer";
import { giftQrUrl } from "@/lib/vietqr";
import type { GiftAccount, InvitationData } from "@/types/invitation";

interface GiftDrawerProps {
  data: InvitationData;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

async function downloadQr(url: string, fileName: string) {
  const isIOS =
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

  // iOS: không tin tưởng a.download → mở ảnh để nhấn giữ
  if (isIOS) {
    window.open(url, "_blank", "noopener,noreferrer");
    return;
  }

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(String(res.status));
    const blob = await res.blob();
    const objectUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = objectUrl;
    a.download = fileName;
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(objectUrl);
  } catch {
    window.open(url, "_blank", "noopener,noreferrer");
  }
}

function AccountCard({ account }: { account: GiftAccount }) {
  const qr = giftQrUrl(account);

  const copyNumber = async () => {
    try {
      await navigator.clipboard.writeText(account.accountNumber);
      toast.success("Đã sao chép số tài khoản");
    } catch {
      toast.error("Không sao chép được, bạn chép tay giúp nhé");
    }
  };

  return (
    <div className="flex flex-col items-center text-center">
      <p className="text-lg text-wine">
        {account.label}
        {account.accountName && ` - ${account.accountName}`}
      </p>
      {qr ? (
        <div className="mt-4 rounded-2xl bg-white p-3 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.35)] ring-1 ring-black/5">
          <img
            src={qr}
            alt={`Mã QR chuyển khoản ${account.label}`}
            className="size-44 object-contain"
            loading="lazy"
          />
        </div>
      ) : (
        <p className="mt-4 text-sm text-muted-foreground">
          Chưa có thông tin QR
        </p>
      )}
      <p className="mt-3 text-base text-wine/80">{account.bankName}</p>
      {account.accountNumber && (
        <button
          type="button"
          onClick={copyNumber}
          className="mt-1 inline-flex items-center gap-1.5 font-mono text-lg tracking-wide text-wine hover:opacity-75"
          title="Sao chép số tài khoản"
        >
          {account.accountNumber}
          <Copy className="size-3.5" />
        </button>
      )}
      <p className="mt-1 font-semibold tracking-wide text-wine uppercase">
        {account.accountName}
      </p>
      {qr && (
        <button
          type="button"
          onClick={() =>
            downloadQr(qr, `qr-${account.accountNumber || account.label}.png`)
          }
          className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-wine/10 px-4 py-2 text-sm font-semibold text-wine transition hover:bg-wine/20"
        >
          <Download className="size-4" />
          Lưu QR
        </button>
      )}
    </div>
  );
}

/** Bottom sheet hiển thị QR chuyển khoản mừng cưới. */
export function GiftDrawer({ data, open, onOpenChange }: GiftDrawerProps) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="mx-auto max-w-[480px] overflow-hidden border-0 bg-paper data-[vaul-drawer-direction=bottom]:max-h-[88vh] data-[vaul-drawer-direction=bottom]:rounded-t-3xl [&>div:first-child]:hidden">
        <div className="relative bg-wine px-6 py-5 text-center text-cream">
          <DrawerTitle className="font-serif text-2xl font-bold tracking-wide text-cream uppercase">
            {data.gift.title}
          </DrawerTitle>
          <DrawerDescription className="sr-only">
            Mã QR chuyển khoản mừng cưới
          </DrawerDescription>
          <DrawerClose
            className="absolute top-1/2 right-5 -translate-y-1/2 rounded-full p-1 text-cream/90 transition hover:bg-white/10"
            aria-label="Đóng"
          >
            <X className="size-6" />
          </DrawerClose>
        </div>
        <div className="space-y-10 overflow-y-auto px-6 pt-6 pb-10">
          {data.gift.accounts.map((account, index) => (
            <AccountCard
              key={`${account.accountNumber}-${index}`}
              account={account}
            />
          ))}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
