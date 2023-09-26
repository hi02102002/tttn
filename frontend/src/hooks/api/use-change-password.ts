import { usersService } from '@/services';
import { TChangePasswordDto } from '@/types/auth';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useChangePassword = () => {
   return useMutation({
      mutationFn: async (data: TChangePasswordDto) => {
         return usersService.changePassword(data);
      },
      onSuccess(data, variables, context) {
         toast.success(data.message || 'Change password successfully');
      },
      onError(error: any, variables, context) {
         toast.error(
            error?.response?.data?.message || 'Change password failed'
         );
      },
   });
};
