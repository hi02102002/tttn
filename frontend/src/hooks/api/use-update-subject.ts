import { subjectService } from '@/services';
import { TSubjectDto, TSubjectQuery } from '@/types/subject';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useUpdateSubject = (q?: TSubjectQuery) => {
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: async ({
         id,
         values,
      }: {
         id: string;
         values: Partial<TSubjectDto>;
      }) => {
         const res = await subjectService.updateSubject(id, values);
         return res;
      },
      onSuccess: (data) => {
         toast.success(data.message || 'Update subject successfully');
      },
      onError(error: any, variables, context) {
         toast.error(
            error?.response?.data?.message ||
               'Something when wrong while update subject'
         );
      },
      onSettled: () => {
         queryClient.invalidateQueries(['subjects', JSON.stringify(q)]);
      },
   });
};
