import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { z } from "zod";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "components/ui/form";
import { Input } from "components/ui/input";
// import { useSelector, useDispatch } from 'store';
import FormSubmitButton from "components/FormSubmitButton";
import { loginUser } from "slices/auth";
import { useDispatch, useSelector } from "store";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export default function AdminLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  let { isLoggingIn, error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: any) {
    const { email, password } = values;
    const data = { email, password };
    dispatch(loginUser(data));
  }

  return (
    <div className="flex h-screen items-center justify-center">
      <Card className="mx-auto w-full max-w-96">
        <CardHeader>
          <CardTitle>Log in</CardTitle>
        </CardHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <CardContent className="space-y-4">
              {/* {error && (
                <FormItem>
                  <FormLabel></FormLabel>
                  <FormControl>
                    <FormMessage type="error">{error}</FormMessage>
                  </FormControl>
                </FormItem>
              )} */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormDescription>
                <Link to="/forgot-password">Forgot password?</Link>
              </FormDescription>
            </CardContent>
            <CardFooter className="flex justify-between">
              <FormSubmitButton isPending={isLoggingIn} label="Log in" />
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
