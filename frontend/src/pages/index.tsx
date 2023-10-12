import { ROUTES } from '@/constants';
import React from 'react';

type Props = {};

const Home = (props: Props) => {
   return <div>Home</div>;
};

export default Home;

export const getServerSideProps = async () => {
   return {
      redirect: {
         destination: ROUTES.ADMIN,
         permanent: false,
      },
   };
};
