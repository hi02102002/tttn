import { TOderBy, TQueryPagination } from './shared';

export type TSubject = {
   name: string;
   numCredits: number;
   id: string;
};

export type TSubjectDto = {
   name: TSubject['name'];
   numCredits: TSubject['numCredits'];
};

export type TSubjectQuery = TQueryPagination &
   TOderBy & {
      name?: TSubject['name'];
      numCredits?: TSubject['numCredits'];
      studentId?: string;
   };
