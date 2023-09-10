import { httpClient } from '@/lib/axios';
import { TBaseResponse } from '@/types/shared';
import { TQueryStudent, TStudent, TStudentDto } from '@/types/student';

class StudentsService {
   getStudents(q?: TQueryStudent): Promise<
      TBaseResponse<{
         total: number;
         students: TStudent[];
      }>
   > {
      return httpClient.get('/students', {
         params: q,
      });
   }

   getStudent(mssv: string): Promise<TBaseResponse<TStudent>> {
      return httpClient.get(`/students/${mssv}`);
   }
   createStudent(data: TStudentDto): Promise<TBaseResponse<TStudent>> {
      return httpClient.post('/students', data);
   }

   updateStudent(
      mssv: string,
      data: Partial<TStudentDto>
   ): Promise<TBaseResponse<TStudent>> {
      return httpClient.patch(`/students/${mssv}`, data);
   }

   deleteStudent(mssv: string): Promise<TBaseResponse<TStudent>> {
      return httpClient.delete(`/students/${mssv}`);
   }

   deleteManyStudents(mssv: string[]): Promise<TBaseResponse<TStudent>> {
      return httpClient.delete('/students', {
         data: {
            mssv,
         },
      });
   }
}

export const studentsService = new StudentsService();
