import { subjectService } from '@/services';
import { TSubjectQuery } from '@/types/subject';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useDeleteSubject = (q?: TSubjectQuery) => {
   const queryClient = useQueryClient();
   return useMutation({
      mutationFn: async (id: string) => {
         const res = await subjectService.deleteSubject(id);

         return res;
      },
      onSuccess: (data) => {
         toast.success(data.message || 'Deleted subject successfully');
      },
      onError(error: any, variables, context) {
         toast.error(
            error?.response?.data?.message ||
               'Something when wrong while delete subject'
         );
      },
      onSettled: () => {
         queryClient.invalidateQueries(['subjects', JSON.stringify(q)]);
      },
   });
};
