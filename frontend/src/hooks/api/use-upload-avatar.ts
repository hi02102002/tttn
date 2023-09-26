import { usersService } from '@/services';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useUploadAvatar = () => {
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: async (file: File | Blob | string) => {
         const res = await usersService.changeAvatar(file);

         return res;
      },
      onSuccess: (data) => {
         toast.success(data.message || 'Upload avatar successfully');
         queryClient.invalidateQueries(['me']);
      },
      onError: (err: any) => {
         toast.error(err?.response?.data.message || 'Upload avatar failed');
      },
   });
};
