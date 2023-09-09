import { httpClient } from '@/lib/axios';
import { TClassroom, TClassroomDto, TClassroomQuery } from '@/types/class';
import { TBaseResponse } from '@/types/shared';

class ClassroomsService {
   getAllClassrooms(q?: TClassroomQuery): Promise<
      TBaseResponse<{
         total: number;
         classes: TClassroom[];
      }>
   > {
      return httpClient.get('/classes', { params: q });
   }

   getClassroomById(id: string): Promise<TBaseResponse<TClassroom>> {
      return httpClient.get(`/classes/${id}`);
   }

   createClassroom(data: TClassroomDto): Promise<TBaseResponse<TClassroom>> {
      const academicYear = data.academicYear.getFullYear();

      return httpClient.post('/classes', {
         ...data,
         academicYear,
      });
   }

   updateClassroom(
      id: string,
      data: Partial<TClassroomDto>
   ): Promise<TBaseResponse<TClassroom>> {
      return httpClient.patch(`/classes/${id}`, data);
   }

   deleteClassroom(id: string): Promise<TBaseResponse<TClassroom>> {
      return httpClient.delete(`/classes/${id}`);
   }

   deleteClassrooms(ids: string[]): Promise<TBaseResponse<TClassroom[]>> {
      return httpClient.delete('/classes', { data: { ids } });
   }
}

export const classroomsService = new ClassroomsService();
