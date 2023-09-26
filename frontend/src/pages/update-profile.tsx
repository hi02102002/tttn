import {
   SectionBody,
   SectionInfo,
   SectionInfoDescription,
   SectionInfoFooter,
   SectionInfoTitle,
} from '@/components/pages/update-profile';
import {
   Avatar,
   AvatarFallback,
   AvatarImage,
   Button,
   Form,
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
   Input,
} from '@/components/ui';
import { useUser } from '@/contexts/user.ctx';
import { useChangePassword, useUpdateProfile } from '@/hooks/api';
import Layout from '@/layouts/student';
import { RoleName } from '@/types/role';
import { NextPageWithLayout } from '@/types/shared';
import { withUser } from '@/utils/withUser';
import { zodResolver } from '@hookform/resolvers/zod';
import { GetServerSideProps } from 'next';
import React from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const addressSchema = z.object({
   address: z.string({
      required_error: 'Address is required',
   }),
});

const passwordSchema = z
   .object({
      oldPassword: z
         .string({
            required_error: 'Old password is required',
         })
         .nonempty({
            message: 'Old password is required',
         }),
      newPassword: z
         .string({
            required_error: 'New password is required',
         })
         .nonempty({
            message: 'New password is required',
         })
         .min(8, {
            message: 'Password must be at least 8 characters',
         }),
      confirmPassword: z
         .string({
            required_error: 'Confirm new password is required',
         })
         .nonempty({
            message: 'Confirm new password is required',
         }),
   })
   .refine((data) => data.newPassword === data.confirmPassword, {
      message: 'Confirm password must match with new password',
      path: ['confirmPassword'],
   });

type AddressFormValues = z.infer<typeof addressSchema>;

type PasswordFormValues = z.infer<typeof passwordSchema>;

