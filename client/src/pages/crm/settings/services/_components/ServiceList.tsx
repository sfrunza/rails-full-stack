import { DragDropContext, DropResult, Droppable } from "react-beautiful-dnd";
import ListItem from "./ListItem";
import { TService } from "@/types/service";

function reorder(list: TService[], startIndex: number, endIndex: number) {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
}

export default function ServiceList({
  items,
  setItems,
  setOrderChanged,
}: {
  items: TService[];
  setItems: (value: any[]) => void;
  setOrderChanged: (value: boolean) => void;
}) {
  function onDragEnd(result: DropResult) {
    if (!result.destination) {
      return;
    }
    const { source, destination } = result;
    if (source.index === destination.index) return;
    const newOrder = reorder(
      items!,
      result.source.index,
      result.destination.index,
    );
    setItems(newOrder);
    setOrderChanged(true);
  }

  function handleServiceEdit(index: number, value: string) {
    const newItems = [...items!];
    newItems[index].name = value;
    setItems(newItems);
    setOrderChanged(true);
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable">
        {(provided, _) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            <div className="flex flex-col">
              {items?.map((item, index) => {
                return (
                  <ListItem
                    key={JSON.stringify(item.droppable_index)}
                    draggableId={JSON.stringify(item.droppable_index)}
                    index={index}
                    item={item}
                    items={items}
                    setItems={setItems}
                    handleServiceEdit={handleServiceEdit}
                  />
                );
              })}
            </div>
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
