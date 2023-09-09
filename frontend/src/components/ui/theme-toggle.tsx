import { Button } from '@/components/ui';
import { IconMoonStars, IconSun } from '@tabler/icons-react';
import { useTheme } from 'next-themes';

export const ThemeToggle = () => {
   const { setTheme, theme } = useTheme();

   const handleToggle = () => {
      setTheme(theme === 'dark' ? 'light' : 'dark');
   };

   return (
      <Button
         className="w-9 h-9 p-0 flex items-center justify-center"
         variant="outline"
         onClick={handleToggle}
      >
         {theme === 'dark' ? (
            <IconSun className="w-5 h-5" />
         ) : (
            <IconMoonStars className="w-5 h-5" />
         )}
      </Button>
   );
};
