import { subjectService } from '@/services';
import { TSubjectQuery } from '@/types/subject';
import { useQuery } from '@tanstack/react-query';

export const useSubjects = (q?: TSubjectQuery) => {
   return useQuery({
      queryFn: async () => {
         const res = await subjectService.getAllSubjects(q);

         return res.data;
      },
      keepPreviousData: true,
      queryKey: ['subjects', JSON.stringify(q)],
   });
};
