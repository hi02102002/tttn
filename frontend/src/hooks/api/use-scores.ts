import { scoreService } from '@/services';
import { TQueryScore } from '@/types/score';
import { useQuery } from '@tanstack/react-query';

export const useScores = (q?: TQueryScore) => {
   return useQuery({
      queryKey: ['scores', JSON.stringify(q)],
      queryFn: async () => {
         const res = await scoreService.getAllScores(q);

         return res.data;
      },
   });
};
