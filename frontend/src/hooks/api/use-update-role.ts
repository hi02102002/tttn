import { rolesService } from '@/services/roles.service';
import { TRoleDto, TRoleQuery } from '@/types/role';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useUpdateRole = (q?: TRoleQuery) => {
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: async ({ id, data }: { id: string; data: TRoleDto }) => {
         const res = await rolesService.updateRole(id, data);
         return res;
      },
      onSuccess: (data) => {
         toast.success(data.message || 'Update role successfully');
      },
      onError(error: any, variables, context) {
         toast.error(
            error?.response?.data?.message ||
               'Something when wrong while update role'
         );
      },
      onSettled: () => {
         queryClient.invalidateQueries(['roles', JSON.stringify(q)]);
      },
   });
};
