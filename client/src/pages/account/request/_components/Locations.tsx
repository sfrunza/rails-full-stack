import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/useModal";
import { cn } from "@/lib/utils";
import { MapPinIcon, SquarePenIcon } from "lucide-react";
import { ModalType } from "@/slices/modal";
import { useSelector } from "@/store";
import Map from "@/components/Map/Map";

// const API_KEY = process.env.VITE_GOOGLE_MAPS_API_KEY as string;

// const libraries = ["places"];

export default function Locations() {
  // const { isLoaded } = useLoadScript({
  //   googleMapsApiKey: API_KEY,
  //   libraries: libraries as LoadScriptProps["libraries"],
  // });
  const { request } = useSelector((state) => state.request);
  const { openModal } = useModal();

  if (!request) return null;

  const { origin, destination, can_edit_request } = request;
  // const { id: requestId, origin, destination, canEditRequest } = request!;

  // const { onOpen } = useModal();

  const onEditLocationsAction = (e: React.MouseEvent, action: ModalType) => {
    e.stopPropagation();

    openModal(action, {
      locations: {
        origin: origin,
        destination: destination,
      },
    });
  };

  return (
    <div className="flex grid-cols-2 flex-col-reverse lg:grid">
      <div className="col-span-1 p-4 text-sm">
        {/* Origin */}
        <AddressItem
          address={origin}
          type="Origin"
          actionButton={
            can_edit_request && (
              <Button
                className="w-fit"
                variant="edit"
                size="sm"
                onClick={(e) => onEditLocationsAction(e, "editLocations")}
              >
                <SquarePenIcon className="mr-2 size-3" />
                {!origin ? "Add origin" : "Edit"}
              </Button>
            )
          }
        />
        <AddressItem
          address={destination}
          type="Destination"
          actionButton={
            can_edit_request && (
              <Button
                className="w-fit"
                variant="edit"
                size="sm"
                onClick={(e) => onEditLocationsAction(e, "editLocations")}
              >
                <SquarePenIcon className="mr-2 size-3" />
                {!destination ? "Add destination" : "Edit"}
              </Button>
            )
          }
        />
      </div>
      <div className="col-span-1">
        <Map />
      </div>
    </div>
  );
}

function AddressItem({
  address,
  type,
  actionButton,
}: {
  address: any;
  type: "Origin" | "Destination" | "Pick up" | "Drop off";
  actionButton?: React.ReactNode;
}) {
  // <EditLocation origin={{}} destination={{}} />;
  return (
    <>
      <div
        className={cn(
          "grid grid-cols-12 items-center gap-1 text-blue-600",
          type === "Origin" && "text-green-500",
          type === "Destination" && "text-red-500",
        )}
      >
        <div className="col-span-1">
          <MapPinIcon className="size-4" />
        </div>
        <h3 className="col-span-11 font-semibold">{type}</h3>
      </div>

      <div className="grid grid-cols-12 gap-1">
        {/* <div className="col-span-1 h-full w-full justify-self-center"></div> */}
        <div
          className={cn(
            "col-span-1 h-full w-full justify-self-center",
            type !== "Destination" &&
              "bg-radial-gradient bg-gradient-to-br from-slate-200 via-transparent to-transparent bg-left-top bg-repeat-y",
          )}
        />
        <div className="col-span-11 grid pb-4 pt-1">
          {!address && actionButton}
          {address && (
            <>
              <div className="flex items-center gap-4">
                <p>
                  <span className="font-semibold">
                    {address?.street || "TBD"},
                  </span>{" "}
                  {address?.city}, {address?.state} {address?.zip}
                  {/* {address?.apt && (
                    <span className="ml-1 text-muted-foreground">
                      Apt. {address.apt}
                    </span>
                  )} */}
                </p>
                {actionButton}
              </div>
              {/* {address?.apt && (
                <span className="text-muted-foreground">
                  Apt. {address.apt}
                </span>
              )} */}
              <p className="text-muted-foreground">
                {address?.apt && <span>Apt. {address.apt} &#x2022; </span>}
                {address?.floor}
              </p>
            </>
          )}
        </div>
      </div>
    </>
  );
}
