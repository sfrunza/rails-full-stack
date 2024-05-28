import { jsonCityState } from "@/lib/usCities";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import toast from "react-hot-toast";
import { Button } from "../ui/button";
import { FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { type Inputs } from "./BookForm";
import { CalendarWithRates } from "../CalendarWithRates";

// const timeFrame = ['8AM', '10AM-12PM', '12PM-4PM', '4PM-8PM'];
const services = [
  "Local Moving",
  "Moving & Storage",
  "Loading Help",
  "Unloading Help",
  "Inside Move",
];

function onlyNumbers(e: React.ChangeEvent<HTMLInputElement>) {
  e.target.value = e.target.value.replace(/[^0-9]/g, "");
}

export default function DateTimeStep({
  form,
}: {
  form: UseFormReturn<Inputs>;
}) {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isCalendarDeliveryOpen, setIsCalendarDeliveryOpen] = useState(false);

  function onZipChange(
    e: React.ChangeEvent<HTMLInputElement>,
    type: "origin" | "destination",
  ) {
    form.clearErrors(`${type}.zip`);
    const zip = e.target.value;

    if (zip.length > 5) return;

    form.setValue(`${type}.zip`, zip);

    if (zip.length === 5) {
      const cityState = jsonCityState.find((item) => item.z === zip);

      if (cityState) {
        form.setValue(`${type}.city`, cityState.c);
        form.setValue(`${type}.state`, cityState.s);
        toast.success(`${cityState.c}, ${cityState.s} ${cityState.z}`);
      } else {
        form.setError(`${type}.zip`, {
          type: "manual",
          message: "Invalid zip code",
        });
        form.setValue(`${type}.city`, "");
        form.setValue(`${type}.state`, "");
        toast.error("Invalid zip code");
      }
    }
  }

  // console.log(form.watch());

  return (
    <div className="grid grid-cols-6 gap-4">
      <div className="col-span-6">
        <FormField
          control={form.control}
          name="movingDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Moving Date</FormLabel>
              <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full rounded-md pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span className="text-muted-foreground">
                          Pick Moving Date
                        </span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 text-slate-500 opacity-60" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto overflow-hidden p-0"
                  align="start"
                >
                  <CalendarWithRates
                    mode="single"
                    selected={field.value}
                    onSelect={(date) => {
                      field.onChange(date);
                      setIsCalendarOpen(false);
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </FormItem>
          )}
        />
      </div>
      {/* <div className="col-span-2">
        <FormField
          control={form.control}
          name="startTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Start Time</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {timeFrame.map((item, i) => (
                    <SelectItem
                      key={i}
                      value={item}
                      className="hover:cursor-pointer"
                    >
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
      </div> */}
      <div className="col-span-3">
        <FormField
          control={form.control}
          name="origin.zip"
          render={({ field }) => (
            <FormItem>
              <FormLabel>From Zip</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="tel"
                  pattern="[0-9]*"
                  maxLength={5}
                  placeholder="From ZIP"
                  onChange={(e) => onZipChange(e, "origin")}
                  onInput={onlyNumbers}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
      <div className="col-span-3">
        <FormField
          control={form.control}
          name="destination.zip"
          render={({ field }) => (
            <FormItem>
              <FormLabel>To Zip</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="tel"
                  pattern="[0-9]*"
                  maxLength={5}
                  placeholder="To ZIP"
                  onChange={(e) => onZipChange(e, "destination")}
                  onInput={onlyNumbers}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
      <div className="col-span-4">
        <FormField
          control={form.control}
          name="service"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Service</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Service" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {services.map((item, i) => (
                    <SelectItem
                      key={i}
                      value={item}
                      className="hover:cursor-pointer"
                    >
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
      </div>
      {form.watch("service") === "Moving & Storage" && (
        <div className="col-span-6">
          <FormField
            control={form.control}
            name="deliveryDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Delivey Date</FormLabel>
                <Popover
                  open={isCalendarDeliveryOpen}
                  onOpenChange={setIsCalendarDeliveryOpen}
                >
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full rounded-md pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span className="text-muted-foreground">
                            Pick Delivery Date
                          </span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 text-slate-500 opacity-60" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarWithRates
                      mode="single"
                      selected={field.value}
                      onSelect={(date) => {
                        field.onChange(date);
                        setIsCalendarDeliveryOpen(false);
                      }}
                      disabled={(date) => {
                        return (
                          form.watch("movingDate") &&
                          date <= form.watch("movingDate")
                        );
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </FormItem>
            )}
          />
        </div>
      )}
    </div>
  );
}
