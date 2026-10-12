import { describe, expect, it, vi } from 'vitest'
import { buildOgMeta, injectOgMeta, renderInvitationHtml, type OgSource } from './og-meta'

const source: OgSource = {
  title: 'Thiệp test',
  seo: { title: '', description: '', ogImage: '' },
  groom: 'Minh Quân',
  bride: 'Thu Trang',
  photo: 'https://cdn.example.com/hero.webp',
  date: '2026-12-19',
}
const pageUrl = new URL('https://thiep.example.com/minh-quan-thu-trang')
const html = '<html><head>\n    <title>Thiệp cưới online</title>\n  </head><body></body></html>'

describe('buildOgMeta', () => {
  it('tạo tiêu đề, mô tả mặc định từ tên cặp đôi và ngày tiệc', () => {
    expect(buildOgMeta(source, pageUrl)).toEqual({
      title: 'Thiệp cưới Minh Quân & Thu Trang',
      description: 'Trân trọng kính mời bạn tới dự lễ cưới của Minh Quân & Thu Trang vào ngày 19/12/2026.',
      url: 'https://thiep.example.com/minh-quan-thu-trang',
      image: 'https://cdn.example.com/hero.webp',
    })
  })

  it('ưu tiên SEO do admin nhập, ảnh tương đối thành tuyệt đối, bỏ ảnh SVG', () => {
    const meta = buildOgMeta(
      { ...source, seo: { title: 'Đám cưới Quân Trang', description: 'Mời bạn', ogImage: '/og.jpg' } },
      pageUrl,
    )
    expect(meta).toMatchObject({ title: 'Đám cưới Quân Trang', description: 'Mời bạn' })
    expect(meta.image).toBe('https://thiep.example.com/og.jpg')
    expect(buildOgMeta({ ...source, photo: '/placeholders/photo-1.svg' }, pageUrl).image).toBeUndefined()
  })

  it('cá nhân hoá theo tên khách', () => {
    const meta = buildOgMeta(source, pageUrl, 'Anh Minh')
    expect(meta.title).toBe('Thân mời Anh Minh | Thiệp cưới Minh Quân & Thu Trang')
    expect(meta.description).toContain('kính mời Anh Minh tới dự')
  })
})

describe('injectOgMeta', () => {
  it('thay title, chèn meta và escape nội dung', () => {
    const out = injectOgMeta(html, {
      title: 'A & B <script>',
      description: 'Mô tả "đẹp"',
      url: 'https://x.vn/a',
      image: 'https://x.vn/a.jpg',
    })
    expect(out).toContain('<title>A &amp; B &lt;script&gt;</title>')
    expect(out).toContain('<meta property="og:title" content="A &amp; B &lt;script&gt;" />')
    expect(out).toContain('<meta property="og:description" content="Mô tả &quot;đẹp&quot;" />')
    expect(out).toContain('<meta property="og:image" content="https://x.vn/a.jpg" />')
    expect(out).not.toContain('Thiệp cưới online')
    expect(out.indexOf('og:title')).toBeLessThan(out.indexOf('</head>'))
  })

  it('không có ảnh thì không chèn og:image', () => {
    const out = injectOgMeta(html, { title: 't', description: 'd', url: 'https://x.vn' })
    expect(out).not.toContain('og:image')
    expect(out).toContain('content="summary"')
  })
})

describe('renderInvitationHtml', () => {
  const env = (fetchMock: typeof fetch) => ({ supabaseUrl: 'https://db.supabase.co', supabaseKey: 'anon', fetch: fetchMock })
  const respond = (body: unknown, init?: ResponseInit) =>
    new Response(typeof body === 'string' ? body : JSON.stringify(body), init)

  it('bỏ qua đường dẫn không phải thiệp', async () => {
    const fetchMock = vi.fn<typeof fetch>()
    for (const path of ['/', '/admin', '/admin/thiep/1', '/demo', '/Hoa-Sen', '/a/b']) {
      expect(await renderInvitationHtml(new Request(`https://x.vn${path}`), env(fetchMock))).toBeNull()
    }
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('chèn meta cho thiệp đã xuất bản, kèm tên khách từ ?g=', async () => {
    const fetchMock = vi.fn<typeof fetch>(async (input) => {
      const url = String(input)
      if (url.includes('/rest/v1/invitations')) return respond([source])
      if (url.includes('/rpc/get_guest')) return respond([{ id: '1', display_name: 'Gia đình cô Lan' }])
      return respond(html)
    })
    const out = await renderInvitationHtml(new Request('https://x.vn/minh-quan-thu-trang?g=abc123'), env(fetchMock))
    expect(out).toContain('<title>Thân mời Gia đình cô Lan | Thiệp cưới Minh Quân &amp; Thu Trang</title>')
    const invitationCall = String(fetchMock.mock.calls.find(([input]) => String(input).includes('invitations'))?.[0])
    expect(invitationCall).toContain('slug=eq.minh-quan-thu-trang')
    expect(invitationCall).toContain('published=is.true')
  })

  it('thiệp không tồn tại hoặc chưa xuất bản thì trả null', async () => {
    const fetchMock = vi.fn<typeof fetch>(async (input) =>
      String(input).includes('/rest/v1/') ? respond([]) : respond(html),
    )
    expect(await renderInvitationHtml(new Request('https://x.vn/khong-co'), env(fetchMock))).toBeNull()
  })
})
