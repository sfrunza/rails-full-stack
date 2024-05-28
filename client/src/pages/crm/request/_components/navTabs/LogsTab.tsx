import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
// import { Card, CardContent } from "@/components/ui/card";
// import { TStop } from "@/types/request";
import { format } from "date-fns";
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
                <AccordionContent className="p-2">
                  <pre className="text-xs">
                    {JSON.stringify(version.audited_changes, null, 2)}
                  </pre>
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

// function StopList({ stops }: { stops: TStop[][] }) {
//   // console.log(stops);
//   return (
//     <Card className="border shadow">
//       <CardContent className="p-6">
//         <p className="font-semibold capitalize">Stops:</p>
//         <div>
//           {stops.map((stopGroup, index) => {
//             let text = index === 0 ? "From" : "To";

//             return (
//               <div key={`${index}-stop-list`} className="flex gap-1">
//                 <p className="text-muted-foreground">{text}:</p>
//                 <div className="flex flex-col overflow-hidden text-green-600">
//                   {stopGroup.map((stop, innerIndex) => {
//                     let type = stop.isPickup ? "Pickup" : "Dropoff";
//                     return (
//                       <p key={`${innerIndex}-stop-group`} className="truncate">
//                         <span className="mr-2 font-semibold">{type}</span>
//                         {stop.street} {stop.city} {stop.state} {stop.zip}
//                       </p>
//                     );
//                   })}
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </CardContent>
//     </Card>
//   );
// }

// function ArrayWithStringValues({
//   name,
//   values,
// }: {
//   name: string;
//   values: string[];
// }) {
//   return (
//     <Card className="border shadow">
//       <CardContent className="p-6">
//         <p className="font-semibold capitalize">{name}:</p>
//         <p className="text-muted-foreground">
//           From: <span className="text-green-600">{values[0]}</span>
//         </p>
//         <p className="text-muted-foreground">
//           To: <span className="text-green-600">{values[1]}</span>
//         </p>
//       </CardContent>
//     </Card>
//   );
// }
