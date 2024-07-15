import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MapPinIcon, PlusIcon, Trash2Icon } from "lucide-react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/useModal";
import { ModalType } from "@/slices/modal";
import { setRequest } from "@/slices/request";
import { Input } from "@/components/ui/input";
import { useDispatch, useSelector } from "@/store";
import { TStop } from "@/types/request";
import {
  createDeliveryRequestAction,
  pairRequestAction,
} from "@/actions/requests";
import { formatDate } from "@/lib/utils";
import AddressForm from "./AddressForm";
import StopForm from "./StopForm";

export default function AddressesSection() {
  const { request } = useSelector((state) => state.request);
  const { services } = useSelector((state) => state.globalSettings);
  const service = services.find((s) => s.id === request?.service_id);
  const dispatch = useDispatch();
  const { openModal } = useModal();
  const [isCreating, setIsCreating] = useState(false);
  const [isPairing, setIsPairing] = useState(false);
  const [pairedRequestId, setPairedRequestId] = useState("");
  const navigate = useNavigate();

  const hasOrigin = service?.name !== "Unloading help";
  const hasDestination =
    service?.name !== "Loading help" &&
    service?.name !== "Packing only" &&
    service?.name !== "Inside move";

  const withStorage =
    service?.name === "Moving & Storage" ||
    service?.name === "Overnight Truck Storage";
  const isMovingFromStorage = request?.is_moving_from_storage;
  const hasPairedRequest = request?.paired_request;

  const showOrigin = withStorage ? !isMovingFromStorage : hasOrigin;
  const showDestination = withStorage ? isMovingFromStorage : hasDestination;

  const showStorageOrigin =
    withStorage && isMovingFromStorage && hasPairedRequest;
  const showStorageDestination =
    withStorage && !isMovingFromStorage && hasPairedRequest;

  const showPairRequestsButtons = withStorage && !hasPairedRequest;

  // const address = isMovingFromStorage ? request?.origin : request?.destination;

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

  function handleCreateDeliveryRequest() {
    // if (!serviceId) return;
    setIsCreating(true);
    // const { id, ...requestData } = request!;
    createDeliveryRequestAction({
      ...request,
      // customer_id: request?.customer_id,
      status: "Pending",
      paired_request_id: request?.id,
      is_moving_from_storage: true,
    })
      .then((res) => {
        if (res?.error) {
          toast.error(res.error);
          return;
        }
        navigate(`/crm/requests/${res?.request.id}`);
      })
      .catch((err) => {
        toast.error(err.message || err);
      })
      .finally(() => setIsCreating(false));
  }

  function handlePairRequest() {
    // if (!serviceId) return;
    setIsPairing(true);
    // const { id, ...requestData } = request!;
    pairRequestAction({
      requestId: request?.id!,
      pairedRequestId: Number(pairedRequestId),
    })
      .then((res) => {
        // console.log(res);
        if (res?.error) {
          toast.error(res.error);
          return;
        }
        // navigate(`/crm/requests/${res?.request.id}`);
      })
      .catch((err) => {
        toast.error(err.message || err);
      })
      .finally(() => setIsPairing(false));
  }
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:pr-6">
      {/* Origin */}
      <div className="flex flex-col gap-2">
        {hasOrigin && (
          <div className="flex items-center gap-4 text-sm font-medium text-muted-foreground">
            <MapPinIcon className="size-5" />
            <div className="flex flex-1 items-center justify-between">
              <p className="capitalize">Origin</p>
              <Button
                variant="link"
                className="h-auto p-0"
                onClick={(e: React.MouseEvent) =>
                  onOpenMapAction(e, "openMapModal")
                }
              >
                View map
              </Button>
            </div>
          </div>
        )}
        {showOrigin && <AddressForm type="origin" data={request?.origin} />}
        {showStorageOrigin && (
          <PairedRequestInfo
            serviceName={service.name}
            movingDate={request?.paired_request?.moving_date}
            pairedRequestId={request?.paired_request_id}
            type="in"
          />
        )}
      </div>

      {/* Destination */}

      <div className="flex flex-col gap-2">
        {hasDestination && (
          <div className="flex items-center gap-4 text-sm font-medium text-muted-foreground">
            <MapPinIcon className="size-5" />
            <div className="flex flex-1 items-center justify-between">
              <p className="capitalize">Destination</p>
              <p className="text-primary">Total distance 2.7 miles</p>
            </div>
          </div>
        )}

        {showPairRequestsButtons && (
          <div className="space-y-2 md:pl-6">
            <Button
              disabled={isCreating}
              variant="edit"
              onClick={handleCreateDeliveryRequest}
            >
              <PlusIcon className="mr-2 size-3" />
              Create delivery request
            </Button>
            {/* <div className="flex flex-col gap-2"> */}
            <Input
              value={pairedRequestId}
              onChange={(e) => setPairedRequestId(e.target.value)}
              placeholder="Enter Paired Request ID"
            />
            <Button
              disabled={isPairing}
              variant="edit"
              onClick={handlePairRequest}
            >
              <PlusIcon className="mr-2 size-3" />
              Connect delivery request
            </Button>
          </div>
        )}
        {showDestination && (
          <AddressForm type="destination" data={request?.destination} />
        )}
        {showStorageDestination && (
          <PairedRequestInfo
            serviceName={service.name}
            movingDate={request?.paired_request?.moving_date}
            pairedRequestId={request?.paired_request_id}
            type="out"
          />
          // <div className="flex justify-between gap-2 md:pl-6">
          //   <div className="relative flex-1 space-y-2 text-sm">
          //     <p className="font-semibold">Company storage</p>
          //     <div className="text-primary">
          //       <Link to={`/crm/requests/${request?.paired_request_id}`}>
          //         Request #{request?.paired_request_id}
          //       </Link>
          //     </div>
          //     <p className="text-muted-foreground">
          //       Move in date: {formatDate(request?.paired_request?.moving_date)}
          //     </p>
          //     <img
          //       src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTUiIGhlaWdodD0iNTUiIHZpZXdCb3g9IjAgMCA1NSA1NSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICAgIDxnIGNsaXAtcGF0aD0idXJsKCNjbGlwMCkiPgogICAgICAgIDxwYXRoIGQ9Ik0yNC44ODA1IDEuODE3ODRMMjQuODc5MiAxLjgxODkxQzIyLjE1NjcgLTAuMDMyMzk3MiAxOC4yNzAxIDAuMTE5MjgzIDEzLjM4OTkgMi45MzY5NkM1Ljk5NDg5IDcuMjA2NDQgMCAxNS43NDQzIDAgMjIuMDA2OUwyOC4yMjAzIDM4LjQzNjFMNTIuNTk0NiAxNy44Nzg4TDI0Ljg4MDUgMS44MTc4NFoiIGZpbGw9InVybCgjcGFpbnQwX2xpbmVhcikiLz4KICAgICAgICA8cGF0aCBkPSJNMTYuOTI5NyA0Ljk4MTc4QzIxLjQzNDkgMi4zODA3OCAyNS4wOTI1IDIuMDUzMDMgMjcuNzcgMy40NzQyMkwyNi43ODE0IDIuOTAxMzRMMjYuNzgwMSAyLjkwMjQyQzI0LjA1NzcgMS4wNTExMSAyMC4xNzEgMS4yMDI3OSAxNS4yOTA4IDQuMDIwMzZDNy44OTU3NyA4LjI5MDA1IDEuOTAwODggMTYuODI3OSAxLjkwMDg4IDIzLjA5MDVMMy41NDAwMyAyNC4wNDQ4QzMuNTQ0NTQgMTcuNzgyOCA5LjUzNzM5IDkuMjQ5NzYgMTYuOTI5NyA0Ljk4MTc4WiIgZmlsbD0iI0FCMkMzNyIvPgogICAgICAgIDxwYXRoIGQ9Ik0yNC4zMDM4IDkuMjgzMjFDMjguODA4OSA2LjY4MjIgMzIuNDY2NSA2LjM1NDQ2IDM1LjE0NCA3Ljc3NTY1TDM0LjE1NTQgNy4yMDI3N0wzNC4xNTQxIDcuMjAzODRDMzEuNDMxNyA1LjM1MjY0IDI3LjU0NSA1LjUwNDMyIDIyLjY2NDggOC4zMjE4OUMxNS4yNjk4IDEyLjU5MTQgOS4yNzQ5IDIxLjEyOTQgOS4yNzQ5IDI3LjM5MTlMMTAuOTE0MSAyOC4zNDYyQzEwLjkxODYgMjIuMDg0MiAxNi45MTE0IDEzLjU1MTEgMjQuMzAzOCA5LjI4MzIxWiIgZmlsbD0iI0FCMkMzNyIvPgogICAgICAgIDxwYXRoIGQ9Ik0zMS42NzM4IDEzLjU2NUMzNi4xNzg5IDEwLjk2NCAzOS44MzY1IDEwLjYzNjMgNDIuNTE0IDEyLjA1NzVMNDEuNTI1NCAxMS40ODQ2TDQxLjUyNDEgMTEuNDg1N0MzOC44MDE3IDkuNjM0MzYgMzQuOTE1IDkuNzg2MDQgMzAuMDM0OCAxMi42MDM2QzIyLjYzOTggMTYuODczMyAxNi42NDUgMjUuNDExMiAxNi42NDUgMzEuNjczOEwxOC4yODQyIDMyLjYyOEMxOC4yODg2IDI2LjM2NjEgMjQuMjgxNSAxNy44MzMgMzEuNjczOCAxMy41NjVaIiBmaWxsPSIjQUIyQzM3Ii8+CiAgICAgICAgPHBhdGggZD0iTTM4Ljk1MDYgMTcuODEwMkM0My40NTU4IDE1LjIwOTEgNDcuMTEzNCAxNC44ODE0IDQ5Ljc5MDkgMTYuMzAyNkw0OC44MDIzIDE1LjcyOTdMNDguODAxIDE1LjczMDhDNDYuMDc4NiAxMy44Nzk1IDQyLjE5MTkgMTQuMDMxMiAzNy4zMTE3IDE2Ljg0ODdDMjkuOTE2OCAyMS4xMTg0IDIzLjkyMTkgMjkuNjU2MyAyMy45MjE5IDM1LjkxODlMMjUuNTYxIDM2Ljg3MzFDMjUuNTY1NCAzMC42MTEyIDMxLjU1ODQgMjIuMDc4MSAzOC45NTA2IDE3LjgxMDJaIiBmaWxsPSIjQUIyQzM3Ii8+CiAgICAgICAgPHBhdGggZD0iTTQxLjYxMDEgMTkuMzY2MUMzNC4yNzA1IDIzLjYwMzYgMjguMzEzMyAzMi4wNDQ1IDI4LjIyNDMgMzguMjkzN0wyOC4yMjI2IDM4LjI5NzlMMCAyMi4wMDY4VjM3LjA1ODdDMCAzOC4xMDkyIDAuNTYwNDIgMzkuMDc5OCAxLjQ3MDA3IDM5LjYwNUwyNi4xMzggNTMuODQ3QzI3LjQyNzkgNTQuNTkxOCAyOS4wMTcyIDU0LjU5MTYgMzAuMzA3IDUzLjg0NjhMNTMuNTMwMSA0MC40MzQ5QzU0LjQzOTcgMzkuOTA5NyA1NC45OTk5IDM4LjkzOTEgNTQuOTk5OSAzNy44ODg4VjIyLjk3NDdDNTUgMTYuNzEyMiA0OS4wMDUxIDE1LjA5NjUgNDEuNjEwMSAxOS4zNjYxWiIgZmlsbD0idXJsKCNwYWludDFfbGluZWFyKSIvPgogICAgICAgIDxwYXRoIGQ9Ik01My41MzAzIDM2LjkxMDJMMzAuMzA3MSA1MC4zMjE5QzI5LjAxNzMgNTEuMDY2OSAyNy40MjggNTEuMDY2OSAyNi4xMzggNTAuMzIyM0wxLjQ3MDA3IDM2LjA4MDNDMC41NjA0MiAzNS41NTUxIDAgMzQuNTg0NCAwIDMzLjUzMzlWMzcuMDU4OEMwIDM4LjEwOTIgMC41NjA0MiAzOS4wNzk5IDEuNDcwMDcgMzkuNjA1MUwyNi4xMzggNTMuODQ3MkMyNy40Mjc5IDU0LjU5MTggMjkuMDE3MiA1NC41OTE4IDMwLjMwNzEgNTMuODQ2OUw1My41MzAzIDQwLjQzNTFDNTQuNDM5OCAzOS45MDk5IDU1IDM4LjkzOTMgNTUgMzcuODg5VjM0LjM2NDJDNTUgMzUuNDE0NCA1NC40Mzk3IDM2LjM4NDkgNTMuNTMwMyAzNi45MTAyWiIgZmlsbD0idXJsKCNwYWludDJfbGluZWFyKSIvPgogICAgICAgIDxwYXRoIGQ9Ik0zOC4zODkyIDQ5LjE3NjRMNDguMDMwMiA0My42MTAxVjM0LjEwNzlMMzguMzg5MiAzOS42OTY1VjQ5LjE3NjRaIiBmaWxsPSIjNDMzODZCIi8+CiAgICAgICAgPHBhdGggZD0iTTguNTc3OTkgMzUuMTI1Mkw1LjQ4Nzc5IDMzLjM0ODNWMjguNTE3OEw4LjU3Nzk5IDMwLjMwOTJWMzUuMTI1MloiIGZpbGw9IiM0MzM4NkIiLz4KICAgICAgICA8cGF0aCBkPSJNMTkuOTAwMyA0MS43MzI4TDE2LjgxMDEgMzkuOTU1OFYzNS4xMjUyTDE5LjkwMDMgMzYuOTE2NlY0MS43MzI4WiIgZmlsbD0iIzQzMzg2QiIvPgogICAgICAgIDxwYXRoIGQ9Ik0zOC4zODkyIDM2LjgxNjZMNDEuNDc5NCAzNS4wMzk3VjMwLjIwOTJMMzguMzg5MiAzMi4wMDA1VjM2LjgxNjZaIiBmaWxsPSIjNDMzODZCIi8+CiAgICAgICAgPHBhdGggZD0iTTQ0LjkzOTkgMzMuMDI0OUw0OC4wMzAxIDMxLjI0NzlWMjYuNDE3NUw0NC45Mzk5IDI4LjIwODdWMzMuMDI0OVoiIGZpbGw9IiM0MzM4NkIiLz4KICAgIDwvZz4KICAgIDxkZWZzPgogICAgICAgIDxsaW5lYXJHcmFkaWVudCBpZD0icGFpbnQwX2xpbmVhciIgeDE9IjE3LjgzOTMiIHkxPSIzMi43MzU2IiB4Mj0iMzIuODEwNCIgeTI9IjYuODA0OSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICAgICAgICA8c3RvcCBzdG9wLWNvbG9yPSIjQUIyQzM3Ii8+CiAgICAgICAgICAgIDxzdG9wIG9mZnNldD0iMC4yMDA3IiBzdG9wLWNvbG9yPSIjQjUyRjNCIi8+CiAgICAgICAgICAgIDxzdG9wIG9mZnNldD0iMC41NDcxIiBzdG9wLWNvbG9yPSIjRDEzODQ2Ii8+CiAgICAgICAgICAgIDxzdG9wIG9mZnNldD0iMC45OTUyIiBzdG9wLWNvbG9yPSIjRkU0NzU3Ii8+CiAgICAgICAgICAgIDxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0ZGNDc1NyIvPgogICAgICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICAgICAgPGxpbmVhckdyYWRpZW50IGlkPSJwYWludDFfbGluZWFyIiB4MT0iMjQuNTYwMSIgeTE9IjM1LjY5MjkiIHgyPSIyOC45NjgzIiB5Mj0iMzUuNjkyOSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICAgICAgICA8c3RvcCBzdG9wLWNvbG9yPSIjQzVCQUVCIi8+CiAgICAgICAgICAgIDxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0Q3RDFFQiIvPgogICAgICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICAgICAgPGxpbmVhckdyYWRpZW50IGlkPSJwYWludDJfbGluZWFyIiB4MT0iMjUuMjU0MyIgeTE9IjQzLjk2OTgiIHgyPSIzMS40MzU3IiB5Mj0iNDMuOTY5OCIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICAgICAgICA8c3RvcCBzdG9wLWNvbG9yPSIjQUIyQzM3Ii8+CiAgICAgICAgICAgIDxzdG9wIG9mZnNldD0iMC4yMDA3IiBzdG9wLWNvbG9yPSIjQjUyRjNCIi8+CiAgICAgICAgICAgIDxzdG9wIG9mZnNldD0iMC41NDcxIiBzdG9wLWNvbG9yPSIjRDEzODQ2Ii8+CiAgICAgICAgICAgIDxzdG9wIG9mZnNldD0iMC45OTUyIiBzdG9wLWNvbG9yPSIjRkU0NzU3Ii8+CiAgICAgICAgICAgIDxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0ZGNDc1NyIvPgogICAgICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICAgICAgPGNsaXBQYXRoIGlkPSJjbGlwMCI+CiAgICAgICAgICAgIDxyZWN0IHdpZHRoPSI1NSIgaGVpZ2h0PSI1NSIgZmlsbD0id2hpdGUiLz4KICAgICAgICA8L2NsaXBQYXRoPgogICAgPC9kZWZzPgo8L3N2Zz4K"
          //       className="absolute right-0 top-0 size-10"
          //     />
          //   </div>
          //   <div>
          //     <Button size="icon" variant="ghost">
          //       <Trash2Icon className="size-4" />
          //     </Button>
          //   </div>
          // </div>
        )}
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

interface PairedRequestInfoProps {
  serviceName: string;
  pairedRequestId: number;
  movingDate: Date | undefined;
  type: "in" | "out";
}

type TStorageIcons = {
  [key: string]: string;
};

const storageIcons = {
  "Moving & Storage": "/svg-icons/warehouse.svg",
  "Overnight Truck Storage": "/svg-icons/truck.svg",
} as TStorageIcons;

function PairedRequestInfo({
  serviceName,
  pairedRequestId,
  movingDate,
  type,
}: PairedRequestInfoProps) {
  return (
    <div className="flex justify-between gap-2 md:pl-6">
      <div className="relative flex-1 space-y-2 text-sm">
        <p className="font-semibold">Company storage</p>
        <div className="text-primary">
          <Link to={`/crm/requests/${pairedRequestId}`}>
            Request #{pairedRequestId}
          </Link>
        </div>
        <p className="text-muted-foreground">
          Move {type} date: {movingDate && formatDate(movingDate)}
        </p>
        <img
          src={storageIcons[serviceName]}
          className="absolute right-0 top-0 size-10"
        />
      </div>
      <div>
        <Button size="icon" variant="ghost">
          <Trash2Icon className="size-4" />
        </Button>
      </div>
    </div>
  );
}
