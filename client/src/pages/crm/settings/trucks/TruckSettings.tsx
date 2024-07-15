import { updateTrucks } from "@/actions/trucks";
import BackButton from "@/components/BackButton";
import FormSubmitButton from "@/components/FormSubmitButton";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { deepCopy } from "@/lib/utils";
import { setParklotTrucks, setTrucks } from "@/slices/globalSetting";
import { useDispatch, useSelector } from "@/store";
import { type TTruck } from "@/types/truck";
import { TruckIcon } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import TruckForm from "./_components/TruckForm";
// import PackingForm from "./_components/PackingForm";
// import PackingList from "./_components/PackingList";

export default function TruckSettings() {
  const { trucks } = useSelector((state) => state.globalSettings);
  const dispatch = useDispatch();
  const [items, setItems] = useState<TTruck[]>(trucks);
  const [isSaving, setIsSaving] = useState(false);
  const [listChanged, setListChanged] = useState(false);

  useEffect(() => {
    if (!trucks) return;
    setItems(deepCopy(trucks));
  }, [trucks]);

  function handleUpdateTrucks(newItemsOrder: any[]) {
    if (!newItemsOrder) return;
    setIsSaving(true);
    updateTrucks(newItemsOrder)
      .then((res) => {
        if (res?.error) {
          toast.error(res.error);
          return;
        }
        setListChanged(false);
        toast.success(res?.success);
        dispatch(setTrucks(newItemsOrder));
        dispatch(
          setParklotTrucks(newItemsOrder.filter((truck) => truck.is_active)),
        );
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
        <CardTitle>Trucks</CardTitle>
        <div className="absolute right-6">
          <TruckForm />
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {/* <PackingList
          items={items}
          setItems={setItems}
          setListChanged={setListChanged}
        /> */}
        <div className="space-y-4">
          {items?.map((truck, idx) => (
            <div key={truck.id} className="grid grid-cols-12 items-center">
              <div className="col-span-4 flex items-center gap-2 text-sm text-muted-foreground md:col-span-3 md:gap-4">
                <TruckIcon className="size-5" />
                <div className="flex items-center">Truck {idx + 1}</div>
              </div>
              <Switch
                className="col-span-2 md:col-span-1"
                checked={truck.is_active}
                onCheckedChange={(checked) => {
                  const value = checked;
                  const newPacking = { ...truck, is_active: value };
                  const newPackingList = items.map((item) =>
                    item.id === newPacking.id
                      ? {
                          ...item,
                          is_active: newPacking.is_active,
                        }
                      : item,
                  );
                  setItems(newPackingList);
                  setListChanged(true);
                  // dispatch(setTrucks(newPackingList));
                }}
              />
              <Input
                className="col-span-6 md:col-span-8"
                value={truck.name}
                onChange={(e) => {
                  const value = e.target.value;
                  const newPacking = { ...truck, name: value };
                  const newPackingList = items.map((item) =>
                    item.id === newPacking.id
                      ? {
                          ...item,
                          name: newPacking.name,
                        }
                      : item,
                  );
                  setItems(newPackingList);
                  setListChanged(true);
                  // dispatch(setTrucks(newPackingList));
                }}
              />
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex sm:justify-end">
        <div className="flex min-h-9 w-full gap-4 sm:w-auto">
          {listChanged && (
            <>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setItems(deepCopy(trucks!));
                  setListChanged(false);
                }}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <FormSubmitButton
                type="button"
                onClick={() => handleUpdateTrucks(items!)}
                disabled={isSaving}
                isPending={isSaving}
                label="Save changes"
              />
            </>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
