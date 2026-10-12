import { Controller, get, useFormContext, type Path } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import type { InvitationData } from '@/types/invitation'

export type FieldPath = Path<InvitationData>

interface FieldShellProps {
  label: string
  htmlFor?: string
  hint?: React.ReactNode
  error?: string
  className?: string
  children: React.ReactNode
}

export function FieldShell({ label, htmlFor, hint, error, className, children }: FieldShellProps) {
  return (
    <div className={cn('space-y-1.5', className)}>
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {error ? (
        <p className="text-xs text-destructive">{error}</p>
      ) : (
        hint && <p className="text-xs text-muted-foreground">{hint}</p>
      )}
    </div>
  )
}

function useFieldError(name: FieldPath) {
  const {
    formState: { errors },
  } = useFormContext<InvitationData>()
  return (get(errors, name) as { message?: string } | undefined)?.message
}

interface TextFieldProps {
  name: FieldPath
  label: string
  placeholder?: string
  hint?: React.ReactNode
  multiline?: boolean
  type?: 'text' | 'date' | 'time'
  className?: string
}

export function TextField({ name, label, placeholder, hint, multiline, type = 'text', className }: TextFieldProps) {
  const { register } = useFormContext<InvitationData>()
  const error = useFieldError(name)
  const id = `f-${name}`
  return (
    <FieldShell label={label} htmlFor={id} hint={hint} error={error} className={className}>
      {multiline ? (
        <Textarea id={id} placeholder={placeholder} rows={3} aria-invalid={Boolean(error)} {...register(name)} />
      ) : (
        <Input id={id} type={type} placeholder={placeholder} aria-invalid={Boolean(error)} {...register(name)} />
      )}
    </FieldShell>
  )
}

export function SwitchField({ name, label, hint }: { name: FieldPath; label: string; hint?: string }) {
  const { control } = useFormContext<InvitationData>()
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <label className="flex items-center justify-between gap-4 rounded-lg border bg-muted/30 px-3 py-2.5">
          <span className="space-y-0.5">
            <span className="block text-sm font-medium">{label}</span>
            {hint && <span className="block text-xs text-muted-foreground">{hint}</span>}
          </span>
          <Switch checked={Boolean(field.value)} onCheckedChange={field.onChange} />
        </label>
      )}
    />
  )
}

export function ColorInput({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="color"
        value={/^#[0-9a-f]{6}$/i.test(value) ? value : '#000000'}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 w-11 shrink-0 cursor-pointer rounded-md border bg-transparent p-1"
      />
      <Input value={value} onChange={(e) => onChange(e.target.value)} className="font-mono" maxLength={7} />
    </div>
  )
}

export function ColorField({ name, label }: { name: FieldPath; label: string }) {
  const { control } = useFormContext<InvitationData>()
  const error = useFieldError(name)
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <FieldShell label={label} error={error}>
          <ColorInput value={String(field.value ?? '')} onChange={field.onChange} />
        </FieldShell>
      )}
    />
  )
}

/** Lưới 2 cột cho các field ngắn */
export function FieldGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-4 sm:grid-cols-2">{children}</div>
}
