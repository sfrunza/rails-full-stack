import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { addService } from "actions/services";
import { Button } from "components/ui/button";
import { Input } from "components/ui/input";
import { deepCopy } from "lib/utils";
import { GripVerticalIcon, PlusIcon } from "lucide-react";
import toast from "react-hot-toast";
import { setServices } from "slices/globalSetting";
import { useDispatch, useSelector } from "store";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "components/ui/form";

const FormDataSchema = z.object({
  service: z.string().min(5),
});

type Inputs = z.infer<typeof FormDataSchema>;

export default function ServiceForm() {
  const { services } = useSelector((state) => state.globalSettings);
  const dispatch = useDispatch();
  const [isAdding, setIsAdding] = useState(false);

  const form = useForm<Inputs>({
    resolver: zodResolver(FormDataSchema),
    reValidateMode: "onChange",
    defaultValues: {
      service: "",
    },
  });

  function handleAddService(newData: Inputs) {
    if (!newData.service || !services) return;
    const newService = {
      name: newData.service,
      droppable_index: services!.length,
    };
    setIsAdding(true);
    addService(newService)
      .then((res) => {
        if (res?.error) {
          toast.error(res.error);
          return;
        }
        toast.success(res?.success);
        form.reset();
        dispatch(setServices([...deepCopy(services), res?.service]));
      })
      .finally(() => setIsAdding(false));
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleAddService)}
        className="flex items-center justify-between gap-4 py-2"
      >
        <div className="w-6"></div>
        <div className="flex flex-1 items-end justify-between gap-4 sm:gap-[6.5rem]">
          <FormField
            control={form.control}
            name="service"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>New service</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="col-span-2 col-start-11"
            disabled={isAdding}
          >
            <PlusIcon className="size-4 md:mr-2" />
            <span className="hidden md:flex">Add</span>
          </Button>
        </div>
      </form>
    </Form>
  );
}
