import { TOderBy, TQueryPagination } from './shared';
import { TStudent } from './student';
import { TSubject } from './subject';

export type TScore = {
   id: string;
   score: number | null;
   student: TStudent;
   subject: TSubject;
};

export type TQueryScore = {
   mssv?: string;
   subjectId?: string;
   classId?: string;
   studentName?: string;
} & TQueryPagination &
   TOderBy;

export type TUpdateScoreDto = {
   mssv: string;
   subjectId: string;
   score: number;
};
