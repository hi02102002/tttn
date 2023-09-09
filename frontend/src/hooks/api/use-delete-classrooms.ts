import { classroomsService } from '@/services';
import { TClassroomQuery } from '@/types/class';
import { toIds } from '@/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useDeleteClassrooms = (q?: TClassroomQuery) => {
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: async (obj: Record<string, boolean>) => {
         const ids = toIds(obj);

         const res = await classroomsService.deleteClassrooms(ids);

         return res;
      },
      onSuccess: (data) => {
         toast.success(data.message || 'Deleted classrooms successfully');
      },
      onError(error: any, variables, context) {
         toast.error(
            error?.response?.data?.message ||
               'Something when wrong while update classroom'
         );
      },
      onSettled: () => {
         queryClient.invalidateQueries(['classrooms', JSON.stringify(q)]);
      },
   });
};
