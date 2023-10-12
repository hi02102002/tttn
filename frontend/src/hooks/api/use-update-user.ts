import { usersService } from '@/services';
import { TQueryUser, TUpdateUserDto } from '@/types/user';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useUpdateUser = (q?: TQueryUser) => {
   const queryClient = useQueryClient();
   return useMutation({
      mutationFn: async ({
         userId,
         data,
      }: {
         userId: string;
         data: TUpdateUserDto;
      }) => {
         const res = await usersService.updateUser(userId, data);
         return res;
      },
      onSuccess: (data) => {
         toast.success(data.message || 'Update user successfully');
         queryClient.invalidateQueries(['users', JSON.stringify(q)]);
      },
      onError(error: any, variables, context) {
         toast.error(
            error?.response?.data?.message ||
               'Something went wrong while updating user'
         );
      },
   });
};
