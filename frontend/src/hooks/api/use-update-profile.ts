import { usersService } from '@/services';
import { TUpdateProfileDto } from '@/types/user';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useUpdateProfile = () => {
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: async (data: TUpdateProfileDto) => {
         return usersService.updateProfile(data);
      },
      onSuccess(data, variables, context) {
         toast.success(data.message || 'Update profile successfully');
         queryClient.invalidateQueries(['me']);
      },
      onError(error: any, variables, context) {
         toast.error(error?.response?.data?.message || 'Update profile failed');
      },
   });
};
