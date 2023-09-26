import { AUTH_ROUTES, ENDPOINTS, ROUTES } from '@/constants';
import { httpServer } from '@/lib/axios';
import { RoleName } from '@/types/role';
import { TBaseResponse } from '@/types/shared';
import { TUser } from '@/types/user';
import { deleteCookie, getCookie } from 'cookies-next';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';

type TOptions = {
   roles?: RoleName[];
   isProtected?: boolean;
};

export type TWithUser = <T extends Record<string, any> = Record<string, any>>(
   options?: TOptions
) => (
   gssp?: ({}: {
      user: TUser | null;
      token: string;
      ctx: GetServerSidePropsContext;
   }) => Promise<GetServerSidePropsResult<T>>
) => (ctx: GetServerSidePropsContext) => Promise<GetServerSidePropsResult<T>>;

export const withUser: TWithUser = (options) => (gssp) => async (ctx) => {
   const { req, res } = ctx;
   const { roles, isProtected } = options || {};

   const accessToken = getCookie('accessToken', {
      req,
      res,
   }) as string;

   // if not have token and this page is protected, redirect to login
   if (!accessToken && isProtected) {
      return {
         redirect: {
            destination: ROUTES.LOGIN,
            permanent: false,
         },
      };
   }

   let user: TUser | null = null;

   try {
      console.log('accessToken', accessToken);
      const resUser: TBaseResponse<TUser> = await httpServer.get(
         `${ENDPOINTS.AUTH}/me`,
         {
            headers: {
               Authorization: `Bearer ${accessToken}`,
            },
         }
      );
      user = resUser?.data || null;
   } catch (error) {
      console.log(error);
      deleteCookie('accessToken', { req, res });
      user = null;
   }

   // if user not found and this page is protected, redirect to login
   if (isProtected && !user) {
      return {
         redirect: {
            destination: ROUTES.LOGIN,
            permanent: false,
         },
      };
   }

   const isAdmin = user?.usersRoles.some(
      (ur) => ur.role.name === RoleName.ADMIN
   );

   //  if user is logged in and this page is auth page, redirect to home
   if (isProtected && user && AUTH_ROUTES.includes(ctx.resolvedUrl)) {
      return {
         redirect: {
            destination: isAdmin ? ROUTES.HOME : ROUTES.STUDENT_DASHBOARD,
            permanent: false,
         },
      };
   }

   // check permission
   const isHavePermission = user?.usersRoles.some((ur) => {
      return roles?.includes(ur.role.name as RoleName);
   });

   // if user is logged in and this page is protected and user not have permission, redirect to 403
   if (isProtected && !isHavePermission) {
      return {
         redirect: {
            destination: ROUTES['403'],
            permanent: false,
         },
      };
   }

   if (gssp) {
      const gsspResult = await gssp({
         ctx,
         user,
         token: accessToken,
      });

      if ('props' in gsspResult) {
         return {
            props: {
               ...gsspResult.props,
               user,
            },
         } as GetServerSidePropsResult<any>;
      }

      return {
         props: {
            user,
         },
      };
   }

   return {
      props: {
         user,
      },
   };
};
