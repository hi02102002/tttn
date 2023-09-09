import { cn } from '@/lib/utils';
import { TNavItem } from '@/types/shared';
import Link from 'next/link';
import { useRouter } from 'next/router';

type Props = {
   items: TNavItem[];
};

const Nav = ({ items }: Props) => {
   const router = useRouter();
   return (
      <nav className="container h-header flex items-center">
         <ul className="flex items-center gap-4">
            {items.map((item) => {
               const isActive = router.pathname === item.path;
               return (
                  <li key={item.id}>
                     <Link
                        href={item.path}
                        className={cn(
                           'relative block font-semibold after:content-[""] after:absolute after:-bottom-2 after:left-0 after:h-[0.188rem]  after:bg-primary hover:after:w-full after:transition-all',
                           {
                              'after:w-full': isActive,
                           }
                        )}
                     >
                        {item.name}
                     </Link>
                  </li>
               );
            })}
         </ul>
      </nav>
   );
};

export default Nav;
