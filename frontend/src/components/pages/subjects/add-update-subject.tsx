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
   Input,
} from '@/components/ui';
import { useDisclosure } from '@/hooks/shared';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

type Props = {
   children: React.ReactNode;
   title?: string;
   description?: string;
   type?: 'UPDATE' | 'ADD';
   onSubmit?: (options: { values: TFormValues; onClose?: () => void }) => void;
   defaultValues?: Partial<TFormValues>;
   isLoading?: boolean;
};

const schema = z.object({
   name: z
      .string({
         required_error: 'Please enter subject name',
      })
      .nonempty('Please enter subject name'),
   numCredits: z
      .string({
         required_error: 'Please enter number of credits',
      })
      .nonempty('Please enter number of credits')
      .regex(/^[0-9]+\d*$/, 'Please enter only number and positive number')
      .refine((v) => Number(v) !== 0, {
         message: 'Number of credits at least one credit',
      }),
});

const numberNotZeroLeading = (value: string) => {
   if (value.length === 1 && value === '0') {
      value = value.replace('0', '');
   }

   value = value.replace(/[^0-9]+/g, '');

   return value;
};

const result = schema.safeParse({
   name: 'Hoang Huy',
   numCredits: 'a',
});

type TFormValues = z.infer<typeof schema>;

export const AddUpdateSubject = ({
   defaultValues,
   children,
   description = 'Please fill out the form below to create a new subject',
   isLoading,
   onSubmit,
   title = 'Add new subject',
   type = 'ADD',
}: Props) => {
   const { name = '', numCredits = '' } = defaultValues || {};
   const form = useForm<TFormValues>({
      resolver: zodResolver(schema),
      defaultValues: {
         name,
         numCredits,
      },
   });

   const [isOpen, { onChange, onClose }] = useDisclosure({
      isOpen: false,
      callback: {
         close() {
            form.reset();
         },
      },
   });

   const _handleSubmit = (values: TFormValues) => {
      onSubmit?.({
         values,
         onClose,
      });
   };

   const { control, handleSubmit } = form;

   return (
      <Dialog open={isOpen} onOpenChange={onChange}>
         <DialogTrigger asChild>{children}</DialogTrigger>
         <DialogContent>
            <DialogHeader>
               <DialogTitle>{title}</DialogTitle>
               <DialogDescription>{description}</DialogDescription>
            </DialogHeader>
            <Form {...form}>
               <form
                  className="space-y-3"
                  id="add-update-classroom-form"
                  onSubmit={handleSubmit(_handleSubmit)}
                  autoComplete="off"
               >
                  <FormField
                     control={control}
                     name="name"
                     render={({ field, fieldState }) => {
                        return (
                           <FormItem>
                              <FormLabel required>Subject</FormLabel>
                              <FormControl>
                                 <Input
                                    {...field}
                                    error={fieldState.error?.message}
                                    placeholder="Enter subject name"
                                 />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        );
                     }}
                  />
                  <FormField
                     control={control}
                     name="numCredits"
                     render={({ field, fieldState }) => {
                        return (
                           <FormItem>
                              <FormLabel required>Number of credits</FormLabel>
                              <FormControl>
                                 <Input
                                    {...field}
                                    error={fieldState.error?.message}
                                    placeholder="Enter number of credits"
                                    onChange={(e) =>
                                       field.onChange(
                                          numberNotZeroLeading(e.target.value)
                                       )
                                    }
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
                  form="add-update-classroom-form"
                  disabled={!form.formState.isDirty && type === 'UPDATE'}
                  loading={isLoading}
               >
                  {type === 'ADD' ? 'Create subject' : 'Save changes'}
               </Button>
            </DialogFooter>
         </DialogContent>
      </Dialog>
   );
};

export default AddUpdateSubject;
