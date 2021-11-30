import { NextRequest, NextResponse } from 'next/server'

export const middleware = (req: NextRequest) => {
  console.log('in middleware')
  if (req.nextUrl.pathname.match(/\.(ico|jpg|png)$/)) return
  if (req.cookies['cacheable'] !== 'true') {
    console.log('SSR mode', req.nextUrl.pathname)
    return
  }

  console.log('SSG mode', `/ssg${req.nextUrl.pathname}`)
  return NextResponse.rewrite(`/ssg${req.nextUrl.pathname}`)
}
