import { LoaderCircleIcon, MapPinIcon } from "lucide-react";

import {
  AutoCompleteInput,
  TAutocompleteData,
} from "@/components/AutoCompleteInput";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { floorOptions } from "@/constants/request";
import { useModal } from "@/hooks/useModal";
import useUpdateRequest from "@/hooks/useUpdateRequest";
import { useSelector } from "@/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const FormDataSchema = z.object({
  street: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(1),
  zip: z.string().min(1),
  apt: z.string().optional(),
  floor: z.string().min(1),
  isPickup: z.boolean(),
  isDropoff: z.boolean(),
  type: z.string().min(1),
  fullAddress: z.string().min(1),
  location: z
    .object({
      lat: z.number().optional(),
      lng: z.number().optional(),
    })
    .optional(),
});

export type Inputs = z.infer<typeof FormDataSchema>;

export function EditStopModal() {
  const { request } = useSelector((state) => state.request);
  const { isModalOpen, closeModal, getModalData } = useModal();
  const { isSaving, updateRequestHandler } = useUpdateRequest();

  const { stops } = request!;
  const { stop } = getModalData("editStop");

  const fullAddressArray = [
    stop?.street || "",
    stop?.city || "",
    stop?.state || "",
    stop?.zip || "",
  ];

  const form = useForm<Inputs>({
    resolver: zodResolver(FormDataSchema),
    defaultValues: {
      street: stop?.street || "",
      city: stop?.city || "",
      state: stop?.state || "",
      zip: stop?.zip || "",
      apt: stop?.apt || "",
      floor: stop?.floor || "",
      isPickup: stop?.isPickup || true,
      isDropoff: stop?.isDropoff || false,
      type: stop?.isPickup
        ? "Pick up"
        : stop?.isDropoff
          ? "Drop off"
          : "Pick up",
      fullAddress: stop ? fullAddressArray.join(" ") : "",
      location: stop?.location,
    },
  });

  function getNewAddress(newData: TAutocompleteData) {
    form.setValue("street", newData.street!);
    form.setValue("city", newData.city!);
    form.setValue("state", newData.state!);
    form.setValue("zip", newData.zip!);
    form.setValue("location", newData.location!);
    form.setValue("fullAddress", newData.fullAddress!);
  }

  function _onSubmit(newData: any) {
    const newStop = {
      street: newData.street,
      city: newData.city,
      state: newData.state,
      zip: newData.zip,
      apt: newData.apt,
      floor: newData.floor,
      isPickup: newData.isPickup,
      isDropoff: newData.isDropoff,
      location: newData.location,
    };

    const newStopsArray = [...stops];

    if (stop) {
      const index = newStopsArray.findIndex((item) => item === stop);
      newStopsArray[index] = newStop;
    } else {
      newStopsArray.push(newStop);
    }

    updateRequestHandler({ stops: newStopsArray }, handleClose);
  }

  const st = form.watch("street");
  const ci = form.watch("city");
  const stt = form.watch("state");
  const zi = form.watch("zip");

  const handleClose = () => {
    form.reset();
    closeModal("editStop");
  };

  return (
    <Dialog open={isModalOpen("editStop")} onOpenChange={handleClose}>
      <DialogContent
        onInteractOutside={(e) => {
          const classes: Array<Array<string>> = [];

          e.composedPath().forEach((el: any) => {
            if (el.classList) {
              classes.push(Array.from(el.classList));
            }
          });
          if (classes.join("-").includes("pac-container")) {
            e.preventDefault();
          }
        }}
        className="flex h-full flex-col overflow-hidden p-0 sm:h-auto"
      >
        <DialogHeader className="p-6">
          <DialogTitle>{stop ? "Edit stop" : "Add stop"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(_onSubmit)}
            className="flex flex-1 flex-col justify-between overflow-hidden"
          >
            <div className="px-4 pb-6 sm:px-6">
              <Card className="border shadow-none">
                <CardHeader className="bg-slate-100 p-4">
                  <div className="grid grid-cols-5 items-start text-sm">
                    <div className="col-span-2 flex items-center gap-3">
                      <MapPinIcon className="size-5 text-blue-600" />
                      <Select
                        onValueChange={(val) => {
                          if (val === "Pick up") {
                            form.setValue("isPickup", true);
                            form.setValue("isDropoff", false);
                          } else {
                            form.setValue("isPickup", false);
                            form.setValue("isDropoff", true);
                          }
                        }}
                        defaultValue={form.getValues("type")}
                      >
                        <SelectTrigger className="bg-white">
                          <SelectValue placeholder="Select floor" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem
                            value="Pick up"
                            className="hover:cursor-pointer"
                          >
                            Pick up
                          </SelectItem>
                          <SelectItem
                            value="Drop off"
                            className="hover:cursor-pointer"
                          >
                            Drop off
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <p className="col-span-3 text-right">
                      <span className="font-semibold">{st}</span>
                      <br />
                      {ci && `${ci},`} {stt} {zi}
                    </p>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 py-6">
                  <FormField
                    control={form.control}
                    name="fullAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Address</FormLabel>
                        <FormControl>
                          <AutoCompleteInput
                            {...field}
                            value={field.value}
                            getAddress={getNewAddress}
                            placeholder="Full Address"
                            title="Please enter your Full Address"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="apt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Apartment</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Apt. (optional)"
                            title="Please enter your Apartment"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="floor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Floor</FormLabel>
                        <Select
                          onValueChange={(val) => {
                            field.onChange(val);
                          }}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select floor" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {floorOptions.map((item, i) => (
                              <SelectItem
                                key={i}
                                value={item.value}
                                className="hover:cursor-pointer"
                                disabled={item.value === "5th floor"}
                              >
                                {item.value}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>
            <DialogFooter className="flex justify-end bg-muted p-6">
              <Button disabled={isSaving}>
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
