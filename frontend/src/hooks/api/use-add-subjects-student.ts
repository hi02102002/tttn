import { studentsService } from '@/services/students.service';
import { TAddSubjectsToStudentDto } from '@/types/student';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useAddSubjectsStudent = () => {
   return useMutation({
      mutationFn: async (data: TAddSubjectsToStudentDto) => {
         return studentsService.addSubjectsToStudent(data);
      },
      onSuccess: (data) => {
         toast.success(data.message || 'Add subjects to student successfully');
      },
      onError(error: any, variables, context) {
         toast.error(
            error?.response?.data?.message ||
               'Something when wrong while add subjects to student'
         );
      },
   });
};
