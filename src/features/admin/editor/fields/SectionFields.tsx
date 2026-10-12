import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react'
import { Controller, useFieldArray, useFormContext } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import type { InvitationData } from '@/types/invitation'
import { ColorField, ColorInput, FieldGrid, FieldShell, SwitchField, TextField } from './FormFields'
import { ImageField } from './ImageField'

export function ThemeFields() {
  return (
    <div className="space-y-4">
      <FieldGrid>
        <ColorField name="theme.primary" label="Màu chủ đạo (đỏ đô)" />
        <ColorField name="theme.primaryDark" label="Màu chủ đạo đậm" />
        <ColorField name="theme.cream" label="Màu kem (chữ trên nền đậm)" />
        <ColorField name="theme.paper" label="Màu nền giấy" />
        <ColorField name="theme.gold" label="Màu nhấn (vàng)" />
      </FieldGrid>
      <SwitchField name="autoScroll" label="Tự động cuộn sau khi mở thiệp" hint="Dừng khi khách tự cuộn/chạm" />
    </div>
  )
}

export function CoverFields() {
  return (
    <div className="space-y-4">
      <FieldGrid>
        <TextField name="cover.greeting" label="Lời mời trên bìa" placeholder="Thân mời" />
        <TextField name="cover.buttonText" label="Chữ trên nút" placeholder="Mở thiệp" />
      </FieldGrid>
      <TextField name="hero.label" label="Dòng chữ nhỏ đầu thiệp" placeholder="Save The Date" />
      <ImageField name="hero.photo" label="Ảnh chính (khung vòm)" hint="Ảnh dọc, tỉ lệ 3:4" />
    </div>
  )
}

export function PersonFields({ who }: { who: 'groom' | 'bride' }) {
  return (
    <div className="space-y-4">
      <FieldGrid>
        <TextField name={`${who}.fullName`} label="Họ và tên" />
        <TextField name={`${who}.shortName`} label="Tên gọi (hiện trên bìa)" />
      </FieldGrid>
      <TextField
        name={`${who}.role`}
        label="Vai vế"
        placeholder={who === 'groom' ? 'Trưởng nam' : 'Út nữ'}
        hint="Vd: Trưởng nam, Thứ nam, Út nữ…"
      />
      <FieldGrid>
        <TextField name={`${who}.father`} label="Tên bố" />
        <TextField name={`${who}.mother`} label="Tên mẹ" />
      </FieldGrid>
      <TextField name={`${who}.address`} label="Địa chỉ gia đình" />
    </div>
  )
}

const LUNAR_HINT = 'Để trống để tự tính âm lịch từ ngày dương'

export function CeremonyFields() {
  return (
    <div className="space-y-4">
      <TextField name="ceremony.title" label="Tiêu đề khối" />
      <TextField name="ceremony.announcement" label="Lời báo tin" multiline />
      <FieldGrid>
        <TextField name="ceremony.heading" label="Dòng giới thiệu nơi làm lễ" />
        <TextField name="ceremony.venue" label="Nơi làm lễ" placeholder="Tư gia nhà trai" />
        <TextField name="ceremony.date" label="Ngày làm lễ" type="date" />
        <TextField name="ceremony.time" label="Giờ làm lễ" type="time" />
      </FieldGrid>
      <TextField
        name="ceremony.lunarOverride"
        label="Âm lịch (tuỳ chọn)"
        placeholder="ngày 15 tháng 11 năm Ất Tỵ"
        hint={LUNAR_HINT}
      />
    </div>
  )
}

export function PartyFields() {
  return (
    <div className="space-y-4">
      <TextField name="party.title" label="Tiêu đề khối" />
      <TextField name="party.heading" label="Dòng giới thiệu giờ tiệc" />
      <FieldGrid>
        <TextField name="party.date" label="Ngày tiệc" type="date" />
        <TextField name="party.time" label="Giờ tiệc" type="time" />
        <TextField name="party.welcomeTime" label="Giờ đón khách" type="time" />
        <TextField name="party.startTime" label="Giờ khai tiệc" type="time" />
      </FieldGrid>
      <TextField name="party.lunarOverride" label="Âm lịch (tuỳ chọn)" hint={LUNAR_HINT} />
      <TextField name="party.venueTitle" label="Tiêu đề địa điểm" />
      <TextField name="party.venueName" label="Tên nhà hàng / trung tâm tiệc" />
      <TextField name="party.address" label="Địa chỉ" />
      <TextField
        name="party.mapQuery"
        label="Từ khoá Google Maps (tuỳ chọn)"
        hint="Để trống sẽ tìm theo tên + địa chỉ. Có thể dán toạ độ, vd 16.0678,108.2208"
      />
    </div>
  )
}

