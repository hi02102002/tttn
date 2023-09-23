import Layout from '@/layouts/student';
import { NextPageWithLayout } from '@/types/shared';
import React from 'react';

type Props = {};

const RegisterSubjects: NextPageWithLayout<Props> = () => {
   return <div>RegisterSubjects</div>;
};

RegisterSubjects.getLayout = (page) => {
   return <Layout>{page}</Layout>;
};

export default RegisterSubjects;
