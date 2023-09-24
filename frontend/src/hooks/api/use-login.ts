import { ROUTES } from '@/constants';
import { authService } from '@/services';
import { TLoginDto } from '@/types/auth';
import { RoleName } from '@/types/role';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import jwtDecode from 'jwt-decode';
import { useRouter } from 'next/router';
import { toast } from 'sonner';

export const useLogin = () => {
   const router = useRouter();
   const queryClient = useQueryClient();
   return useMutation({
      mutationFn: async (data: TLoginDto) => {
         const res = await authService.login(data);

         return res;
      },
      onSuccess: (data) => {
         if (data?.data.accessToken) {
            const accessToken = data.data.accessToken;

            const decoded = jwtDecode(accessToken) as {
               id: string;
               roles: RoleName[];
            };

            const isAdmin = decoded.roles.includes(RoleName.ADMIN);

            router.push(isAdmin ? ROUTES.HOME : ROUTES.STUDENT_DASHBOARD);
            queryClient.invalidateQueries(['me']);
         }
         toast.success(data.message || 'Login successfully');
      },
      onError: (error: any) => {
         toast.error(error?.response?.data?.message || 'Login failed');
      },
   });
};
