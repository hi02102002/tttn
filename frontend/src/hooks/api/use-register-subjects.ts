import { subjectService } from '@/services';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useRegisterSubjects = () => {
   const queryClient = useQueryClient();
   return useMutation({
      mutationFn: async (data: string[]) => {
         const res = await subjectService.registerSubjects({
            subjects: data,
         });

         return res;
      },
      onSuccess: (data) => {
         toast.success(data.message || 'Register subjects successfully');
         queryClient.invalidateQueries(['list-subject-to-register']);
      },
      onError: (error: any) => {
         toast.error(
            error?.response?.data?.message || 'Register subjects failed'
         );
      },
   });
};
