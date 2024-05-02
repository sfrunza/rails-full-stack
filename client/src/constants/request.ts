import { TStatus } from "types/request";

export const statusOptions = [
  "Pending",
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
  Confirmed: "bg-green-600",
  "Not Confirmed": "bg-indigo-600",
  Canceled: "bg-red-500",
  Completed: "bg-[deepskyblue]",
  "Not Available": "bg-slate-800",
  Expired: "bg-slate-800",
  Spam: "bg-slate-800",
} as { [key in TStatus]: string }

