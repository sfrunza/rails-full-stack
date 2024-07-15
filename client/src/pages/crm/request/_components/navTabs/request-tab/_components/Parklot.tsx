import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { statusColors } from "@/constants/request";
import {
  cn,
  convertMinutesToHoursAndMinutes,
  formatDate,
  formatMoney,
  formatTimeWindow,
} from "@/lib/utils";
import { setParklot, setParklotDate, setRequest } from "@/slices/request";
import { useDispatch, useSelector } from "@/store";
import { TFullRequest, TStatus } from "@/types/request";
import { format } from "date-fns";
import {
  CalendarDaysIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Clock4Icon,
  LoaderCircleIcon,
  MapIcon,
  MapPinIcon,
  SettingsIcon,
  TicketIcon,
  TruckIcon,
  UserRoundIcon,
  UsersIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useSWR from "swr";
// import { fetchRequestsByDate } from "@/slices/parklot";

const startTime = new Date();
startTime.setHours(7, 0); // Start at 7:00 AM
const endTime = new Date();
endTime.setHours(21, 0); // End at 9:00 PM
const interval = 60;

const timeSlots = generateTimeSlots(startTime, endTime, interval); // From 7 AM to 9 PM

// const formatDate = (timestamp: number) => {
//   const date = new Date(timestamp * 1000);
//   return date.toLocaleString("en-US", {
//     weekday: "long",
//     year: "numeric",
//     month: "long",
//     day: "numeric",
//     hour: "numeric",
//     minute: "numeric",
//     second: "numeric",
//     hour12: true,
//   });
// };

export default function Parklot() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  // const [onlyRequests, setOnlyRequests] = useState([]);

  const { parklotTruks } = useSelector((state) => state.globalSettings);
  const { request, parklotRequests, parklotDate } = useSelector(
    (state) => state.request,
  );
  const truckIds = request?.truck_ids ?? [];
  const { data, isLoading } = useSWR<TFullRequest>(
    parklotDate ? `trucks/requests/${parklotDate}` : null,
  );

  console.log("request", request?.start_time_window);

  useEffect(() => {
    if (data) {
      dispatch(setParklot(data));
    }
  }, [parklotDate, dispatch, data]);

  console.log("parklotRequests", parklotRequests);

  console.log("parklotDate", parklotDate);

  return (
    <>
      <div className="flex items-center justify-center gap-8 border-b bg-background py-2">
        <Button
          size="icon"
          variant="ghost"
          onClick={() => {
            const newDate = new Date(parklotDate!);
            newDate.setDate(newDate.getDate() - 1);
            dispatch(setParklotDate(new Date(newDate).toISOString()));
            // dispatch(fetchRequestsByDate(new Date(newDate)));
          }}
        >
          <ChevronLeftIcon className="size-5 text-primary" />
        </Button>
        <div className="flex items-center gap-4">
          <p className="text-sm font-medium">{format(parklotDate!, "PPPP")}</p>
          {/* <Button size="icon" variant="ghost">
            <CalendarDaysIcon className="size-5 text-primary" />
          </Button> */}
          <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <PopoverTrigger asChild>
              <Button size="icon" variant="ghost">
                <CalendarDaysIcon className="size-5 text-primary" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={new Date(parklotDate!)}
                onSelect={(selectedDay) => {
                  // console.log("selectedDay", selectedDay);
                  dispatch(
                    setParklotDate(new Date(selectedDay!).toISOString()),
                  );
                  // dispatch(fetchRequestsByDate(selectedDay));
                  // dispatch(fetchRequestsByDate(selectedDay));

                  // const newStartTime = updateDateKeepingTime(
                  //   request?.start_time_window,
                  //   selectedDay!,
                  // );

                  // const newEndTime = updateDateKeepingTime(
                  //   request?.end_time_window,
                  //   selectedDay!,
                  // );

                  // dispatch(
                  //   setRequest({
                  //     moving_date: new Date(selectedDay!).toISOString(),
                  //     start_time_window: newStartTime,
                  //     end_time_window: newEndTime,
                  //   }),
                  // );
                  setIsCalendarOpen(false);
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <Button
          size="icon"
          variant="ghost"
          onClick={() => {
            const newDate = new Date(parklotDate!);
            newDate.setDate(newDate.getDate() + 1);
            dispatch(setParklotDate(new Date(newDate).toISOString()));
            // dispatch(fetchRequestsByDate(new Date(newDate)));
          }}
        >
          <ChevronRightIcon className="size-6 text-primary" />
        </Button>
      </div>
      <div className="bg-background">
        <ScrollArea className="relative h-full w-full">
          <div className="grid h-full w-full auto-rows-min grid-cols-16">
            <div className="mb-2 flex items-end justify-center text-muted-foreground">
              {isLoading && (
                <LoaderCircleIcon className="mr-2 size-4 animate-spin" />
              )}
            </div>

            <div className="row-span-3 grid grid-rows-subgrid">
              <div className="grid h-14 -translate-x-2 grid-cols-15-custom items-end">
                {timeSlots.map((time, index) => (
                  <div key={index} className="relative">
                    <div className="flex items-center gap-1 pb-2">
                      <div className="text-xs font-semibold">{time.digit}</div>
                      <div className="text-xs text-muted-foreground">
                        {time.suffix}
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-[7px] h-1.5 border-l"></div>
                  </div>
                ))}
              </div>
              <div className="flex-1 overflow-hidden border-t">
                {parklotTruks.map((truck, truckIndex) => {
                  const req =
                    parklotRequests?.filter((r) =>
                      r.truck_ids.includes(truck.id),
                    ) ?? [];
                  return (
                    <div key={truckIndex} className="relative flex">
                      {Array(30)
                        .fill(null)
                        .map((_, index) => (
                          <div
                            key={index}
                            className="h-14 w-20 flex-none border-b border-r"
                          />
                        ))}
                      {req?.map((currentReq, reqIndex) => {
                        const startSlotIndex = getTimeSlotIndex(
                          currentReq?.start_time_window,
                        );
                        const durationSlots =
                          (currentReq.work_time.max + currentReq.travel_time) /
                          15;
                        return (
                          <Popover key={reqIndex}>
                            <PopoverTrigger asChild>
                              <div
                                // onClick={() => {
                                //   navigate(`/crm/requests/${currentReq.id}`);
                                // }}
                                key={reqIndex}
                                // className="absolute top-1/2 flex h-11 -translate-y-1/2 transform items-center justify-center rounded bg-green-600 text-xs font-semibold text-white shadow-inner"
                                className={cn(
                                  "absolute top-1/2 flex h-10 -translate-y-1/2 transform items-center justify-start gap-2 rounded-sm px-2 text-xs font-semibold text-white hover:cursor-pointer",
                                  statusColors[currentReq.status as TStatus],
                                  request!.id === currentReq.id &&
                                    "z-10 rounded-none border-4 border-dashed border-white",
                                )}
                                style={{
                                  left: `${(startSlotIndex / 4) * 5}rem`,
                                  width: `${(durationSlots / 4) * 5}rem`,
                                }}
                              >
                                <div className="flex items-center gap-1">
                                  <TicketIcon className="mr-1 size-4" />#
                                  {currentReq.id}
                                </div>
                                <div className="flex items-center gap-1">
                                  <UsersIcon className="mr-1 size-4" />
                                  {currentReq.crew_size}
                                </div>
                                <div className="h-6 w-[1px] border border-white/30" />
                                <div className="flex items-center gap-1">
                                  <div className="flex size-7 items-center justify-center rounded-full bg-black/10 p-1.5 shadow">
                                    {currentReq?.customer?.first_name &&
                                      currentReq.customer.first_name[0]}
                                    {currentReq?.customer?.first_name &&
                                      currentReq.customer?.last_name[0]}
                                  </div>
                                  <p>{currentReq.customer?.first_name}</p>
                                  <p>{currentReq.customer?.last_name}</p>
                                </div>
                                <div className="h-6 w-[1px] border border-white/30" />
                              </div>
                            </PopoverTrigger>
                            <PopoverContent className="space-y-4 text-sm text-muted-foreground">
                              <div className="space-y-1.5">
                                <div className="rounded bg-muted px-4 py-2 text-black">
                                  # {currentReq.id}
                                </div>
                                <div className="flex items-center gap-3">
                                  <UserRoundIcon className="size-4" />
                                  <div>
                                    {currentReq?.customer?.first_name}{" "}
                                    {currentReq?.customer?.last_name}
                                  </div>
                                </div>

                                <div className="flex items-center gap-3">
                                  <MapPinIcon className="size-4" />
                                  <div>
                                    From: {currentReq.origin.city},{" "}
                                    {currentReq.origin.state}{" "}
                                    {currentReq.origin.zip}
                                  </div>
                                </div>

                                <div className="flex items-center gap-3">
                                  <MapPinIcon className="size-4" />
                                  <div>
                                    To: {currentReq.destination.city},{" "}
                                    {currentReq.destination.state}{" "}
                                    {currentReq.destination.zip}
                                  </div>
                                </div>

                                <div className="flex items-center gap-3">
                                  <CalendarDaysIcon className="size-4" />
                                  <div>
                                    {formatDate(currentReq.moving_date)}
                                  </div>
                                </div>

                                <div className="flex items-center gap-3">
                                  <Clock4Icon className="size-4" />
                                  <div>
                                    {formatTimeWindow(
                                      currentReq.start_time_window,
                                    )}{" "}
                                    -{" "}
                                    {formatTimeWindow(
                                      currentReq.end_time_window,
                                    )}
                                  </div>
                                </div>

                                <div className="flex items-center gap-3">
                                  <SettingsIcon className="size-4" />
                                  <div>{formatMoney(currentReq.rate)}/hour</div>
                                </div>

                                <div className="flex items-center gap-3">
                                  <TruckIcon className="size-4" />
                                  <TimeDisplay time={currentReq.work_time} />
                                </div>

                                <div className="flex items-center gap-3">
                                  <MapIcon className="size-4" />
                                  <div>
                                    {convertMinutesToHoursAndMinutes(
                                      currentReq.travel_time || 0,
                                    )}
                                  </div>
                                </div>

                                <div className="grid grid-cols-2">
                                  <div className="flex items-center gap-3">
                                    <UsersIcon className="size-4" />
                                    <div>{currentReq.crew_size}</div>
                                  </div>

                                  <div className="flex items-center gap-3">
                                    <TruckIcon className="size-4" />
                                    <div>{currentReq.truck_ids.length}</div>
                                  </div>
                                </div>
                              </div>
                              {currentReq.id !== request?.id && (
                                <Button
                                  size="sm"
                                  onClick={() => {
                                    navigate(`/crm/requests/${currentReq.id}`);
                                  }}
                                >
                                  View request
                                </Button>
                              )}
                            </PopoverContent>
                          </Popover>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="sticky left-0 z-20 border-t">
              <div>
                {parklotTruks.map((truck, index) => (
                  <div
                    key={index}
                    className={cn(
                      "flex h-14 cursor-pointer items-center justify-center border-b border-r bg-muted text-sm font-semibold",
                      truckIds.includes(truck.id) && "bg-primary text-white",
                    )}
                    onClick={(e) => {
                      e.stopPropagation();
                      const newSelectedTrucks = truckIds.includes(truck.id)
                        ? truckIds.filter((id) => id !== truck.id)
                        : [...truckIds, truck.id];

                      // console.log("newSelectedTrucks", newSelectedTrucks);
                      dispatch(
                        setRequest({
                          truck_ids: newSelectedTrucks,
                        }),
                      );

                      // const newReq = { ...request, truck_ids: newSelectedTrucks };

                      // handleToggleRequest(truck.id);

                      // if (newSelectedTrucks.length === 0) {
                      //   setTruckRequests((prev) =>
                      //     prev.filter((item) => item.id !== newReq.id),
                      //   );
                      // } else {
                      //   setTruckRequests((prev) => [
                      //     ...prev.filter((item) => item.id !== newReq.id),
                      //     newReq,
                      //   ]);
                      // }
                      // setTruckRequests((prev) => [
                      //   ...prev,
                      //   { ...request, truck_ids: newSelectedTrucks },
                      // ]);
                      // setRequests((prev) => [...prev, request]);
                    }}
                  >
                    {truck.name}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </>
  );
}

type TimeSlot = {
  digit: string;
  suffix: string;
};

function generateTimeSlots(
  startTime: Date,
  endTime: Date,
  interval: number,
): TimeSlot[] {
  const times = [];
  let current = startTime;

  while (current <= endTime) {
    const formattedTime = current.toLocaleString("en-US", {
      hour: "2-digit",
      hour12: true,
    });

    const [digit, suffix] = formattedTime.split(" ");
    times.push({ digit, suffix });
    current.setMinutes(current.getMinutes() + interval);
  }

  return times;
}

// const getTimeSlotIndex = (startTime: any) => {
//   const [hours, minutes] = startTime.split(":").map(Number);
//   const baseIndex = (hours - 7) * 4;
//   const minuteIndex = minutes / 15;
//   return baseIndex + minuteIndex;
// };

function getTimeSlotIndex(startTime: number): number {
  const date = new Date(startTime * 1000);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  return (hours - 7) * 4 + Math.floor(minutes / 15);
}

// const getTimeSlotIndex = (startTime: any) => {
//   const [hours, minutes] = startTime.split(":").map(Number);
//   return (hours - 7) * 4 + Math.floor(minutes / 15);
// };

// const TruckGrid = ({ trucks }: { trucks: any }) => {
//   return (
//     <div className="flex">
//       {/* Truck Names */}
//       <div className="w-36">
//         <div className="h-10 border-b bg-transparent"></div>
//         {trucks.map((truck, index) => (
//           <div key={index} className="h-12 border-b border-gray-300 p-2">
//             {truck.name}
//           </div>
//         ))}
//       </div>

//       {/* Time Grid */}
//       <div className="z-50 flex-1 overflow-x-auto">
//         <div className="flex border-b border-gray-300">
//           {timeSlots1.map((slot, index) => (
//             <div
//               key={index}
//               className="relative h-10 w-20 flex-none text-center"
//             >
//               <span>{slot}</span>
//               <div className="absolute left-0 top-0 h-full w-px bg-gray-300"></div>
//             </div>
//           ))}
//         </div>
//         {trucks.map((truck, truckIndex) => (
//           <div key={truckIndex} className="relative flex">
//             {Array(30)
//               .fill(null)
//               .map((_, index) => (
//                 <div
//                   key={index}
//                   className="h-12 w-20 flex-none border-b border-r border-gray-300"
//                 />
//               ))}
//             {truck.requests.map((request, reqIndex) => {
//               const startSlotIndex = getTimeSlotIndex(request.startTime);
//               const durationSlots = request.duration / 15;
//               console.log(startSlotIndex);
//               // Each slot represents 15 minutes
//               return (
//                 <div
//                   key={reqIndex}
//                   className="absolute bg-green-500 text-center text-white"
//                   style={{
//                     left: `${(startSlotIndex / 4) * 5}rem`,
//                     width: `${(durationSlots / 4) * 5}rem`,
//                     height: "3rem", // Adjust the height as needed
//                     top: 0,
//                   }}
//                 >
//                   {request.startTime} - {request.duration / 60}h
//                 </div>
//               );
//             })}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

function TimeDisplay({ time }: { time: { min: number; max: number } }) {
  const { min, max } = time;

  // Determine the formatted time string based on min and max values
  const minTime = convertMinutesToHoursAndMinutes(min);
  const maxTime = convertMinutesToHoursAndMinutes(max);

  // Conditionally render based on the max value
  if (max === 0) {
    return minTime;
  } else {
    return `${minTime} - ${maxTime}`;
  }
}
