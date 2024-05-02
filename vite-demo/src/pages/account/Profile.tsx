import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { formatPhone } from '@/lib/utils';
import { ChevronLeftIcon } from 'lucide-react';
// import { useSession } from "next-auth/react";
// import Link from "next/link";
import FormSubmitButton from '@/components/FormSubmitButton';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { updateUser } from '@/slices/auth';
import { useDispatch, useSelector } from '@/store';
import { z } from 'zod';
import { useEffect } from 'react';

export const FormDataSchema = z.object({
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  email: z.string().min(1, 'required').email('Invalid email address'),
  phone: z.string().min(14).max(14),
  add_phone: z.string().min(14).max(14).optional().or(z.literal('')),
});

export type Inputs = z.infer<typeof FormDataSchema>;

export default function Profile() {
  const { user, isUpdating } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const form = useForm<Inputs>({
    resolver: zodResolver(FormDataSchema),
    mode: 'onTouched',
    reValidateMode: 'onChange',
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      add_phone: '',
    },
  });

  useEffect(() => {
    form.reset({
      first_name: user?.first_name,
      last_name: user?.last_name,
      email: user?.email,
      phone: user?.phone,
      add_phone: user?.add_phone || '',
    });
  }, [user]);

  async function _onSubmit(newProfileData: any) {
    if (!user) return;
    dispatch(updateUser(user.id, newProfileData)).then((result) => {
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success(result.success!);
    });
  }

  return (
    <Card>
      <CardHeader className="relative flex flex-row items-center justify-center space-y-0 lg:justify-start">
        <Button
          asChild
          variant="link"
          size="sm"
          className="absolute left-0 lg:hidden"
        >
          <Link to="/account">
            <ChevronLeftIcon className="mr-1 h-5 w-5" />
            Account
          </Link>
        </Button>
        <CardTitle className="text-center lg:text-left">My Profile</CardTitle>
      </CardHeader>
      <Form {...form}>
        <form autoComplete="off" onSubmit={form.handleSubmit(_onSubmit)}>
          <CardContent>
            {/* {!user && <p>Loading...</p>} */}
            <div className="grid grid-cols-6 gap-4">
              <div className="col-span-6 sm:col-span-3">
                <FormField
                  control={form.control}
                  name="first_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="First Name"
                          title="Please enter your First Name"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-span-6 sm:col-span-3">
                <FormField
                  control={form.control}
                  name="last_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Last Name"
                          title="Please enter your Last Name"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-span-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="m@example.com"
                          title="Please enter your Email"
                          autoComplete="on"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-span-6 sm:col-span-3">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Primary Phone</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          inputMode="numeric"
                          value={formatPhone(field.value)}
                          autoComplete="on"
                          placeholder="(xxx) xxx-xxxx"
                          title="Please enter your Primary Phone Number"
                          onChange={(e) => {
                            const input = e.target.value;
                            field.onChange(formatPhone(input));
                          }}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-span-6 sm:col-span-3">
                <FormField
                  control={form.control}
                  name="add_phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Secondary Phone</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          inputMode="numeric"
                          placeholder="(xxx) xxx-xxxx"
                          title="Please enter your Secondary Phone Number"
                          onChange={(e) => {
                            const input = e.target.value;
                            field.onChange(formatPhone(input));
                          }}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <FormSubmitButton
              isPending={isUpdating}
              label="Save changes"
              clasName="lg:w-[10rem]"
            />
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
