import { updateRequest } from "@/actions/requests";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatPhone } from "@/lib/utils";
import { setOriginalRequest, setRequest } from "@/slices/request";
import { useDispatch, useSelector } from "@/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

export const FormDataSchema = z.object({
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  email: z.string().min(1, "required").email("Invalid email address"),
  phone: z.string().min(14).max(14),
  add_phone: z.string().min(14).max(14).optional().or(z.literal("")),
});

export type Inputs = z.infer<typeof FormDataSchema>;

export default function CustomerTab() {
  const { request } = useSelector((state) => state.request);
  const dispatch = useDispatch();
  const [newPassword, setNewPassword] = useState("");

  const { customer } = request!;

  const form = useForm<Inputs>({
    resolver: zodResolver(FormDataSchema),
    mode: "onTouched",
    reValidateMode: "onChange",
    defaultValues: {
      first_name: customer?.first_name || "test",
      last_name: customer?.last_name || "test",
      email: customer?.email || "test@mail.com",
      phone: customer?.phone || "2342342344",
      add_phone: customer?.add_phone || "",
    },
  });

  async function _onSubmit(newProfileData: any) {
    if (!customer?.id) {
      handleCreate(newProfileData);
    } else {
      handleEdit(newProfileData);
    }
  }

  async function handleCreate(newProfileData: any) {
    if (!request) return null;
    try {
      let response = await fetch("/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.token,
        },
        body: JSON.stringify({
          user: { ...newProfileData, password: newPassword },
        }),
      });
      const data = await response.json();
      if (data.error) {
        toast.error(JSON.stringify(data.error));
      } else {
        toast.success("Customer saved");
        updateRequest(request?.id, { customer_id: data.user.id });
        dispatch(setRequest({ customer: data.user }));
        dispatch(setOriginalRequest({ ...request, customer: data.user }));
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  }

  async function handleEdit(newProfileData: any) {
    if (!customer?.id) return null;
    try {
      let response = await fetch(`/api/v1/users/${customer.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.token,
        },
        body: JSON.stringify(newProfileData),
      });
      const data = await response.json();
      if (data.error) {
        toast.error(data.error);
      } else {
        toast.success("Changes saved");
        dispatch(setRequest({ customer: data }));
        dispatch(setOriginalRequest({ ...request, customer: data }));
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  }

  async function updatePassword(newPassword: string) {
    if (!customer?.id) return null;
    try {
      let response = await fetch(
        `/api/v1/users/${customer.id}/update_password`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.token,
          },
          body: JSON.stringify({ password: newPassword }),
        },
      );
      const data = await response.json();
      if (data.error) {
        toast.error(data.error);
      } else {
        toast.success("Password saved");
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      }
    }
  }

  return (
    <>
      <div className="p-4 md:p-6">
        <Form {...form}>
          <form autoComplete="off" onSubmit={form.handleSubmit(_onSubmit)}>
            <div className="grid grid-cols-6 gap-4">
              <div className="col-span-6 sm:col-span-3">
                <FormField
                  control={form.control}
                  name="first_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
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
                        <Input {...field} />
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
            <div className="flex justify-end gap-4 pt-6">
              <Button
                type="button"
                onClick={() => {
                  form.reset();
                }}
                variant="outline"
              >
                Cancel
              </Button>
              <Button type="submit">Save changes</Button>
            </div>
          </form>
        </Form>
      </div>
      <div className="mt-10 grid grid-cols-6 items-end gap-4 border-b border-t bg-muted p-4 md:p-6">
        <div className="col-span-6 space-y-2 sm:col-span-3">
          <Label htmlFor="password">Password</Label>
          <Input
            className="bg-background"
            name="password"
            id="password"
            type="password"
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
        <div className="col-span-6 flex justify-end space-y-2 sm:col-span-3">
          <Button type="button" onClick={() => updatePassword(newPassword)}>
            Save new password
          </Button>
        </div>
      </div>
    </>
  );
}
