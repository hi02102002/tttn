import { classroomsService } from '@/services';
import { TClassroomDto, TClassroomQuery } from '@/types/class';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { toast } from 'sonner';
export const useCreateClassroom = (q?: TClassroomQuery) => {
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: async (data: TClassroomDto) => {
         const res = await classroomsService.createClassroom(data);

         return res;
      },
      onSuccess: (data) => {
         toast.success(data.message || 'Create classroom successfully', {
            description: format(new Date(), 'dd/MM/yyyy hh:mm:ss'),
         });
      },
      onError(error: any, variables, context) {
         toast.error(
            error?.response?.data?.message ||
               'Something when wrong while create classroom',
            {
               description: format(new Date(), 'dd/MM/yyyy hh:mm:ss'),
            }
         );
      },
      onSettled: () => {
         queryClient.invalidateQueries(['classrooms', JSON.stringify(q)]);
      },
   });
};
