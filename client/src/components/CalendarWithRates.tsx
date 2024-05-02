"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import * as React from "react";
import { DayPicker } from "react-day-picker";

import { buttonVariants } from "components/ui/button";
import { cn } from "lib/utils";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "components/ui/tooltip";
import { InfoIcon } from "lucide-react";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function CalendarWithRates({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <>
      <DayPicker
        showOutsideDays={showOutsideDays}
        className={cn("p-3", className)}
        classNames={{
          months:
            "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
          month: "space-y-4",
          caption: "flex justify-center pt-1 relative items-center",
          caption_label: "text-sm font-medium",
          nav: "space-x-1 flex items-center",
          nav_button: cn(
            buttonVariants({ variant: "outline" }),
            "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
          ),
          nav_button_previous: "absolute left-1",
          nav_button_next: "absolute right-1",
          table: "w-full border-collapse space-y-1",
          head_row: "flex gap-1",
          head_cell:
            "text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]",
          row: "flex w-full mt-2 gap-1",
          cell: cn(
            "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected].day-range-end)]:rounded-r-md",
            props.mode === "range"
              ? "[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
              : "[&:has([aria-selected])]:rounded-md",
          ),
          day: cn(
            true && "bg-emerald-100 text-emerald-600",
            buttonVariants({ variant: "ghost" }),
            "h-8 w-8 p-0 font-normal aria-selected:opacity-100",
          ),
          day_range_start: "day-range-start",
          day_range_end: "day-range-end",
          day_selected:
            "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
          day_today: "bg-accent text-accent-foreground",
          day_outside:
            "day-outside text-muted-foreground opacity-50  aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
          day_disabled: "text-muted-foreground opacity-50 bg-slate-200",
          day_range_middle:
            "aria-selected:bg-accent aria-selected:text-accent-foreground",
          day_hidden: "invisible",
          ...classNames,
        }}
        components={{
          IconLeft: ({ ...props }) => <ChevronLeftIcon className="h-4 w-4" />,
          IconRight: ({ ...props }) => <ChevronRightIcon className="h-4 w-4" />,
        }}
        {...props}
      />
      <div className="border-t bg-slate-50">
        <div className="flex max-w-[17rem] flex-wrap items-center justify-center gap-1 py-4">
          <TooltipRate type="Discount">Discount</TooltipRate>
          <TooltipRate type="Regular">Regular</TooltipRate>
          <TooltipRate type="Subpeak">Subpeak</TooltipRate>
          <TooltipRate type="Peak">Peak</TooltipRate>
          <TooltipRate type="High Peak">High Peak</TooltipRate>
        </div>
      </div>
    </>
  );
}
CalendarWithRates.displayName = "CalendarWithRates";

export { CalendarWithRates };

function TooltipRate({
  type,
  children,
}: {
  type: "Discount" | "Regular" | "Subpeak" | "Peak" | "High Peak";
  children: React.ReactNode;
}) {
  const textColor = {
    Discount: "text-emerald-600",
    Regular: "text-blue-600",
    Subpeak: "text-yellow-600",
    Peak: "text-orange-600",
    "High Peak": "text-red-600",
  };

  const bgColor = {
    Discount: "bg-emerald-100",
    Regular: "bg-blue-100",
    Subpeak: "bg-yellow-100",
    Peak: "bg-orange-100",
    "High Peak": "bg-red-100",
  };

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild className="hover:cursor-help">
          <p
            className={cn(
              "flex items-center rounded-sm px-2 py-1 text-xs font-medium",
              type && textColor[type],
              type && bgColor[type],
            )}
          >
            {children}
            <InfoIcon className="ml-1 h-4 w-4" />
          </p>
        </TooltipTrigger>
        <TooltipContent className="text-pretty bg-white p-3 text-slate-900 shadow-lg">
          <div className="flex flex-col gap-1 divide-y">
            <div className="flex items-center justify-between gap-10">
              <p>2 Movers & Truck</p>
              <p>
                <span className={cn("font-medium", type && textColor[type])}>
                  $109
                </span>
                /hr
              </p>
            </div>
            <div className="flex items-center justify-between gap-4 pt-1">
              <p>3 Movers & Truck</p>
              <p>
                <span className={cn("font-medium", type && textColor[type])}>
                  $109
                </span>
                /hr
              </p>
            </div>
            <div className="flex items-center justify-between gap-4 pt-1">
              <p>4 Movers & Truck</p>
              <p>
                <span className={cn("font-medium", type && textColor[type])}>
                  $109
                </span>
                /hr
              </p>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
