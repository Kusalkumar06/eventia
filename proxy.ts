import { getToken } from 'next-auth/jwt';
import { NextRequest,NextResponse } from "next/server";

export async function proxy(req : NextRequest){
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  const publicRoutes = ['/signin','/signup','/verify-otp','/','/events'];

  if (!token && !publicRoutes.includes(req.nextUrl.pathname)) {
    const loginUrl = new URL('/signin',req.url);

    return NextResponse.redirect(loginUrl);
  }

  if (req.nextUrl.pathname.startsWith("/admin") && token?.role !== "admin") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (token && publicRoutes.includes(req.nextUrl.pathname)){
    const homeUrl = new URL('/',req.url);

    return NextResponse.redirect(homeUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/create','/my-events','/profile','/admin/:path*']
}