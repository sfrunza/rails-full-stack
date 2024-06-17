import { forwardRef, useEffect, useState } from "react";
import { Autocomplete } from "@react-google-maps/api";

import { Input } from "@/components/ui/input";

export type TAutocompleteData = {
  street: string;
  city: string;
  state: string;
  zip: string;
  fullAddress: string;
  location: google.maps.LatLng | google.maps.LatLngLiteral;
};

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  getAddress: (data: TAutocompleteData) => void;
  updateValue?: (val: string) => void;
}

export const AutoCompleteInput = forwardRef<HTMLInputElement, InputProps>(
  ({ type, getAddress, updateValue, ...props }, ref) => {
    const [searchResult, setSearchResult] =
      useState<google.maps.places.Autocomplete>();

    function onLoad(autocomplete: google.maps.places.Autocomplete) {
      autocomplete.setComponentRestrictions({
        country: "us",
      });
      setSearchResult(autocomplete);
    }

    function onPlaceChanged() {
      if (searchResult != null) {
        const place = searchResult.getPlace();
        const addressComponents =
          place.address_components as google.maps.GeocoderAddressComponent[];

        let street = "";
        let city = "";
        let state = "";
        let zip = "";

        addressComponents.forEach((component) => {
          const types = component.types;
          if (types.includes("premise")) {
            street = component.long_name;
          } else if (types.includes("street_number")) {
            street = component.long_name;
          } else if (types.includes("route")) {
            street += " " + component.long_name;
          } else if (
            ["locality", "neighborhood"].some((str) => types.includes(str))
          ) {
            city = component.long_name;
          } else if (types.includes("administrative_area_level_1")) {
            state = component.short_name;
          } else if (types.includes("postal_code")) {
            zip = component.long_name;
          }
        });

        const data = {
          street: street!,
          city: city!,
          state: state!,
          zip: zip!,
          fullAddress: place?.formatted_address!,
          location: {
            lat: place?.geometry?.location?.lat()!,
            lng: place?.geometry?.location?.lng()!,
          },
        };

        getAddress(data);
      }
    }

    useEffect(() => {
      // Disable Radix ui dialog pointer events lockout
      setTimeout(() => (document.body.style.pointerEvents = ""), 0);
    });

    return (
      <>
        <Autocomplete onPlaceChanged={onPlaceChanged} onLoad={onLoad}>
          <Input {...props} ref={ref} />
        </Autocomplete>
      </>
    );
  },
);

AutoCompleteInput.displayName = "AutoCompleteInput";
