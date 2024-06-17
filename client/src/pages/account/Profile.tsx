import FormSubmitButton from "@/components/FormSubmitButton";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { formatPhone } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeftIcon } from "lucide-react";
// import { useDispatch, useSelector } from "@/store";
import useAuth from "@/hooks/useAuth";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { z } from "zod";

export const formSchema = z.object({
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  email: z.string().min(1, "required").email("Invalid email address"),
  // add_email: z.string().min(1).optional().or(z.literal("")),
  phone: z.string().min(14).max(14),
  add_phone: z.string().min(14).max(14).optional().or(z.literal("")),
});

export type Inputs = z.infer<typeof formSchema>;

export default function Profile() {
  // const { user, isUpdating } = useSelector((state) => state.auth);
  // const dispatch = useDispatch();

  const { user, isLoading, update } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      first_name: user?.first_name,
      last_name: user?.last_name,
      email: user?.email,
      // add_email: user?.add_email,
      phone: user?.phone,
      add_phone: user?.add_phone,
    },
  });

  useEffect(() => {
    form.reset({
      first_name: user?.first_name,
      last_name: user?.last_name,
      email: user?.email,
      // add_email: user?.add_email,
      phone: user?.phone,
      add_phone: user?.add_phone,
    });
  }, [user]);

  async function _onSubmit(formData: z.infer<typeof formSchema>) {
    if (!user) return;
    update(user.id, formData);
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
            <div className="grid grid-cols-6 gap-4">
              <div className="col-span-6 sm:col-span-3">
                <FormField
                  control={form.control}
                  name="first_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          title="Please enter your First Name"
                          autoComplete="given-name"
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
                      <FormLabel>Last name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          title="Please enter your Last Name"
                          autoComplete="family-name"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-span-6 sm:col-span-3">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          title="Please enter your Email"
                          autoComplete="on"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              {/* <div className="col-span-6 sm:col-span-3">
                <FormField
                  control={form.control}
                  name="add_email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional email</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          title="Please enter Additional email"
                          autoComplete="off"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div> */}
              <div className="col-span-6 sm:col-span-3">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          inputMode="numeric"
                          value={formatPhone(field.value)}
                          title="Please enter your Phone"
                          onChange={(e) => {
                            const input = e.target.value;
                            field.onChange(formatPhone(input));
                          }}
                          autoComplete="tel"
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
                      <FormLabel>Additional phone</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          inputMode="numeric"
                          value={formatPhone(field.value ?? "")}
                          title="Please enter Additional phone"
                          onChange={(e) => {
                            const input = e.target.value;
                            field.onChange(formatPhone(input));
                          }}
                          autoComplete="tel"
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
              disabled={isLoading || !form.formState.isDirty}
              isPending={isLoading}
              label="Save changes"
            />
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
