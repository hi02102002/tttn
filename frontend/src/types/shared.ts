import { NextPage } from 'next';
import { AppProps } from 'next/app';
import { ReactElement, ReactNode } from 'react';

export type TNavItem = {
   name: string;
   path: string;
   id: string;
};

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
   getLayout?: (page: ReactElement) => ReactNode;
};

export type AppPropsWithLayout = AppProps & {
   Component: NextPageWithLayout;
};

export type TQueryPagination = {
   page?: number;
   limit?: number;
};

export type TBaseResponse<T = unknown> = {
   data: T;
   message: string;
};

export type ESort = 'asc' | 'desc';

export type TOderBy = {
   orderBy?: {
      [key: string]: ESort;
   };
};

export interface TBaseService {
   endpoint: string;
}

export enum EExportType {
   XLSX = 'xlsx',
   PDF = 'pdf',
}
