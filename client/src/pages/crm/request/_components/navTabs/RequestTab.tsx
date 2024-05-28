import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { floorOptions } from "@/constants/request";
import { useModal } from "@/hooks/useModal";
import {
  convertMinutesToHoursAndMinutes,
  formatDate,
  formatMoney,
} from "@/lib/utils";
import { ModalType } from "@/slices/modal";
import { useSelector } from "@/store";
import { HomeIcon, MapPinIcon, PlusIcon, SquarePenIcon } from "lucide-react";
import DateTimeSection from "../DateTimeSection";
import Notes from "../Notes";
import PageFooter from "../PageFooter";
import StatusServiceSection from "../StatusServiceSection";

const packingIcons = {
  1: "",
  2: "👜",
  3: "📦",
} as any;

export default function RequestTab() {
  const { services, packings } = useSelector((state) => state.globalSettings);
  const { request } = useSelector((state) => state.request);
  const { openModal } = useModal();

  const packing = packings.find((p) => p.id === request?.packing_id);
  const service = services.find((s) => s.id === request?.service_id);

  const onMoveSizeAction = (e: React.MouseEvent, action: ModalType) => {
    e.stopPropagation();
    openModal(action, {
      size: request?.size,
    });
  };

  const onDepositAction = (e: React.MouseEvent, action: ModalType) => {
    e.stopPropagation();
    openModal(action, {
      deposit: request?.deposit,
    });
  };

  const onAction = (e: React.MouseEvent, action: ModalType) => {
    e.stopPropagation();
    openModal(action, {
      packing_id: request?.packing_id,
    });
  };

  // if (!request) return null;

  return (
    <div className="bg-muted">
      <DateTimeSection />
      <StatusServiceSection />
      <div className="grid grid-cols-1 gap-6 px-2 md:grid-cols-3 md:px-4">
        <div className="md:col-span-2">
          <Card>
            <CardContent className="space-y-6 p-4 md:p-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-4 text-sm font-medium text-muted-foreground">
                    <MapPinIcon className="size-5" />
                    <div className="flex flex-1 items-center justify-between">
                      <p>Origin</p>
                      <p className="text-primary">View Map</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-12 gap-2 md:pl-6">
                    <div className="col-span-8">
                      <Input
                        defaultValue={request?.origin.street}
                        placeholder="Street"
                      />
                    </div>
                    <div className="col-span-4">
                      <Input
                        defaultValue={request?.origin.apt}
                        placeholder="Apt."
                      />
                    </div>
                    <div className="col-span-6">
                      <Input
                        defaultValue={request?.origin.city}
                        placeholder="City"
                      />
                    </div>
                    <div className="col-span-3">
                      <Input
                        defaultValue={request?.origin.state}
                        placeholder="State"
                      />
                    </div>
                    <div className="col-span-3">
                      <Input
                        defaultValue={request?.origin.zip}
                        placeholder="Zip"
                      />
                    </div>
                    <div className="col-span-12">
                      <Select defaultValue={request?.origin.floor}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select floor" />
                        </SelectTrigger>
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
                    </div>
                    <div className="col-span-12 mt-2">
                      <Button
                        variant="outline"
                        className="w-full border-dashed shadow-none"
                      >
                        <PlusIcon className="mr-2 size-5" />
                        Add extra pickup
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-4 text-sm font-medium text-muted-foreground">
                    <MapPinIcon className="size-5" />
                    <div className="flex flex-1 items-center justify-between">
                      <p>Destination</p>
                      <p className="text-primary">Total distance 2.7 miles</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-12 gap-2 md:pl-6">
                    <div className="col-span-8">
                      <Input
                        defaultValue={request?.destination.street}
                        placeholder="Street"
                      />
                    </div>
                    <div className="col-span-4">
                      <Input
                        defaultValue={request?.destination.apt}
                        placeholder="Apt."
                      />
                    </div>
                    <div className="col-span-6">
                      <Input
                        defaultValue={request?.destination.city}
                        placeholder="City"
                      />
                    </div>
                    <div className="col-span-3">
                      <Input
                        defaultValue={request?.destination.state}
                        placeholder="State"
                      />
                    </div>
                    <div className="col-span-3">
                      <Input
                        defaultValue={request?.destination.zip}
                        placeholder="Zip"
                      />
                    </div>
                    <div className="col-span-12">
                      <Select defaultValue={request?.destination.floor}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select floor" />
                        </SelectTrigger>
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
                    </div>
                    <div className="col-span-12 mt-2">
                      <Button
                        variant="outline"
                        className="w-full border-dashed shadow-none"
                      >
                        <PlusIcon className="mr-2 size-5" />
                        Add extra dropoff
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              <Separator />
              <Notes />
              <Separator />
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2">
                  <div className="space-y-1 text-sm md:col-span-1">
                    <div className="flex items-baseline justify-between">
                      <p className="font-medium">Request</p>
                      <p>#{request?.id}</p>
                    </div>
                    <div className="flex items-baseline justify-between">
                      <p className="font-medium">Client</p>
                      <div className="text-right">
                        <p>
                          {request?.customer?.first_name}{" "}
                          {request?.customer?.last_name}
                        </p>
                        <p>{request?.customer?.phone}</p>
                        <p>{request?.customer?.email}</p>
                      </div>
                    </div>
                    <div className="flex items-baseline justify-between">
                      <p className="font-medium">Date</p>
                      <p>{formatDate(request?.moving_date)}</p>
                    </div>
                    <div className="flex items-baseline justify-between">
                      <p className="font-medium">Start time</p>
                      <p>To be determined</p>
                    </div>
                    <div className="flex items-baseline justify-between">
                      <p className="font-medium">Hourly rate</p>
                      <p>{formatMoney(request?.rate || 0)}</p>
                    </div>
                    <div className="flex items-baseline justify-between">
                      <p className="font-medium">Crew size</p>
                      <p>{request?.crew_size} movers</p>
                    </div>
                    <div className="flex items-baseline justify-between">
                      <p className="font-medium">Travel time</p>
                      <p>
                        {convertMinutesToHoursAndMinutes(
                          request?.travel_time || 0,
                        )}
                      </p>
                    </div>

                    <div className="flex items-baseline justify-between">
                      <p className="font-medium">Estimated labor time</p>
                      <p>
                        <TimeDisplay time={request?.work_time!} />
                      </p>
                    </div>

                    <div className="flex items-baseline justify-between">
                      <p className="font-medium">Estimated total time</p>
                      <p>
                        <TimeDisplay time={request?.total_time!} />
                      </p>
                    </div>

                    <div className="flex items-baseline justify-between">
                      <p className="font-medium">Estimated quote</p>
                      <p>
                        {service?.name === "Flat Rate" ? (
                          <PriceDisplayFlatRate price={request!.total_price} />
                        ) : (
                          <PriceDisplayLocal price={request!.total_price} />
                        )}
                      </p>
                    </div>
                    <div className="flex items-baseline justify-between">
                      <p className="font-medium">Paid deposit</p>
                      <p>0</p>
                    </div>
                  </div>
                </div>
                <Separator />
                <div className="grid grid-cols-1 gap-6 text-sm md:grid-cols-2">
                  <div>
                    <p>
                      <span className="mr-2 font-bold">Origin</span>(
                      {request?.origin.floor})
                    </p>
                    <div>
                      <p>{request?.origin.street}</p>
                      <p>
                        {request?.origin.city}, {request?.origin.state}{" "}
                        {request?.origin.zip}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p>
                      <span className="mr-2 font-bold">Destination</span>(
                      {request?.destination.floor})
                    </p>
                    <div>
                      <p>{request?.destination.street}</p>
                      <p>
                        {request?.destination.city},{" "}
                        {request?.destination.state} {request?.destination.zip}
                      </p>
                    </div>
                  </div>
                </div>
                <Separator />
                <div className="flex justify-between text-sm">
                  <p className="font-bold uppercase">Additional Details</p>
                  <p>N/A</p>
                </div>
                <Separator />
                <div className="flex justify-between text-sm">
                  <p className="font-bold uppercase">Packing</p>
                  <p>{packing && packing.name}</p>
                </div>
                <Separator />
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex size-10 items-center justify-center rounded-full bg-muted p-2">
                  <HomeIcon className="size-5" />
                </div>
                <div>
                  <CardTitle className="flex items-center gap-4">
                    {request?.size}
                  </CardTitle>
                  <CardDescription>676 cbf, 50 items, 8 boxes</CardDescription>
                </div>
              </div>
              <Button
                variant="edit"
                size="sm"
                onClick={(e) => onMoveSizeAction(e, "editMoveSize")}
                className="right-4 top-4 mt-0"
              >
                <SquarePenIcon className="mr-2 size-3" />
                Edit
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="text-xs font-medium [&>*:nth-child(odd)]:bg-muted">
                <div
                  className="group flex items-center justify-between px-6 py-3 hover:cursor-pointer hover:bg-muted"
                  onClick={(e) => onDepositAction(e, "editDeposit")}
                >
                  <p className="text-muted-foreground group-hover:text-accent-foreground">
                    Reservation price
                  </p>
                  <p className="group-hover:text-primary">
                    {formatMoney(request?.deposit!)}
                  </p>
                </div>
                <div
                  className="group flex items-center justify-between px-6 py-3 hover:cursor-pointer hover:bg-muted"
                  onClick={(e) => onAction(e, "editPacking")}
                >
                  <p className="text-muted-foreground group-hover:text-accent-foreground">
                    Packing
                  </p>
                  <p className="group-hover:text-primary">
                    <span className="mr-2">
                      {packingIcons[request?.packing_id!]}
                    </span>
                    {packing?.name}
                  </p>
                </div>
                <div className="flex items-center justify-between px-6 py-3">
                  <p className="text-muted-foreground">Extra services</p>
                  <p>$100.00</p>
                </div>
                <div className="flex items-center justify-between px-6 py-3">
                  <p className="text-muted-foreground">Reservation price</p>
                  <p>$100.00</p>
                </div>
                <div className="flex items-center justify-between px-6 py-3">
                  <p className="text-muted-foreground">Reservation price</p>
                  <p>$100.00</p>
                </div>
                <div className="flex items-center justify-between px-6 py-3">
                  <p className="text-muted-foreground">Reservation price</p>
                  <p>$100.00</p>
                </div>
                <div className="flex items-center justify-between px-6 py-3">
                  <p className="text-muted-foreground">Reservation price</p>
                  <p>$100.00</p>
                </div>
                <div className="flex items-center justify-between px-6 py-3">
                  <p className="text-muted-foreground">Reservation price</p>
                  <p>$100.00</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-slate-900 p-0 text-white">
              <div className="flex w-full items-center justify-between px-6 py-3 text-sm font-bold">
                <p>Total price</p>
                <p>
                  {service?.name === "Flat Rate" ? (
                    <PriceDisplayFlatRate price={request!.total_price} />
                  ) : (
                    <PriceDisplayLocal price={request!.total_price} />
                  )}
                </p>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
      <PageFooter />
    </div>
  );
}

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

function PriceDisplayLocal({ price }: { price: { min: number; max: number } }) {
  const { min, max } = price;

  // Determine the formatted time string based on min and max values
  const minPrice = formatMoney(min);
  const maxPrice = formatMoney(max);

  // Conditionally render based on the max value
  if (max === 0) {
    return minPrice;
  } else {
    return `${minPrice} - ${maxPrice}`;
  }
}

function PriceDisplayFlatRate({
  price,
}: {
  price: { min: number; max: number };
}) {
  const { min, max } = price;

  const maxPrice = formatMoney(max);

  if (max === 0 || min === 0) {
    return "To be determined";
  } else {
    return maxPrice;
  }
}
