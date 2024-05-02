import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "components/ui/select";
import { Separator } from "./ui/separator";
import { useDispatch } from "store";
import { updateStoreRequest } from "slices/request";

// export function generateWorkTimeOptions() {
//   const options = [];
//   for (let hours = 0; hours < 24; hours++) {
//     for (let minutes = 0; minutes < 60; minutes += 15) {
//       const time = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
//       options.push({ value: time, label: time });
//     }
//   }
//   return options;
// }

export function generateWorkTimeOptions() {
  const options = [];
  for (let hours = 0; hours < 24; hours++) {
    for (let minutes = 0; minutes < 60; minutes += 15) {
      const timeInMinutes = hours * 60 + minutes;
      options.push({
        value: timeInMinutes,
        label: `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`,
      });
    }
  }
  return options;
}

export default function WorkTimeInput({
  workTime,
}: {
  workTime: { min: number; max: number };
}) {
  const dispatch = useDispatch();
  return (
    <div className="flex w-full gap-[1px] rounded-md border shadow-sm">
      <Select
        value={workTime.min.toString()}
        onValueChange={(val) => {
          const newWorkTime = { ...workTime };
          if (parseInt(val) > newWorkTime.max) {
            newWorkTime.max = parseInt(val);
          }
          dispatch(
            updateStoreRequest({
              work_time: { ...newWorkTime, min: parseInt(val) },
            }),
          );
        }}
      >
        <SelectTrigger
          id="workTime"
          className="rounded-r-none border-none shadow-none"
        >
          <SelectValue placeholder="" />
        </SelectTrigger>
        <SelectContent>
          {generateWorkTimeOptions().map((option) => (
            <SelectItem key={option.value} value={option.value.toString()}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Separator className="h-9" orientation="vertical" />
      <Select
        value={workTime.max.toString()}
        onValueChange={(val) => {
          // console.log(val);
          const newWorkTime = { ...workTime };
          if (parseInt(val) < newWorkTime.min) {
            newWorkTime.min = parseInt(val);
          }
          dispatch(
            updateStoreRequest({
              work_time: { ...newWorkTime, max: parseInt(val) },
            }),
          );
        }}
      >
        <SelectTrigger className="rounded-l-none border-none shadow-none">
          <SelectValue placeholder="" />
        </SelectTrigger>
        <SelectContent>
          {generateWorkTimeOptions().map((option) => (
            <SelectItem key={option.value} value={option.value.toString()}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
