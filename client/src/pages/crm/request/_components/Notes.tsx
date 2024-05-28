import { useEffect } from "react";
import { z } from "zod";
import { LoaderCircleIcon } from "lucide-react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import useUpdateRequest from "@/hooks/useUpdateRequest";
import { useSelector } from "@/store";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  sales_notes: z.string().nullable(),
  driver_notes: z.string().nullable(),
  customer_notes: z.string().nullable(),
  dispatch_notes: z.string().nullable(),
});

export default function Notes() {
  const { isSaving, updateRequestHandler } = useUpdateRequest();

  const { request } = useSelector((state) => state.request);
  const { sales_notes, driver_notes, customer_notes, dispatch_notes } =
    request!;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sales_notes: sales_notes || "",
      driver_notes: driver_notes || "",
      customer_notes: customer_notes || "",
      dispatch_notes: dispatch_notes || "",
    },
  });

  useEffect(() => {
    form.reset({
      sales_notes: sales_notes || "",
      driver_notes: driver_notes || "",
      customer_notes: customer_notes || "",
      dispatch_notes: dispatch_notes || "",
    });
  }, [sales_notes, driver_notes, customer_notes, dispatch_notes]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { sales_notes, driver_notes, customer_notes, dispatch_notes } =
      values;
    updateRequestHandler({
      sales_notes,
      driver_notes,
      customer_notes,
      dispatch_notes,
    });
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <div className="space-y-4">
        <Tabs defaultValue="sales_notes">
          <ScrollArea className="w-full whitespace-nowrap">
            <TabsList className="justify-start gap-1">
              <TabsTrigger value="sales_notes">
                <div className="relative px-1">
                  Sales notes{" "}
                  {form.watch("sales_notes") && (
                    <span className="absolute right-0 top-0 size-1.5 rounded-full bg-green-600" />
                  )}
                </div>
              </TabsTrigger>
              <TabsTrigger value="driver_notes">
                <div className="relative px-1">
                  Driver notes{" "}
                  {form.watch("driver_notes") && (
                    <span className="absolute right-0 top-0 size-1.5 rounded-full bg-green-600" />
                  )}
                </div>
              </TabsTrigger>
              <TabsTrigger value="customer_notes">
                <div className="relative px-1">
                  Customer notes{" "}
                  {form.watch("customer_notes") && (
                    <span className="absolute right-0 top-0 size-1.5 rounded-full bg-green-600" />
                  )}
                </div>
              </TabsTrigger>
              <TabsTrigger value="dispatch_notes">
                <div className="relative px-1">
                  Dispatch notes{" "}
                  {form.watch("dispatch_notes") && (
                    <span className="absolute right-0 top-0 size-1.5 rounded-full bg-green-600" />
                  )}
                </div>
              </TabsTrigger>
            </TabsList>
            <ScrollBar orientation="horizontal" className="mt-2" />
          </ScrollArea>
          <TabsContent value="sales_notes">
            <Textarea rows={7} {...form.register("sales_notes")} />
          </TabsContent>
          <TabsContent value="driver_notes">
            <Textarea rows={7} {...form.register("driver_notes")} />
          </TabsContent>
          <TabsContent value="customer_notes">
            <Textarea rows={7} {...form.register("customer_notes")} />
          </TabsContent>
          <TabsContent value="dispatch_notes">
            <Textarea rows={7} {...form.register("dispatch_notes")} />
          </TabsContent>
        </Tabs>
        <div className="flex justify-end">
          <Button disabled={isSaving || !form.formState.isDirty} type="submit">
            {isSaving && (
              <LoaderCircleIcon className="mr-2 h-4 w-4 animate-spin" />
            )}
            Save notes
          </Button>
        </div>
      </div>
    </form>
  );
}
