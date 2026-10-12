const dateTimeFormat = new Intl.DateTimeFormat('vi-VN', { dateStyle: 'short', timeStyle: 'short' })

export const formatDateTime = (iso: string) => dateTimeFormat.format(new Date(iso))
