import { authService } from '@/services';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { toast } from 'sonner';

export const useLogout = () => {
   const router = useRouter();
   const queryClient = useQueryClient();
   return useMutation({
      mutationFn: async () => {
         const res = await authService.logout();

         return res;
      },

      onSuccess: (data) => {
         toast.success(data.message || 'Logout successfully');
         router.reload();
         queryClient.invalidateQueries(['me']);
      },

      onError: (error: any) => {
         toast.error(error?.response?.data?.message || 'Something went wrong');
      },
   });
};
