import { zodResolver } from "@hookform/resolvers/zod";
// import TrumbowygEditor from '@/components/TrumbowygEditor';
import FormSubmitButton from "@/components/FormSubmitButton";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDispatch, useSelector } from "@/store";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { setTrucks } from "@/slices/globalSetting";
import toast from "react-hot-toast";
import { addTruck } from "@/actions/trucks";

const formSchema = z.object({
  name: z.string(),
});

export default function TruckForm() {
  const { trucks } = useSelector((state) => state.globalSettings);
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    handleSaveNewTruck(values);
  }

  // function handleUpdatePacking(values: z.infer<typeof formSchema>) {
  //   if (!data) return;
  //   const newValues = {
  //     id: data?.id,
  //     name: values.name,
  //     description: values.description,
  //     labor_increase: parseInt(values.laborIcrease),
  //   };
  //   setIsLoading(true);
  //   updatePacking(data.id, newValues)
  //     .then((res) => {
  //       if (res?.error) {
  //         toast.error(res.error);
  //         return;
  //       }
  //       form.reset();
  //       toast.success(res?.success);
  //       const newPacking = res?.packing;
  //       console.log(newPacking);
  //       const newPackingList = items.map((item) =>
  //         item.id === newPacking.id
  //           ? {
  //               ...item,
  //               name: newPacking.name,
  //               description: newPacking.description,
  //               labor_increase: newPacking.labor_increase,
  //             }
  //           : item,
  //       );
  //       // setItems(newPackingList);
  //       dispatch(setPackings(newPackingList));
  //       handleClose();
  //     })
  //     .finally(() => setIsLoading(false));
  // }

  function handleSaveNewTruck(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    addTruck(values)
      .then((res) => {
        if (res?.error) {
          toast.error(res.error);
          return;
        }
        form.reset();
        toast.success(res?.success);
        const newTruckList = [...trucks, res?.truck];
        // setItems(newPackingList);
        dispatch(setTrucks(newTruckList));
        handleClose();
      })
      .finally(() => setIsLoading(false));
  }

  const handleClose = () => {
    form.reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon className="size-4 md:mr-2" />
          Add truck
        </Button>
      </DialogTrigger>
      <DialogContent className="flex h-full flex-col overflow-hidden p-0 sm:h-auto">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle>Add truck</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-1 flex-col justify-between overflow-hidden"
          >
            <ScrollArea className="h-full w-full">
              <div className="space-y-4 px-4 pb-6 sm:px-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Truck name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </ScrollArea>
            <DialogFooter className="flex justify-end bg-muted p-6">
              {/* <Button
                type="submit"
                disabled={isLoading}
                className="lg:w-[10rem]"
              >
                Save changes
              </Button> */}
              <FormSubmitButton
                disabled={isLoading || !form.formState.isDirty}
                isPending={isLoading}
                label="Save changes"
              />
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
