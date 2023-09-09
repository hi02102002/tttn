import { ThemeToggle } from '@/components/ui';
import { ROUTES } from '@/constants';
import { TNavItem } from '@/types/shared';
import { IconBrandAsana } from '@tabler/icons-react';
import Link from 'next/link';
import Nav from './nav';

type Props = {
   items?: TNavItem[];
};

export const Header = ({ items }: Props) => {
   return (
      <header className="sticky top-0 left-0 right-0 bg-background border-border border-b pb-2 z-50">
         <div className="flex items-center h-header">
            <div className="container flex items-center justify-between">
               <Link href={ROUTES.HOME} className="flex items-center gap-2">
                  <IconBrandAsana className="w-9 h-9" />
                  <span className="text-lg font-bold">TTTN</span>
               </Link>
               <ThemeToggle />
            </div>
         </div>
         {items && items.length > 0 && <Nav items={items} />}
      </header>
   );
};

export default Header;
