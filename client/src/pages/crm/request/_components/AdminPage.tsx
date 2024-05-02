import React, { useEffect, useState } from "react";

import cable from "api/WebSocketConnection";
import { TFullRequest, TStatus } from "types/request";
import { centsToDollars, cn, formatDate } from "lib/utils";
import { Label } from "components/ui/label";
import {
  CalendarIcon,
  DollarSignIcon,
  MapIcon,
  TruckIcon,
  UserRoundIcon,
} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import { Button } from "components/ui/button";
import { Calendar } from "components/ui/calendar";
import { updateRequest } from "actions/requests";
import WorkTimeInput, {
  generateWorkTimeOptions,
} from "components/WorkTimeInput";
import { useDispatch, useSelector } from "store";
import { setRequest, updateStoreRequest } from "slices/request";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "components/ui/select";
import { Input } from "components/ui/input";
import { statusColors, statusOptions } from "constants/request";

export default function AdminPage({ requestId }: { requestId: number }) {
  // const [request, setRequest] = useState<TFullRequest | null>(null);
  const { services } = useSelector((state) => state.globalSettings);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const { request } = useSelector((state) => state.request);
  const dispatch = useDispatch();

  function handleUpdateRequest() {
    updateRequest(requestId, request!).then((res) => {
      if (res?.error) {
        alert(res.error);
        return;
      }
      // alert("Request updated");
    });
  }

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const response = await fetch(`/api/v1/requests/${requestId}`, {
          headers: {
            Accept: "application/json",
            Authorization: localStorage.token,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch request");
        }
        const requestData = await response.json();
        // setRequest(requestData);
        dispatch(setRequest(requestData));
      } catch (error) {
        console.error("Error fetching request:", error);
      }
    };

    fetchRequest();
    // Subscribe to channel
    const channel = cable.subscriptions.create(
      { channel: "RequestChannel", request_id: requestId },
      {
        connected() {
          console.log("Connected to RequestChannel");
        },
        disconnected() {
          console.log("Disconnected from RequestChannel");
        },
        received(data) {
          console.log("Admin view received:", data);
          // Update request state with the received data
          // setRequest(data);
          dispatch(setRequest(data));
          // console.log('Received data from RequestChannel:', data);
          if (data.action === "update" && data.id === requestId) {
            console.log("Received data from RequestChannel 2:", data);
            // onUpdateRequest && onUpdateRequest(data.request);
          }
        },
      },
    );

    return () => {
      // Unsubscribe from the channel when component unmounts
      channel.unsubscribe();
      dispatch(setRequest(null));
    };
  }, [requestId]);

  return (
    <div>
      <h2>Customer View</h2>
      {request ? (
        <div>
          <p>Request ID: {request.id}</p>
          <p>moving date: {formatDate(request.moving_date)}</p>
          <div className="flex flex-col gap-4 md:flex-row">
            <Select
              defaultValue={request?.status}
              onValueChange={(val) => {
                dispatch(updateStoreRequest({ status: val }));
              }}
            >
              <SelectTrigger
                className={cn(
                  "h-12 w-full px-4 text-sm font-medium text-white md:w-[14rem]",
                  statusColors[request?.status as TStatus],
                )}
              >
                <SelectValue placeholder="select status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((status, i) => {
                  return (
                    <SelectItem key={i} value={status}>
                      {status}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            <Select
              defaultValue={JSON.stringify(request?.service_id || "")}
              onValueChange={(val: string) => {
                dispatch(updateStoreRequest({ service_id: val }));
              }}
            >
              <SelectTrigger className="h-12 w-full bg-white px-4 text-sm font-medium md:w-[14rem]">
                <SelectValue placeholder="select status" />
              </SelectTrigger>
              <SelectContent>
                {services.map((service, i) => {
                  return (
                    <SelectItem key={i} value={JSON.stringify(service.id)}>
                      {service.name}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
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
                    selected={request?.moving_date || new Date()}
                    onSelect={(date) => {
                      dispatch(updateStoreRequest({ moving_date: date }));
                      // setRequest({ ...request, moving_date: date });
                      setIsCalendarOpen(false);
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Label className="ml-8" htmlFor="workTime">
                Work time
              </Label>
              <div className="flex items-center gap-2">
                <TruckIcon className="ml-auto size-5 text-muted-foreground" />
                <WorkTimeInput workTime={request?.work_time!} />
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
                    dispatch(
                      updateStoreRequest({ travel_time: parseInt(val) }),
                    );
                  }}
                >
                  <SelectTrigger id="travelTime">
                    <SelectValue placeholder="" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {generateWorkTimeOptions().map((option) => (
                      <SelectItem
                        key={option.value}
                        value={option.value.toString()}
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-between gap-4">
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
                        dispatch(
                          updateStoreRequest({ crew_size: parseInt(value) }),
                        );
                      }
                    }}
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
                    value={centsToDollars(request?.rate) || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d*$/.test(value)) {
                        // setRate(Number(value));
                        dispatch(
                          updateStoreRequest({
                            rate: Math.round(parseFloat(value) * 100),
                          }),
                        );
                      }
                    }}
                  />
                  {/* <Input
                    id="rate"
                    pattern="[0-9]+"
                    value={request?.rate || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d*$/.test(value)) {
                        // setRate(Number(value));
                        dispatch(
                          updateStoreRequest({
                            rate: parseFloat(value),
                          }),
                        );
                      }
                    }}
                  /> */}
                </div>
              </div>

              <div>
                <Label className="ml-8" htmlFor="packingId">
                  Packing ID
                </Label>
                <div className="flex items-center gap-2">
                  <DollarSignIcon className="ml-auto size-5 text-muted-foreground" />
                  <Input
                    id="packingId"
                    pattern="[0-9]+"
                    value={request?.packing_id}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d*$/.test(value)) {
                        // setRate(Number(value));
                        dispatch(
                          updateStoreRequest({
                            packing_id: Number(value),
                          }),
                        );
                      }
                    }}
                  />
                </div>
              </div>
            </div>
            <div>
              <Button
                size="lg"
                className="h-12 w-full"
                onClick={() => handleUpdateRequest()}
              >
                Update Request
              </Button>
            </div>
            <pre>
              <div>
                <p>Total Time{JSON.stringify(request.total_time, null, 2)}</p>
              </div>

              <p>Total Price{JSON.stringify(request.total_price, null, 2)}</p>
            </pre>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
