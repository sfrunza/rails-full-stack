import { deleteService, updateServicesOrder } from "@/actions/services";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { setServices } from "@/slices/globalSetting";
import { useDispatch } from "@/store";
import {
  GripVerticalIcon,
  LoaderCircleIcon,
  OctagonXIcon,
  Trash2Icon,
} from "lucide-react";
import { useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import toast from "react-hot-toast";

export default function ListItem({
  draggableId,
  item,
  index,
  items,
  setItems,
  handleServiceEdit,
}: {
  draggableId: string;
  item: any;
  index: number;
  items: any[];
  setItems: (value: any[]) => void;
  handleServiceEdit: any;
}) {
  const dispatch = useDispatch();
  const [isDeleting, setIsDeleting] = useState(false);
  const isDefault = item.is_default;

  function handleDeleteService(id: string) {
    if (!id) return;
    setIsDeleting(true);
    deleteService(id)
      .then((response) => {
        if (response?.error) {
          toast.error(response.error);
          return;
        }
        const newItems = items?.filter((item) => item.id !== id);
        setItems(newItems);
        toast.success(response?.success);
        updateServicesOrder(newItems!).then((res) => {
          if (res?.error) {
            return;
          }
          dispatch(setServices(newItems));
        });
      })
      .finally(() => setIsDeleting(false));
  }

  return (
    <Draggable draggableId={draggableId} index={index}>
      {(provided, _) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className="flex items-center justify-between gap-4 bg-white py-2"
        >
          <div {...provided.dragHandleProps}>
            <GripVerticalIcon className="size-6 text-muted-foreground" />
          </div>
          <div className="flex flex-1 items-center justify-between gap-4 sm:gap-20">
            <Input
              value={item.name}
              onChange={(e) => {
                const value = e.target.value;
                handleServiceEdit(index, value);
              }}
              name={item.name}
              disabled={isDefault}
            />
            {isDefault ? (
              <Button variant="ghost" disabled>
                <OctagonXIcon className="size-4 md:mr-2" />
                <span className="hidden md:flex">Default</span>
              </Button>
            ) : (
              <Button
                variant="ghost"
                onClick={() => {
                  handleDeleteService(item.id);
                }}
                disabled={isDeleting || isDefault}
              >
                {isDeleting && (
                  <LoaderCircleIcon className="size-4 animate-spin md:mr-2" />
                )}
                {!isDeleting && <Trash2Icon className="size-4 md:mr-2" />}
                <span className="hidden md:flex">Remove</span>
              </Button>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
}
