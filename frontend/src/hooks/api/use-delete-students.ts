import { studentsService } from '@/services/students.service';
import { TQueryStudent } from '@/types/student';
import { toIds } from '@/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useDeleteStudents = (q?: TQueryStudent) => {
   const queryClient = useQueryClient();
   return useMutation({
      mutationFn: async (obj: Record<string, boolean>) => {
         const ids = toIds(obj);

         const res = await studentsService.deleteManyStudents(ids);

         return res;
      },
      onSuccess: (data) => {
         toast.success(data.message || 'Deleted students successfully');
      },
      onError(error: any, variables, context) {
         toast.error(
            error?.response?.data?.message ||
               'Something when wrong while delete students'
         );
      },
      onSettled: () => {
         queryClient.invalidateQueries(['students', JSON.stringify(q)]);
      },
   });
};
