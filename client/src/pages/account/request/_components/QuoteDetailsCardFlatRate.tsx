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
import { formatDate, formatMoney } from "@/lib/utils";
import { CheckCircleIcon, ChevronRightIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { useSelector } from "@/store";

export default function QuoteDetailsCardFlatRate() {
  const { request } = useSelector((state) => state.request);
  if (!request) return null;

  const { id, moving_date, status, total_price } = request;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quote Details Flat Rate</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between text-sm lg:grid lg:grid-cols-12">
              <p className="col-span-4">Moving Date</p>
              <p className="font-medium lg:col-span-8">
                {formatDate(moving_date)}
              </p>
            </div>

            <div className="flex items-center justify-between text-sm lg:grid lg:grid-cols-12">
              <p className="col-span-4">Start Time</p>
              <p className="font-medium lg:col-span-8">{"8AM" || "TBD"}</p>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-sm lg:grid lg:grid-cols-12">
              <p className="col-span-4">Delivery Date</p>
              <p className="font-medium lg:col-span-8">
                {formatDate(moving_date)}
              </p>
            </div>

            <div className="flex items-center justify-between text-sm lg:grid lg:grid-cols-12">
              <p className="col-span-4">Start Time</p>
              <p className="font-medium lg:col-span-8">{"8AM" || "TBD"}</p>
            </div>
          </div>
        </div>
        <Separator className="my-2" />

        <div className="my-4 flex flex-col items-center justify-between lg:grid lg:grid-cols-12">
          <p className="col-span-4 text-center lg:text-left">Flat Rate</p>
          <p className="text-xl font-semibold lg:col-span-8">
            <PriceDisplay price={total_price} />
          </p>
        </div>

        <Separator className="my-2" />
        <ul className="my-6 space-y-3 text-sm">
          <li className="flex items-center gap-4">
            <CheckCircleIcon className="size-4 text-green-600" />
            Our employees and our trucks.
          </li>
          <li className="flex items-center gap-4">
            <CheckCircleIcon className="size-4 text-green-600" />
            Absolutely no surpises at the end.
          </li>
          <li className="flex items-center gap-4">
            <CheckCircleIcon className="size-4 text-green-600" />
            First class customer service.
          </li>
          <li className="flex items-center gap-4">
            <CheckCircleIcon className="size-4 text-green-600" />
            Guaranteed flat price.
          </li>
        </ul>
        <Drawer>
          <DrawerTrigger asChild className="mt-4">
            <Button variant="edit">Learn More</Button>
          </DrawerTrigger>
          <DrawerContent>
            <ScrollArea className="h-[80vh]">
              <div className="mx-auto mb-10 max-w-2xl space-y-4 p-6 text-sm">
                <p>
                  No ballpark estimates or hourly rates. This is the exact price
                  based on your move details.
                </p>

                <p className="text-primary">
                  There are no hidden fees or charges.
                </p>

                <p>
                  Moving blankets, dollies, tools and fuel are FREE of charge.
                </p>

                <p className="font-semibold uppercase">How do we work?</p>

                <p>
                  We offer single-load service to all long-distance moves. Your
                  shipment is being picked up, transported and delivered only by
                  our company.
                </p>
                <p>
                  There are no third parties involved in the
                  transportation/delivery.
                </p>
                <p>
                  Many moving companies will load with one group, another worker
                  will drive, and then they&apos;ll hire a new group of workers
                  to unload at the delivery. This is of course a very economical
                  way on one side.
                </p>
                <p>
                  On the other, there is a bigger chance, that something will
                  get damaged or lost when third party is involved. We
                  don&apos;t take your stuff to a hub and put it on a different
                  truck and then switch it again and again.
                </p>
                <p>
                  This eliminates confusion, contamination, chances of something
                  will get damaged and you always know where your goods are, who
                  has your goods, and when they are going to arrive.
                </p>
                <p>We expect you to empty all drawers of the furniture.</p>
                <p>
                  Should there be changes in the scope of your work, the charges
                  will be adjusted accordingly.
                </p>
                <p>
                  Cost of service is binding to the list of items and will not
                  exceed the amount indicated.
                </p>
                <p>
                  In the event unknown additional services are required to
                  effect delivery, these costs will be in addition to the amount
                  stated. Such services and applicable charges will be based
                  upon the tariff rates in effect on the date of this estimate.
                </p>

                <p className="font-semibold uppercase">Packing Options</p>
                <ol className="list-decimal space-y-2 px-4">
                  <li>
                    Self packing. All boxes have to be packed by you, the
                    customer, prior to the pick up. Our company will handle all
                    the furniture disassembly, wrapping and reassembly on the
                    other end.
                  </li>
                  <li>
                    Partial Packing. All boxes would have to be packed by you,
                    the customer, with the exception of the company packaging
                    listed on the "Inventory" or indicated under "Additional
                    services". Last minute partial packing is prorated at
                    $20/box for the services. Cost of supplies is determined
                    based on the actual usage.
                  </li>
                  <li>
                    Company Packing. All boxes will be packed by Our company.
                  </li>
                </ol>

                <p className="font-semibold">PLEASE NOTE:</p>

                <p>
                  This estimate is valid for 30 days from the date of issue.
                </p>

                <p>
                  Our company operates on first-comes, first-served basis,
                  therefore we do not guarantee any availability for a not
                  confirmed move.
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

function PriceDisplay({ price }: { price: { min: number; max: number } }) {
  const { min, max } = price;

  const maxPrice = formatMoney(max);

  if (max === 0 || min === 0) {
    return "To be determined";
  } else {
    return maxPrice;
  }
}
