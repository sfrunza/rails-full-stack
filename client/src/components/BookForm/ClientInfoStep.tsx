import { UseFormReturn } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Input } from "../ui/input";
import { type Inputs } from "./BookForm";

export default function ClientInfoStep({
  form,
}: {
  form: UseFormReturn<Inputs>;
}) {
  return (
    <div className="grid grid-cols-6 gap-4">
      <div className="col-span-3">
        <FormField
          control={form.control}
          name="customer.firstName"
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
      <div className="col-span-3">
        <FormField
          control={form.control}
          name="customer.lastName"
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
          name="customer.email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="email"
                  placeholder="m@example.com"
                  title="Please enter your email address"
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
      <div className="col-span-6">
        <FormField
          control={form.control}
          name="customer.phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="tel"
                  placeholder="(555) 555-5555"
                  pattern="\(\d{3}\) \d{3}-\d{4}"
                  title="Please enter a phone number in the format (555) 555-5555"
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
      {/* <div className="col-span-6">
        <FormField
          control={form.control}
          name="additionalInfo"
          render={({ field }) => (
            <FormItem>
              <div className="flex justify-between items-center">
                <FormLabel>Additional Comments/Requests</FormLabel>
                <span className="text-muted-foreground text-sm">Optional</span>
              </div>
              <FormControl>
                <Textarea
                  {...field}
                  rows={5}
                  placeholder="Please include information on heavy, oversized or fragile items, narrow stairways or halls, long walk ways, extra stops, or anything else that may affect the moving time."
                  title="Please enter Additional Comments/Requests"
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div> */}
    </div>
  );
}
