import {
  CheckCircleIcon,
  ClipboardListIcon,
  ClipboardPenIcon,
  ImagesIcon,
  SquarePenIcon,
} from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn, hasNonEmptyValues } from "@/lib/utils";
import { useSelector } from "@/store";
import { ModalType } from "@/slices/modal";
import { useModal } from "@/hooks/useModal";

export default function MoveSizeCard() {
  const { request } = useSelector((state) => state.request);
  const { openModal } = useModal();

  if (!request) return null;

  const { size, details, can_edit_request } = request;

  const photos = [] as any[];
  const hasDetails = hasNonEmptyValues(details);

  const onMoveSizeAction = (e: React.MouseEvent, action: ModalType) => {
    e.stopPropagation();
    openModal(action, {
      size: size,
    });
  };

  const onEditDetailsAction = (e: React.MouseEvent, action: ModalType) => {
    e.stopPropagation();
    openModal(action, {
      details: details,
    });
  };

  const onEditPhotosAction = (e: React.MouseEvent, action: ModalType) => {
    e.stopPropagation();
    openModal(action, {
      photos: [],
    });
  };

  // const onEditMoveSizeAction = (e: React.MouseEvent, action: ModalType) => {
  //   e.stopPropagation();

  //   onOpen(action, {
  //     moveSize: moveSize!,
  //     requestId: requestId,
  //   });
  // };

  // const onEditDetailsAction = (e: React.MouseEvent, action: ModalType) => {
  //   e.stopPropagation();

  //   onOpen(action, {
  //     details: details! as any,
  //     canEditRequest: canEditRequest,
  //     requestId: requestId,
  //   });
  // };

  // const onEditPhotosAction = (e: React.MouseEvent, action: ModalType) => {
  //   e.stopPropagation();

  //   onOpen(action, {
  //     photos: photos!,
  //     canEditRequest: canEditRequest,
  //     requestId: requestId,
  //   });
  // };

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <CardTitle>{size || "TBD"}</CardTitle>
          {can_edit_request && (
            <Button
              variant="edit"
              size="sm"
              onClick={(e) => onMoveSizeAction(e, "editMoveSize")}
              className="right-4 top-4 mt-0"
            >
              <SquarePenIcon className="mr-2 size-3" />
              Edit move size
            </Button>
          )}
        </div>
        <CardDescription>
          119 items 38 boxes 1215 cbf
          <br />
          Extra room 2, Basement, Living Room, Outdoor & Other, Dining Room
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="mb-4 text-center text-sm">
          Do you want to get a more precise quote ?
        </p>

        <div className="space-y-3 sm:container sm:max-w-sm">
          {/* Edit Inventory */}
          <button
            className={cn(
              buttonVariants({
                variant: false ? "default" : "edit",
              }),
              "text flex h-fit w-full flex-col items-start gap-1 px-6 py-3 text-xs hover:cursor-pointer",
            )}
            disabled
            // onClick={(e) => onEditDetailsAction(e, "editDetails")}
          >
            <div className="flex items-center gap-4">
              {false ? (
                <CheckCircleIcon className="mr-2 size-8" />
              ) : (
                <ClipboardListIcon className="mr-2 size-8" />
              )}
              <div className="text-left text-sm">
                <p className="font-semibold">Edit Inventory</p>
                <p
                  className={cn(
                    "font-normal",
                    false ? "text-white" : "text-slate-800",
                  )}
                >
                  Optional
                </p>
              </div>
            </div>
          </button>

          {/* Edit Details */}
          <button
            className={cn(
              buttonVariants({
                variant: hasDetails ? "default" : "edit",
              }),
              "text flex h-fit w-full flex-col items-start gap-1 px-6 py-3 text-xs hover:cursor-pointer",
            )}
            onClick={(e) => onEditDetailsAction(e, "editDetails")}
          >
            <div className="flex items-center gap-4">
              {hasDetails ? (
                <CheckCircleIcon className="mr-2 size-8" />
              ) : (
                <ClipboardPenIcon className="mr-2 size-8" />
              )}
              <div className="text-left text-sm">
                <p className="font-semibold">
                  {hasDetails ? "View or modify details" : "Add Details"}
                </p>
                <p
                  className={cn(
                    "font-normal",
                    hasDetails ? "text-white" : "text-slate-800",
                  )}
                >
                  Optional
                </p>
              </div>
            </div>
          </button>

          {/* <EditPhotos /> */}
          <button
            className={cn(
              buttonVariants({ variant: photos?.length ? "default" : "edit" }),
              "text flex h-fit w-full flex-col items-start gap-1 px-6 py-3 text-xs hover:cursor-pointer",
            )}
            onClick={(e) => onEditPhotosAction(e, "editPhotos")}
          >
            <div className="flex items-center gap-4">
              {photos?.length ? (
                <CheckCircleIcon className="mr-2 size-8" />
              ) : (
                <ImagesIcon className="mr-2 size-8" />
              )}
              <div className="text-left text-sm">
                <p className="font-semibold">
                  {photos?.length ? "View or add photos" : "Add Photos"}
                </p>
                <p
                  className={cn(
                    "font-normal",
                    photos?.length ? "text-white" : "text-slate-800",
                  )}
                >
                  Optional
                </p>
              </div>
            </div>
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
