import { zodResolver } from "@hookform/resolvers/zod";
import { addPacking, updatePacking } from "actions/packings";
import TrumbowygEditor from "components/TrumbowygEditor";
import { Button } from "components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "components/ui/form";
import { Input } from "components/ui/input";
import { ScrollArea } from "components/ui/scroll-area";
import { PencilLineIcon, PlusIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { setPackings } from "slices/globalSetting";
import { useDispatch, useSelector } from "store";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(10),
  description: z.string().min(10),
  laborIcrease: z.string().min(1),
});

export default function PackingForm({
  data,
  items,
  setItems,
}: {
  data?: {
    id: number;
    name: string;
    description: string;
    labor_increase: number;
  };
  items: any[];
  setItems: (items: any[]) => void;
}) {
  const { packings } = useSelector((state) => state.globalSettings);
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    reValidateMode: "onBlur",
    defaultValues: {
      name: data?.name || "",
      description: data?.description || "",
      laborIcrease: data?.labor_increase.toString() || "",
    },
  });

  useEffect(() => {
    if (data) {
      form.setValue("name", data.name);
      form.setValue("description", data.description);
      form.setValue("laborIcrease", data.labor_increase.toString());
    }
  }, [data]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (data) {
      handleUpdatePacking(values);
    } else {
      handleSaveNewPacking(values);
    }
  }

  function handleUpdatePacking(values: z.infer<typeof formSchema>) {
    if (!data) return;
    const newValues = {
      id: data?.id,
      name: values.name,
      description: values.description,
      labor_increase: parseInt(values.laborIcrease),
    };
    setIsLoading(true);
    updatePacking(data.id, newValues)
      .then((res) => {
        if (res?.error) {
          toast.error(res.error);
          return;
        }
        form.reset();
        toast.success(res?.success);
        const newPacking = res?.packing;
        console.log(newPacking);
        const newPackingList = items.map((item) =>
          item.id === newPacking.id
            ? {
                ...item,
                name: newPacking.name,
                description: newPacking.description,
                labor_increase: newPacking.labor_increase,
              }
            : item,
        );
        // setItems(newPackingList);
        dispatch(setPackings(newPackingList));
        handleClose();
      })
      .finally(() => setIsLoading(false));
  }

  function handleSaveNewPacking(values: z.infer<typeof formSchema>) {
    const newValues = {
      name: values.name,
      description: values.description,
      is_defalut: false,
      labor_increase: parseInt(values.laborIcrease),
      droppable_index: packings.length,
    };
    setIsLoading(true);
    addPacking(newValues)
      .then((res) => {
        if (res?.error) {
          toast.error(res.error);
          return;
        }
        form.reset();
        toast.success(res?.success);
        const newPackingList = [...items, res?.packing];
        // setItems(newPackingList);
        dispatch(setPackings(newPackingList));
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
        {data ? (
          <Button
            variant="ghost"
            className="text-green-600 hover:text-green-600"
          >
            <PencilLineIcon className="size-4 md:mr-2" />
            <span className="hidden md:flex">Edit</span>
          </Button>
        ) : (
          <Button>
            <PlusIcon className="size-4 md:mr-2" />
            Add packing
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="flex h-full flex-col overflow-hidden p-0 sm:h-[90vh]">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle>{data ? "Edit" : "Add"} packing service</DialogTitle>
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
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <TrumbowygEditor
                          value={field.value}
                          onChange={(e) =>
                            field.onChange(() => {
                              form.setValue("description", e.target.innerHTML);
                            })
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="laborIcrease"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Labor increse %</FormLabel>
                      <FormControl>
                        <Input placeholder="0" type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </ScrollArea>
            <DialogFooter className="flex justify-end bg-slate-100 p-6">
              <Button
                type="submit"
                disabled={isLoading}
                className="lg:w-[10rem]"
              >
                Save changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
