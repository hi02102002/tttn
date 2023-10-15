import {
   Button,
   Checkbox,
   Form,
   FormField,
   LoadingFullpage,
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from '@/components/ui';
import { ENDPOINTS } from '@/constants';
import { useListSubjectToRegister, useRegisterSubjects } from '@/hooks/api';
import Layout from '@/layouts/student';
import http_server from '@/lib/axios/http-server';

import { RoleName } from '@/types/role';
import { NextPageWithLayout, TBaseResponse } from '@/types/shared';
import { TSubject } from '@/types/subject';
import { withUser } from '@/utils/withUser';
import { zodResolver } from '@hookform/resolvers/zod';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

type Props = {
   subjects: Array<TSubject>;
};

const schema = z.object({
   subjects: z.array(z.string()).refine((value) => value.some((item) => item), {
      message: 'You have to select at least one subject.',
   }),
});

type FormValues = z.infer<typeof schema>;

const RegisterSubjects: NextPageWithLayout<Props> = ({
   subjects: initSubjects,
}) => {
   const { data: subjects } = useListSubjectToRegister(initSubjects);
   const form = useForm<FormValues>({
      resolver: zodResolver(schema),
      defaultValues: {
         subjects: [],
      },
   });

   const subjectsField = form.watch('subjects');

   const { mutateAsync: registerSubjects, isLoading: isRegisteringSubjects } =
      useRegisterSubjects();

   const onSubmit = async (values: FormValues) => {
      await registerSubjects(values.subjects);
   };

   return (
      <>
         <Head>
            <title>Register Subjects</title>
         </Head>
         {isRegisteringSubjects && <LoadingFullpage />}
         <div className="space-y-4">
            <div>
               <h2 className="text-2xl font-semibold">Register Subjects</h2>
               <p className="text-muted-foreground">
                  List of subjects that you can register to study.
               </p>
            </div>
            <div>
               <Form {...form}>
                  <form
                     className="space-y-4"
                     onSubmit={form.handleSubmit(onSubmit)}
                  >
                     <Table>
                        <TableHeader>
                           <TableRow>
                              <TableHead></TableHead>
                              <TableHead className="whitespace-nowrap">
                                 Subject
                              </TableHead>
                              <TableHead className="whitespace-nowrap">
                                 Number of credits
                              </TableHead>
                           </TableRow>
                        </TableHeader>
                        <TableBody>
                           {subjects && subjects?.length === 0 ? (
                              <TableRow>
                                 <TableCell colSpan={3}>
                                    <p className="flex items-center justify-center font-medium text-muted-foreground p-4">
                                       Not found any subjects to register.
                                    </p>
                                 </TableCell>
                              </TableRow>
                           ) : (
                              subjects?.map((subject) => (
                                 <FormField
                                    key={subject.id}
                                    control={form.control}
                                    name="subjects"
                                    render={({ field }) => {
                                       return (
                                          <TableRow key={subject.id}>
                                             <TableCell className="font-medium">
                                                <Checkbox
                                                   checked={field.value?.includes(
                                                      subject.id
                                                   )}
                                                   onCheckedChange={(
                                                      checked
                                                   ) => {
                                                      return checked
                                                         ? field.onChange([
                                                              ...field.value,
                                                              subject.id,
                                                           ])
                                                         : field.onChange(
                                                              field.value?.filter(
                                                                 (value) =>
                                                                    value !==
                                                                    subject.id
                                                              )
                                                           );
                                                   }}
                                                />
                                             </TableCell>
                                             <TableCell className="font-medium">
                                                {subject.name}
                                             </TableCell>
                                             <TableCell>
                                                {subject.numCredits}
                                             </TableCell>
                                          </TableRow>
                                       );
                                    }}
                                 />
                              ))
                           )}
                        </TableBody>
                     </Table>
                     <div className="flex items-center justify-end">
                        <Button
                           type="submit"
                           disabled={subjectsField.length === 0}
                           className="select-none"
                           loading={isRegisteringSubjects}
                        >
                           Register subjects
                        </Button>
                     </div>
                  </form>
               </Form>
            </div>
         </div>
      </>
   );
};

export const getServerSideProps: GetServerSideProps = withUser({
   isProtected: true,
   roles: [RoleName.STUDENT],
})(async ({ ctx }) => {
   const res: TBaseResponse<Array<TSubject>> = await http_server(ctx)(
      `${ENDPOINTS.SUBJECTS}/list-register`
   );

   return {
      props: {
         subjects: res.data,
      },
   };
});

RegisterSubjects.getLayout = (page) => {
   return <Layout>{page}</Layout>;
};

export default RegisterSubjects;
