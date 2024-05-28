import { cn } from "@/lib/utils";
import { UseFormReturn } from "react-hook-form";
import { Button } from "../ui/button";
import { FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Separator } from "../ui/separator";
import { type Inputs } from "./BookForm";

const floors = [
  {
    label: "1",
    value: "1st/ground floor",
  },
  {
    label: "2",
    value: "2nd floor",
  },
  {
    label: "3",
    value: "3rd floor",
  },
  {
    label: "4",
    value: "4th floor",
  },
  {
    label: "5",
    value: "5th floor",
    isDisabled: true,
  },
  {
    label: "House",
    value: "Private House",
  },
  {
    label: "Elevator",
    value: "Elevator Building",
  },
  {
    label: "Storage",
    value: "Storage Unit",
  },
];

const sizes = [
  "Room or less (partial move)",
  "Studio apartment",
  "Small 1 Bedroom apartment",
  "Large 1 Bedroom apartment",
  "Small 2 Bedroom apartment",
  "Large 2 Bedroom apartment",
  "3 Bedroom apartment",
  "2 Bedroom House/Townhouse",
  "3 Bedroom House/Townhouse",
  "4 Bedroom House/Townhouse",
  "Commercial Move",
];

export default function DetailsStep({ form }: { form: UseFormReturn<Inputs> }) {
  return (
    <div className="grid grid-cols-6 gap-4">
      <div className="col-span-6">
        <FormField
          control={form.control}
          name="moveSize"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Move Size</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Move Size" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {sizes.map((item, i) => (
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
      <div className="col-span-6">
        <Separator />
      </div>
      <div className="col-span-6">
        <FormField
          control={form.control}
          name="origin.floor"
          render={({ field }) => (
            <FormItem>
              <p
                className={cn(
                  "mb-4 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                  form.formState.errors.origin?.floor && "text-red-600",
                )}
              >
                Origin Floor Level
              </p>
              <fieldset className="flex flex-wrap gap-2">
                {floors.map((item, i) => {
                  return (
                    <Button
                      key={`origin-floor-${i}`}
                      size="sm"
                      type="button"
                      disabled={item.isDisabled}
                      onClick={() => field.onChange(item.value)}
                      variant={
                        field.value === item.value ? "default" : "outline"
                      }
                      className={cn(
                        "grow",
                        field.value === item.value
                          ? "border-input shadow-button"
                          : "",
                      )}
                    >
                      {item.label}
                    </Button>
                  );
                })}
              </fieldset>
            </FormItem>
          )}
        />
      </div>
      <div className="col-span-6">
        <Separator />
      </div>
      <div className="col-span-6">
        <FormField
          control={form.control}
          name="destination.floor"
          render={({ field }) => (
            <FormItem>
              <p
                className={cn(
                  "mb-4 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                  form.formState.errors.destination?.floor && "text-red-600",
                )}
              >
                Destination Floor Level
              </p>
              <fieldset className="flex flex-wrap gap-2">
                {floors.map((item, i) => {
                  return (
                    <Button
                      key={`destination-floor-${i}`}
                      size="sm"
                      type="button"
                      disabled={item.isDisabled}
                      onClick={() => field.onChange(item.value)}
                      variant={
                        field.value === item.value ? "default" : "outline"
                      }
                      className={cn(
                        "grow",
                        field.value === item.value
                          ? "border-input shadow-button"
                          : "",
                      )}
                    >
                      {item.label}
                    </Button>
                  );
                })}
              </fieldset>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
