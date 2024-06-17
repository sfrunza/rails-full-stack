import cable from "@/api/WebSocketConnection";
import Spinner from "@/components/Spinner";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { hasNonEmptyValues } from "@/lib/utils";
import {
  clearRequest,
  fetchAdminRequest,
  setOriginalRequest,
  setRequest,
} from "@/slices/request";
import { useDispatch, useSelector } from "@/store";
import { MailIcon, PhoneCallIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BackButton from "./_components/BackButton";
import CustomerTab from "./_components/navTabs/CustomerTab";
import DetailsTab from "./_components/navTabs/DetailsTab";
import LogsTab from "./_components/navTabs/LogsTab";
import RequestTab from "./_components/navTabs/RequestTab";

export default function Request() {
  const { id } = useParams<{ id: string }>();
  const [value, setValue] = useState("request");
  const dispatch = useDispatch();

  const { request, isLoading, error } = useSelector((state) => state.request);
  const { customer, details } = request ?? {};

  const fullName = customer?.id
    ? customer?.first_name + " " + customer?.last_name
    : "---------";

  const hasDetails = hasNonEmptyValues(details ?? {});

  useEffect(() => {
    if (!id) return;

    dispatch(fetchAdminRequest(id));

    // Subscribe to channel
    const channel = cable.subscriptions.create(
      { channel: "RequestChannel", request_id: id },
      {
        connected() {
          console.log("Connected to RequestChannel");
        },
        disconnected() {
          console.log("Disconnected from RequestChannel");
        },
        received(data) {
          console.log("AdminRequestChannel", data);
          dispatch(setRequest(data));
          dispatch(setOriginalRequest(data));
        },
        ensureActiveConnection() {
          console.log("sukaaaa");
        },
      },
    );

    // toast.error("Error fetching request");

    // cable.ensureActiveConnection(() => {
    //   console.log("Reconnecting to RequestChannel");
    //   channel.perform("subscribe");

    // });

    return () => {
      // Unsubscribe from the channel when component unmounts
      dispatch(clearRequest());
      channel.unsubscribe();
    };
  }, [id]);

  // console.log(request);

  if (isLoading || (!request && !error))
    return (
      <div className="flex items-center justify-center py-80 md:py-96">
        <Spinner withText />
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center py-80 md:py-96">
        <p>{error}</p>
      </div>
    );

  return (
    <div>
      <div className="flex items-baseline justify-between p-4 pr-2 md:items-center md:p-6 md:pr-4">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-8">
          <h1 className="text-lg font-semibold">{fullName}</h1>
          <a
            href={`tel:${request?.customer?.phone || "#"}`}
            className="flex items-center gap-4 text-sm text-primary"
          >
            <PhoneCallIcon className="size-4" />
            {request?.customer?.phone ?? "---------"}
          </a>
          <p className="flex items-center gap-4 text-sm text-muted-foreground">
            <MailIcon className="size-4" />
            {request?.customer?.email ?? "---------"}
          </p>
        </div>
        <BackButton />
      </div>
      <div className="border-b px-4 pb-4 pt-2 md:px-6">
        <Tabs
          defaultValue={value}
          onValueChange={(val) => {
            setValue(val);
          }}
        >
          <ScrollArea className="w-full whitespace-nowrap">
            <TabsList className="justify-start gap-1">
              <TabsTrigger value="request" className={"w-[6rem]"}>
                Request #{id}
              </TabsTrigger>
              <TabsTrigger value="customer" className={"w-[6rem]"}>
                Customer
              </TabsTrigger>
              <TabsTrigger value="messages" className={"w-[6rem]"}>
                Messages
              </TabsTrigger>
              <TabsTrigger value="logs" className={"w-[6rem]"}>
                Logs
              </TabsTrigger>
              <TabsTrigger value="details" className={"w-[6rem]"}>
                <div className="relative px-1">
                  Details{" "}
                  {hasDetails && (
                    <span className="absolute right-0 top-0 size-1.5 rounded-full bg-green-600" />
                  )}
                </div>
              </TabsTrigger>
              <TabsTrigger value="photos" className={"w-[6rem]"}>
                Photos
              </TabsTrigger>
              <TabsTrigger value="inventory" className={"w-[6rem]"}>
                Inventory
              </TabsTrigger>
            </TabsList>
            <ScrollBar orientation="horizontal" className="mt-2" />
          </ScrollArea>
        </Tabs>
      </div>
      <div>
        {value === "request" && <RequestTab />}
        {value === "customer" && <CustomerTab />}
        {value === "logs" && <LogsTab requestId={Number(id)} />}
        {value === "details" && <DetailsTab />}
      </div>
    </div>
  );
}
