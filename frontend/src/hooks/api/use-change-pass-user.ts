import { usersService } from '@/services';
import { TChangePasswordDto } from '@/types/auth';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useChangePassUser = () => {
   return useMutation({
      mutationFn: async ({
         data,
         userId,
      }: {
         userId: string;
         data: Omit<TChangePasswordDto, 'oldPassword'>;
      }) => {
         return usersService.adminUpdatePassword(userId, data);
      },
      onSuccess(data, variables, context) {
         toast.success(data.message || 'Change password user successfully');
      },
      onError(error: any, variables, context) {
         toast.error(
            error?.response?.data?.message ||
               'Something went wrong while change password user'
         );
      },
   });
};
