import { DragDropContext, DropResult, Droppable } from "react-beautiful-dnd";
import ListItem from "./ListItem";

function reorder(
  list: { id: string; name: string; droppable_index: number }[],
  startIndex: number,
  endIndex: number,
) {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
}

export default function PackingList({
  items,
  setItems,
  setOrderChanged,
}: {
  items: { id: string; name: string; droppable_index: number }[];
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
                    setOrderChanged={setOrderChanged}
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
