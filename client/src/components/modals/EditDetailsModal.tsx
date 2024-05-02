import { Button } from "components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "components/ui/form";
import { Label } from "components/ui/label";
import { RadioGroup, RadioGroupItem } from "components/ui/radio-group";
import { Textarea } from "components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useModal } from "hooks/useModal";
import useUpdateRequest from "hooks/useUpdateRequest";
import { useForm } from "react-hook-form";
import { useSelector } from "store";
import { z } from "zod";
import { ScrollArea } from "../ui/scroll-area";

const FormDataSchema = z.object({
  delicate_items_question_answer: z.string(),
  bulky_items_question_answer: z.string(),
  disassemble_items_question_answer: z.string(),
  comments: z.string(),
});

type Inputs = z.infer<typeof FormDataSchema>;

export function EditDetailsModal() {
  const { request } = useSelector((state) => state.request);
  const { isModalOpen, closeModal, getModalData } = useModal();
  const { isSaving, updateRequestHandler } = useUpdateRequest();

  const { details } = getModalData("editDetails");

  const form = useForm<Inputs>({
    resolver: zodResolver(FormDataSchema),
    reValidateMode: "onChange",
    defaultValues: {
      delicate_items_question_answer: details?.delicate_items_question_answer,
      bulky_items_question_answer: details?.bulky_items_question_answer,
      disassemble_items_question_answer:
        details?.disassemble_items_question_answer,
      comments: details?.comments,
    },
  });

  async function onSubmit(newData: Inputs) {
    updateRequestHandler({ details: newData }, handleClose);
  }

  const handleClose = () => {
    form.reset();
    closeModal("editDetails");
  };

  return (
    <Dialog open={isModalOpen("editDetails")} onOpenChange={handleClose}>
      <DialogContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="flex h-full flex-col overflow-hidden p-0 sm:h-[80vh]"
      >
        <DialogHeader className="p-6 pb-0">
          <DialogTitle>Update details</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-1 flex-col justify-between overflow-hidden"
          >
            <ScrollArea className="h-full w-full px-2 pb-4 sm:px-4">
              <div className="grid gap-4 p-2">
                <p className="font-semibold">Additional questions</p>
                {/* Q1 */}
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <p className="text-sm text-muted-foreground">
                    Do you have items that easily break and need extra love
                    (lamps, mirrors, electronics, artwork)?
                  </p>
                  <FormField
                    control={form.control}
                    name="delicate_items_question_answer"
                    render={({ field }) => (
                      <RadioGroup
                        defaultValue={form.getValues(
                          "delicate_items_question_answer",
                        )}
                        onValueChange={(val) => {
                          field.onChange(val);
                        }}
                        className="flex justify-start gap-4 lg:justify-end"
                        disabled={!request?.can_edit_request}
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="yes" id="q11" />
                          <Label htmlFor="q11">Yes</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="no" id="q12" />
                          <Label htmlFor="q12">No</Label>
                        </div>
                      </RadioGroup>
                    )}
                  />
                </div>
                {/* Q2 */}
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <p className="text-sm text-muted-foreground">
                    Do you have bulky items that require added handling? (e.g
                    armoires, ellipticals, treadmills, appliances)
                  </p>
                  <FormField
                    control={form.control}
                    name="bulky_items_question_answer"
                    render={({ field }) => (
                      <RadioGroup
                        defaultValue={form.getValues(
                          "bulky_items_question_answer",
                        )}
                        onValueChange={(val) => {
                          field.onChange(val);
                        }}
                        className="flex justify-start gap-4 lg:justify-end"
                        disabled={!request?.can_edit_request}
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="yes" id="q21" />
                          <Label htmlFor="q21">Yes</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="no" id="q22" />
                          <Label htmlFor="q22">No</Label>
                        </div>
                      </RadioGroup>
                    )}
                  />
                </div>
                {/* Q3 */}
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <p className="text-sm text-muted-foreground">
                    Do you have items that we&apos;ll need to disassemble for
                    you?
                  </p>
                  <FormField
                    control={form.control}
                    name="disassemble_items_question_answer"
                    render={({ field }) => (
                      <RadioGroup
                        defaultValue={form.getValues(
                          "disassemble_items_question_answer",
                        )}
                        onValueChange={(val) => {
                          field.onChange(val);
                        }}
                        className="flex justify-start gap-4 lg:justify-end"
                        disabled={!request?.can_edit_request}
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="yes" id="q31" />
                          <Label htmlFor="q31">Yes</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="no" id="q32" />
                          <Label htmlFor="q32">No</Label>
                        </div>
                      </RadioGroup>
                    )}
                  />
                </div>
                {/* Add info */}
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="comments"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Additional details</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            rows={8}
                            placeholder="Enter your comments..."
                            className="col-span-3"
                            disabled={!request?.can_edit_request}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </ScrollArea>
            <DialogFooter className="flex justify-end bg-slate-100 p-6">
              <Button disabled={isSaving}>Save changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}