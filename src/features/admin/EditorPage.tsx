import { useDeferredValue, useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, ExternalLink, Eye, Loader2, PencilLine, Save } from 'lucide-react'
import { FormProvider, useForm, useWatch, type FieldErrors } from 'react-hook-form'
import { Link, useBlocker, useParams } from 'react-router'
import { toast } from 'sonner'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { validateSlug } from '@/lib/slug'
import { cn } from '@/lib/utils'
import { invitationDataSchema, type Invitation, type InvitationData } from '@/types/invitation'
import { isDuplicateSlugError, useInvitation, useUpdateInvitation } from './api'
import { invitationUrl } from './DashboardPage'
import { GiftFields } from './editor/fields/GiftFields'
import {
  AlbumFields,
  CeremonyFields,
  CoverFields,
  DecorFields,
  DressCodeFields,
  FooterFields,
  InteractionFields,
  MusicFields,
  PartyFields,
  PersonFields,
  ScheduleFields,
  ThemeFields,
} from './editor/fields/SectionFields'
import { PhonePreview } from './editor/PhonePreview'

/** Các mục trong form; `keys` là trường gốc của InvitationData để đánh dấu mục đang có lỗi. */
const SECTIONS: { id: string; title: string; keys: (keyof InvitationData)[]; content: React.ReactNode }[] = [
  { id: 'cover', title: 'Bìa thiệp & ảnh chính', keys: ['cover', 'hero'], content: <CoverFields /> },
  { id: 'groom', title: 'Chú rể & gia đình', keys: ['groom'], content: <PersonFields who="groom" /> },
  { id: 'bride', title: 'Cô dâu & gia đình', keys: ['bride'], content: <PersonFields who="bride" /> },
  { id: 'ceremony', title: 'Lễ thành hôn', keys: ['ceremony'], content: <CeremonyFields /> },
  { id: 'album', title: 'Album ảnh', keys: ['album'], content: <AlbumFields /> },
  { id: 'party', title: 'Tiệc cưới & địa điểm', keys: ['party'], content: <PartyFields /> },
  { id: 'dress', title: 'Dress code', keys: ['dressCode'], content: <DressCodeFields /> },
  { id: 'schedule', title: 'Lịch trình ngày cưới', keys: ['schedule'], content: <ScheduleFields /> },
  { id: 'interact', title: 'Xác nhận tham dự & lưu bút', keys: ['rsvp', 'guestbook'], content: <InteractionFields /> },
  { id: 'gift', title: 'Hộp quà mừng', keys: ['gift'], content: <GiftFields /> },
  { id: 'music', title: 'Nhạc nền', keys: ['music'], content: <MusicFields /> },
  { id: 'theme', title: 'Màu sắc & hiệu ứng', keys: ['theme', 'autoScroll'], content: <ThemeFields /> },
  { id: 'decor', title: 'Hình trang trí', keys: ['assets'], content: <DecorFields /> },
  { id: 'footer', title: 'Lời cảm ơn & chia sẻ link', keys: ['footer', 'seo'], content: <FooterFields /> },
]

