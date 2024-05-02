import { Button } from "components/ui/button";
import { Card, CardContent, CardHeader } from "components/ui/card";
import { SquarePenIcon } from "lucide-react";
import { useSelector } from "store";
import image from "assets/movers-packing.jpg";
import { useModal } from "hooks/useModal";
import { ModalData, ModalType } from "slices/modal";

export default function PackingCard() {
  // const { request } = clientRequest((state) => state);
  const { packings } = useSelector((state) => state.globalSettings);
  const { request } = useSelector((state) => state.request);
  const { openModal } = useModal();

  if (!request) return null;

  const { packing_id, can_edit_request } = request;
  const packing = packings.find((p) => p.id === packing_id);

  const onAction = (e: React.MouseEvent, action: ModalType) => {
    e.stopPropagation();
    openModal(action, {
      packing_id: packing_id,
    });
  };

  return (
    <Card className="h-full">
      <CardHeader className="p-0">
        <img
          src={image}
          alt="Packing"
          className="h-40 w-full object-cover object-center"
        />
      </CardHeader>
      <CardContent className="pt-4">
        <p className="text-lg font-bold">Packing</p>
        <p className="font-medium text-primary">{packing?.name}</p>
        <div
          dangerouslySetInnerHTML={{ __html: packing?.description || "" }}
          className="mt-2 line-clamp-5"
        />
        <br />
        {can_edit_request && (
          <Button
            variant="edit"
            size="sm"
            onClick={(e) => onAction(e, "editPacking")}
          >
            <SquarePenIcon className="mr-2 size-3" />
            Edit packing
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
