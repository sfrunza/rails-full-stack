import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from './ui/separator';
import { XIcon } from 'lucide-react';
import { useState } from 'react';

function generateTimeOptions() {
  const options = [];
  // const options = [{ value: "", label: "" }];

  const startTime = new Date();
  startTime.setHours(5, 0, 0); // Set start time to 8:00 AM

  // Generate options every 30 minutes
  for (let i = 0; i < 16 * 2; i++) {
    const time = new Date(startTime.getTime() + i * 30 * 60 * 1000);
    const formattedTime = time.toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit',
    });
    options.push({ value: formattedTime, label: formattedTime });
  }
  return options;
}

export default function StartTimeInput() {
  const [startTime, setStartTime] = useState({ start: '', end: '' });

  // function handleStartTimeChange(val: string) {
  //   setStartTime({ ...startTime, start: val });
  // }

  function handleEndTimeChange(val: string) {
    setStartTime({ ...startTime, end: val });
  }

  // console.log(startTime);
  return (
    <div className="flex w-full gap-[1px] rounded-md border shadow-sm">
      <Select
        defaultValue={startTime.start}
        onValueChange={(val: string) => {
          console.log(startTime.end);
          if (!startTime.end.length) {
            setStartTime((prev) => ({ ...prev, start: val, end: val }));
          } else {
            setStartTime((prev) => ({ ...prev, start: val }));
          }
        }}
      >
        <SelectTrigger
          id="startTime"
          className="rounded-r-none border-none shadow-none"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {generateTimeOptions().map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Separator className="h-9" orientation="vertical" />
      <Select
        // defaultValue={startTime.end}
        onValueChange={() => {
          handleEndTimeChange('');
          return undefined;
          // setStartTime({ ...startTime, end: "" });
        }}
      >
        <div className="relative flex w-full items-center">
          <SelectTrigger className="rounded-l-none border-none shadow-none">
            <SelectValue placeholder="sad" />
          </SelectTrigger>

          <XIcon
            onClick={(e) => {
              e.stopPropagation();
              handleEndTimeChange('');
              setStartTime((prev) => {
                return { ...prev, end: '' };
              });
            }}
            className="absolute right-0 size-4 cursor-pointer opacity-50 hover:opacity-100"
          />
        </div>
        <SelectContent>
          {generateTimeOptions().map((option, i) => (
            <SelectItem key={i} value={option.value ?? ''}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
