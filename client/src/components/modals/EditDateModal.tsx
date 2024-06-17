import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { CalendarWithRates } from "@/components/CalendarWithRates";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form, FormField } from "@/components/ui/form";
import { useModal } from "@/hooks/useModal";
import useUpdateRequest from "@/hooks/useUpdateRequest";
import FormSubmitButton from "../FormSubmitButton";

const FormDataSchema = z.record(z.date().nullable());

type Inputs = z.infer<typeof FormDataSchema>;

export const EditDateModal = () => {
  const { isModalOpen, closeModal, getModalData } = useModal();
  const { isSaving, updateRequestHandler } = useUpdateRequest();

  const { date } = getModalData("editDate");

  if (!date) return null;

  const form = useForm<Inputs>({
    resolver: zodResolver(FormDataSchema),
    reValidateMode: "onSubmit",
    defaultValues: {
      [date.field]: new Date(date[date.field]),
    },
  });

  async function onSubmit(newData: Inputs) {
    updateRequestHandler(newData, handleClose);
  }

  const handleClose = () => {
    form.reset();
    closeModal("editDate");
  };

  return (
    <Dialog open={isModalOpen("editDate")} onOpenChange={handleClose}>
      <DialogContent className="h-full overflow-hidden p-0 sm:h-auto">
        <DialogHeader className="p-6">
          <DialogTitle>Select date</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col justify-between"
          >
            <div>
              <FormField
                control={form.control}
                name={date.field}
                render={({ field }) => {
                  return (
                    <div className="flex flex-col items-center justify-center pb-10">
                      <CalendarWithRates
                        mode="single"
                        selected={field.value || undefined}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </div>
                  );
                }}
              />
            </div>
            <DialogFooter className="flex justify-end bg-muted p-6">
              <FormSubmitButton
                disabled={isSaving || !form.formState.isDirty}
                isPending={isSaving}
                label="Save changes"
              />
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
