import { ENDPOINTS } from '@/constants';
import { httpClient } from '@/lib/axios';
import {
   TClassroom,
   TClassroomDto,
   TClassroomQuery,
   TExportDto,
} from '@/types/class';
import { TBaseResponse, TBaseService } from '@/types/shared';

class ClassroomsService implements TBaseService {
   endpoint: string = ENDPOINTS.CLASSES;
   getAllClassrooms(q?: TClassroomQuery): Promise<
      TBaseResponse<{
         total: number;
         classes: TClassroom[];
      }>
   > {
      return httpClient.get(this.endpoint, { params: q });
   }

   getClassroomById(id: string): Promise<TBaseResponse<TClassroom>> {
      return httpClient.get(`${this.endpoint}/${id}`);
   }

   createClassroom(data: TClassroomDto): Promise<TBaseResponse<TClassroom>> {
      const academicYear = data.academicYear.getFullYear();

      return httpClient.post(this.endpoint, {
         ...data,
         academicYear,
      });
   }

   updateClassroom(
      id: string,
      data: Partial<TClassroomDto>
   ): Promise<TBaseResponse<TClassroom>> {
      return httpClient.patch(`${this.endpoint}/${id}`, data);
   }

   deleteClassroom(id: string): Promise<TBaseResponse<TClassroom>> {
      return httpClient.delete(`${this.endpoint}/${id}`);
   }

   deleteClassrooms(ids: string[]): Promise<TBaseResponse<TClassroom[]>> {
      return httpClient.delete(this.endpoint, { data: { ids } });
   }

   exportAllClassrooms(data?: TExportDto): Promise<Blob> {
      return httpClient.post(`${this.endpoint}/export`, data, {
         responseType: 'blob',
      });
   }
}

export const classroomsService = new ClassroomsService();
