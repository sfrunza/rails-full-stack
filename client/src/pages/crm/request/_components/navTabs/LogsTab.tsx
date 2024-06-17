import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { formatDate, formatMoney } from "@/lib/utils";
// import { Card, CardContent } from "@/components/ui/card";
// import { TStop } from "@/types/request";
import { format } from "date-fns";
import { CircleCheckBigIcon } from "lucide-react";
import useSWR from "swr";

// function isArrayOfStrings(obj: { [key: string]: string[] }, key: string) {
//   // Check if the key exists in the object
//   if (obj.hasOwnProperty(key)) {
//     // Get the value associated with the key
//     const value = obj[key];

//     // Check if the value is an array
//     if (Array.isArray(value)) {
//       // Check if all elements in the array are strings
//       return value.every((item) => typeof item === "string");
//     }
//   }

//   // If key does not exist or value is not an array of strings, return false
//   return false;
// }

type TLog = {
  id: string;
  user_id: number;
  user: {
    first_name: string;
    last_name: string;
  };
  action: string;
  audited_changes: {
    [key: string]: any[];
  };
  created_at: Date;
};

export default function LogsTab({ requestId }: { requestId: number }) {
  const { data, error } = useSWR<TLog[]>(`/requests/${requestId}/versions`);

  console.log(data);

  return (
    <div className="space-y-4 p-4 md:p-6">
      {error && <div>{error.message}</div>}
      <Accordion type="single" collapsible className="w-full">
        {data &&
          data.map((version: TLog, index: number) => {
            return (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex flex-col items-start">
                    <span>Request {version.action}</span>
                    <span className="text-xs text-muted-foreground">
                      {format(version.created_at, "PPpp")}
                      <span className="ml-2 text-green-600">
                        by {version.user.first_name} {version.user.last_name}
                      </span>
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  {/* <pre className="text-xs"> */}
                  {JSON.stringify(version.audited_changes, null, 2)}
                  <DisplayChanges data={version.audited_changes} />
                  {/* </pre> */}
                  {/* <div className="text-xs">
                     {Object.entries(version.audited_changes).map(
                      ([key, value], i) => {
                        if (key === "stops") {
                          return <StopList key={`${key}-${i}`} stops={value} />;
                        }
                        if (isArrayOfStrings(version.audited_changes, key)) {
                          return (
                            <ArrayWithStringValues
                              key={`${key}-${i}`}
                              name={key}
                              values={value}
                            />
                          );
                        }
                        return null;
                      },
                    )} 
                  </div> */}
                </AccordionContent>
              </AccordionItem>
            );
          })}
      </Accordion>
    </div>
  );
}

interface MinMax {
  max: number;
  min: number;
}

interface Details {
  delicate_items_question_answer: string;
  bulky_items_question_answer: string;
  disassemble_items_question_answer: string;
  comments: string;
}
interface Origin {
  street: string;
  city: string;
  state: string;
  zip: string;
  apt?: string;
  floor: string;
  location: google.maps.LatLng | google.maps.LatLngLiteral;
}

interface Data {
  status?: string[];
  moving_date?: Date[];
  service_id?: number[];
  packing_id?: number[];
  work_time?: MinMax[];
  total_time?: MinMax[];
  total_price?: MinMax[];
  min_total_time?: number[];
  details?: Details[];
  size?: string[];
  travel_time?: number[];
  crew_size?: number[];
  rate?: number[];
  origin?: Origin[];
  destination?: Origin[];
  deposit?: number[];
}

interface DisplayChangesProps {
  data: Data;
}

// const formatCurrency = (value: number): string => {
//   return `$${(value / 100).toFixed(2)}`;
// };

function getFullAddress(address: Origin) {
  if (!address || !address.city) return "--";
  return `${address?.street}, ${address?.city}, ${address?.state}, ${address?.zip}`;
}

function getDetails(details: Details) {
  if (!details) return "--";

  // const d = Object.entries(details).map(([key, value]) => {
  //   return `${key}: ${value}`;
  // });

  return (
    <span className="flex flex-col">
      <span>bulky items: {details.bulky_items_question_answer}</span>
      <span>delicate items: {details.delicate_items_question_answer} </span>
      <span>
        disassembly items: {details.disassemble_items_question_answer}
      </span>
      <span>comments: {details.comments}</span>
    </span>
  );
}

