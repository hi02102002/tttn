import { rolesService } from '@/services/roles.service';
import { TRoleDto, TRoleQuery } from '@/types/role';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useCreateRole = (q?: TRoleQuery) => {
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: async (data: TRoleDto) => {
         const res = await rolesService.createRole(data);
         return res;
      },
      onSuccess: (data) => {
         toast.success(data.message || 'Create role successfully');
      },
      onError(error: any, variables, context) {
         toast.error(
            error?.response?.data?.message ||
               'Something when wrong while create role'
         );
      },
      onSettled: () => {
         queryClient.invalidateQueries(['roles', JSON.stringify(q)]);
      },
   });
};
