import { classroomsService } from '@/services';
import { TExportDto } from '@/types/class';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useDownload } from '../shared';

export const useExportClassrooms = () => {
   const download = useDownload();
   return useMutation({
      mutationFn: async (
         options?: TExportDto & {
            filename?: string;
         }
      ) => {
         const { filename, classId, type } = options || {};

         console.log({
            classId,
            type,
         });
         const res = await classroomsService.exportAllClassrooms({
            classId,
            type,
         });

         await download(res, filename || `classrooms.${type}`);

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
