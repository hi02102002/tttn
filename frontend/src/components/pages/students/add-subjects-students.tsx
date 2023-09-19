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
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from '@/components/ui';
import { FancyMultiSelect } from '@/components/ui/multiple-combobox';
import { useSubjects } from '@/hooks/api';
import { useDisclosure } from '@/hooks/shared';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

type Props = {
   children?: React.ReactNode;
   onSubmit?: ({
      values,
      onClose,
   }: {
      values: string[];
      onClose: () => void;
   }) => void;
   isLoading?: boolean;
};

const schema = z.object({
   subjects: z
      .array(
         z.object({
            value: z.string(),
            label: z.string(),
         })
      )
      .nonempty({
         message: 'Please select at least one subject',
      }),
});

type FormValues = z.infer<typeof schema>;

export const AddSubjectStudent = ({ children, onSubmit, isLoading }: Props) => {
   const form = useForm<FormValues>({
      resolver: zodResolver(schema),
      defaultValues: {
         subjects: [],
      },
   });

   const { data: resSubjects } = useSubjects();

   const { handleSubmit } = form;

   const [isOpen, { onChange, onClose }] = useDisclosure({
      isOpen: false,
      callback: {
         close: () => {
            form.reset();
         },
      },
   });

   const _handleSubmit = (values: FormValues) => {
      const ids = values.subjects.map((item) => item.value);
      onSubmit?.({
         values: ids,
         onClose,
      });
   };

   return (
      <Dialog onOpenChange={onChange} open={isOpen}>
         <DialogTrigger asChild>{children}</DialogTrigger>
         <DialogContent>
            <DialogHeader>
               <DialogTitle>Add subjects to student</DialogTitle>
               <DialogDescription>
                  Choose multiple subjects for student
               </DialogDescription>
            </DialogHeader>
            <Form {...form}>
               <form
                  className="space-y-3"
                  id="add-subject-student-form"
                  onSubmit={handleSubmit(_handleSubmit)}
                  autoComplete="off"
               >
                  <FormField
                     name="subjects"
                     control={form.control}
                     render={({ field, fieldState }) => {
                        return (
                           <FormItem>
                              <FormLabel required>Subjects</FormLabel>
                              <FormControl>
                                 <FancyMultiSelect
                                    options={
                                       resSubjects?.subjects.map((subject) => {
                                          return {
                                             label: `${subject.name} (${subject.numCredits})`,
                                             value: subject.id,
                                          };
                                       }) || []
                                    }
                                    width="100%"
                                    onChange={(values) => {
                                       field.onChange(values);
                                    }}
                                    values={field.value}
                                    placeholder="Select subjects"
                                    placeholderEmpty="No subjects found"
                                    placeholderSelected="Selected subjects"
                                    error={fieldState.error?.message}
                                 />
                              </FormControl>
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
               <Button
                  type="submit"
                  form="add-subject-student-form"
                  loading={isLoading}
               >
                  Add subjects
               </Button>
            </DialogFooter>
         </DialogContent>
      </Dialog>
   );
};

export default AddSubjectStudent;
