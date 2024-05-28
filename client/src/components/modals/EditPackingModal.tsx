import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormField } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useModal } from "@/hooks/useModal";
import useUpdateRequest from "@/hooks/useUpdateRequest";
import { cn } from "@/lib/utils";
import { useSelector } from "@/store";
import { useEffect, useRef } from "react";
import { LoaderCircleIcon } from "lucide-react";

const FormDataSchema = z.object({
  packing_id: z.string(),
});

type Inputs = z.infer<typeof FormDataSchema>;

export function EditPackingModal() {
  const { packings } = useSelector((state) => state.globalSettings);
  const { isModalOpen, closeModal, getModalData } = useModal();
  const { isSaving, updateRequestHandler } = useUpdateRequest();

  const { packing_id } = getModalData("editPacking");

  const form = useForm<Inputs>({
    resolver: zodResolver(FormDataSchema),
    reValidateMode: "onChange",
    defaultValues: {
      packing_id: packing_id.toString() || "",
    },
  });

  const selectedRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isModalOpen("editPacking") && selectedRef.current) {
      selectedRef.current.scrollIntoView({
        block: "end",
        inline: "nearest",
      });
    }
  }, []);

  async function onSubmit(newData: Inputs) {
    updateRequestHandler(newData, handleClose);
  }
  const handleClose = () => {
    form.reset();
    closeModal("editPacking");
  };

  return (
    <Dialog open={isModalOpen("editPacking")} onOpenChange={handleClose}>
      <DialogTrigger asChild>
        <Button>Edit packing</Button>
      </DialogTrigger>
      <DialogContent className="flex h-full flex-col overflow-hidden p-0 sm:h-[90vh]">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle>Select packing</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            className="flex flex-1 flex-col justify-between overflow-hidden"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <ScrollArea className="h-full w-full px-2 sm:px-4">
              <FormField
                control={form.control}
                name="packing_id"
                render={({ field }) => (
                  <RadioGroup
                    defaultValue={form.getValues("packing_id")}
                    onValueChange={(val) => {
                      field.onChange(val);
                    }}
                    className="gap-4 p-2"
                  >
                    {packings.map((packing) => (
                      <div
                        key={packing.id}
                        className={cn(
                          Number(form.getValues("packing_id")) === packing.id &&
                            "border-primary bg-primary/5 ring-2 ring-primary",
                          "relative flex cursor-pointer flex-row-reverse gap-4 rounded-lg border-input p-4 shadow-button focus:outline-none",
                        )}
                        ref={
                          Number(form.getValues("packing_id")) === packing.id
                            ? selectedRef
                            : null
                        }
                      >
                        <RadioGroupItem
                          value={packing.id.toString()}
                          id={packing.id.toString()}
                          className="absolute"
                        />
                        <Label
                          htmlFor={packing.id.toString()}
                          className="w-full hover:cursor-pointer"
                        >
                          <div className="space-y-2">
                            <p
                              className={cn(
                                "text-base font-semibold",
                                Number(form.getValues("packing_id")) ===
                                  packing.id && "text-primary",
                              )}
                            >
                              {packing.name}
                            </p>
                            <div
                              dangerouslySetInnerHTML={{
                                __html: packing.description,
                              }}
                            />
                          </div>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}
              />
            </ScrollArea>
            <DialogFooter className="flex justify-end bg-muted p-6">
              <Button disabled={isSaving || !form.formState.isDirty}>
                {isSaving && (
                  <LoaderCircleIcon className="mr-2 h-4 w-4 animate-spin" />
                )}
                Save changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
