import { TClassroom } from './class';
import { EExportType, TOderBy, TQueryPagination } from './shared';

export type TStudent = {
   mssv: string;
   name: string;
   address: string;
   classId: string;
   class: TClassroom;
};

export type TQueryStudent = Partial<{
   name: string;
   address: string;
   classId: string;
}> &
   TQueryPagination &
   TOderBy;

export type TStudentDto = Omit<TStudent, 'mssv' | 'class'>;

export type TAddSubjectsToStudentDto = {
   mssv: string;
   subjectIds: string[];
};

export type TExportDto = {
   mssv: string;
   type: EExportType;
   filename: string;
};
