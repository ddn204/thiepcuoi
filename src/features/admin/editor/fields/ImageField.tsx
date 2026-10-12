import { useRef } from 'react'
import { ImageOff, Loader2, Music, Upload, X } from 'lucide-react'
import { Controller, useFormContext } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { MediaKind } from '@/lib/upload-media'
import type { InvitationData } from '@/types/invitation'
import { useMediaUpload } from '../use-media-upload'
import { FieldShell, type FieldPath } from './FormFields'

interface MediaFieldProps {
  name: FieldPath
  label: string
  hint?: string
}

const ACCEPT: Record<MediaKind, string> = {
  image: 'image/jpeg,image/png,image/webp,image/gif,image/avif',
  audio: 'audio/mpeg,audio/mp4,audio/x-m4a,audio/aac,audio/ogg,audio/wav',
}

/** Ô chọn ảnh/nhạc: xem trước, tải file lên Supabase Storage hoặc dán URL. */
function MediaField({ name, label, hint, kind }: MediaFieldProps & { kind: MediaKind }) {
  const { control } = useFormContext<InvitationData>()
  const inputRef = useRef<HTMLInputElement>(null)
  const { upload, uploading } = useMediaUpload(kind)

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const value = String(field.value ?? '')

        const handleFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
          const file = event.target.files?.[0]
          event.target.value = ''
          if (!file) return
          const url = await upload(file)
          if (url) field.onChange(url)
        }

        return (
          <FieldShell label={label} hint={hint} error={fieldState.error?.message}>
            <div className="flex gap-3">
              {kind === 'image' && (
                <div className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-lg border bg-muted">
                  {value ? (
                    <img src={value} alt="" className="size-full object-cover" />
                  ) : (
                    <ImageOff className="size-5 text-muted-foreground" />
                  )}
                </div>
              )}
              <div className="min-w-0 flex-1 space-y-2">
                <div className="flex items-start gap-2">
                  <Input
                    value={value}
                    onChange={field.onChange}
                    placeholder={kind === 'image' ? 'Dán URL ảnh hoặc tải lên' : 'Dán URL file nhạc hoặc tải lên'}
                  />
                  {value && (
                    <Button type="button" variant="ghost" size="icon" title="Bỏ" onClick={() => field.onChange('')}>
                      <X />
                    </Button>
                  )}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={uploading}
                  onClick={() => inputRef.current?.click()}
                >
                  {uploading ? <Loader2 className="animate-spin" /> : kind === 'image' ? <Upload /> : <Music />}
                  {uploading ? 'Đang tải lên…' : kind === 'image' ? 'Tải ảnh lên' : 'Tải nhạc lên'}
                </Button>
                {kind === 'audio' && value && <audio src={value} controls preload="none" className="h-9 w-full" />}
                <input ref={inputRef} type="file" accept={ACCEPT[kind]} hidden onChange={handleFile} />
              </div>
            </div>
          </FieldShell>
        )
      }}
    />
  )
}

export function ImageField(props: MediaFieldProps) {
  return <MediaField {...props} kind="image" />
}

export function AudioField(props: MediaFieldProps) {
  return <MediaField {...props} kind="audio" />
}
