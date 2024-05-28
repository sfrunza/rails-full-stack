import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useModal } from "@/hooks/useModal";
import { centsToDollars } from "@/lib/utils";
import { setRequest } from "@/slices/request";
import { useDispatch } from "@/store";
import { DollarSignIcon } from "lucide-react";
import { Input } from "../ui/input";

const FormDataSchema = z.object({
  deposit: z.number(),
});
type Inputs = z.infer<typeof FormDataSchema>;

export const EditDepositModal = () => {
  const { isModalOpen, closeModal, getModalData } = useModal();
  const dispatch = useDispatch();

  const { deposit } = getModalData("editDeposit");

  const form = useForm<Inputs>({
    resolver: zodResolver(FormDataSchema),
    reValidateMode: "onChange",
    defaultValues: {
      deposit,
    },
  });

  async function onSubmit(newData: Inputs) {
    // updateRequestHandler(newData, handleClose);
    dispatch(setRequest({ deposit: newData.deposit }));
    handleClose();
  }

  const handleClose = () => {
    form.reset();
    closeModal("editDeposit");
  };

  return (
    <Dialog open={isModalOpen("editDeposit")} onOpenChange={handleClose}>
      <DialogContent className="flex h-full flex-col overflow-hidden p-0 sm:h-auto">
        <DialogHeader className="p-6">
          <DialogTitle>Reservation price</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-1 flex-col justify-between overflow-hidden"
          >
            <div className="px-6 pb-10">
              <FormField
                control={form.control}
                name="deposit"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="ml-8">Reservation price</FormLabel>
                    <div className="flex items-center gap-2">
                      <DollarSignIcon className="ml-auto size-5 text-muted-foreground" />
                      <FormControl>
                        <Input
                          {...field}
                          pattern="[0-9]+"
                          value={centsToDollars(form.watch("deposit")) || ""}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (/^\d*$/.test(value)) {
                              field.onChange(
                                Math.round(parseFloat(value) * 100),
                              );
                            }
                          }}
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="flex justify-end bg-muted p-6">
              <Button disabled={!form.formState.isDirty}>Save changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
