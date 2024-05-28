import { useState } from "react";

import WorkTimeInput, {
  generateWorkTimeOptions,
} from "@/components/WorkTimeInput";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { centsToDollars, cn, formatDate } from "@/lib/utils";
import { setRequest } from "@/slices/request";
import { useDispatch, useSelector } from "@/store";
import {
  CalendarIcon,
  Clock4Icon,
  DollarSignIcon,
  MapIcon,
  TruckIcon,
  UserRoundIcon,
} from "lucide-react";

export default function DateTimeSection() {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const { request } = useSelector((state) => state.request);
  const dispatch = useDispatch();
  return (
    <div className="grid w-full grid-cols-1 gap-4 bg-background p-4 shadow md:auto-cols-max md:grid-flow-col md:grid-cols-none md:gap-6 md:p-6">
      <div>
        <Label className="ml-8" htmlFor="movingDate">
          Move date
        </Label>
        <div className="flex items-center gap-2">
          <CalendarIcon className="ml-auto size-5 text-muted-foreground" />
          <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full border border-input text-left font-normal shadow-sm",
                  !request?.moving_date && "text-muted-foreground",
                )}
                id="movingDate"
              >
                {request?.moving_date ? (
                  formatDate(request?.moving_date)
                ) : (
                  <span>Pick a date</span>
                )}
                <CalendarIcon className="ml-auto size-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={new Date(request?.moving_date!)}
                onSelect={(selectedDay) => {
                  dispatch(
                    setRequest({
                      moving_date: new Date(selectedDay!).toISOString(),
                    }),
                  );
                  // setRequest({ ...request, moving_date: date });
                  setIsCalendarOpen(false);
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div>
        <Label className="ml-8" htmlFor="workTime">
          Start time window
        </Label>
        <div className="flex items-center gap-2">
          <Clock4Icon className="ml-auto size-5 text-muted-foreground" />
          <WorkTimeInput />
        </div>
      </div>
      <div>
        <Label className="ml-8" htmlFor="workTime">
          Work time
        </Label>
        <div className="flex items-center gap-2">
          <TruckIcon className="ml-auto size-5 text-muted-foreground" />
          <WorkTimeInput />
        </div>
      </div>
      <div>
        <Label className="ml-8" htmlFor="travelTime">
          Travel time
        </Label>
        <div className="flex items-center gap-2">
          <MapIcon className="ml-auto size-5 text-muted-foreground" />
          <Select
            defaultValue={request?.travel_time.toString()}
            onValueChange={(val: string) => {
              console.log(val);
              dispatch(setRequest({ travel_time: parseInt(val) }));
            }}
          >
            <SelectTrigger id="travelTime">
              <SelectValue placeholder="" className="w-full" />
            </SelectTrigger>
            <SelectContent className="max-h-60">
              {generateWorkTimeOptions().map((option) => (
                <SelectItem key={option.value} value={option.value.toString()}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      {/* <div className="flex justify-between gap-4"> */}
      <div>
        <Label className="ml-8" htmlFor="crewSize">
          Crew size
        </Label>
        <div className="flex items-center gap-2">
          <UserRoundIcon className="ml-auto size-5 text-muted-foreground" />
          <Input
            id="crewSize"
            pattern="[0-9]+"
            value={request?.crew_size || ""}
            onChange={(e) => {
              const value = e.target.value;
              if (/^\d*$/.test(value)) {
                // setRate(Number(value));
                dispatch(setRequest({ crew_size: parseInt(value) }));
              }
            }}
            className="md:w-20"
          />
        </div>
      </div>
      <div>
        <Label className="ml-8" htmlFor="rate">
          Rate
        </Label>
        <div className="flex items-center gap-2">
          <DollarSignIcon className="ml-auto size-5 text-muted-foreground" />
          <Input
            id="rate"
            pattern="[0-9]+"
            value={centsToDollars(request?.rate!) || ""}
            onChange={(e) => {
              const value = e.target.value;
              if (/^\d*$/.test(value)) {
                // setRate(Number(value));
                dispatch(
                  setRequest({
                    rate: Math.round(parseFloat(value) * 100),
                  }),
                );
              }
            }}
            className="md:w-20"
          />
        </div>
      </div>
    </div>
  );
}
