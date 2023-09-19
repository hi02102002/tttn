import {
   Button,
   Dialog,
   DialogContent,
   DialogDescription,
   DialogFooter,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
   Form,
   FormControl,
   FormDescription,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
   Input,
} from '@/components/ui';
import { useDisclosure } from '@/hooks/shared';
import { TStudent } from '@/types/student';
import { TSubject } from '@/types/subject';
import { roundScore } from '@/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

type Props = {
   children: React.ReactNode;
   subject: TSubject;
   student: TStudent;
   defaultValue?: number;
   onSubmit?: ({}: { value: number; onClose?: () => void }) => void;
   isLoading?: boolean;
};

const schema = z.object({
   score: z
      .string({
         required_error: 'Please enter score of student',
      })
      .nonempty('Please enter score of student')
      .regex(/^-?\d{1,2}(\.\d{1,3})?$/, 'Please enter correct format score')
      .refine((v) => Number(v) <= 10, {
         message: 'Score must be less than or equal to 10',
      })
      .refine((v) => Number(v) >= 0, {
         message: 'Score must be greater than or equal to 0',
      }),
});

type TFormValues = z.infer<typeof schema>;

export const UpdateScore = ({
   children,
   student,
   subject,
   defaultValue,
   onSubmit,
   isLoading,
}: Props) => {
   const form = useForm<TFormValues>({
      resolver: zodResolver(schema),
      defaultValues: {
         score: defaultValue ? defaultValue.toString() : undefined,
      },
   });
   const [isOpen, { onChange, onClose }] = useDisclosure({
      isOpen: false,
      callback: {
         close: () => {
            form.reset();
         },
      },
   });

   const { handleSubmit, control } = form;

   const _handleSubmit = (values: TFormValues) => {
      const score = roundScore(Number(values.score));

      onSubmit?.({
         value: score,
         onClose,
      });
   };

   return (
      <Dialog open={isOpen} onOpenChange={onChange}>
         <DialogTrigger asChild>{children}</DialogTrigger>
         <DialogContent>
            <DialogHeader>
               <DialogTitle>Update student score</DialogTitle>
               <DialogDescription>
                  Please enter student score to update score
               </DialogDescription>
            </DialogHeader>
            <Form {...form}>
               <form
                  className="space-y-3"
                  id="update-score"
                  autoComplete="off"
                  onSubmit={handleSubmit(_handleSubmit)}
               >
                  <FormItem>
                     <FormLabel required>MSSV</FormLabel>
                     <FormControl>
                        <Input
                           placeholder="MSSV"
                           disabled
                           defaultValue={student.mssv}
                        />
                     </FormControl>
                  </FormItem>
                  <FormItem>
                     <FormLabel required>Student</FormLabel>
                     <FormControl>
                        <Input
                           placeholder="Student"
                           disabled
                           defaultValue={student.name}
                        />
                     </FormControl>
                  </FormItem>
                  <FormItem>
                     <FormLabel required>Subject</FormLabel>
                     <FormControl>
                        <Input
                           placeholder="Subject"
                           disabled
                           defaultValue={subject.name}
                        />
                     </FormControl>
                  </FormItem>
                  <FormField
                     name="score"
                     control={control}
                     render={({ field, fieldState }) => {
                        return (
                           <FormItem>
                              <FormLabel required>Score</FormLabel>
                              <FormControl>
                                 <Input
                                    {...field}
                                    error={fieldState.error?.message}
                                    placeholder="Enter student score"
                                 />
                              </FormControl>
                              <FormDescription>
                                 Score should be 0.1 5.25 10.00,... And score
                                 will round the number to the second decimal
                                 place
                              </FormDescription>
                              <FormMessage />
                           </FormItem>
                        );
                     }}
                  />
               </form>
            </Form>
            <DialogFooter>
               <Button variant="outline" onClick={onClose}>
                  Cancel
               </Button>
               <Button type="submit" form="update-score" loading={isLoading}>
                  Update score
               </Button>
            </DialogFooter>
         </DialogContent>
      </Dialog>
   );
};

export default UpdateScore;
