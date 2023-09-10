import { studentsService } from '@/services/students.service';
import { TQueryStudent } from '@/types/student';
import { useQuery } from '@tanstack/react-query';

export const useStudents = (q?: TQueryStudent) => {
   return useQuery({
      queryKey: ['students', JSON.stringify(q)],
      queryFn: async () => {
         const res = await studentsService.getStudents(q);

         return res.data;
      },
      keepPreviousData: true,
   });
};
