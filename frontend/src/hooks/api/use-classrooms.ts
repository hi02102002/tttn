import { classroomsService } from '@/services';
import { TClassroomQuery } from '@/types/class';
import { useQuery } from '@tanstack/react-query';

export const useClassrooms = (query?: TClassroomQuery) => {
   return useQuery({
      queryKey: ['classrooms', JSON.stringify(query)],
      keepPreviousData: true,
      queryFn: async () => {
         const res = await classroomsService.getAllClassrooms(query);
         return res.data;
      },
   });
};
