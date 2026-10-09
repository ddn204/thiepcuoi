import { Link } from 'react-router'
import { HeartShape } from '@/features/invitation/ui/HeartShape'

export default function NotFoundPage({ message = 'Không tìm thấy thiệp cưới này.' }: { message?: string }) {
  return (
    <div className="paper-bg flex min-h-dvh flex-col items-center justify-center px-6 text-center text-wine">
      <HeartShape className="size-12 text-wine/80" />
      <h1 className="mt-6 font-display text-4xl">Ôi, lạc đường rồi!</h1>
      <p className="mt-3 max-w-sm font-serif text-lg opacity-80">{message}</p>
      <p className="mt-1 font-serif text-base opacity-60">Bạn kiểm tra lại đường link giúp nhé.</p>
      <Link to="/" className="mt-8 font-serif text-lg underline underline-offset-4">
        Xem thiệp mẫu
      </Link>
    </div>
  )
}
