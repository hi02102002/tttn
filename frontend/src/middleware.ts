import { deleteCookie, getCookie } from 'cookies-next';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {
   ADMIN_ROUTES,
   API_URL,
   AUTH_ROUTES,
   ENDPOINTS,
   ROUTES,
} from './constants';
import { httpServer } from './lib/axios';
import { TBaseResponse } from './types/shared';
import { ERole, TUser } from './types/user';

export async function middleware(request: NextRequest) {
   const accessToken = getCookie('accessToken', { req: request });
   const response = NextResponse.next();

   // if not have access token and this route is auth route, do nothing
   if (!accessToken && AUTH_ROUTES.includes(request.nextUrl.pathname)) {
      return NextResponse.next();
   }

   // if not have access token, redirect to login
   if (!accessToken) {
      return NextResponse.redirect(new URL(ROUTES.LOGIN, request.url));
   }

   const { data: user }: TBaseResponse<TUser> = await fetch(
      `${API_URL}${ENDPOINTS.AUTH}/me`,
      {
         headers: {
            Authorization: `Bearer ${accessToken}`,
         },
      }
   ).then((res) => res.json());

   // if user not found, redirect to login and delete access token
   if (!user) {
      deleteCookie('accessToken', { req: request, res: response });

      return NextResponse.redirect(new URL(ROUTES.LOGIN, request.url));
   }

   const isAdmin = user.usersRoles.some((ur) => ur.role.name === ERole.ADMIN);

   // if have access token and this route is auth route, redirect to home
   if (accessToken && AUTH_ROUTES.includes(request.nextUrl.pathname)) {
      return NextResponse.redirect(
         new URL(isAdmin ? ROUTES.HOME : ROUTES.STUDENT_DASHBOARD, request.url)
      );
   }

   // if not is admin and this route is admin route, redirect to student dashboard
   if (!isAdmin && ADMIN_ROUTES.includes(request.nextUrl.pathname)) {
      return NextResponse.redirect(
         new URL(ROUTES.STUDENT_DASHBOARD, request.url)
      );
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
