import { handleZipCodeSearch } from "@/actions/requests";
import {
  AutoCompleteInput,
  TAutocompleteData,
} from "@/components/AutoCompleteInput";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { floorOptions } from "@/constants/request";
import { setRequest } from "@/slices/request";
import { useDispatch } from "@/store";
import { TAddress } from "@/types/request";
import { MapPinIcon } from "lucide-react";
import toast from "react-hot-toast";

interface AddressFormProps {
  type?: "origin" | "destination";
  data?: TAddress;
  actionButton?: React.ReactNode;
}

export default function AddressForm({
  type,
  data,
  actionButton,
}: AddressFormProps) {
  const dispatch = useDispatch();
  const isLoaded = google.maps.places.AutocompleteService ? true : false;

  function getNewAddress(addressData: TAutocompleteData) {
    dispatch(setRequest({ [type!]: { ...data, ...addressData } }));
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    dispatch(setRequest({ [type!]: { ...data, [name]: value } }));
  }

  function handleZipCodeChange(e: React.ChangeEvent<HTMLInputElement>) {
    const zipCode = e.target.value;
    dispatch(setRequest({ [type!]: { ...data, zip: zipCode } }));
    if (zipCode.length === 5) {
      handleZipCodeSearch(zipCode).then((res) => {
        if (res.error) {
          toast.error(res.error);
        }
        if (res.values) {
          const { zip, city, state, location } = res.values;
          dispatch(
            setRequest({ [type!]: { ...data, zip, city, state, location } }),
          );
        }
      });
    }
  }

  function handleFloorChange(value: string) {
    dispatch(setRequest({ [type!]: { ...data, floor: value } }));
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-4 text-sm font-medium text-muted-foreground">
        <MapPinIcon className="size-5" />
        <div className="flex flex-1 items-center justify-between">
          <p className="capitalize">{type}</p>
          {actionButton}
        </div>
      </div>
      <div className="grid grid-cols-12 gap-2 md:pl-6">
        <div className="col-span-8">
          {isLoaded ? (
            <AutoCompleteInput
              value={data?.street || ""}
              getAddress={getNewAddress}
              placeholder="Full Address"
              title="Please enter your Full Address"
              name="street"
              onChange={handleInputChange}
            />
          ) : (
            <Input
              value={data?.street || ""}
              placeholder="Address"
              name="street"
              title="Please enter your Full Address"
              onChange={handleInputChange}
            />
          )}
        </div>
        <div className="col-span-4">
          <Input
            value={data?.apt || ""}
            placeholder="Apt. (optional)"
            title="Please enter your Apartment"
            name="apt"
            onChange={handleInputChange}
          />
        </div>
        <div className="col-span-6">
          <Input
            value={data?.city || ""}
            placeholder="City"
            title="Please enter your City"
            name="city"
            onChange={handleInputChange}
          />
        </div>
        <div className="col-span-3">
          <Input
            value={data?.state || ""}
            placeholder="State"
            title="Please enter your State"
            name="state"
            onChange={handleInputChange}
          />
        </div>
        <div className="col-span-3">
          <Input
            value={data?.zip || ""}
            placeholder="ZIP"
            title="Please enter your Zip"
            name="zip"
            pattern="[0-9]{5}"
            inputMode="numeric"
            maxLength={5}
            onChange={handleZipCodeChange}
          />
        </div>
        <div className="col-span-12">
          <Select
            value={data?.floor}
            onValueChange={(val) => handleFloorChange(val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select floor" />
            </SelectTrigger>
            <SelectContent>
              {floorOptions.map((item, i) => (
                <SelectItem
                  key={i}
                  value={item.value}
                  className="hover:cursor-pointer"
                  disabled={item.value === "5th floor"}
                >
                  {item.value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