function UnsavedChangesGuard({ dirty }: { dirty: boolean }) {
  const blocker = useBlocker(({ currentLocation, nextLocation }) => dirty && currentLocation.pathname !== nextLocation.pathname)

  useEffect(() => {
    if (!dirty) return
    const handler = (event: BeforeUnloadEvent) => event.preventDefault()
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [dirty])

  return (
    <AlertDialog open={blocker.state === 'blocked'}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Rời trang khi chưa lưu?</AlertDialogTitle>
          <AlertDialogDescription>Các thay đổi chưa lưu sẽ bị mất.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => blocker.reset?.()}>Ở lại</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={() => blocker.proceed?.()}>
            Rời trang
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export function Editor({ invitation }: { invitation: Invitation }) {
  const form = useForm<InvitationData>({
    resolver: zodResolver(invitationDataSchema),
    defaultValues: invitation.data,
    mode: 'onChange',
  })
  const update = useUpdateInvitation(invitation.id)
  const [title, setTitle] = useState(invitation.title)
  const [slug, setSlug] = useState(invitation.slug)
  const [showCover, setShowCover] = useState(false)
  const [mobileView, setMobileView] = useState<'form' | 'preview'>('form')

  const values = useWatch({ control: form.control }) as InvitationData
  const previewData = useDeferredValue(values)
  const slugError = validateSlug(slug)
  const metaDirty = title !== invitation.title || slug !== invitation.slug
  const dirty = form.formState.isDirty || metaDirty
  const errors = form.formState.errors

  const sectionHasError = (keys: (keyof InvitationData)[], source: FieldErrors<InvitationData>) =>
    keys.some((key) => Boolean(source[key]))

  const save = form.handleSubmit(
    (data) => {
      if (slugError) return toast.error(slugError)
      update.mutate(
        { data, title: title.trim(), slug },
        {
          onSuccess: (saved) => {
            form.reset(saved.data)
            setTitle(saved.title)
            setSlug(saved.slug)
            toast.success('Đã lưu thiệp')
          },
          onError: (error) =>
            toast.error(isDuplicateSlugError(error) ? 'Đường dẫn này đã có thiệp khác dùng' : 'Lưu thất bại, thử lại nhé'),
        },
      )
    },
    () => toast.error('Có trường chưa hợp lệ, xem các mục được đánh dấu đỏ'),
  )

  const togglePublished = (published: boolean) =>
    update.mutate(
      { published },
      { onSuccess: () => toast.success(published ? 'Đã xuất bản thiệp' : 'Đã chuyển về bản nháp') },
    )

  return (
    <FormProvider {...form}>
      <div className="flex h-dvh flex-col bg-muted/40">
        <header className="flex h-14 shrink-0 items-center gap-2 border-b bg-background px-3 sm:px-4">
          <Button variant="ghost" size="icon" asChild title="Về danh sách">
            <Link to="/admin">
              <ArrowLeft />
            </Link>
          </Button>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{title || 'Thiệp chưa đặt tên'}</p>
            <p className="truncate text-xs text-muted-foreground">/{invitation.slug}</p>
          </div>
          {dirty && <Badge variant="outline" className="hidden sm:inline-flex">Chưa lưu</Badge>}
          <label className="hidden items-center gap-2 text-sm sm:flex">
            Xuất bản
            <Switch checked={invitation.published} disabled={update.isPending} onCheckedChange={togglePublished} />
          </label>
          <Button variant="outline" size="sm" asChild className="h-8">
            <a href={invitationUrl(invitation.slug)} target="_blank" rel="noreferrer">
              <ExternalLink />
              <span className="hidden sm:inline">Xem thiệp</span>
            </a>
          </Button>
          <Button size="sm" className="h-8" onClick={save} disabled={!dirty || update.isPending}>
            {update.isPending ? <Loader2 className="animate-spin" /> : <Save />}
            Lưu
          </Button>
        </header>

        <div className="flex min-h-0 flex-1">
          <div className={cn('min-w-0 flex-1 overflow-y-auto', mobileView === 'preview' && 'hidden lg:block')}>
            <div className="mx-auto max-w-2xl p-4 pb-24">
              <Tabs defaultValue="content">
                <TabsList className="mb-4">
                  <TabsTrigger value="content">Nội dung</TabsTrigger>
                </TabsList>

                <TabsContent value="content" className="space-y-4">
                  <div className="grid gap-4 rounded-xl border bg-background p-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label htmlFor="meta-title">Tên thiệp (chỉ admin thấy)</Label>
                      <Input id="meta-title" value={title} onChange={(e) => setTitle(e.target.value)} />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="meta-slug">Đường dẫn</Label>
                      <Input
                        id="meta-slug"
                        value={slug}
                        aria-invalid={Boolean(slugError)}
                        onChange={(e) => setSlug(e.target.value.toLowerCase())}
                      />
                      {slugError ? (
                        <p className="text-xs text-destructive">{slugError}</p>
                      ) : (
                        <p className="truncate text-xs text-muted-foreground">{invitationUrl(slug)}</p>
                      )}
                    </div>
                    <label className="flex items-center justify-between gap-2 text-sm sm:hidden">
                      Xuất bản
                      <Switch checked={invitation.published} disabled={update.isPending} onCheckedChange={togglePublished} />
                    </label>
                  </div>

                  <Accordion type="multiple" defaultValue={['cover']} className="rounded-xl border bg-background px-4">
                    {SECTIONS.map((section) => (
                      <AccordionItem key={section.id} value={section.id}>
                        <AccordionTrigger className="text-base">
                          <span className="flex items-center gap-2">
                            {section.title}
                            {sectionHasError(section.keys, errors) && (
                              <span className="size-2 rounded-full bg-destructive" title="Có trường chưa hợp lệ" />
                            )}
                          </span>
                        </AccordionTrigger>
                        <AccordionContent className="pt-1 pb-5">{section.content}</AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          <aside
            className={cn(
              'w-full shrink-0 flex-col items-center gap-3 overflow-y-auto border-l bg-neutral-100 p-4 lg:flex lg:w-[440px]',
              mobileView === 'preview' ? 'flex' : 'hidden',
            )}
          >
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <Switch checked={showCover} onCheckedChange={setShowCover} />
              Hiện màn bìa
            </label>
            <PhonePreview key={String(showCover)} data={previewData} showCover={showCover} />
          </aside>
        </div>

        {/* Nút chuyển form / xem trước trên màn hình nhỏ */}
        <Button
          className="fixed right-4 bottom-4 z-20 rounded-full shadow-lg lg:hidden"
          onClick={() => setMobileView((view) => (view === 'form' ? 'preview' : 'form'))}
        >
          {mobileView === 'form' ? <Eye /> : <PencilLine />}
          {mobileView === 'form' ? 'Xem trước' : 'Chỉnh sửa'}
        </Button>
      </div>

      <UnsavedChangesGuard dirty={dirty && !update.isPending} />
    </FormProvider>
  )
}

export default function EditorPage() {
  const { id = '' } = useParams()
  const invitation = useInvitation(id)

  if (invitation.isPending) {
    return (
      <div className="flex h-dvh items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!invitation.data) {
    return (
      <div className="flex h-dvh flex-col items-center justify-center gap-3">
        <p className="text-muted-foreground">Không tìm thấy thiệp.</p>
        <Button variant="outline" asChild>
          <Link to="/admin">Về danh sách</Link>
        </Button>
      </div>
    )
  }

  return <Editor key={invitation.data.id} invitation={invitation.data} />
}
