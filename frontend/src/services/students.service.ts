import { ENDPOINTS } from '@/constants';
import { httpClient } from '@/lib/axios';
import { TBaseResponse, TBaseService } from '@/types/shared';
import {
   TAddSubjectsToStudentDto,
   TQueryStudent,
   TStudent,
   TStudentDto,
} from '@/types/student';

class StudentsService implements TBaseService {
   endpoint: string = ENDPOINTS.STUDENTS;
   getStudents(q?: TQueryStudent): Promise<
      TBaseResponse<{
         total: number;
         students: TStudent[];
      }>
   > {
      return httpClient.get(this.endpoint, {
         params: q,
      });
   }

   getStudent(mssv: string): Promise<TBaseResponse<TStudent>> {
      return httpClient.get(`${this.endpoint}/${mssv}`);
   }
   createStudent(data: TStudentDto): Promise<TBaseResponse<TStudent>> {
      return httpClient.post(this.endpoint, data);
   }

   updateStudent(
      mssv: string,
      data: Partial<TStudentDto>
   ): Promise<TBaseResponse<TStudent>> {
      return httpClient.patch(`${this.endpoint}/${mssv}`, data);
   }

   deleteStudent(mssv: string): Promise<TBaseResponse<TStudent>> {
      return httpClient.delete(`${this.endpoint}/${mssv}`);
   }

   deleteManyStudents(mssv: string[]): Promise<TBaseResponse<TStudent>> {
      return httpClient.delete(this.endpoint, {
         data: {
            mssv,
         },
      });
   }
   addSubjectsToStudent(
      data: TAddSubjectsToStudentDto
   ): Promise<TBaseResponse<null>> {
      return httpClient.post(`${this.endpoint}/add-subjects`, data);
   }

   exportSubjectStudent(mssv: string): Promise<Blob> {
      return httpClient.get(`${this.endpoint}/export/${mssv}`, {
         responseType: 'blob',
      });
   }
}

export const studentsService = new StudentsService();
