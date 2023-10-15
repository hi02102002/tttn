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
import { EExportType } from '@/types/shared';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

type Props = {
   children?: React.ReactNode;
   onSubmit?: ({}: { values: TFormValues; onClose?: () => void }) => void;
   isLoading?: boolean;
   defaultValues?: TFormValues;
   title?: string;
   description?: string;
};

const schema = z.object({
   name: z.string().default('untitled'),
   type: z
      .nativeEnum(EExportType)
      .refine((val) => val === 'xlsx' || val === 'pdf', {
         message: 'Invalid export type',
      }),
});

type TFormValues = z.infer<typeof schema>;

export const Export = ({
   children,
   onSubmit,
   isLoading,
   defaultValues,
   title,
   description,
}: Props) => {
   const form = useForm<TFormValues>({
      defaultValues: {
         name: defaultValues?.name || 'untitled',
         type: defaultValues?.type,
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
         defaultValues?.name.replace(' ', '_') ||
         'untitled';

      onSubmit?.({
         values: {
            ...values,
            name: `${name}.${values.type}`,
         },
         onClose,
      });
   };

   return (
      <Dialog open={isOpen} onOpenChange={onChange}>
         <DialogTrigger asChild>{children}</DialogTrigger>
         <DialogContent>
            <DialogHeader>
               <DialogTitle>{title || 'Export'}</DialogTitle>
               <DialogDescription>
                  {description || 'Export file'}
               </DialogDescription>
            </DialogHeader>
            <Form {...form}>
               <form
                  className="space-y-3"
                  id="export-form"
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
                  <FormField
                     control={control}
                     name="type"
                     render={({ field }) => {
                        return (
                           <FormItem>
                              <FormLabel required>File type</FormLabel>
                              <Select
                                 onValueChange={field.onChange}
                                 defaultValue={field.value}
                              >
                                 <FormControl>
                                    <SelectTrigger>
                                       <SelectValue placeholder="Select type of file" />
                                    </SelectTrigger>
                                 </FormControl>
                                 <SelectContent>
                                    <SelectItem value="xlsx">XLSX</SelectItem>
                                    <SelectItem value="pdf">PDF</SelectItem>
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
               <Button type="submit" form="export-form" loading={isLoading}>
                  Export file
               </Button>
            </DialogFooter>
         </DialogContent>
      </Dialog>
   );
};

export default Export;
