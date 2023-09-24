import { subjectService } from '@/services';
import { TSubject } from '@/types/subject';
import { useQuery } from '@tanstack/react-query';

export const useListSubjectToRegister = (init?: Array<TSubject>) => {
   return useQuery({
      queryKey: ['list-subject-to-register'],
      queryFn: async () => {
         const res = await subjectService.getSubjectsToRegister();

         return res.data;
      },
      initialData: init,
   });
};
