import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { cn, formatDate, formatMoney } from "@/lib/utils";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
// import { useSelector } from '@/store';
import { TFullRequest } from "@/types/request";

const statusColors = {
  Confirmed: "text-green-600 bg-green-100",
  Pending: "text-amber-500 bg-orange-100",
  "Pending-info": "text-amber-500 bg-orange-100",
  Canceled: "text-red-600 bg-red-100",
  Expired: "text-slate-800 bg-slate-200",
  Completed: "text-[deepskyblue] bg-sky-100",
  "Not Confirmed": "text-indigo-600 bg-indigo-100",
  "Not Available": "text-slate-800 bg-slate-200",
  Spam: "text-slate-800 bg-slate-200",
};

export function RequestsTable({ requests }: { requests: TFullRequest[] }) {
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState<number | null>(null);

  function handleRowClick(id: number) {
    if (selectedId === id) {
      navigate(`/crm/requests/${id}`);
    } else {
      setSelectedId(id);
    }
  }

  return (
    <div className="min-h-[calc(100vh-250px)]">
      <Table className="min-w-[1850px]">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[70px]">#</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Service</TableHead>
            <TableHead>Move date</TableHead>
            <TableHead>Customer, phone</TableHead>
            <TableHead>Moving from</TableHead>
            <TableHead>Moving to</TableHead>
            <TableHead>Size of move</TableHead>
            <TableHead>Crew</TableHead>
            <TableHead>Created at</TableHead>
            <TableHead>Updated at</TableHead>
            <TableHead className="text-right">Est. Quote</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.map((request) => {
            const fullName = request.customer
              ? `${request.customer?.first_name} ${request.customer?.last_name}`
              : "";
            return (
              <TableRow
                key={request.id}
                className={cn(
                  "h-16 text-xs font-medium hover:cursor-pointer",
                  selectedId === request.id && "bg-muted",
                )}
                onClick={() => handleRowClick(request?.id!)}
                onSelect={() => handleRowClick(request?.id!)}
              >
                <TableCell className="px-2 text-sm font-semibold">
                  {request.id}
                </TableCell>
                <TableCell>
                  <p
                    className={cn(
                      `w-fit rounded px-2 py-1 text-xs font-medium tracking-wider ${
                        statusColors[request.status]
                      } `,
                    )}
                  >
                    {request.status}
                  </p>
                </TableCell>
                <TableCell>{request.service.name}</TableCell>
                <TableCell>
                  {formatDate(request.moving_date)}
                  <br />
                  <DaysUntilMove movingDate={request.moving_date ?? null} />
                </TableCell>
                <TableCell>
                  {fullName ?? ""}
                  <br />
                  {request.customer?.phone ?? ""}
                </TableCell>
                <TableCell>
                  {request.origin.city}
                  <br />
                  {request.origin.state}, {request.origin.zip}
                </TableCell>
                <TableCell>
                  {request.destination.city}
                  <br />
                  {request.destination.state}, {request.destination.zip}
                </TableCell>
                <TableCell width={110}>{request.size ?? ""}</TableCell>
                <TableCell>{request.crew_size ?? ""}</TableCell>
                <TableCell>{format(request.created_at, "Pp")}</TableCell>
                <TableCell>{format(request.updated_at, "Pp")}</TableCell>
                <TableCell className="text-right">
                  <PriceDisplay price={request.total_price} />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

function DaysUntilMove({ movingDate }: { movingDate: Date | null }) {
  if (!movingDate) {
    return null;
  }
  const today = new Date();
  const movingDateObj = new Date(movingDate);

  const diffTime = movingDateObj.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const isInPast = movingDateObj < new Date(today.toDateString());
  const isToday = diffDays.toString() === "0";
  let value = `in ${diffDays} days`;

  if (isInPast) {
    return null;
  }
  if (isToday) {
    value = "today";
  }
  if (diffDays === 1) {
    value = "tomorrow";
  }

  const color = diffDays < 2 ? "text-red-600" : "text-green-600";

  return <span className={color}>{value}</span>;
}

function PriceDisplay({ price }: { price: { min: number; max: number } }) {
  const { min, max } = price;

  const minPrice = formatMoney(min);
  const maxPrice = formatMoney(max);

  if (max === 0) {
    return minPrice;
  } else if (min === max) {
    return maxPrice;
  } else {
    return `${minPrice} - ${maxPrice}`;
  }
}
