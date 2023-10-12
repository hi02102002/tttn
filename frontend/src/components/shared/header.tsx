import {
   Avatar,
   AvatarFallback,
   AvatarImage,
   Button,
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
   LoadingFullpage,
   ThemeToggle,
} from '@/components/ui';
import { ROUTES } from '@/constants';
import { TNavItem } from '@/types/shared';
import { IconBrandAsana } from '@tabler/icons-react';
import Link from 'next/link';
import Nav from './nav';
import { useLogout, useMe } from '@/hooks/api';
import { useUser } from '@/contexts/user.ctx';
import { RoleName } from '@/types/role';
import { useRouter } from 'next/router';

type Props = {
   items?: TNavItem[];
};

export const Header = ({ items }: Props) => {
   const { mutateAsync: logout, isLoading: isLogoutLoading } = useLogout();
   const { user, isUserLoading } = useUser();

   const isAdmin = user?.usersRoles?.some((ur) =>
      ur.role.name.includes(RoleName.ADMIN)
   );

   const router = useRouter();

   return (
      <>
         {isLogoutLoading && <LoadingFullpage />}
         <header className="sticky top-0 left-0 right-0 bg-background border-border border-b pb-2 z-50">
            <div className="flex items-center h-header">
               <div className="container flex items-center justify-between">
                  <Link href={ROUTES.HOME} className="flex items-center gap-2">
                     <IconBrandAsana className="w-9 h-9" />
                     <span className="text-lg font-bold">TTTN</span>
                  </Link>
                  <div className="flex items-center gap-3">
                     <ThemeToggle />
                     <DropdownMenu>
                        <DropdownMenuTrigger>
                           <Avatar className="cursor-pointer w-9 h-9">
                              <AvatarImage
                                 src={user?.avatar?.url}
                                 alt="avatar"
                              />
                              <AvatarFallback>
                                 {user?.username?.charAt(0).toUpperCase()}
                              </AvatarFallback>
                           </Avatar>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                           <DropdownMenuLabel>
                              {isUserLoading
                                 ? 'Loading...'
                                 : isAdmin
                                 ? `Admin: ${user?.username}`
                                 : `Student: ${user?.username}`}
                           </DropdownMenuLabel>
                           <DropdownMenuSeparator />
                           {!isAdmin && (
                              <>
                                 <DropdownMenuItem
                                    onClick={() => {
                                       router.push(
                                          ROUTES.STUDENT_UPDATE_PROFILE
                                       );
                                    }}
                                 >
                                    Update profile
                                 </DropdownMenuItem>
                              </>
                           )}
                           <DropdownMenuItem onClick={() => logout()}>
                              Logout
                           </DropdownMenuItem>
                        </DropdownMenuContent>
                     </DropdownMenu>
                  </div>
               </div>
            </div>
            {items && items.length > 0 && <Nav items={items} />}
         </header>
      </>
   );
};

export default Header;
