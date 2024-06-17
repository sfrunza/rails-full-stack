import { AutoCompleteInput } from "@/components/AutoCompleteInput";
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
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { floorOptions } from "@/constants/request";
import { useModal } from "@/hooks/useModal";
import useUpdateRequest from "@/hooks/useUpdateRequest";
import { zodResolver } from "@hookform/resolvers/zod";
import { MapPinIcon } from "lucide-react";
import { useState } from "react";
import { UseFormReturn, useForm } from "react-hook-form";
import { z } from "zod";
import FormSubmitButton from "../FormSubmitButton";

type TLocationFormProps = {
  form: UseFormReturn<Inputs>;
  type: "origin" | "destination";
  updateLocation: (type: "origin" | "destination", data: Inputs) => void;
};

const formSchema = z.object({
  origin: z
    .object({
      street: z.string().or(z.null()),
      city: z.string().or(z.undefined()),
      state: z.string().or(z.undefined()),
      zip: z.string().or(z.undefined()),
      apt: z.string().or(z.null()),
      floor: z.string().min(5),
      location: z
        .object({
          lat: z.number().optional(),
          lng: z.number().optional(),
        })
        .optional(),
    })
    .required(),
  destination: z
    .object({
      street: z.string().or(z.null()),
      city: z.string().or(z.undefined()),
      state: z.string().or(z.undefined()),
      zip: z.string().or(z.undefined()),
      apt: z.string().or(z.null()),
      floor: z.string().min(5),
      location: z
        .object({
          lat: z.number().optional(),
          lng: z.number().optional(),
        })
        .optional(),
    })
    .required(),
});

type Inputs = z.infer<typeof formSchema>;

export function EditLocationsModal() {
  const { isModalOpen, closeModal, getModalData } = useModal();
  const { isSaving, updateRequestHandler } = useUpdateRequest();
  const { locations, tab } = getModalData("editLocations");
  const [activeTab, setActiveTab] = useState(tab);

  const origin = locations?.origin;
  const destination = locations?.destination;

  const form = useForm<Inputs>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      origin: {
        street: origin?.street || "",
        city: origin?.city,
        state: origin?.state,
        zip: origin?.zip,
        apt: origin?.apt || "",
        floor: origin?.floor,
        location: origin?.location,
      },
      destination: {
        street: destination?.street || "",
        city: destination?.city,
        state: destination?.state,
        zip: destination?.zip,
        apt: destination?.apt || "",
        floor: destination?.floor,
        location: destination?.location,
      },
    },
  });

  function updateLocation(type: "origin" | "destination", data: Inputs) {
    form.setValue(type, {
      ...form.watch(type),
      ...data,
    });
  }

  async function onSubmit(newData: Inputs) {
    updateRequestHandler(
      { origin: newData.origin, destination: newData.destination },
      handleClose,
    );
  }

  const handleClose = () => {
    form.reset();
    closeModal("editLocations");
  };

  return (
    <Dialog open={isModalOpen("editLocations")} onOpenChange={handleClose}>
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
        className="flex h-full w-full min-w-0 flex-col overflow-hidden p-0 sm:h-auto md:max-w-4xl"
      >
        <DialogHeader className="p-6">
          <DialogTitle>Edit locations</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            className="flex flex-1 flex-col justify-between overflow-hidden"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            {/* Form Mobile */}
            <Tabs className="block px-2 md:hidden" value={activeTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger
                  value="origin"
                  onClick={() => setActiveTab("origin")}
                >
                  Origin
                </TabsTrigger>
                <TabsTrigger
                  value="destination"
                  onClick={() => setActiveTab("destination")}
                >
                  Destination
                </TabsTrigger>
              </TabsList>
              {/* </div> */}
              <TabsContent value="origin" className="mt-6">
                <LocationForm
                  form={form}
                  type="origin"
                  updateLocation={updateLocation}
                />
              </TabsContent>
              <TabsContent value="destination" className="mt-6">
                <LocationForm
                  form={form}
                  type="destination"
                  updateLocation={updateLocation}
                />
              </TabsContent>
            </Tabs>

            {/* Form Desktop */}

            <div className="hidden gap-4 px-2 pb-6 sm:grid-cols-2 sm:px-4 md:grid">
              <div className="sm:col-span-1">
                <LocationForm
                  form={form}
                  type="origin"
                  updateLocation={updateLocation}
                />
              </div>
              <div className="sm:col-span-1">
                <LocationForm
                  form={form}
                  type="destination"
                  updateLocation={updateLocation}
                />
              </div>
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
}

function LocationForm({ form, type, updateLocation }: TLocationFormProps) {
  const color = type === "origin" ? "text-green-600" : "text-red-600";

  function getNewAddress(data: any) {
    updateLocation(type, data);
  }

  const isLoaded = google.maps.places.AutocompleteService ? true : false;

  return (
    <Card className="space-y-4 overflow-hidden border shadow-none">
      <CardHeader className="bg-muted p-4">
        <div className="grid grid-cols-5 items-start text-sm">
          <div className="col-span-2 flex gap-3">
            <MapPinIcon className={`size-5 ${color}`} />
            <p className={`font-medium ${color} capitalize`}>{type}</p>
          </div>
          <p className="col-span-3 text-right">
            <span className="font-semibold">
              {form.watch(`${type}.street`)}
            </span>
            <br />
            {form.watch(`${type}.city`)}, {form.watch(`${type}.state`)}{" "}
            {form.watch(`${type}.zip`)}
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-6 gap-4">
          <div className="col-span-4">
            <FormField
              control={form.control}
              name={`${type}.street`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    {isLoaded ? (
                      <AutoCompleteInput
                        {...field}
                        value={field.value ?? ""}
                        getAddress={getNewAddress}
                        placeholder="Address"
                        title="Please enter your Full Address"
                        type={type}
                      />
                    ) : (
                      <Input
                        {...field}
                        value={field.value || ""}
                        placeholder="Address"
                        title="Please enter your Full Address"
                      />
                    )}
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <div className="col-span-2">
            <FormField
              control={form.control}
              name={`${type}.apt`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Apartment</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value || ""}
                      placeholder="Apt. (optional)"
                      title="Please enter your Apartment"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <div className="col-span-2">
            <FormField
              control={form.control}
              name={`${type}.city`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="City"
                      title="Please enter your City"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <div className="col-span-2">
            <FormField
              control={form.control}
              name={`${type}.state`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="State"
                      title="Please enter your State"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <div className="col-span-2">
            <FormField
              control={form.control}
              name={`${type}.zip`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ZIP</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="ZIP"
                      title="Please enter your Zip"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <div className="col-span-3">
            <FormField
              control={form.control}
              name={`${type}.floor`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Floor</FormLabel>
                  <Select
                    defaultValue={field.value}
                    onValueChange={(val) => {
                      field.onChange(val);
                    }}
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
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
