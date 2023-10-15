import {
   Button,
   Form,
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
   Input,
} from '@/components/ui';
import { useLogin } from '@/hooks/api';
import { zodResolver } from '@hookform/resolvers/zod';
import { GraduationCap } from 'lucide-react';
import Head from 'next/head';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const schema = z.object({
   username: z.string().nonempty('Username or MSSV is required'),
   password: z
      .string()
      .nonempty('Password is required')
      .min(8, 'Password at least 8 character.'),
});

type FormValues = z.infer<typeof schema>;

const Login = () => {
   const form = useForm<FormValues>({
      defaultValues: {
         username: '',
         password: '',
      },
      resolver: zodResolver(schema),
   });

   const { mutateAsync: login, isLoading, data } = useLogin();

   const handleLogin = async (values: FormValues) => {
      await login(values);
   };

   return (
      <>
         <Head>
            <title>Login</title>
         </Head>
         <div className="relative flex items-center justify-center min-h-screen px-4">
            <div className="w-full max-w-sm">
               <div className="space-y-6">
                  <div className="flex flex-col items-center space-y-2 text-center">
                     <GraduationCap className="w-10 h-10" />
                     <h1 className="text-2xl font-bold">Welcome back</h1>
                     <p className="text-sm text-muted-foreground">
                        Enter your email or MSSV and password to sign in to your
                        account.
                     </p>
                  </div>
                  <div className="flex flex-col space-y-6">
                     <Form {...form}>
                        <form
                           className="flex flex-col space-y-3"
                           onSubmit={form.handleSubmit(handleLogin)}
                        >
                           <FormField
                              control={form.control}
                              name="username"
                              render={({ field, fieldState }) => {
                                 return (
                                    <FormItem>
                                       <FormLabel required>
                                          Username / MSSV
                                       </FormLabel>
                                       <FormControl>
                                          <Input
                                             {...field}
                                             placeholder="20201902001"
                                             error={fieldState.error?.message}
                                          />
                                       </FormControl>
                                       <FormMessage />
                                    </FormItem>
                                 );
                              }}
                           />
                           <FormField
                              control={form.control}
                              name="password"
                              render={({ field, fieldState }) => {
                                 return (
                                    <FormItem>
                                       <FormLabel required>Password</FormLabel>
                                       <FormControl>
                                          <Input
                                             {...field}
                                             placeholder="Your password"
                                             error={fieldState.error?.message}
                                             type="password"
                                          />
                                       </FormControl>
                                       <FormMessage />
                                    </FormItem>
                                 );
                              }}
                           />

                           <Button
                              className="w-full"
                              type="submit"
                              loading={isLoading}
                           >
                              Login
                           </Button>
                        </form>
                     </Form>
                  </div>
               </div>
            </div>
         </div>
      </>
   );
};

export default Login;
