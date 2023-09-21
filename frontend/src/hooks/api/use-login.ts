import { ROUTES } from '@/constants';
import { authService } from '@/services';
import { TLoginDto } from '@/types/auth';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { toast } from 'sonner';

export const useLogin = () => {
   const router = useRouter();
   return useMutation({
      mutationFn: async (data: TLoginDto) => {
         const res = await authService.login(data);

         return res;
      },
      onSuccess: (data) => {
         toast.success(data.message || 'Login successfully');
         router.push(ROUTES.HOME);
      },
      onError: (error: any) => {
         toast.error(error?.response?.data?.message || 'Login failed');
      },
   });
};
