import { classroomsService } from '@/services';
import { TClassroomDto, TClassroomQuery } from '@/types/class';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
export const useCreateClassroom = (q?: TClassroomQuery) => {
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: async (data: TClassroomDto) => {
         const res = await classroomsService.createClassroom(data);

         return res;
      },
      onSuccess: (data) => {
         toast.success(data.message || 'Create classroom successfully');
      },
      onError(error: any, variables, context) {
         toast.error(
            error?.response?.data?.message ||
               'Something when wrong while create classroom'
         );
      },
      onSettled: () => {
         queryClient.invalidateQueries(['classrooms', JSON.stringify(q)]);
      },
   });
};
