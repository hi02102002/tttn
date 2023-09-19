import { ENDPOINTS } from '@/constants';
import { httpClient } from '@/lib/axios';
import { TBaseResponse, TBaseService } from '@/types/shared';
import { TSubject, TSubjectDto, TSubjectQuery } from '@/types/subject';

class SubjectService implements TBaseService {
   endpoint: string = ENDPOINTS.SUBJECTS;
   getAllSubjects(q?: TSubjectQuery): Promise<
      TBaseResponse<{
         total: number;
         subjects: TSubject[];
      }>
   > {
      return httpClient.get(this.endpoint, { params: q });
   }

   getSubjectById(id: string): Promise<TBaseResponse<TSubject>> {
      return httpClient.get(`${this.endpoint}/${id}`);
   }

   createSubject(data: TSubjectDto): Promise<TBaseResponse<TSubject>> {
      return httpClient.post(this.endpoint, data);
   }

   updateSubject(
      id: string,
      data: Partial<TSubjectDto>
   ): Promise<TBaseResponse<TSubject>> {
      return httpClient.patch(`${this.endpoint}/${id}`, data);
   }

   deleteSubject(id: string): Promise<TBaseResponse<TSubject>> {
      return httpClient.delete(`${this.endpoint}/${id}`);
   }

   deleteSubjects(ids: string[]): Promise<TBaseResponse<TSubject[]>> {
      return httpClient.delete(this.endpoint, { data: { ids } });
   }
}

export const subjectService = new SubjectService();
