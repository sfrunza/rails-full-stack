import { updateRequest } from "actions/requests";
import { Button } from "components/ui/button";
import { default as StartTimeInput } from "components/StartTimeInput";
import WorkTimeInput, {
  generateWorkTimeOptions,
} from "components/WorkTimeInput";
import { Calendar } from "components/ui/calendar";
import { Card, CardContent } from "components/ui/card";
import { Input } from "components/ui/input";
import { Label } from "components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";
import { cn, formatDate } from "lib/utils";
import {
  CalendarIcon,
  Clock9Icon,
  DollarSignIcon,
  MapIcon,
  TruckIcon,
  UserRoundIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { setRequest, updateStoreRequest } from "slices/request";
import { useDispatch, useSelector } from "store";
import useSWR from "swr";
import BackButton from "./_components/BackButton";
import { statusColors, statusOptions } from "constants/request";
import { TFullRequest, TStatus } from "types/request";
import RequestChannelSubscription from "./RequestChannelSubscription";
import AdminPage from "./_components/AdminPage";

export default function Request() {
  // const { services } = useSelector((state) => state.globalSettings);
  // const { request } = useSelector((state) => state.request);
  // const dispatch = useDispatch();
  const { id } = useParams<{ id: string }>();
  // const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  // const { data, isLoading, error, mutate } = useSWR<TFullRequest>(
  //   `/requests/${id}`,
  //   {
  //     onSuccess: (data) => {
  //       dispatch(setRequest(data));
  //     },
  //   },
  // );

  function handleUpdateRequest() {
    // updateRequest(data?.id!, request!).then((res) => {
    //   if (res?.error) {
    //     alert(res.error);
    //     return;
    //   }
    //   alert("Request updated");
    // });
  }

  // function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
  //   const { name, value } = e.target;
  //   dispatch(updateStoreRequest({ [name]: value }));
  // }

  // if (error) return <div>{error.message}</div>;
  // if (isLoading) return <div>loading...</div>;

  // console.log("Min", request?.work_time.min);
  // console.log("MAX", request?.work_time.max);
  // console.log("start_time", start_time);

  // console.log("request", request);

  return (
    <div className="relative space-y-4 px-4 lg:px-6">
      <BackButton />
      {/* <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-6">
        <h1 className="text-xl font-bold">
          {request?.customer?.first_name} {request?.customer?.last_name}
        </h1>
        <a
          href={`tel:${request?.customer?.phone}`}
          className="flex items-center gap-3 text-sm font-semibold text-green-600"
        >
          <PhoneIcon className="size-4" />
          {request?.customer?.phone}
        </a>
        <p className="flex items-center gap-3 text-sm text-muted-foreground">
          <MailIcon className="size-4" />
          {request?.customer?.email}
        </p>
      </div> */}
      {/* <Tabs defaultValue="request" className="md:min-w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="request">Request #{request?.id}</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
        </TabsList>
        <TabsContent value="account">account</TabsContent>
        <TabsContent value="password">password</TabsContent>
      </Tabs> */}
      {/* <p>
        Request ID: <span className="font-semibold">{request?.id}</span>
      </p>
      <p>
        <span className="font-semibold">{request?.service.name}</span>
      </p> */}
      {/* <div className="flex flex-col justify-between gap-4 md:flex-row">
        <div className="flex flex-col gap-4 md:flex-row">
          <Select
            defaultValue={request?.status}
            onValueChange={(val) => {
              dispatch(updateStoreRequest({ status: val }));
            }}
          >
            <SelectTrigger
              className={cn(
                "h-12 w-full px-4 font-medium text-sm text-white md:w-[14rem]",
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
            defaultValue={JSON.stringify(request?.service?.id || "")}
            onValueChange={(val: string) => {
              dispatch(updateStoreRequest({ service_id: val }));
            }}
          >
            <SelectTrigger className="h-12 w-full bg-white px-4 font-medium text-sm md:w-[14rem]">
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
          <Button
            size="lg"
            className="h-12 w-full"
            onClick={() => handleUpdateRequest()}
          >
            Update Request
          </Button>
        </div>
      </div> */}
      {/* <div>
        <Button onClick={() => handleUpdateRequest()}>Save</Button>
      </div> */}
      <div className="grid grid-cols-6 gap-4">
        {/* <div className="col-span-6 md:col-span-4">
          <Card>
            <CardContent>asdasdasd asdasdas</CardContent>
          </Card>
        </div> */}

        {/* details  */}

        {/* <div className="col-span-6 md:col-span-2">
          <Card>
            <CardContent className="flex flex-col gap-4 pt-6">
              <div>
                <Label className="ml-8" htmlFor="movingDate">
                  Move date
                </Label>
                <div className="flex items-center gap-2">
                  <CalendarIcon className="ml-auto size-5 text-muted-foreground" />
                  <Popover
                    open={isCalendarOpen}
                    onOpenChange={setIsCalendarOpen}
                  >
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
                          setIsCalendarOpen(false);
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <div>
                <Label className="ml-8" htmlFor="startTime">
                  Start time window
                </Label>
                <div className="flex items-center gap-2">
                  <Clock9Icon className="ml-auto size-5 text-muted-foreground" />
                  <StartTimeInput
                  // startTime={start_time}
                  // setStartTime={setStartTime}
                  />
                </div>
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
                      value={request?.rate || ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (/^\d*$/.test(value)) {
                          // setRate(Number(value));
                          dispatch(
                            updateStoreRequest({ rate: parseInt(value) }),
                          );
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
              <div>
                <Label className="ml-8" htmlFor="rate">
                  Customer ID
                </Label>
                <div className="flex items-center gap-2">
                  <DollarSignIcon className="ml-auto size-5 text-muted-foreground" />
                  <Input
                    id="rate"
                    pattern="[0-9]+"
                    value={request?.customer_id || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d*$/.test(value)) {
                        // setRate(Number(value));
                        dispatch(
                          updateStoreRequest({
                            customer_id: parseInt(value),
                          }),
                        );
                      }
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div> */}

        <div className="col-span-6 md:col-span-2">
          <Card>
            <CardContent className="pt-6">
              <AdminPage requestId={Number(id)} />
            </CardContent>
          </Card>
        </div>
      </div>
      {/* <RealTimeRequest initialRequest={initialRequest} requestId={id} /> */}
      {/* <RequestChannelSubscription
        requestId={request!.id}
        onUpdateRequest={handleUpdateRequest}
      /> */}
    </div>
  );
}
