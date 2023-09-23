import { useMe } from '@/hooks/api';
import { TUser } from '@/types/user';
import { createContext, useContext } from 'react';

type TUserCtx = {
   user: TUser | null | undefined;
   isUserLoading?: boolean;
};

export const UserContext = createContext<TUserCtx>({
   user: null,
});

export const UserProvider = ({
   children,
   initUser,
}: {
   children: React.ReactNode;
   initUser?: TUser | null;
}) => {
   const { data: user, isLoading: isUserLoading } = useMe(initUser);

   return (
      <UserContext.Provider value={{ user, isUserLoading }}>
         {children}
      </UserContext.Provider>
   );
};

export const useUser = () => {
   const ctx = useContext(UserContext);
   if (ctx === undefined) {
      throw new Error('useUser must be used within a UserProvider');
   }
   return ctx;
};
