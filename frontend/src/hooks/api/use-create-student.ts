import { studentsService } from '@/services/students.service';
import { TClassroomQuery } from '@/types/class';
import { TQueryStudent, TStudentDto } from '@/types/student';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useCreateStudent = (q?: TQueryStudent | TClassroomQuery) => {
   const queryClient = useQueryClient();
   return useMutation({
      mutationFn: async (data: TStudentDto) => {
         const res = await studentsService.createStudent(data);
         return res;
      },
      onSuccess: (data) => {
         toast.success(data.message || 'Create student successfully');
      },
      onError(error: any, variables, context) {
         toast.error(
            error?.response?.data?.message ||
               'Something when wrong while create student'
         );
      },
      onSettled: () => {
         queryClient.invalidateQueries(['students', JSON.stringify(q)]);
         queryClient.invalidateQueries(['classrooms', JSON.stringify(q)]);
      },
   });
};
