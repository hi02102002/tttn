import { usersService } from '@/services';
import { TQueryUser } from '@/types/user';
import { useQuery } from '@tanstack/react-query';

export const useUsers = (q?: TQueryUser) => {
   return useQuery({
      queryFn: async () => {
         const res = await usersService.getAllUsers(q);

         return res.data;
      },
      queryKey: ['users', JSON.stringify(q)],
      keepPreviousData: true,
   });
};