function DisplayChanges({ data }: DisplayChangesProps) {
  // const { rate, service_id, move total_price, size } = data;
  const {
    status,
    moving_date,
    // service_id,
    // packing_id,
    // work_time,
    // total_time,
    // total_price,
    // min_total_time,
    details,
    size,
    // travel_time,
    crew_size,
    rate,
    origin,
    destination,
    deposit,
  } = data;

  return (
    <div className="space-y-2">
      {status && (
        <div>
          <div className="flex items-center gap-2">
            <CircleCheckBigIcon className="size-3 text-green-600" />
            <p className="font-semibold">Status:</p>
          </div>
          <div className="pl-5 text-muted-foreground">
            <p>
              From:
              <span className="ml-1 text-green-600">{status[0]}</span>
            </p>
            <p>
              To: <span className="ml-1 text-green-600">{status[1]}</span>
            </p>
          </div>
        </div>
      )}
      {moving_date && (
        <div>
          <div className="flex items-center gap-2">
            <CircleCheckBigIcon className="size-3 text-green-600" />
            <p className="font-semibold">Moving date:</p>
          </div>
          <div className="pl-5 text-muted-foreground">
            <p>
              From:
              <span className="ml-1 text-green-600">
                {formatDate(moving_date[0])}
              </span>
            </p>
            <p>
              To:{" "}
              <span className="ml-1 text-green-600">
                {formatDate(moving_date[1])}
              </span>
            </p>
          </div>
        </div>
      )}
      {rate && (
        <div>
          <div className="flex items-center gap-2">
            <CircleCheckBigIcon className="size-3 text-green-600" />
            <p className="font-semibold">Rate:</p>
          </div>
          <div className="pl-5 text-muted-foreground">
            <p>
              From:
              <span className="ml-1 text-green-600">
                {formatMoney(rate[0])}
              </span>
            </p>
            <p>
              To:{" "}
              <span className="ml-1 text-green-600">
                {formatMoney(rate[1])}
              </span>
            </p>
          </div>
        </div>
      )}
      {size && (
        <div>
          <div className="flex items-center gap-2">
            <CircleCheckBigIcon className="size-3 text-green-600" />
            <p className="font-semibold">Move size:</p>
          </div>
          <div className="pl-5 text-muted-foreground">
            <p>
              From:
              <span className="ml-1 text-green-600">{size[0]}</span>
            </p>
            <p>
              To: <span className="ml-1 text-green-600">{size[1]}</span>
            </p>
          </div>
        </div>
      )}
      {origin && (
        <div>
          <div className="flex items-center gap-2">
            <CircleCheckBigIcon className="size-3 text-green-600" />
            <p className="font-semibold">Origin:</p>
          </div>
          <div className="pl-5 text-muted-foreground">
            <p>
              From:
              <span className="ml-1 text-green-600">
                {getFullAddress(origin[0])}
              </span>
            </p>
            <p>
              To:{" "}
              <span className="ml-1 text-green-600">
                {getFullAddress(origin[1])}
              </span>
            </p>
          </div>
        </div>
      )}
      {destination && (
        <div>
          <div className="flex items-center gap-2">
            <CircleCheckBigIcon className="size-3 text-green-600" />
            <p className="font-semibold">Destination:</p>
          </div>
          <div className="pl-5 text-muted-foreground">
            <p>
              From:
              <span className="ml-1 text-green-600">
                {getFullAddress(destination[0])}
              </span>
            </p>
            <p>
              To:{" "}
              <span className="ml-1 text-green-600">
                {getFullAddress(destination[1])}
              </span>
            </p>
          </div>
        </div>
      )}
      {crew_size && (
        <div>
          <div className="flex items-center gap-2">
            <CircleCheckBigIcon className="size-3 text-green-600" />
            <p className="font-semibold">Crew size:</p>
          </div>
          <div className="pl-5 text-muted-foreground">
            <p>
              From:
              <span className="ml-1 text-green-600">{crew_size[0]}</span>
            </p>
            <p>
              To: <span className="ml-1 text-green-600">{crew_size[1]}</span>
            </p>
          </div>
        </div>
      )}
      {details && (
        <div>
          <div className="flex items-center gap-2">
            <CircleCheckBigIcon className="size-3 text-green-600" />
            <p className="font-semibold">Details:</p>
          </div>
          <div className="pl-5 text-muted-foreground">
            <p>
              From:
              <span className="ml-1 text-green-600">
                {getDetails(details[0])}
              </span>
            </p>
            <p>
              To:{" "}
              <span className="ml-1 text-green-600">
                {getDetails(details[1])}
              </span>
            </p>
          </div>
        </div>
      )}
      {deposit && (
        <div>
          <div className="flex items-center gap-2">
            <CircleCheckBigIcon className="size-3 text-green-600" />
            <p className="font-semibold">Deposit:</p>
          </div>
          <div className="pl-5 text-muted-foreground">
            <p>
              From:
              <span className="ml-1 text-green-600">
                {formatMoney(deposit[0])}
              </span>
            </p>
            <p>
              To:{" "}
              <span className="ml-1 text-green-600">
                {formatMoney(deposit[1])}
              </span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
