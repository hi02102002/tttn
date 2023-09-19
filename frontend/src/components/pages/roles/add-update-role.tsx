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
};

const schema = z.object({
   name: z
      .string({
         required_error: 'Please enter role name',
      })
      .nonempty('Please enter role name'),
});

type TFormValues = z.infer<typeof schema>;

export const AddUpdateRole = ({
   children,
   description = 'Create a new role in the system',
   title = 'Create role',
   type = 'ADD',
   onSubmit,
   defaultValues,
   isLoading,
}: Props) => {
   const form = useForm<TFormValues>({
      resolver: zodResolver(schema),
      defaultValues: {
         name: defaultValues?.name ? defaultValues?.name : '',
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
                  id="add-update-role-form"
                  onSubmit={handleSubmit(_handleSubmit)}
                  autoComplete="off"
               >
                  <FormField
                     control={control}
                     name="name"
                     render={({ field, fieldState }) => {
                        return (
                           <FormItem>
                              <FormLabel required>Role</FormLabel>
                              <FormControl>
                                 <Input
                                    {...field}
                                    error={fieldState.error?.message}
                                    placeholder="Enter role name"
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
                  form="add-update-role-form"
                  disabled={!form.formState.isDirty && type === 'UPDATE'}
                  loading={isLoading}
               >
                  {type === 'ADD' ? 'Create role' : 'Save changes'}
               </Button>
            </DialogFooter>
         </DialogContent>
      </Dialog>
   );
};

export default AddUpdateRole;
