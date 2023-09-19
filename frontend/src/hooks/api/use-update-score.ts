import { scoreService } from '@/services';
import { TQueryScore, TUpdateScoreDto } from '@/types/score';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useUpdateScore = (q?: TQueryScore) => {
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: async (data: TUpdateScoreDto) => {
         const res = await scoreService.updateScoreStudent(data);

         return res;
      },
      onSuccess: (data) => {
         toast.success(data.message || 'Update student score successfully');
      },
      onError(error: any, variables, context) {
         toast.error(
            error?.response?.data?.message ||
               'Something when wrong while update student score'
         );
      },
      onSettled: () => {
         queryClient.invalidateQueries(['scores', JSON.stringify(q)]);
      },
   });
};
