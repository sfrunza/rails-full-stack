import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import useUpdateRequest from "@/hooks/useUpdateRequest";
import { useSelector } from "@/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircleIcon } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const FormDataSchema = z.object({
  delicate_items_question_answer: z.string(),
  bulky_items_question_answer: z.string(),
  disassemble_items_question_answer: z.string(),
  comments: z.string(),
});

type Inputs = z.infer<typeof FormDataSchema>;

export default function DetailsTab() {
  const { request } = useSelector((state) => state.request);
  const { isSaving, updateRequestHandler } = useUpdateRequest();

  const { details } = request!;

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

  useEffect(() => {
    form.reset({
      delicate_items_question_answer: details?.delicate_items_question_answer,
      bulky_items_question_answer: details?.bulky_items_question_answer,
      disassemble_items_question_answer:
        details?.disassemble_items_question_answer,
      comments: details?.comments,
    });
  }, [details]);

  async function onSubmit(newData: Inputs) {
    updateRequestHandler({ details: newData }, () => {});
  }

  return (
    <div className="p-4 md:p-6">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-1 flex-col justify-between overflow-hidden"
        >
          <div className="grid gap-4 p-1">
            <p className="font-semibold">Additional questions</p>
            {/* Q1 */}
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <p className="text-sm text-muted-foreground">
                Do you have items that easily break and need extra love (lamps,
                mirrors, electronics, artwork)?
              </p>
              <FormField
                control={form.control}
                name="delicate_items_question_answer"
                render={({ field }) => (
                  <RadioGroup
                    value={form.watch("delicate_items_question_answer")}
                    onValueChange={(val) => {
                      field.onChange(val);
                    }}
                    className="flex justify-start gap-4 lg:justify-end"
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
                    value={form.watch("bulky_items_question_answer")}
                    onValueChange={(val) => {
                      field.onChange(val);
                    }}
                    className="flex justify-start gap-4 lg:justify-end"
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
                Do you have items that we&apos;ll need to disassemble for you?
              </p>
              <FormField
                control={form.control}
                name="disassemble_items_question_answer"
                render={({ field }) => (
                  <RadioGroup
                    value={form.watch("disassemble_items_question_answer")}
                    onValueChange={(val) => {
                      field.onChange(val);
                    }}
                    className="flex justify-start gap-4 lg:justify-end"
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
            <Button disabled={isSaving || !form.formState.isDirty}>
              {isSaving && (
                <LoaderCircleIcon className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save changes
            </Button>
            {/* <Button disabled={isSaving}>Save changes</Button> */}
          </div>
        </form>
      </Form>
    </div>
  );
}
