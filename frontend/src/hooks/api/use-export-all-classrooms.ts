import { classroomsService } from '@/services';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useDownload } from '../shared';

export const useExportAllClassrooms = () => {
   const download = useDownload();
   return useMutation({
      mutationFn: async () => {
         const res = await classroomsService.exportAllClassrooms();

         await download(res, 'classrooms.xlsx');

         return res;
      },
      onSuccess: () => {
         toast.success('Export all classrooms successfully');
      },
      onError: () => {
         toast.error('Something went wrong while exporting all classrooms');
      },
   });
};
