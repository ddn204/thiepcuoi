import { Download } from 'lucide-react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { downloadCsv } from '@/lib/csv'
import { useDeleteRsvp, useGuests, useRsvps } from '../api'
import { formatDateTime } from './format'
import { ConfirmDeleteButton, TabShell } from './TabShell'

/** Danh sách xác nhận tham dự: tổng số khách sẽ đến, bảng chi tiết, xuất CSV. */
export function RsvpTab({ invitationId, slug }: { invitationId: string; slug: string }) {
  const rsvps = useRsvps(invitationId)
  const guests = useGuests(invitationId)
  const deleteRsvp = useDeleteRsvp(invitationId)
  const list = rsvps.data ?? []
  const guestNames = new Map((guests.data ?? []).map((guest) => [guest.id, guest.display_name]))

  const attending = list.filter((rsvp) => rsvp.attending)
  const headcount = attending.reduce((sum, rsvp) => sum + rsvp.guest_count, 0)
  const declined = list.length - attending.length

  const exportCsv = () =>
    downloadCsv(`xac-nhan-tham-du-${slug}.csv`, [
      ['Thời gian', 'Tên', 'Tham dự', 'Số người', 'Link khách mời'],
      ...list.map((rsvp) => [
        formatDateTime(rsvp.created_at),
        rsvp.name,
        rsvp.attending ? 'Có' : 'Không',
        rsvp.guest_count,
        rsvp.guest_id ? (guestNames.get(rsvp.guest_id) ?? '') : '',
      ]),
    ])

  return (
    <TabShell
      title="Xác nhận tham dự"
      summary={`${list.length} phản hồi`}
      actions={
        <Button type="button" variant="outline" size="sm" disabled={list.length === 0} onClick={exportCsv}>
          <Download />
          Xuất CSV
        </Button>
      }
      query={rsvps}
      isEmpty={list.length === 0}
      emptyText="Chưa có ai xác nhận tham dự."
    >
      <dl className="grid grid-cols-3 divide-x border-b text-center">
        <Stat label="Khách sẽ đến" value={headcount} hint={`${attending.length} phản hồi`} />
        <Stat label="Không đến" value={declined} />
        <Stat label="Tổng phản hồi" value={list.length} />
      </dl>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="pl-4">Tên</TableHead>
            <TableHead>Tham dự</TableHead>
            <TableHead className="text-right">Số người</TableHead>
            <TableHead>Thời gian</TableHead>
            <TableHead className="w-10" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {list.map((rsvp) => {
            const guestName = rsvp.guest_id ? guestNames.get(rsvp.guest_id) : undefined
            return (
              <TableRow key={rsvp.id}>
                <TableCell className="max-w-56 pl-4 whitespace-normal">
                  <p className="font-medium break-words">{rsvp.name}</p>
                  {guestName && <p className="text-xs text-muted-foreground">Link: {guestName}</p>}
                </TableCell>
                <TableCell>
                  <Badge variant={rsvp.attending ? 'default' : 'secondary'}>
                    {rsvp.attending ? 'Sẽ đến' : 'Không đến'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right tabular-nums">{rsvp.attending ? rsvp.guest_count : '–'}</TableCell>
                <TableCell className="text-muted-foreground">{formatDateTime(rsvp.created_at)}</TableCell>
                <TableCell className="pr-2">
                  <ConfirmDeleteButton
                    title={`Xoá xác nhận của “${rsvp.name}”?`}
                    disabled={deleteRsvp.isPending}
                    onConfirm={() =>
                      deleteRsvp.mutate(rsvp.id, {
                        onSuccess: () => toast.success('Đã xoá'),
                        onError: () => toast.error('Xoá thất bại'),
                      })
                    }
                  />
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </TabShell>
  )
}

function Stat({ label, value, hint }: { label: string; value: number; hint?: string }) {
  return (
    <div className="px-2 py-4">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="text-2xl font-semibold tabular-nums">{value}</dd>
      {hint && <dd className="text-xs text-muted-foreground">{hint}</dd>}
    </div>
  )
}