export function AlbumFields() {
  const { control } = useFormContext<InvitationData>()
  const { fields, append, remove, move } = useFieldArray({ control, name: 'album.photos' })

  return (
    <div className="space-y-4">
      <SwitchField name="album.enabled" label="Hiện album ảnh" />
      <TextField name="album.title" label="Tiêu đề" />
      <div className="space-y-3">
        {fields.map((field, index) => (
          <div key={field.id} className="rounded-lg border p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium">Ảnh {index + 1}</span>
              <div className="flex gap-1">
                <Button type="button" variant="ghost" size="icon-sm" disabled={index === 0} onClick={() => move(index, index - 1)}>
                  <ArrowUp />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  disabled={index === fields.length - 1}
                  onClick={() => move(index, index + 1)}
                >
                  <ArrowDown />
                </Button>
                <Button type="button" variant="ghost" size="icon-sm" onClick={() => remove(index)}>
                  <Trash2 />
                </Button>
              </div>
            </div>
            <ImageField name={`album.photos.${index}.url`} label="Ảnh" />
          </div>
        ))}
      </div>
      <Button type="button" variant="outline" onClick={() => append({ url: '', alt: `Ảnh cưới ${fields.length + 1}` })}>
        <Plus />
        Thêm ảnh
      </Button>
    </div>
  )
}

export function DressCodeFields() {
  const { control } = useFormContext<InvitationData>()
  return (
    <div className="space-y-4">
      <SwitchField name="dressCode.enabled" label="Hiện dress code" />
      <FieldGrid>
        <TextField name="dressCode.title" label="Tiêu đề" />
        <TextField name="dressCode.subtitle" label="Mô tả" />
      </FieldGrid>
      <Controller
        control={control}
        name="dressCode.colors"
        render={({ field }) => (
          <FieldShell label="Màu gợi ý">
            <div className="space-y-2">
              {field.value.map((color, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="flex-1">
                    <ColorInput
                      value={color}
                      onChange={(next) => field.onChange(field.value.map((c, i) => (i === index ? next : c)))}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => field.onChange(field.value.filter((_, i) => i !== index))}
                  >
                    <Trash2 />
                  </Button>
                </div>
              ))}
              {field.value.length < 8 && (
                <Button type="button" variant="outline" size="sm" onClick={() => field.onChange([...field.value, '#c9a24a'])}>
                  <Plus />
                  Thêm màu
                </Button>
              )}
            </div>
          </FieldShell>
        )}
      />
    </div>
  )
}

export function ScheduleFields() {
  const { control } = useFormContext<InvitationData>()
  const { fields, append, remove } = useFieldArray({ control, name: 'schedule.items' })
  return (
    <div className="space-y-4">
      <SwitchField name="schedule.enabled" label="Hiện lịch trình" />
      <TextField name="schedule.title" label="Tiêu đề" />
      <div className="space-y-2">
        {fields.map((field, index) => (
          <div key={field.id} className="flex items-end gap-2">
            <TextField name={`schedule.items.${index}.time`} label={index === 0 ? 'Giờ' : ''} type="time" className="w-32" />
            <TextField name={`schedule.items.${index}.label`} label={index === 0 ? 'Hoạt động' : ''} className="flex-1" />
            <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
              <Trash2 />
            </Button>
          </div>
        ))}
      </div>
      {fields.length < 12 && (
        <Button type="button" variant="outline" size="sm" onClick={() => append({ time: '20:00', label: '' })}>
          <Plus />
          Thêm mốc
        </Button>
      )}
    </div>
  )
}

export function InteractionFields() {
  return (
    <div className="space-y-4">
      <SwitchField name="rsvp.enabled" label="Nút xác nhận tham dự" />
      <TextField name="rsvp.buttonText" label="Chữ trên nút" />
      <SwitchField name="guestbook.enabled" label="Sổ lưu bút" />
      <TextField name="guestbook.title" label="Tiêu đề sổ lưu bút" />
    </div>
  )
}

export function MusicFields() {
  return (
    <div className="space-y-4">
      <SwitchField name="music.enabled" label="Phát nhạc nền" hint="Nhạc bắt đầu khi khách bấm “Mở thiệp”" />
      <TextField name="music.url" label="Link file nhạc (.mp3)" placeholder="https://…/nhac.mp3" />
    </div>
  )
}

export function DecorFields() {
  return (
    <div className="space-y-4">
      <ImageField name="assets.flowerDecor" label="Nhánh hoa trang trí" hint="Ảnh PNG/SVG nền trong suốt, dáng dọc" />
      <ImageField name="assets.cornerFlower" label="Hoa góc thiệp bìa" />
      <ImageField name="assets.backgroundArt" label="Hoạ tiết nền mờ" hint="Lặp dọc toàn thiệp, độ mờ 6%" />
    </div>
  )
}

export function FooterFields() {
  return (
    <div className="space-y-4">
      <TextField name="footer.message" label="Lời cảm ơn cuối thiệp" multiline />
      <TextField name="seo.title" label="Tiêu đề khi chia sẻ link" hint="Để trống: “Thiệp cưới A & B”" />
      <TextField name="seo.description" label="Mô tả khi chia sẻ link" multiline />
      <ImageField name="seo.ogImage" label="Ảnh khi chia sẻ link" hint="Ngang 1200×630. Để trống sẽ dùng ảnh chính" />
    </div>
  )
}
