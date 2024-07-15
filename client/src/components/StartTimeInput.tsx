import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { setRequest } from "@/slices/request";
import { useDispatch, useSelector } from "@/store";
import { XIcon } from "lucide-react";
import { Separator } from "./ui/separator";

// function generateTimeOptions() {
//   const options = [];
//   // const options = [{ value: "", label: "" }];

//   const startTime = new Date();
//   startTime.setHours(5, 0, 0); // Set start time to 8:00 AM

//   // Generate options every 30 minutes
//   for (let i = 0; i < 16 * 2; i++) {
//     const time = new Date(startTime.getTime() + i * 30 * 60 * 1000);
//     const formattedTime = time.toLocaleTimeString([], {
//       hour: "numeric",
//       minute: "2-digit",
//     });
//     options.push({ value: formattedTime, label: formattedTime });
//   }
//   return options;
// }

export default function StartTimeInput() {
  const { request } = useSelector((state) => state.request);
  const dispatch = useDispatch();

  const generateTimeOptions = (
    movingDate?: Date,
  ): { label: string; value: number }[] => {
    const options = [];
    let startOfDay = new Date().setHours(0, 0, 0, 0);

    if (movingDate) {
      startOfDay = new Date(movingDate).setHours(0, 0, 0, 0);
    }

    for (let i = 0; i < 48; i++) {
      // 48 intervals in a day (24 hours * 2)
      const time = new Date(startOfDay + i * 30 * 60 * 1000); // Add 30 minutes
      const label = time.toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
      });
      const value = Math.floor(time.getTime() / 1000);
      options.push({ label, value });
    }

    return options;
  };

  const timeOptions = generateTimeOptions(request?.moving_date);

  return (
    <div className="flex w-full gap-[1px] rounded-md border shadow-sm">
      <Select
        value={
          request?.start_time_window
            ? request?.start_time_window.toString()
            : ""
        }
        onValueChange={(val: string) => {
          dispatch(setRequest({ start_time_window: parseInt(val, 10) }));
        }}
      >
        <SelectTrigger
          id="startTime"
          className="min-w-24 rounded-r-none border-none shadow-none"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {timeOptions.map((option) => (
            <SelectItem key={option.value} value={option.value.toString()}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Separator className="h-9" orientation="vertical" />
      <Select
        value={
          request?.end_time_window ? request?.end_time_window.toString() : ""
        }
        onValueChange={(val: string) => {
          dispatch(setRequest({ end_time_window: parseInt(val, 10) }));
        }}
      >
        <div className="relative flex w-full items-center">
          <SelectTrigger className="min-w-24 rounded-l-none border-none shadow-none">
            <SelectValue />
          </SelectTrigger>

          <XIcon
            onClick={(e) => {
              e.stopPropagation();
              dispatch(setRequest({ end_time_window: null }));
            }}
            className="absolute right-0 size-4 cursor-pointer opacity-50 hover:opacity-100"
          />
        </div>
        <SelectContent>
          {timeOptions.map((option) => (
            <SelectItem key={option.value} value={option.value.toString()}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
