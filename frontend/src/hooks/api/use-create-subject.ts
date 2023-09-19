import { subjectService } from '@/services';
import { TSubjectDto, TSubjectQuery } from '@/types/subject';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useCreateSubject = (q?: TSubjectQuery) => {
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: async (data: TSubjectDto) => {
         const res = await subjectService.createSubject(data);
         return res;
      },
      onSuccess: (data) => {
         toast.success(data.message || 'Create subject successfully');
      },
      onError(error: any, variables, context) {
         toast.error(
            error?.response?.data?.message ||
               'Something when wrong while create subject'
         );
      },
      onSettled: () => {
         queryClient.invalidateQueries(['subjects', JSON.stringify(q)]);
      },
   });
};
