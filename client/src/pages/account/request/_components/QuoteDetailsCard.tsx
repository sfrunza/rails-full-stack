import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  convertMinutesToHoursAndMinutes,
  formatDate,
  formatMoney,
} from "@/lib/utils";
import { ChevronRightIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { useSelector } from "@/store";

export default function QuoteDetailsCard() {
  const { services, packings } = useSelector((state) => state.globalSettings);
  const { request } = useSelector((state) => state.request);
  if (!request) return null;

  const {
    id,
    moving_date,
    status,
    service_id,
    packing_id,
    crew_size,
    travel_time,
    rate,
    work_time,
    total_time,
    total_price,
  } = request;

  const service = services.find((s) => s.id === service_id);
  const packing = packings.find((p) => p.id === packing_id);
  const showLaborTime = travel_time + work_time.max > 120;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quote Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          <div className="flex items-center justify-between text-sm lg:grid lg:grid-cols-12">
            <p className="col-span-4">Moving date</p>
            <p className="font-medium lg:col-span-8">
              {formatDate(moving_date)}
            </p>
          </div>

          <div className="flex items-center justify-between text-sm lg:grid lg:grid-cols-12">
            <p className="col-span-4">Start time</p>
            <p className="font-medium lg:col-span-8">{"8AM"}</p>
          </div>

          {moving_date && (
            <div className="flex items-center justify-between text-sm lg:grid lg:grid-cols-12">
              <p className="col-span-4">Delivery date</p>
              <p className="font-medium lg:col-span-8">
                {formatDate(moving_date)}
              </p>
            </div>
          )}

          {moving_date && (
            <div className="flex items-center justify-between text-sm lg:grid lg:grid-cols-12">
              <p className="col-span-4">Delivery time</p>
              <p className="font-medium lg:col-span-8">{"8AM"}</p>
            </div>
          )}
        </div>

        <Separator className="my-2" />

        <div className="space-y-1">
          <div className="flex items-center justify-between text-sm lg:grid lg:grid-cols-12">
            <p className="col-span-4">Service</p>
            <p className="font-medium lg:col-span-8">{service?.name || ""}</p>
          </div>

          <div className="flex items-center justify-between text-sm lg:grid lg:grid-cols-12">
            <p className="col-span-4">Move size</p>
            <p className="font-medium lg:col-span-8">{"1 Berdoom apartment"}</p>
          </div>

          <div className="flex items-center justify-between text-sm lg:grid lg:grid-cols-12">
            <p className="col-span-4">Packing</p>
            <p className="font-medium lg:col-span-8">{packing?.name || ""}</p>
          </div>
        </div>

        <Separator className="my-2" />

        <div className="space-y-1">
          <div className="flex items-center justify-between text-sm lg:grid lg:grid-cols-12">
            <p className="col-span-4">Crew size</p>
            <p className="font-medium lg:col-span-8">{crew_size} movers</p>
          </div>

          <div className="flex items-center justify-between text-sm lg:grid lg:grid-cols-12">
            <p className="col-span-4">Hourly rate</p>
            <p className="font-medium lg:col-span-8">{formatMoney(rate)}/hr</p>
          </div>

          <div className="flex items-center justify-between text-sm lg:grid lg:grid-cols-12">
            <p className="col-span-4">Travel time</p>
            <p className="font-medium lg:col-span-8">
              {convertMinutesToHoursAndMinutes(travel_time)}
            </p>
          </div>

          {showLaborTime && (
            <div className="flex items-center justify-between text-sm lg:grid lg:grid-cols-12">
              <p className="col-span-4">Est. Labor time</p>
              <p className="font-medium lg:col-span-8">
                <TimeDisplay time={work_time} />
              </p>
            </div>
          )}
          <div className="flex items-center justify-between text-sm lg:grid lg:grid-cols-12">
            <p className="lg:col-span-4">Est. Total time</p>
            <p className="font-medium lg:col-span-8">
              <TimeDisplay time={total_time} />
            </p>
          </div>

          <div className="my-4 flex flex-col items-center justify-between lg:grid lg:grid-cols-12">
            <p className="col-span-4 text-center lg:text-left">
              Estimated Quote
            </p>
            <p className="text-xl font-semibold lg:col-span-8">
              <PriceDisplay price={total_price} />
              {/* {formatMoney(total_price.min)}-{formatMoney(total_price.max)} */}
            </p>
          </div>
        </div>
        {request.customer_notes && (
          <>
            <Separator className="my-4" />
            <div className="flex flex-col gap-2">
              <h3 className="font-semibold">Notes</h3>
              <p className="whitespace-pre-line text-sm">
                {request.customer_notes}
              </p>
            </div>
          </>
        )}

        <Separator className="my-4" />
        <p className="text-sm">
          <b className="text-red-600">NOTE:</b>{" "}
          <strong>
            This quote is just an estimate and provided for your convinience
            only.
          </strong>{" "}
          We give you a database average for generally similar moves. However,
          your final cost is based on hourly rate and actual time your move will
          take. Additional time may be required if your move involves long
          walks, narrow stares, furniture disassembly, bad weather conditions,
          etc.
        </p>
        <p className="mt-8 font-semibold">How quote is calculated?</p>
        <Drawer>
          <DrawerTrigger asChild className="mt-4">
            <Button variant="edit">Learn More</Button>
          </DrawerTrigger>
          <DrawerContent>
            <ScrollArea className="h-[80vh]">
              <div className="mx-auto mb-10 max-w-2xl space-y-4 p-6 text-sm">
                <p className="font-semibold uppercase">
                  How quote is calculated?
                </p>
                <p>
                  <span className="font-semibold">Please note:</span> This quote
                  is just an estimate and is provided for your convenience only.
                </p>
                <p>
                  Move cost is based on the size of your shipment and the amount
                  of packing to be performed. By entering the items through the
                  online inventory our system will generate a quote based on a
                  database average for generally similar moves. It is best to
                  consider this as a thinking tool. Your final cost will be
                  based on the actual size of your move and the number of items
                  you need to move.
                </p>
                <p>
                  It is best to consider this a thinking tool. Your final cost
                  will be based on the hourly rate and your move&apos;s actual
                  time. Additional time may be required if your move involves
                  long walks from your apartment to the truck, narrow hallways
                  and/or tight staircases, disassembling and reassembling
                  furniture, hoisting, moving oversized, antique items, ones
                  with glass and/or marble, appliances moving any items over
                  300lb.
                </p>
                <p>
                  It is important to understand, that the move time will also
                  depend on how well you are packed and organized: all drawers
                  of all the furniture must be emptied, and all miscellaneous
                  items packed neatly into moving boxes of correct sizes.
                </p>
              </div>
              <ScrollBar orientation="vertical" />
            </ScrollArea>
          </DrawerContent>
        </Drawer>
      </CardContent>
      <CardFooter className="flex-col items-start p-4">
        {status === "Not Confirmed" && (
          <Button
            size="lg"
            className="w-full rounded-xl py-8 text-base font-semibold"
            asChild
          >
            <Link to={`/account/requests/${id}/confirmation`}>
              Proceed to Confirmation Page
              <ChevronRightIcon className="ml-2 size-5" />
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
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

function PriceDisplay({ price }: { price: { min: number; max: number } }) {
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
