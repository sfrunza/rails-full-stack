import { updateServicesOrder } from "actions/services";
import BackButton from "components/BackButton";
import { Button } from "components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "components/ui/card";
import { deepCopy } from "lib/utils";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { setServices } from "slices/globalSetting";
import { useDispatch, useSelector } from "store";
import ServiceForm from "./_components/ServiceForm";
import ServiceList from "./_components/ServiceList";

export default function ServicesSettings() {
  const { services } = useSelector((state) => state.globalSettings);
  const dispatch = useDispatch();
  const [items, setItems] = useState<any[]>(services);
  const [isUpdating, setIsUpdating] = useState(false);
  const [orderChanged, setOrderChanged] = useState(false);

  useEffect(() => {
    if (!services) return;
    setItems(deepCopy(services));
  }, [services]);

  function updateServiceOrder(newItemsOrder: any[]) {
    if (!newItemsOrder) return;
    setIsUpdating(true);
    updateServicesOrder(newItemsOrder)
      .then((res) => {
        if (res?.error) {
          toast.error(res.error);
          return;
        }
        dispatch(setServices(newItemsOrder));
        setOrderChanged(false);
        toast.success(res?.success);
      })
      .finally(() => setIsUpdating(false));
  }

  return (
    <Card className="max-w-screen-md">
      <CardHeader>
        <BackButton
          to="/crm/settings"
          label="Settings"
          className="mb-4 md:hidden"
        />
        <CardTitle>Moving Services</CardTitle>
        <CardDescription>
          Add, remove, and reorder services for your customers
        </CardDescription>
      </CardHeader>
      <CardContent className="p-2 md:p-6">
        <ServiceForm />
        <ServiceList
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
                  setItems(deepCopy(services!));
                  setOrderChanged(false);
                }}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>

              <Button
                type="button"
                disabled={isUpdating}
                onClick={() => updateServiceOrder(items!)}
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
