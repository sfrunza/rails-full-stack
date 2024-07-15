import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { CalendarDaysIcon, ClockIcon } from "lucide-react";
import StatusMessage from "./StatusMessage";
import { statusColors } from "@/constants/request";
import { useSelector } from "@/store";
import Locations from "./Locations";
import { ModalType } from "@/slices/modal";
import { useModal } from "@/hooks/useModal";
import { TStatus } from "@/types/request";

export default function DateTimeAddressesCard() {
  const { request } = useSelector((state) => state.request);
  const { services } = useSelector((state) => state.globalSettings);
  const { openModal } = useModal();

  if (!request) return null;

  const { id, moving_date, status, service_id, can_edit_request } = request!;
  const service = services.find((s) => s.id === service_id);

  const start_time = {
    min: "11:00 AM",
    max: "02:00 PM",
  };

  const onDateAction = (
    e: React.MouseEvent,
    action: ModalType,
    type: "moving_date" | "delivery_date",
  ) => {
    e.stopPropagation();
    let date = type === "moving_date" ? moving_date : moving_date; //del_date

    openModal(action, {
      date: { [type]: date, field: type },
    });
  };

  const onTimeAction = (
    e: React.MouseEvent,
    action: ModalType,
    type: "start_time" | "delivery_time",
  ) => {
    e.stopPropagation();
    let time = type === "start_time" ? start_time : start_time; //del_time

    openModal(action, {
      time: { [type]: time, field: type },
    });
  };

  return (
    <Card>
      <CardHeader
        className={`${
          statusColors[status as TStatus]
        } relative m-2 flex flex-row items-center justify-between space-y-0 rounded-xl p-4 py-[1.3rem]`}
      >
        <div className="absolute left-4">
          <CardTitle className="font-semibold tracking-wide text-white">
            Request #{id}
          </CardTitle>
          <CardDescription className="text-sm font-normal text-white">
            {service?.name}
          </CardDescription>
        </div>
        <p className="flex-1 text-right text-xl font-extrabold tracking-wide text-white lg:text-center lg:text-2xl">
          {status}
        </p>
      </CardHeader>
      <CardContent className="p-0">
        <StatusMessage />
        {/* Moving Date/Time */}
        <div className="grid grid-cols-2 border-b p-4">
          <DateItem
            date={moving_date}
            label="Move Date"
            canEditRequest={can_edit_request}
            onClick={(e: React.MouseEvent) =>
              onDateAction(e, "editDate", "moving_date")
            }
          />
          <TimeItem
            time={"8AM"}
            label="Start Time Window"
            canEditRequest={can_edit_request}
            onClick={(e: React.MouseEvent) =>
              onTimeAction(e, "editTime", "start_time")
            }
          />
        </div>
        {/* Delivery Date/Time */}
        <div className="grid grid-cols-2 border-b p-4">
          <DateItem
            date={new Date()}
            label="Delivery Date"
            canEditRequest={can_edit_request}
            onClick={(e: React.MouseEvent) =>
              onDateAction(e, "editDate", "delivery_date")
            }
          />
          <TimeItem
            time={"8AM"}
            label="Delivery Time Window"
            canEditRequest={can_edit_request}
            onClick={(e: React.MouseEvent) =>
              onTimeAction(e, "editTime", "delivery_time")
            }
          />
        </div>
        <Locations />
      </CardContent>
    </Card>
  );
}

function DateItem({
  date,
  label,
  canEditRequest,
  onClick,
}: {
  date: Date | undefined;
  label: string;
  canEditRequest: boolean | undefined;
  onClick: (e: React.MouseEvent) => void;
}) {
  return (
    <div className="col-span-1 flex flex-col items-baseline gap-2 space-y-1 lg:flex-row lg:items-center lg:gap-6">
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm">{formatDate(date)}</p>
      </div>
      {canEditRequest && (
        <Button variant="edit" size="sm" onClick={onClick}>
          <CalendarDaysIcon className="mr-2 size-3" />
          Edit date
        </Button>
      )}
    </div>
  );
}

function TimeItem({
  time,
  label,
  canEditRequest,
  onClick,
}: {
  time: string | null;
  label: string;
  canEditRequest: boolean | undefined;
  onClick: (e: React.MouseEvent) => void;
}) {
  return (
    <div className="col-span-1 flex flex-col items-baseline gap-2 space-y-1 lg:flex-row lg:items-center lg:gap-6">
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm">{time || "TBD"}</p>
      </div>
      {canEditRequest && (
        <Button variant="edit" size="sm" onClick={onClick}>
          <ClockIcon className="mr-2 size-3" />
          Edit Time
        </Button>
      )}
    </div>
  );
}
