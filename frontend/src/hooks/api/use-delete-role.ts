import { rolesService } from '@/services/roles.service';
import { studentsService } from '@/services/students.service';
import { TRoleQuery } from '@/types/role';
import { TQueryStudent } from '@/types/student';
import { toIds } from '@/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useDeleteRole = (q?: TRoleQuery) => {
   const queryClient = useQueryClient();
   return useMutation({
      mutationFn: async (id: string) => {
         const res = await rolesService.deleteRole(id);

         return res;
      },
      onSuccess: (data) => {
         toast.success(data.message || 'Deleted role successfully');
      },
      onError(error: any, variables, context) {
         toast.error(
            error?.response?.data?.message ||
               'Something when wrong while delete role'
         );
      },
      onSettled: () => {
         queryClient.invalidateQueries(['roles', JSON.stringify(q)]);
      },
   });
};
