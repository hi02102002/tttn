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
import { TClassroom } from '@/types/class';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

type Props = {
   children?: React.ReactNode;
   classroom: TClassroom;
   onSubmit?: ({}: { name: string; onClose?: () => void }) => void;
   isLoading?: boolean;
};

const schema = z.object({
   name: z.string().default('untitled'),
});

type TFormValues = z.infer<typeof schema>;

export const ExportClassrooms = ({
   children,
   classroom,
   onSubmit,
   isLoading,
}: Props) => {
   const form = useForm<TFormValues>({
      defaultValues: {
         name: classroom.name,
      },
      resolver: zodResolver(schema),
   });

   const [isOpen, { onChange, onClose }] = useDisclosure({
      isOpen: false,
      callback: {
         close: () => {
            form.reset();
         },
      },
   });

   const { control, handleSubmit } = form;

   const _handleSubmit = (values: TFormValues) => {
      const name =
         values.name.trim().replace(' ', '_') ||
         classroom.name.replace(' ', '_');

      onSubmit?.({
         name: `${name}.xlsx`,
         onClose,
      });
   };

   return (
      <Dialog open={isOpen} onOpenChange={onChange}>
         <DialogTrigger asChild>{children}</DialogTrigger>
         <DialogContent>
            <DialogHeader>
               <DialogTitle>Export class {classroom.name}</DialogTitle>
               <DialogDescription>
                  Export all students of class {classroom.name}
               </DialogDescription>
            </DialogHeader>
            <Form {...form}>
               <form
                  className="space-y-3"
                  id="export-class-form"
                  onSubmit={handleSubmit(_handleSubmit)}
                  autoComplete="off"
               >
                  <FormField
                     control={control}
                     name="name"
                     render={({ field, fieldState }) => {
                        return (
                           <FormItem>
                              <FormLabel>File name</FormLabel>
                              <FormControl>
                                 <Input
                                    {...field}
                                    error={fieldState.error?.message}
                                    placeholder="Enter file name"
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
                  form="export-class-form"
                  loading={isLoading}
               >
                  Export file
               </Button>
            </DialogFooter>
         </DialogContent>
      </Dialog>
   );
};

export default ExportClassrooms;
