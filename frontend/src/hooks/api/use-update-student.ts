import { studentsService } from '@/services/students.service';
import { TQueryStudent, TStudentDto } from '@/types/student';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useUpdateStudent = (q?: TQueryStudent) => {
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: async (options: {
         mssv: string;
         values: Partial<TStudentDto>;
      }) => {
         const res = await studentsService.updateStudent(
            options.mssv,
            options.values
         );

         return res;
      },
      onSuccess: (data) => {
         toast.success(data.message || 'Update student successfully');
      },
      onError(error: any, variables, context) {
         toast.error(
            error?.response?.data?.message ||
               'Something when wrong while update student'
         );
      },
      onSettled: () => {
         queryClient.invalidateQueries(['students', JSON.stringify(q)]);
      },
   });
};
