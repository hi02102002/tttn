import { TOderBy, TQueryPagination } from './shared';

export type TClassroom = {
   name: string;
   academicYear: number;
   id: string;
   students: string[];
   _count: {
      students: number;
   };
};

export type TClassroomDto = {
   name: TClassroom['name'];
   academicYear: Date;
};

export type TClassroomQuery = TQueryPagination & {
   name?: TClassroom['name'];
   academicYear?: TClassroom['academicYear'];
} & TOderBy;