const UpdateProfile: NextPageWithLayout = () => {
   const { user } = useUser();

   const addressForm = useForm<AddressFormValues>({
      resolver: zodResolver(addressSchema),
      defaultValues: {
         address: user?.student?.address || '',
      },
   });

   const passwordForm = useForm<PasswordFormValues>({
      resolver: zodResolver(passwordSchema),
      defaultValues: {
         oldPassword: '',
         newPassword: '',
         confirmPassword: '',
      },
   });

   const { mutateAsync: changePassword, isLoading: isChangePasswordLoading } =
      useChangePassword();
   const { mutateAsync: updateProfile, isLoading: isUpdateProfileLoading } =
      useUpdateProfile();

   const handleChangePassword = async (values: PasswordFormValues) => {
      await changePassword(values);
      passwordForm.reset({
         oldPassword: '',
         newPassword: '',
         confirmPassword: '',
      });
   };

   const handleUpdateProfile = async (values: AddressFormValues) => {
      await updateProfile(values);
   };

   return (
      <div className="space-y-4">
         <div>
            <h2 className="text-2xl font-semibold ">Update Profile</h2>
            <p className="text-muted-foreground">
               Your information will be displayed here. You can edit your
               profile here.
            </p>
         </div>
         <div className="space-y-4">
            <SectionInfo>
               <SectionBody>
                  <div className="space-y-4">
                     <div>
                        <SectionInfoTitle title="MSSV" />
                        <p>This is your MSSV. You can&apos;t change it.</p>
                     </div>

                     <Input
                        placeholder="MSSV"
                        className="max-w-sm"
                        defaultValue={user?.student?.mssv}
                        disabled
                     />
                  </div>
               </SectionBody>
               <SectionInfoFooter>
                  <SectionInfoDescription description="This is your MSSV. You can use it to login to the system." />
               </SectionInfoFooter>
            </SectionInfo>
            <SectionInfo>
               <SectionBody>
                  <div className="space-y-4">
                     <div>
                        <SectionInfoTitle title="Name" />
                        <p>This is your name. You can&apos;t change it.</p>
                     </div>

                     <Input
                        placeholder="Name"
                        className="max-w-sm"
                        defaultValue={user?.student?.name}
                        disabled
                     />
                  </div>
               </SectionBody>
               <SectionInfoFooter>
                  <SectionInfoDescription
                     description="
                        This is your username. Once you have created your account, you can't change it."
                  />
               </SectionInfoFooter>
            </SectionInfo>
            <SectionInfo>
               <SectionBody>
                  <div className="flex items-start justify-between gap-4">
                     <div>
                        <SectionInfoTitle title="Avatar" />
                        <p>
                           This is your avatar.
                           <br />
                           Click on the avatar to upload a custom one from your
                           files.
                        </p>
                     </div>
                     <Avatar className="h-24 w-24 cursor-pointer">
                        <AvatarImage
                           src={user?.avatar?.url}
                           alt={user?.username}
                           draggable={false}
                        />
                        <AvatarFallback>
                           {user?.username?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                     </Avatar>
                  </div>
               </SectionBody>
               <SectionInfoFooter>
                  <SectionInfoDescription description="An avatar is optional but strongly recommended." />
               </SectionInfoFooter>
            </SectionInfo>

            <SectionInfo>
               <SectionBody>
                  <div className="space-y-4">
                     <div>
                        <SectionInfoTitle title="Address" />
                        <p>Please enter the your address.</p>
                     </div>
                     <Form {...addressForm}>
                        <form
                           id="address-form"
                           className="space-y-3"
                           onSubmit={addressForm.handleSubmit(
                              handleUpdateProfile
                           )}
                        >
                           <FormField
                              control={addressForm.control}
                              name="address"
                              render={({ field, fieldState }) => {
                                 return (
                                    <FormItem>
                                       <FormLabel required>Address</FormLabel>
                                       <FormControl>
                                          <Input
                                             {...field}
                                             error={fieldState.error?.message}
                                             placeholder="Address"
                                             className="max-w-sm"
                                          />
                                       </FormControl>
                                       <FormMessage />
                                    </FormItem>
                                 );
                              }}
                           />
                        </form>
                     </Form>
                  </div>
               </SectionBody>
               <SectionInfoFooter>
                  <Button form="address-form" type="submit" className="ml-auto">
                     Save
                  </Button>
               </SectionInfoFooter>
            </SectionInfo>
            <SectionInfo>
               <SectionBody>
                  <div className="space-y-4">
                     <div>
                        <SectionInfoTitle title="Change password" />
                        <p>
                           Please enter your old password and your new password
                           to change your password.
                        </p>
                     </div>
                     <Form {...passwordForm}>
                        <form
                           id="password-form"
                           className="space-y-3"
                           onSubmit={passwordForm.handleSubmit(
                              handleChangePassword
                           )}
                        >
                           <FormField
                              control={passwordForm.control}
                              name="oldPassword"
                              render={({ field, fieldState }) => {
                                 return (
                                    <FormItem>
                                       <FormLabel required>
                                          Old password
                                       </FormLabel>
                                       <FormControl>
                                          <Input
                                             {...field}
                                             error={fieldState.error?.message}
                                             placeholder="Old password"
                                             className="max-w-sm"
                                             type="password"
                                          />
                                       </FormControl>
                                       <FormMessage />
                                    </FormItem>
                                 );
                              }}
                           />
                           <FormField
                              control={passwordForm.control}
                              name="newPassword"
                              render={({ field, fieldState }) => {
                                 return (
                                    <FormItem>
                                       <FormLabel required>
                                          New password
                                       </FormLabel>
                                       <FormControl>
                                          <Input
                                             {...field}
                                             error={fieldState.error?.message}
                                             placeholder="New password"
                                             className="max-w-sm"
                                             type="password"
                                          />
                                       </FormControl>
                                       <FormMessage />
                                    </FormItem>
                                 );
                              }}
                           />
                           <FormField
                              control={passwordForm.control}
                              name="confirmPassword"
                              render={({ field, fieldState }) => {
                                 return (
                                    <FormItem>
                                       <FormLabel required>
                                          Confirm password
                                       </FormLabel>
                                       <FormControl>
                                          <Input
                                             {...field}
                                             error={fieldState.error?.message}
                                             placeholder="Confirm password"
                                             className="max-w-sm"
                                             type="password"
                                          />
                                       </FormControl>
                                       <FormMessage />
                                    </FormItem>
                                 );
                              }}
                           />
                        </form>
                     </Form>
                  </div>
               </SectionBody>
               <SectionInfoFooter>
                  <Button
                     form="password-form"
                     type="submit"
                     className="ml-auto"
                     loading={isChangePasswordLoading}
                  >
                     Change
                  </Button>
               </SectionInfoFooter>
            </SectionInfo>
         </div>
      </div>
   );
};

UpdateProfile.getLayout = (page) => {
   return <Layout>{page}</Layout>;
};

export const getServerSideProps: GetServerSideProps = withUser({
   isProtected: true,
   roles: [RoleName.STUDENT],
})();

export default UpdateProfile;
