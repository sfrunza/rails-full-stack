import FormSubmitButton from "@/components/FormSubmitButton";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { statusColors, statusOptions } from "@/constants/request";
import useUpdateRequest from "@/hooks/useUpdateRequest";
import { cn } from "@/lib/utils";
import { selectIsRequestChanged, setRequest } from "@/slices/request";
import { useDispatch, useSelector } from "@/store";
import { TStatus } from "@/types/request";
import {
  BookCopyIcon,
  MailsIcon,
  PrinterIcon,
  UserRoundIcon,
} from "lucide-react";

export default function StatusServiceSection() {
  const { services } = useSelector((state) => state.globalSettings);
  const { request } = useSelector((state) => state.request);
  const { isSaving, updateRequestHandler } = useUpdateRequest();
  const isChanged = useSelector(selectIsRequestChanged);
  const dispatch = useDispatch();

  function handleUpdateRequest() {
    updateRequestHandler(request!, () => {});
  }

  return (
    <div className="p-4">
      <div className="flex flex-col justify-between gap-4 md:flex-row">
        <div className="flex flex-col items-center gap-4 md:flex-row">
          <Select
            value={request?.status}
            onValueChange={(val) => {
              dispatch(setRequest({ status: val }));
            }}
          >
            <SelectTrigger
              className={cn(
                "h-11 w-full px-4 text-sm font-medium text-white md:w-[14rem]",
                statusColors[request?.status as TStatus],
              )}
            >
              <SelectValue placeholder="select status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((status, i) => {
                return (
                  <SelectItem key={i} value={status}>
                    {status}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
          <Select
            value={JSON.stringify(request?.service_id || "")}
            onValueChange={(val: string) => {
              dispatch(setRequest({ service_id: parseInt(val) }));
            }}
          >
            <SelectTrigger className="h-11 w-full bg-white px-4 text-sm font-medium md:w-[14rem]">
              <SelectValue placeholder="select status" />
            </SelectTrigger>
            <SelectContent>
              {services.map((service, i) => {
                return (
                  <SelectItem key={i} value={JSON.stringify(service.id)}>
                    {service.name}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
          <div className="flex gap-8 md:gap-4 md:pl-10">
            <TooltipProvider>
              <Tooltip delayDuration={100}>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="outline"
                    className="size-11 rounded-full hover:bg-background hover:text-primary"
                  >
                    <MailsIcon className="size-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Emails</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip delayDuration={100}>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="outline"
                    className="size-11 rounded-full hover:bg-background hover:text-primary"
                  >
                    <UserRoundIcon className="size-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Client page</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip delayDuration={100}>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="outline"
                    className="size-11 rounded-full hover:bg-background hover:text-primary"
                  >
                    <BookCopyIcon className="size-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Clone request</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip delayDuration={100}>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="outline"
                    className="size-11 rounded-full hover:bg-background hover:text-primary"
                  >
                    <PrinterIcon className="size-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>View PDF</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        {isChanged && (
          <FormSubmitButton
            size="lg"
            type="button"
            onClick={() => handleUpdateRequest()}
            disabled={isSaving}
            isPending={isSaving}
            label="Update request"
            className="absolute -left-1/2 -right-1/2 bottom-0 z-50 h-14 w-auto md:static md:bottom-0 md:right-0 md:ml-auto md:mt-0 md:h-11"
          />
        )}
      </div>
    </div>
  );
}
