import { TStatus } from "@/types/request";

export const statusOptions = [
  "Pending",
  "Pending-info",
  "Confirmed",
  "Not Confirmed",
  "Canceled",
  "Completed",
  "Not Available",
  "Expired",
  "Spam",
] as TStatus[];


export const statusColors = {
  Pending: "bg-amber-500",
  "Pending-info": "bg-amber-500",
  Confirmed: "bg-green-600",
  "Not Confirmed": "bg-indigo-600",
  Canceled: "bg-red-500",
  Completed: "bg-[deepskyblue]",
  "Not Available": "bg-slate-800",
  Expired: "bg-slate-800",
  Spam: "bg-slate-800",
} as { [key in TStatus]: string }



export const floorOptions = [
  {
    label: "Elevator",
    value: "Elevator Building",
  },
  {
    label: "1",
    value: "1st/ground floor",
  },
  {
    label: "2",
    value: "2nd floor",
  },
  {
    label: "3",
    value: "3rd floor",
  },
  {
    label: "4",
    value: "4th floor",
  },
  {
    label: "5",
    value: "5th floor",
    isDisabled: true,
  },
  {
    label: "House",
    value: "Private House",
  },

  {
    label: "Storage",
    value: "Storage Unit",
  },
] as { label: string; value: string; isDisabled?: boolean }[];
