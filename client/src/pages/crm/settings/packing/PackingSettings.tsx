import { updatePackingsOrder } from "actions/packings";
import BackButton from "components/BackButton";
import { Button } from "components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "components/ui/card";
import { deepCopy } from "lib/utils";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { setPackings } from "slices/globalSetting";
import { useDispatch, useSelector } from "store";
import PackingForm from "./_components/PackingForm";
import PackingList from "./_components/PackingList";

export default function PackingSettings() {
  const { packings } = useSelector((state) => state.globalSettings);
  const dispatch = useDispatch();
  const [items, setItems] = useState<any[]>(packings);
  const [isSaving, setIsSaving] = useState(false);
  const [orderChanged, setOrderChanged] = useState(false);

  useEffect(() => {
    if (!packings) return;
    setItems(deepCopy(packings));
  }, [packings]);

  function handleUpdatePackingOrder(newItemsOrder: any[]) {
    if (!newItemsOrder) return;
    setIsSaving(true);
    updatePackingsOrder(newItemsOrder)
      .then((res) => {
        if (res?.error) {
          toast.error(res.error);
          return;
        }
        setOrderChanged(false);
        toast.success(res?.success);
        dispatch(setPackings(newItemsOrder));
      })
      .finally(() => setIsSaving(false));
  }

  return (
    <Card className="max-w-screen-md">
      <CardHeader className="relative">
        <BackButton
          to="/crm/settings"
          label="Settings"
          className="mb-4 md:hidden"
        />
        <CardTitle>Packing Services</CardTitle>
        <div className="absolute right-6">
          <PackingForm setItems={setItems} items={items} />
        </div>
      </CardHeader>
      <CardContent className="p-2 md:p-6">
        <PackingList
          items={items}
          setItems={setItems}
          setOrderChanged={setOrderChanged}
        />
      </CardContent>
      <CardFooter className="flex sm:justify-end">
        <div className="flex min-h-9 w-full gap-4 sm:w-auto">
          {orderChanged && (
            <>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setItems(deepCopy(packings!));
                  setOrderChanged(false);
                }}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>

              <Button
                type="button"
                disabled={isSaving}
                onClick={() => handleUpdatePackingOrder(items!)}
                className="w-full sm:w-auto"
              >
                Save changes
              </Button>
            </>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
