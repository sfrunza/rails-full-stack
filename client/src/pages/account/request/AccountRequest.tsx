import cable from "@/api/WebSocketConnection";
import Spinner from "@/components/Spinner";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchClientRequest, setRequest } from "@/slices/request";
import { useDispatch, useSelector } from "@/store";
import DateTimeAddressesCard from "./_components/DateTimeAddressesCard";
import MoveSizeCard from "./_components/MoveSizeCard";
import PackingCard from "./_components/PackingCard";
import QuoteDetailsCard from "./_components/QuoteDetailsCard";
import QuoteDetailsCardFlatRate from "./_components/QuoteDetailsCardFlatRate";

export default function AccountRequest() {
  const { id } = useParams<{ id: string }>();
  const { services } = useSelector((state) => state.globalSettings);
  const { request, error, isLoading } = useSelector((state) => state.request);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!id) return;

    dispatch(fetchClientRequest(id));

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
          console.log("CustomerRequestChannel", data);
          dispatch(setRequest(data));
        },
      },
    );

    return () => {
      // Unsubscribe from the channel when component unmounts
      channel.unsubscribe();
      setRequest(null);
    };
  }, [id]);

  if (isLoading || (!request && !error))
    return (
      <Card>
        <CardContent className="flex h-[568px] items-center justify-center">
          <Spinner />
        </CardContent>
      </Card>
    );

  if (error)
    return (
      <Card>
        <CardContent className="flex h-[568px] items-center justify-center">
          <p>{error}</p>
        </CardContent>
      </Card>
    );

  // console.log('Request:', request);

  const { service_id } = request!;
  const service = services.find((s) => s.id === service_id);

  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12">
        <DateTimeAddressesCard />
      </div>
      <div className="col-span-12 lg:col-span-6">
        <MoveSizeCard />
      </div>

      <div className="col-span-12 lg:col-span-6">
        <PackingCard />
      </div>
      <div className="col-span-12">
        {service && service?.name === "Flat Rate" ? (
          <QuoteDetailsCardFlatRate />
        ) : (
          <QuoteDetailsCard />
        )}
      </div>
    </div>
  );
}
