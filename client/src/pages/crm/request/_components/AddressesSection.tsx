import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/useModal";
import { ModalType } from "@/slices/modal";
import { setRequest } from "@/slices/request";
import { useDispatch, useSelector } from "@/store";
import AddressForm from "./AddressForm";
import { PlusIcon, Trash2Icon } from "lucide-react";
import { TStop } from "@/types/request";
import StopForm from "./StopForm";

export default function AddressesSection() {
  const { request } = useSelector((state) => state.request);
  const dispatch = useDispatch();
  const { openModal } = useModal();

  const onOpenMapAction = (e: React.MouseEvent, action: ModalType) => {
    e.stopPropagation();

    openModal(action, {});
  };

  function handleDeleteAddress(id: number) {
    const newStops = request?.stops.filter((_, i) => i !== id);
    dispatch(setRequest({ stops: newStops }));
  }

  const onAddStopAction = (action: ModalType, stop: TStop | null = null) => {
    openModal(action, {
      stop: stop,
    });
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:pr-6">
      <div className="flex flex-col gap-6">
        <AddressForm
          type="origin"
          data={request?.origin}
          actionButton={
            <Button
              variant="link"
              className="h-auto p-0"
              onClick={(e: React.MouseEvent) =>
                onOpenMapAction(e, "openMapModal")
              }
            >
              View map
            </Button>
          }
        />
      </div>
      <div className="flex flex-col gap-6">
        <AddressForm
          type="destination"
          data={request?.destination}
          actionButton={
            <p className="text-primary">Total distance 2.7 miles</p>
          }
        />
      </div>
      {request?.stops.map((stop, i) => (
        <div className="flex flex-col gap-6" key={i}>
          <StopForm
            type={stop.isPickup ? "pick up" : "drop off"}
            data={{ ...stop, idx: i }}
            actionButton={
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDeleteAddress(i)}
              >
                <Trash2Icon className="size-4" />
              </Button>
            }
          />
        </div>
      ))}
      <div className="grid grid-cols-2 gap-6 lg:col-span-2 lg:px-6">
        <div className="col-span-2 lg:col-span-1">
          <Button
            className="w-full"
            variant="edit"
            onClick={() => onAddStopAction("editStop")}
          >
            <PlusIcon className="mr-2 size-3" />
            Add extra stop
          </Button>
        </div>
      </div>
    </div>
  );
}
