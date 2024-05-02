import { deletePacking, updatePackingsOrder } from '@/actions/packings';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { GripVerticalIcon, Trash2Icon } from 'lucide-react';
import { forwardRef, useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import toast from 'react-hot-toast';
import { setPackings } from '@/slices/globalSetting';
import { useDispatch } from '@/store';
import PackingForm from './PackingForm';

export default function ListItem({
  draggableId,
  item,
  index,
  items,
  setItems,
}: {
  draggableId: string;
  item: any;
  index: number;
  items: any[];
  setItems: any;
  setOrderChanged: any;
}) {
  const dispatch = useDispatch();
  const [isDeleting, setIsDeleting] = useState(false);
  const isDefalut = item.is_default;

  function handleDeletePacking(id: number) {
    if (!id) return;
    setIsDeleting(true);
    deletePacking(id)
      .then((res) => {
        if (res?.error) {
          toast.error(res.error);
          return;
        }
        const newItems = items?.filter((item) => item.id !== id);
        setItems(newItems);
        updatePackingsOrder(newItems!).then((res) => {
          if (res?.error) {
            return;
          }
          dispatch(setPackings(newItems));
        });
        toast.success(res?.success);
      })
      .finally(() => setIsDeleting(false));
  }

  return (
    <>
      {isDefalut ? (
        <RednderData
          isDefalut={isDefalut}
          item={item}
          isDeleting={isDeleting}
          handleDeletePacking={handleDeletePacking}
          setItems={setItems}
          items={items}
        />
      ) : (
        <Draggable draggableId={draggableId} index={index}>
          {(provided, _) => (
            <RednderData
              isDefalut={isDefalut}
              item={item}
              isDeleting={isDeleting}
              handleDeletePacking={handleDeletePacking}
              ref={provided.innerRef}
              draggableProps={provided.draggableProps}
              dragHandleProps={provided.dragHandleProps}
              setItems={setItems}
              items={items}
            />
          )}
        </Draggable>
      )}
    </>
  );
}

interface Props {
  isDefalut: boolean;
  item: any;
  isDeleting: boolean;
  handleDeletePacking: (id: number) => void;
  ref?: any | null;
  draggableProps?: any | null;
  dragHandleProps?: any | null;
  setItems: (value: any[]) => void;
  items: any[];
}

type Ref = HTMLButtonElement;

const RednderData = forwardRef<Ref, Props>(
  (
    {
      isDefalut,
      item,
      isDeleting,
      handleDeletePacking,
      draggableProps,
      dragHandleProps,
      setItems,
      items,
    },
    ref
  ) => {
    const deleteButtonLabel = isDefalut ? 'Default' : 'Remove';

    return (
      <div
        ref={ref}
        {...draggableProps}
        className="flex items-center justify-between gap-4 border-b bg-white py-2"
      >
        <div {...dragHandleProps} className="flex min-w-6">
          {!isDefalut && (
            <GripVerticalIcon className="size-6 text-muted-foreground" />
          )}
        </div>
        <div className="flex flex-1 items-center justify-between gap-4 sm:gap-20">
          <p className="text-sm">{item.name}</p>
          <div>
            <PackingForm data={item} setItems={setItems} items={items} />
            <Button
              variant="ghost"
              onClick={() => {
                handleDeletePacking(item.id);
              }}
              disabled={isDeleting || isDefalut}
              className={cn(isDefalut && 'hover:bg-transparent')}
            >
              <Trash2Icon
                className={cn(
                  'size-4 md:mr-2',
                  isDefalut && 'opacity-0 md:mr-3'
                )}
              />
              <span className="hidden md:flex">{deleteButtonLabel}</span>
            </Button>
          </div>
        </div>
      </div>
    );
  }
);
