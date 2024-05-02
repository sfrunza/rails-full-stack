import { useState } from "react";

interface ObjectChange {
  id: number;
  property: string;
  oldValue: any;
  newValue: any;
}

interface ObjectItem {
  id: number;
  [key: string]: any;
}

interface ObjectArrayChanges {
  newArrayData: ObjectItem[];
  changes: ObjectChange[];
  updateProperty: (id: number, property: string, newValue: any) => void;
  reorderData: (newOrder: ObjectItem[]) => void;
}

// Custom hook to track changes in an array of objects
function useObjectArrayChanges(initialData: ObjectItem[]): ObjectArrayChanges {
  const [newArrayData, setNewArrayData] = useState<ObjectItem[]>(initialData);
  const [changes, setChanges] = useState<ObjectChange[]>([]);

  // Function to update property of an object and track changes
  const updateProperty = (id: number, property: string, newValue: any) => {
    // console.log(id, property, newValue);
    setNewArrayData((prevData) => {
      const newData = prevData.map((item) => {
        console.log("item", item);
        if (item.id === id) {
          const oldValue = item[property];
          // Update the property
          item[property] = newValue;
          // Track the change
          setChanges((prevChanges) => [
            ...prevChanges,
            { id, property, oldValue, newValue },
          ]);
        }
        return item;
      });
      return newData;
    });
  };

  // console.log("changes", changes);

  const reorderData = (newOrder: ObjectItem[]) => {
    setNewArrayData(newOrder);
    // Track the change
    setChanges(prevChanges => [
      ...prevChanges,
      {
        id: 0, // Assigning 0 as a special ID to denote reordering
        property: 'order', // You can use any property name to denote reordering
        oldValue: null, // No need to track old value for reordering
        newValue: newOrder // Store the new order in newValue
      }
    ]);
  };

  return {
    newArrayData,
    changes,
    updateProperty,
    reorderData
  };
}

export default useObjectArrayChanges;
