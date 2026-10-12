import { Plus, Trash2 } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { Controller, useFieldArray, useFormContext } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { COMMON_BANKS, fetchBanks } from '@/lib/vietqr'
import type { InvitationData } from '@/types/invitation'
import { FieldGrid, FieldShell, SwitchField, TextField } from './FormFields'
import { ImageField } from './ImageField'

function BankSelect({ index }: { index: number }) {
  const { control, setValue } = useFormContext<InvitationData>()
  const banks = useQuery({ queryKey: ['vietqr-banks'], queryFn: ({ signal }) => fetchBanks(signal), staleTime: Infinity })
  const list = banks.data ?? COMMON_BANKS

  return (
    <Controller
      control={control}
      name={`gift.accounts.${index}.bankBin`}
      render={({ field }) => (
        <FieldShell label="Ngân hàng">
          <Select
            value={field.value || undefined}
            onValueChange={(bin) => {
              field.onChange(bin)
              const bank = list.find((b) => b.bin === bin)
              if (bank) setValue(`gift.accounts.${index}.bankName`, bank.shortName, { shouldDirty: true })
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Chọn ngân hàng" />
            </SelectTrigger>
            <SelectContent className="max-h-72">
              {list.map((bank) => (
                <SelectItem key={bank.bin} value={bank.bin}>
                  {bank.shortName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FieldShell>
      )}
    />
  )
}

export function GiftFields() {
  const { control } = useFormContext<InvitationData>()
  const { fields, append, remove } = useFieldArray({ control, name: 'gift.accounts' })

  return (
    <div className="space-y-4">
      <SwitchField name="gift.enabled" label="Hiện hộp quà mừng" />
      <TextField name="gift.title" label="Tiêu đề" />
      {fields.map((field, index) => (
        <div key={field.id} className="space-y-3 rounded-lg border p-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Tài khoản {index + 1}</span>
            <Button type="button" variant="ghost" size="icon-sm" title="Xoá tài khoản" onClick={() => remove(index)}>
              <Trash2 />
            </Button>
          </div>
          <FieldGrid>
            <TextField name={`gift.accounts.${index}.label`} label="Tiêu đề" placeholder="Chú rể / Cô dâu" />
            <BankSelect index={index} />
            <TextField name={`gift.accounts.${index}.accountNumber`} label="Số tài khoản" />
            <TextField name={`gift.accounts.${index}.accountName`} label="Tên chủ tài khoản" hint="IN HOA không dấu" />
          </FieldGrid>
          <ImageField
            name={`gift.accounts.${index}.qrImage`}
            label="Ảnh QR riêng (tuỳ chọn)"
            hint="Để trống sẽ tự tạo QR VietQR từ ngân hàng + số tài khoản"
          />
        </div>
      ))}
      {fields.length < 4 && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            append({ label: '', bankBin: '', bankName: '', accountNumber: '', accountName: '', qrImage: '' })
          }
        >
          <Plus />
          Thêm tài khoản
        </Button>
      )}
    </div>
  )
}
