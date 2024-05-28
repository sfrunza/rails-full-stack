import {
  DirectionsRenderer,
  GoogleMap,
  LoadScriptProps,
  Marker,
  useLoadScript,
} from "@react-google-maps/api";
import { memo, useEffect, useState } from "react";
import markerRed from "@/assets/marker-red-2.jpeg";
import markerGreen from "@/assets/marker-green-2.jpeg";
import markerBlue from "@/assets/marker-blue-2.jpeg";

import mapStyles from "./mapStyles";
import { useSelector } from "@/store";
import { TAddress } from "@/types/request";

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string;

function calculateMapCenter(
  origin: TAddress,
  destination: TAddress,
): google.maps.LatLng | google.maps.LatLngLiteral | undefined {
  if (origin.city) {
    return origin.location;
  } else if (destination.city) {
    return destination.location;
  }
  return undefined;
}

const libraries = ["places"];

const convertTime = (value: number) => {
  value = Number(value);
  var h = Math.floor(value / 3600);
  var m = Math.floor((value % 3600) / 60);

  var hDisplay = h > 0 ? h + (h === 1 ? " hour " : " hours ") : "";
  var mDisplay = m > 0 ? m + (m === 1 ? " min " : " mins") : "";
  return hDisplay + mDisplay;
};

const Map = () => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: API_KEY,
    libraries: libraries as LoadScriptProps["libraries"],
  });
  const { request } = useSelector((state) => state.request);

  const { origin, destination, stops } = request!;

  const [directionsResult, setDirectionsResult] =
    useState<google.maps.DirectionsResult | null>(null);
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");

  useEffect(() => {
    if (isLoaded) {
      calculateRoute();
    }

    return () => {
      setDirectionsResult(null);
    };
  }, [isLoaded, origin, destination, stops]);

  async function calculateRoute() {
    if (origin.city && destination.city) {
      const directionsService = new google.maps.DirectionsService();
      const results = await directionsService.route({
        origin: origin.location,
        destination: destination.location,
        waypoints: stops.map((stop) => ({ location: stop.location })),
        travelMode: google.maps.TravelMode.DRIVING,
      });
      let resp = results.routes[0].legs;
      let miles = 0;
      let time = 0;

      resp.map((leg: google.maps.DirectionsLeg) => {
        if (leg.distance && leg.duration) {
          miles += leg.distance.value;
          time += leg.duration.value;
        }
        return 0;
      });
      setDirectionsResult(results);
      setDistance((miles / 1609).toFixed(1) + " mi");
      setDuration(convertTime(time));
    }
  }

  return (
    <div className="relative flex h-52 w-full flex-col items-center justify-center gap-1 lg:h-full">
      {isLoaded && (
        <GoogleMap
          center={calculateMapCenter(origin, destination)}
          zoom={directionsResult ? 14 : 15}
          // onLoad={onLoad}
          // onUnmount={onUnmount}
          mapContainerStyle={{
            height: "100%",
            width: "100%",
            margin: "auto",
          }}
          options={{
            zoomControl: false,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
            styles: mapStyles as google.maps.MapTypeStyle[],
            scrollwheel: true,
          }}
        >
          {origin.city && (
            <Marker
              position={origin.location}
              icon={{
                url: markerGreen,
                scaledSize: new google.maps.Size(18, 22),
              }}
            />
          )}
          {destination.city && (
            <Marker
              position={destination.location}
              icon={{
                url: markerRed,
                scaledSize: new google.maps.Size(18, 22),
              }}
            />
          )}
          {stops.length > 0 &&
            stops.map((stop, index) => (
              <Marker
                key={`stop-${index}`}
                position={stop.location}
                icon={{
                  url: markerBlue,
                  scaledSize: new google.maps.Size(18, 22),
                }}
              />
            ))}
          {directionsResult && (
            <DirectionsRenderer
              directions={directionsResult}
              routeIndex={0}
              options={{
                suppressMarkers: true,
                polylineOptions: {
                  strokeWeight: 3,
                  strokeColor: "#4AB5FB",
                },
              }}
            />
          )}
        </GoogleMap>
      )}

      {directionsResult && (
        <p className="absolute right-0 top-0 rounded bg-green-200/40 px-2 py-1 text-center text-xs font-semibold text-green-600">
          {distance} ({duration})
        </p>
      )}
    </div>
  );
};

export default memo(Map);
