import { Link, useParams } from "react-router-dom";
import { MoveRightIcon } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const statusColors = {
  Pending: "text-amber-500 bg-amber-100",
  Confirmed: "text-green-600 bg-green-100",
  "Not Confirmed": "text-indigo-600 bg-indigo-100",
  Canceled: "text-red-500 bg-red-100",
  Completed: "text-[deepskyblue] bg-sky-100",
  "Not Available": "text-slate-800 bg-slate-200",
  Expired: "text-slate-800 bg-slate-200",
  Spam: "text-slate-800 bg-slate-200",
};

export default function JobItem({
  id,
  status,
  origin,
  destination,
}: {
  id: number;
  status: string;
  origin?: { city?: string; state?: string };
  destination?: { city?: string; state?: string };
}) {
  const params = useParams<{ id: string }>();

  return (
    <Link
      to={`account/requests/${id}`}
      className={cn(
        buttonVariants({ variant: "outline" }),
        params.id === id.toString() && "bg-muted",
        "flex h-fit flex-col gap-2 p-2 text-xs",
      )}
    >
      <div className="flex w-full items-center justify-between">
        <p className="font-semibold"># {id}</p>
        <p
          className={cn(
            `w-fit rounded-full px-2 py-1 ${
              statusColors[status as keyof typeof statusColors]
            } `,
          )}
        >
          {status}
        </p>
      </div>
      <div className="flex w-full items-center gap-2 overflow-hidden text-muted-foreground">
        {origin && (
          <p>
            {origin.city}, {origin.state}
          </p>
        )}
        {origin && destination && <MoveRightIcon className="size-4 min-w-4" />}
        {destination && (
          <p>
            {destination.city}, {destination.state}
          </p>
        )}
      </div>
    </Link>
  );
}
