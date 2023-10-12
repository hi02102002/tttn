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
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from '@/components/ui';
import { useDisclosure } from '@/hooks/shared';
import { EStatus } from '@/types/user';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as zod from 'zod';

type Props = {
   defaultValues?: TFormValues;
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

const schema = zod.object({
   username: zod
      .string({
         required_error: 'Username is required',
      })
      .nonempty({
         message: 'Username is required',
      }),
   status: zod.nativeEnum(EStatus, {
      required_error: 'Status is required',
   }),
});

type TFormValues = zod.infer<typeof schema>;

export const UpdateUser = ({
   onSubmit,
   defaultValues,
   children,
   isLoading,
}: Props) => {
   const form = useForm<TFormValues>({
      resolver: zodResolver(schema),
      defaultValues: {
         username: defaultValues?.username ?? '',
         status: defaultValues?.status ?? EStatus.ACTIVE,
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

   return (
      <Dialog open={isOpen} onOpenChange={onChange}>
         <DialogTrigger asChild>{children}</DialogTrigger>
         <DialogContent>
            <DialogHeader>
               <DialogTitle>Update user</DialogTitle>
               <DialogDescription>
                  Please fill out the form below to update user information
               </DialogDescription>
            </DialogHeader>
            <Form {...form}>
               <form
                  className="space-y-3"
                  id="update-user-form"
                  onSubmit={form.handleSubmit(_handleSubmit)}
                  autoComplete="off"
               >
                  <FormField
                     control={form.control}
                     name="username"
                     render={({ field, fieldState }) => {
                        return (
                           <FormItem>
                              <FormLabel required>Username</FormLabel>
                              <FormControl>
                                 <Input
                                    {...field}
                                    error={fieldState.error?.message}
                                    placeholder="Enter username"
                                 />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        );
                     }}
                  />
                  <FormField
                     control={form.control}
                     name="status"
                     render={({ field, fieldState }) => {
                        return (
                           <FormItem>
                              <FormLabel required>Status</FormLabel>
                              <Select
                                 onValueChange={field.onChange}
                                 defaultValue={field.value}
                              >
                                 <FormControl>
                                    <SelectTrigger
                                       error={fieldState.error?.message}
                                    >
                                       <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                 </FormControl>
                                 <SelectContent>
                                    {Object.values(EStatus).map((status) => {
                                       return (
                                          <SelectItem
                                             key={status}
                                             value={status}
                                          >
                                             {status}
                                          </SelectItem>
                                       );
                                    })}
                                 </SelectContent>
                              </Select>
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
                  form="update-user-form"
                  loading={isLoading}
               >
                  Save changes
               </Button>
            </DialogFooter>
         </DialogContent>
      </Dialog>
   );
};

export default UpdateUser;
