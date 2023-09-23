import { getCookie } from 'cookies-next';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { AUTH_ROUTES, ROUTES } from './constants';
import jwt_decode from 'jwt-decode';
import { RoleName } from './types/role';

export async function middleware(request: NextRequest) {
   const accessToken = getCookie('accessToken', { req: request });

   // if not have access token and this route is auth route, do nothing
   if (!accessToken && AUTH_ROUTES.includes(request.nextUrl.pathname)) {
      return NextResponse.next();
   }

   // if not have access token, redirect to login
   if (!accessToken) {
      return NextResponse.redirect(new URL(ROUTES.LOGIN, request.url));
   }

   // if have access token and this route is auth route, redirect to home

   if (accessToken && AUTH_ROUTES.includes(request.nextUrl.pathname)) {
      const decoded = jwt_decode(accessToken) as {
         id: string;
         roles: RoleName[];
      };

      const isAdmin = decoded.roles.includes(RoleName.ADMIN);

      return NextResponse.redirect(
         new URL(isAdmin ? ROUTES.HOME : ROUTES.STUDENT_DASHBOARD, request.url)
      );
   }

   if (request.nextUrl.pathname === ROUTES.HOME) {
      return NextResponse.redirect(new URL(ROUTES.ADMIN, request.url));
   }

   return NextResponse.next();
}

export const config = {
   matcher: [
      /*
       * Match all request paths except for the ones starting with:
       * - api (API routes)
       * - _next/static (static files)
       * - _next/image (image optimization files)
       * - favicon.ico (favicon file)
       */
      '/((?!api|_next/static|_next/image|favicon.ico).*)',
   ],
};
