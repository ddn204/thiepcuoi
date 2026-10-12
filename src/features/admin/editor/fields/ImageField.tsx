import { ImageOff, X } from 'lucide-react'
import { Controller, useFormContext } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { InvitationData } from '@/types/invitation'
import { FieldShell, type FieldPath } from './FormFields'

interface ImageFieldProps {
  name: FieldPath
  label: string
  hint?: string
}

/** Ô chọn ảnh: xem trước + dán URL ảnh. */
export function ImageField({ name, label, hint }: ImageFieldProps) {
  const { control } = useFormContext<InvitationData>()
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const value = String(field.value ?? '')
        return (
          <FieldShell label={label} hint={hint} error={fieldState.error?.message}>
            <div className="flex gap-3">
              <div className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-lg border bg-muted">
                {value ? (
                  <img src={value} alt="" className="size-full object-cover" />
                ) : (
                  <ImageOff className="size-5 text-muted-foreground" />
                )}
              </div>
              <div className="flex min-w-0 flex-1 items-start gap-2">
                <Input value={value} onChange={field.onChange} placeholder="https://… hoặc /duong-dan-anh.jpg" />
                {value && (
                  <Button type="button" variant="ghost" size="icon" title="Bỏ ảnh" onClick={() => field.onChange('')}>
                    <X />
                  </Button>
                )}
              </div>
            </div>
          </FieldShell>
        )
      }}
    />
  )
}
