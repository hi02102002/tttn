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
import { useForm } from 'react-hook-form';
import * as zod from 'zod';

type Props = {
   onSubmit?: ({
      values,
      onClose,
   }: {
      values: TFormValues;
      onClose?: () => void;
   }) => void;
   children: React.ReactNode;
   isLoading?: boolean;
};

const schema = zod
   .object({
      newPassword: zod
         .string({
            required_error: 'New password is required',
         })
         .nonempty({
            message: 'New password is required',
         })
         .min(8, {
            message: 'New password must be at least 8 characters',
         }),
      confirmPassword: zod
         .string({
            required_error: 'Confirm password is required',
         })
         .nonempty({
            message: 'Confirm password is required',
         })
         .min(8, {
            message: 'Confirm password must be at least 8 characters',
         }),
   })
   .refine((data) => data.newPassword === data.confirmPassword, {
      message: 'Confirm password must match password',
      path: ['confirmPassword'],
   });

type TFormValues = zod.infer<typeof schema>;

export const ChangePassword = ({ onSubmit, children, isLoading }: Props) => {
   const form = useForm<TFormValues>({
      resolver: zodResolver(schema),
      defaultValues: {},
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

   return (
      <Dialog open={isOpen} onOpenChange={onChange}>
         <DialogTrigger asChild>{children}</DialogTrigger>
         <DialogContent>
            <DialogHeader>
               <DialogTitle>Change user password</DialogTitle>
               <DialogDescription>
                  Please fill out the form below to change user password.
               </DialogDescription>
            </DialogHeader>
            <Form {...form}>
               <form
                  className="space-y-3"
                  id="change-password-form"
                  onSubmit={form.handleSubmit(_handleSubmit)}
                  autoComplete="off"
               >
                  <FormField
                     control={form.control}
                     name="newPassword"
                     render={({ field, fieldState }) => {
                        return (
                           <FormItem>
                              <FormLabel required>New password</FormLabel>
                              <FormControl>
                                 <Input
                                    {...field}
                                    error={fieldState.error?.message}
                                    placeholder="Enter new password"
                                 />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        );
                     }}
                  />
                  <FormField
                     control={form.control}
                     name="confirmPassword"
                     render={({ field, fieldState }) => {
                        return (
                           <FormItem>
                              <FormLabel required>Confirm password</FormLabel>
                              <FormControl>
                                 <Input
                                    {...field}
                                    error={fieldState.error?.message}
                                    placeholder="Enter confirm password"
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
                  form="change-password-form"
                  loading={isLoading}
               >
                  Change password
               </Button>
            </DialogFooter>
         </DialogContent>
      </Dialog>
   );
};

export default ChangePassword;
