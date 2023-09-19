import { classroomsService } from '@/services';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useDownload } from '../shared';

export const useExportClassrooms = () => {
   const download = useDownload();
   return useMutation({
      mutationFn: async (options?: { classId?: string; filename?: string }) => {
         const { filename = 'classrooms.xlsx', classId } = options || {};
         const res = await classroomsService.exportAllClassrooms({ classId });

         await download(res, filename);

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
