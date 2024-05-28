import { memo } from "react";
import Map from "@/components/Map/Map";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/useModal";
import useUpdateRequest from "@/hooks/useUpdateRequest";
import { cn } from "@/lib/utils";
import { ModalType } from "@/slices/modal";
import { useSelector } from "@/store";
import { TStop } from "@/types/request";
import {
  LoaderCircleIcon,
  MapPinIcon,
  PlusIcon,
  SquarePenIcon,
  Trash2Icon,
} from "lucide-react";
// import { EditStop } from "./EditStop";

function Locations() {
  const { request } = useSelector((state) => state.request);
  const { openModal } = useModal();

  if (!request) return null;

  const { origin, destination, stops, can_edit_request } = request;

  const onAddStopAction = (action: ModalType, stop: TStop | null = null) => {
    openModal(action, {
      stop: stop,
    });
  };

  return (
    <div className="flex grid-cols-2 flex-col-reverse lg:grid">
      <div className="col-span-1 p-4 text-sm">
        {/* Origin */}
        <AddressItem
          address={origin}
          type="Origin"
          action="editLocations"
          actionData={{
            locations: {
              origin: origin,
              destination: destination,
            },
          }}
        />

        {/* Stops */}
        {stops.map((stop, index) => (
          <AddressItem
            key={index}
            address={stop}
            type={stop.isPickup ? "Pick up" : "Drop off"}
            action="editStop"
            actionData={{
              stop,
            }}
            canRemove
          />
        ))}

        {/* Add Stop Button */}
        {can_edit_request && (
          <div className="grid grid-cols-12 gap-1">
            <div className="bg-radial-gradient col-span-1 h-full w-full justify-self-center bg-gradient-to-br from-gray-200 via-transparent to-transparent bg-left-top bg-repeat-y"></div>
            <div className="col-span-11 grid pb-4">
              <Button
                className="w-fit"
                variant="edit"
                size="sm"
                onClick={() => onAddStopAction("editStop")}
              >
                <PlusIcon className="mr-2 size-3" />
                Add extra stop
              </Button>
            </div>
          </div>
        )}

        {/* Destination */}
        <AddressItem
          address={destination}
          type="Destination"
          action="editLocations"
          actionData={{
            locations: {
              origin: origin,
              destination: destination,
            },
          }}
        />
      </div>
      <div className="col-span-1">
        <Map />
      </div>
    </div>
  );
}

export default memo(Locations);

function AddressItem({
  address,
  type,
  action,
  actionData,
  canRemove = false,
}: {
  address: any;
  type: "Origin" | "Destination" | "Pick up" | "Drop off";
  action: ModalType;
  actionData: any;
  canRemove?: boolean;
}) {
  const { request } = useSelector((state) => state.request);
  const { openModal } = useModal();
  const { isSaving, updateRequestHandler } = useUpdateRequest();

  if (!request) return null;

  const { can_edit_request, stops } = request;

  function onEditAction() {
    openModal(action, actionData);
  }

  function onRemoveStop(stop: TStop) {
    const newStops = stops.filter((s) => s !== stop);

    updateRequestHandler(
      {
        stops: newStops,
      },
      () => {},
    );
  }

  return (
    <>
      <div
        className={cn(
          "grid grid-cols-12 items-center gap-1 text-blue-600",
          type === "Origin" && "text-green-600",
          type === "Destination" && "text-red-600",
        )}
      >
        <div className="col-span-1">
          <MapPinIcon className="size-4" />
        </div>
        <h3 className="col-span-11 font-semibold">{type}</h3>
      </div>

      <div className="grid grid-cols-12 gap-1">
        <div
          className={cn(
            "col-span-1 h-full w-full justify-self-center",
            type !== "Destination" &&
              "bg-radial-gradient bg-gradient-to-br from-slate-200 via-transparent to-transparent bg-left-top bg-repeat-y",
          )}
        />
        <div className="col-span-11 grid pb-4 pt-1">
          {/* {!address && actionButton} */}
          {address && (
            <>
              <div className="flex items-center gap-4">
                <div>
                  <p>
                    <span className="font-medium">
                      {address?.street || "TBD"},
                    </span>{" "}
                    {address?.city}, {address?.state} {address?.zip}
                  </p>
                  <p className="text-muted-foreground">
                    {address?.apt && <span>Apt. {address.apt} &#x2022; </span>}
                    {address?.floor}
                  </p>
                </div>
                {can_edit_request && (
                  <div className="flex flex-col gap-2">
                    <Button
                      className="w-fit"
                      variant="edit"
                      size="sm"
                      onClick={onEditAction}
                    >
                      <SquarePenIcon className="mr-2 size-3" />
                      Edit
                    </Button>
                    {canRemove && (
                      <Button
                        className="w-fit text-red-600"
                        variant="edit"
                        size="sm"
                        onClick={() => onRemoveStop(address)}
                        disabled={isSaving}
                      >
                        {isSaving && (
                          <LoaderCircleIcon className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        {!isSaving && <Trash2Icon className="mr-2 size-3" />}
                        Remove
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
