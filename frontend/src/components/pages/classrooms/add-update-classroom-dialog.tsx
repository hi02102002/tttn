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
   Popover,
   PopoverContent,
   PopoverTrigger,
} from '@/components/ui';
import YearPicker from '@/components/ui/year-picker';
import { useDisclosure } from '@/hooks/shared';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { CalendarIcon } from '@radix-ui/react-icons';
import { format } from 'date-fns';
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
   name: z.string().nonempty('Please enter classroom name'),
   academicYear: z
      .date({
         required_error: "Please enter classroom's academic year",
      })
      .default(() => new Date()),
});

type TFormValues = z.infer<typeof schema>;

export const AddUpdateClassroomDialog = ({
   children,
   description = 'Create a new classroom',
   title = 'Create classroom',
   type = 'ADD',
   onSubmit,
   defaultValues,
   isLoading,
}: Props) => {
   const form = useForm<TFormValues>({
      resolver: zodResolver(schema),
      defaultValues: {
         academicYear: defaultValues?.academicYear
            ? defaultValues?.academicYear
            : new Date(),
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

   const academicYear = form.watch('academicYear');

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
                              <FormLabel required>Classroom name</FormLabel>
                              <FormControl>
                                 <Input
                                    {...field}
                                    error={fieldState.error?.message}
                                    placeholder="Enter classroom name"
                                 />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        );
                     }}
                  />
                  <FormField
                     control={control}
                     name="academicYear"
                     render={({ field }) => (
                        <FormItem className="flex flex-col">
                           <FormLabel required>Academic year</FormLabel>
                           <Popover>
                              <PopoverTrigger asChild>
                                 <FormControl>
                                    <Button
                                       variant="outline"
                                       className={cn(
                                          'w-[240px] pl-3 text-left font-normal',
                                          !field.value &&
                                             'text-muted-foreground'
                                       )}
                                    >
                                       {field.value ? (
                                          format(field.value, 'yyyy')
                                       ) : (
                                          <span>Pick a year</span>
                                       )}
                                       <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                 </FormControl>
                              </PopoverTrigger>
                              <PopoverContent
                                 className="w-auto p-0"
                                 align="start"
                              >
                                 <YearPicker
                                    onChange={field.onChange}
                                    value={field.value}
                                 />
                              </PopoverContent>
                           </Popover>
                           <FormMessage />
                        </FormItem>
                     )}
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
                  {type === 'ADD' ? 'Create classroom' : 'Save changes'}
               </Button>
            </DialogFooter>
         </DialogContent>
      </Dialog>
   );
};

export default AddUpdateClassroomDialog;
