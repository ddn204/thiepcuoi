/**
 * Meta Open Graph cho link thiệp, để khi gửi qua Zalo/Messenger/Facebook hiện đúng ảnh và tên cặp đôi.
 * Dùng trong Vercel Routing Middleware (`middleware.ts`) nên chỉ import đường dẫn tương đối có đuôi `.ts`, không alias `@/`.
 */

import { RESERVED_SLUGS, SLUG_PATTERN } from './slug.ts'

export interface OgMeta {
  title: string
  description: string
  url: string
  image?: string
}

/** Các trường lấy từ bảng invitations (chọn theo JSON path để không tải cả `data`) */
export interface OgSource {
  title: string
  seo: { title?: string; description?: string; ogImage?: string } | null
  groom: string | null
  bride: string | null
  photo: string | null
  date: string | null
}

export interface OgEnv {
  supabaseUrl: string
  supabaseKey: string
  fetch?: typeof fetch
}

const GUEST_CODE_PATTERN = /^[a-z0-9]{4,16}$/

export const escapeHtml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

/** "2026-12-19" → "19/12/2026" */
const formatDate = (iso: string | null) => {
  const match = iso?.match(/^(\d{4})-(\d{2})-(\d{2})/)
  return match ? `${match[3]}/${match[2]}/${match[1]}` : ''
}

/** Mạng xã hội không hiển thị SVG làm ảnh xem trước nên bỏ qua */
const absoluteImage = (src: string | null | undefined, origin: string) => {
  if (!src?.trim()) return undefined
  const url = new URL(src.trim(), origin)
  return /\.svg$/i.test(url.pathname) ? undefined : url.href
}

export function buildOgMeta(source: OgSource, pageUrl: URL, guestName?: string): OgMeta {
  const couple = [source.groom, source.bride].filter(Boolean).join(' & ') || source.title
  const date = formatDate(source.date)
  const title = guestName
    ? `Thân mời ${guestName} | Thiệp cưới ${couple}`
    : source.seo?.title?.trim() || `Thiệp cưới ${couple}`
  const description =
    source.seo?.description?.trim() ||
    `Trân trọng kính mời ${guestName || 'bạn'} tới dự lễ cưới của ${couple}${date ? ` vào ngày ${date}` : ''}.`

  return {
    title,
    description,
    url: pageUrl.href,
    image: absoluteImage(source.seo?.ogImage, pageUrl.origin) ?? absoluteImage(source.photo, pageUrl.origin),
  }
}

/** Thay <title> và chèn meta OG/Twitter vào trước </head> của index.html */
export function injectOgMeta(html: string, meta: OgMeta): string {
  const property = (name: string, content: string) =>
    `<meta property="${name}" content="${escapeHtml(content)}" />`
  const named = (name: string, content: string) => `<meta name="${name}" content="${escapeHtml(content)}" />`

  const tags = [
    named('description', meta.description),
    property('og:type', 'website'),
    property('og:locale', 'vi_VN'),
    property('og:title', meta.title),
    property('og:description', meta.description),
    property('og:url', meta.url),
    ...(meta.image ? [property('og:image', meta.image)] : []),
    named('twitter:card', meta.image ? 'summary_large_image' : 'summary'),
    named('twitter:title', meta.title),
    named('twitter:description', meta.description),
    ...(meta.image ? [named('twitter:image', meta.image)] : []),
  ]

  return html
    .replace(/<title>[\s\S]*?<\/title>/, () => `<title>${escapeHtml(meta.title)}</title>`)
    .replace('</head>', () => `    ${tags.join('\n    ')}\n  </head>`)
}

/**
 * Trả về index.html đã chèn meta cho `/{slug}` của thiệp đã xuất bản, hoặc null nếu không phải trang thiệp
 * (để middleware cho request đi tiếp như bình thường).
 */
export async function renderInvitationHtml(request: Request, env: OgEnv): Promise<string | null> {
  if (request.method !== 'GET' || !env.supabaseUrl || !env.supabaseKey) return null
  const url = new URL(request.url)
  const slug = url.pathname.replace(/^\/|\/$/g, '')
  if (!SLUG_PATTERN.test(slug) || RESERVED_SLUGS.includes(slug)) return null

  const doFetch = env.fetch ?? fetch
  const headers = { apikey: env.supabaseKey, Authorization: `Bearer ${env.supabaseKey}` }
  const rest = `${env.supabaseUrl.replace(/\/$/, '')}/rest/v1`
  const select =
    'title,seo:data->seo,groom:data->groom->>shortName,bride:data->bride->>shortName,photo:data->hero->>photo,date:data->party->>date'
  const guestCode = url.searchParams.get('g')?.toLowerCase()

  const [rows, guests, page] = await Promise.all([
    doFetch(`${rest}/invitations?select=${select}&slug=eq.${slug}&published=is.true&limit=1`, { headers }).then(
      (res) => (res.ok ? (res.json() as Promise<OgSource[]>) : []),
    ),
    guestCode && GUEST_CODE_PATTERN.test(guestCode)
      ? doFetch(`${rest}/rpc/get_guest`, {
          method: 'POST',
          headers: { ...headers, 'Content-Type': 'application/json' },
          body: JSON.stringify({ p_slug: slug, p_code: guestCode }),
        }).then((res) => (res.ok ? (res.json() as Promise<{ display_name: string }[]>) : []))
      : [],
    // index.html có dấu chấm nên không đi qua middleware lần nữa
    doFetch(new URL('/index.html', url), { headers: { accept: 'text/html' } }),
  ])

  const source = rows[0]
  if (!source || !page.ok) return null
  const guestName = guests[0]?.display_name || url.searchParams.get('khach')?.trim().slice(0, 80) || undefined
  return injectOgMeta(await page.text(), buildOgMeta(source, url, guestName))
}
