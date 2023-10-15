import { studentsService } from '@/services/students.service';
import { TExportDto } from '@/types/student';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useDownload } from '../shared';

export const useExportSubjectsStudent = () => {
   const download = useDownload();
   return useMutation({
      mutationFn: async (data: TExportDto) => {
         const { filename } = data;
         const res = await studentsService.exportSubjectStudent(data);

         await download(res, filename);

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
