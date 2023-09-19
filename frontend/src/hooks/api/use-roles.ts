import { rolesService } from '@/services/roles.service';
import { TRoleQuery } from '@/types/role';
import { useQuery } from '@tanstack/react-query';

export const useRoles = (q?: TRoleQuery) => {
   return useQuery({
      queryKey: ['roles', JSON.stringify(q)],
      queryFn: async () => {
         const res = await rolesService.getAllRoles(q);
         return res.data;
      },
      keepPreviousData: true,
   });
};
