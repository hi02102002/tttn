import { classroomsService } from '@/services';
import { TClassroomDto, TClassroomQuery } from '@/types/class';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useUpdateClassroom = (q?: TClassroomQuery) => {
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: async ({
         id,
         values,
      }: {
         id: string;
         values: Partial<TClassroomDto>;
      }) => {
         const res = await classroomsService.updateClassroom(id, values);

         return res;
      },
      onSuccess: (data) => {
         toast.success(data.message || 'Update classroom successfully');
      },
      onError(error: any, variables, context) {
         toast.error(
            error?.response?.data?.message ||
               'Something when wrong while update classroom'
         );
      },
      onSettled: () => {
         queryClient.invalidateQueries(['classrooms', JSON.stringify(q)]);
      },
   });
};
