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
   ScrollArea,
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from '@/components/ui';
import { useClassrooms } from '@/hooks/api';
import { useDisclosure } from '@/hooks/shared';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
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
   classId?: string;
};

const schema = z.object({
   name: z
      .string({
         required_error: 'Please enter classroom name',
      })
      .nonempty('Please enter classroom name'),
   classId: z
      .string({
         required_error: 'Please enter classroom',
      })
      .nonempty('Please enter classroom'),
   address: z
      .string({
         required_error: 'Please enter student address',
      })
      .nonempty('Please enter student address'),
});

type TFormValues = z.infer<typeof schema>;

export const AddUpdateStudent = ({
   children,
   description = 'Create a new student for classroom',
   title = 'Create student',
   type = 'ADD',
   onSubmit,
   defaultValues,
   isLoading,
   classId,
}: Props) => {
   const { data: responseClassrooms } = useClassrooms();
   const form = useForm<TFormValues>({
      resolver: zodResolver(schema),
      defaultValues: {
         name: defaultValues?.name ? defaultValues?.name : '',
         classId: defaultValues?.classId ? defaultValues?.classId : '',
         address: defaultValues?.address ? defaultValues?.address : '',
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

   const { control, handleSubmit } = form;

   const _handleSubmit = (values: TFormValues) => {
      onSubmit?.({
         values,
         onClose,
      });
   };

   useEffect(() => {
      if (classId && isOpen) {
         form.setValue('classId', classId);
      }
   }, [classId, form, isOpen]);

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
               >
                  <FormField
                     control={control}
                     name="name"
                     render={({ field, fieldState }) => {
                        return (
                           <FormItem>
                              <FormLabel required>Student</FormLabel>
                              <FormControl>
                                 <Input
                                    {...field}
                                    error={fieldState.error?.message}
                                    placeholder="Enter student name"
                                 />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        );
                     }}
                  />
                  <FormField
                     control={control}
                     name="address"
                     render={({ field, fieldState }) => {
                        return (
                           <FormItem>
                              <FormLabel required>Address</FormLabel>
                              <FormControl>
                                 <Input
                                    {...field}
                                    error={fieldState.error?.message}
                                    placeholder="Enter student address"
                                 />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        );
                     }}
                  />
                  {!classId && (
                     <FormField
                        control={control}
                        name="classId"
                        render={({ field, fieldState }) => {
                           return (
                              <FormItem>
                                 <FormLabel required>Classroom</FormLabel>
                                 <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                 >
                                    <FormControl>
                                       <SelectTrigger
                                          error={fieldState.error?.message}
                                       >
                                          <SelectValue placeholder="Select a verified email to display" />
                                       </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                       <ScrollArea className="h-52">
                                          {responseClassrooms?.classes.map(
                                             (_class) => {
                                                return (
                                                   <SelectItem
                                                      key={_class.id}
                                                      value={_class.id}
                                                   >
                                                      {_class.name}
                                                   </SelectItem>
                                                );
                                             }
                                          )}
                                       </ScrollArea>
                                    </SelectContent>
                                 </Select>
                                 <FormMessage />
                              </FormItem>
                           );
                        }}
                     />
                  )}
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
                  {type === 'ADD' ? 'Create student' : 'Save changes'}
               </Button>
            </DialogFooter>
         </DialogContent>
      </Dialog>
   );
};

export default AddUpdateStudent;
