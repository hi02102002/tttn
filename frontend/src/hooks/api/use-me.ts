import { authService } from '@/services';
import { TUser } from '@/types/user';
import { useQuery } from '@tanstack/react-query';

export const useMe = (initUser?: TUser | null) => {
   return useQuery({
      queryKey: ['me'],
      queryFn: async () => {
         const res = await authService.getMe();
         return res.data;
      },
      cacheTime: Infinity,
      initialData: initUser,
      enabled: initUser !== undefined,
   });
};
