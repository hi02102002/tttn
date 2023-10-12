import { studentsService } from '@/services/students.service';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useDownload } from '../shared';

export const useExportSubjectsStudent = () => {
   const download = useDownload();
   return useMutation({
      mutationFn: async (mssv: string) => {
         const res = await studentsService.exportSubjectStudent(mssv);

         await download(res, `${mssv}.xlsx`);

         return res;
      },

      onSuccess: () => {
         toast.success('Export subjects of student successfully');
      },
      onError: () => {
         toast.error(
            'Something went wrong while exporting subjects of student'
         );
      },
   });
};
