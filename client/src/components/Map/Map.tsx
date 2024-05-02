import {
  DirectionsRenderer,
  GoogleMap,
  LoadScriptProps,
  Marker,
  useLoadScript,
} from "@react-google-maps/api";
import { memo, useCallback, useEffect, useState } from "react";
import markerRed from "assets/marker-red-2.jpeg";
import markerGreen from "assets/marker-green-2.jpeg";
import markerBlue from "assets/marker-blue-2.jpeg";

import mapStyles from "./mapStyles";
import { useSelector } from "store";

const API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY as string;
const CENTER: google.maps.LatLngLiteral = { lat: 42.36, lng: -71.06 };

const libraries = ["places"];

const convertTime = (value: number) => {
  value = Number(value);
  var h = Math.floor(value / 3600);
  var m = Math.floor((value % 3600) / 60);

  var hDisplay = h > 0 ? h + (h === 1 ? " hour " : " hours ") : "";
  var mDisplay = m > 0 ? m + (m === 1 ? " min " : " mins") : "";
  return hDisplay + mDisplay;
};

function getFullAddress(address: {
  street: string;
  city: string;
  state: string;
  zip: string;
}) {
  return `${address.street} ${address.city}, ${address.state} ${address.zip} USA`;
}

const Map = () => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: API_KEY,
    libraries: libraries as LoadScriptProps["libraries"],
  });
  const { request } = useSelector((state) => state.request);

  const { origin, destination, stops } = request!;

  // const waypoints = ["Newton, MA", "Waltham, MA", "Watertown, MA"];
  const waypoints = [] as string[];
  // const request = {
  //   origin: {
  //     street: "123 Main St",
  //     city: "Boston",
  //     state: "MA",
  //     zip: "02101",
  //   },
  //   destination: {
  //     street: "456 Elm St",
  //     city: "Boston",
  //     state: "MA",
  //     zip: "02101",
  //   },
  // };

  const [directionsResult, setDirectionsResult] =
    useState<google.maps.DirectionsResult | null>(null);
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  const [marker, setMarker] = useState<google.maps.LatLng>();
  const [originCoords, setOriginCoords] = useState<google.maps.LatLngLiteral>();
  const [destinationCoords, setDestinationCoords] =
    useState<google.maps.LatLngLiteral>();
  const [waypointsCoords, setWaypointsCoords] = useState<
    google.maps.LatLngLiteral[]
  >([]);

  const o = getFullAddress(origin);
  const d = getFullAddress(destination);

  const geocoder = isLoaded ? new google.maps.Geocoder() : null;

  const geocodeAddress = (
    address: string,
  ): Promise<google.maps.LatLngLiteral> => {
    return new Promise((resolve, reject) => {
      if (!geocoder) {
        return;
      }
      geocoder.geocode({ address }, (results, status) => {
        if (
          status === google.maps.GeocoderStatus.OK &&
          results &&
          results.length > 0
        ) {
          const location = results[0].geometry.location;
          resolve({ lat: location.lat(), lng: location.lng() });
        } else {
          const errorMessage = `Geocode failed for address: ${address}. Status: ${status}`;
          console.error(errorMessage);
          reject(new Error(errorMessage));
        }
      });
    });
  };
  // const d = null;

  // console.log("Map render", waypointsCoords);

  useEffect(() => {
    if (isLoaded) {
      calculateRoute();
    }

    return () => {
      setDirectionsResult(null);
    };
  }, [isLoaded, origin, destination, stops]);

  // const onLoad = useCallback(() => {
  //   calculateRoute();
  // }, [origin, destination, stops]);

  // const onUnmount = useCallback(() => {
  //   setDirectionsResult(null);
  // }, []);

  function generateWaypoints() {
    const waypointsCoordsArr = [] as google.maps.LatLngLiteral[];

    waypoints.map(async (waypoint) => {
      let res = await geocodeAddress(waypoint);
      waypointsCoordsArr.push(res);
      // console.log("waypoint", res);
      setWaypointsCoords((prev) => [...prev, res]);
    });

    // console.log("waypointsCoordsArr", waypointsCoordsArr);
    // setWaypointsCoords(waypointsCoordsArr);
  }

  async function calculateRoute() {
    // const d = null;
    if (!origin.city || !destination.city) {
      return;
    }

    if (o && d) {
      const directionsService = new google.maps.DirectionsService();
      const results = await directionsService.route({
        origin: o,
        destination: d,
        waypoints: waypoints.map((waypoint) => ({ location: waypoint })),
        travelMode: google.maps.TravelMode.DRIVING,
      });

      const originCoords = await geocodeAddress(o);
      const destinationCoords = await geocodeAddress(d);

      // const waypointsCoordsArr = [] as google.maps.LatLngLiteral[];

      // waypoints.map(async (waypoint) => {
      //   let res = await geocodeAddress(waypoint);
      //   waypointsCoordsArr.push(res);
      // });

      setOriginCoords(originCoords);
      setDestinationCoords(destinationCoords);
      generateWaypoints();
      // setWaypointsCoords(waypointsCoordsArr);

      let resp = results.routes[0].legs;
      let distance = 0;
      let time = 0;

      resp.map((leg: google.maps.DirectionsLeg) => {
        if (leg.distance && leg.duration) {
          distance += leg.distance.value;
          time += leg.duration.value;
        }
        return 0;
      });

      // console.log(results);
      setDirectionsResult(results);
      setDistance((distance / 1609).toFixed(1) + " mi");
      setDuration(convertTime(time));
    } else if ((o && !d) || (!o && d)) {
      const geocoder = new google.maps.Geocoder();
      await geocoder.geocode(
        { address: o || d },
        function (
          results: google.maps.GeocoderResult[] | null,
          status: google.maps.GeocoderStatus,
        ) {
          // console.log(results);
          if (status === "OK" && results) {
            setMarker(results[0].geometry.location);
          } else {
            alert(
              "Geocode was not successful for the following reason: " + status,
            );
          }
        },
      );
    }
  }

  console.log("waypointsCoords.", waypointsCoords.length);

  return (
    <div className="relative flex h-52 w-full flex-col items-center justify-center gap-1 lg:h-full">
      {isLoaded && (
        <GoogleMap
          center={directionsResult ? CENTER : marker}
          // zoom={directionsResult ? 14 : 15}
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
          {directionsResult ? (
            <DirectionsRenderer
              directions={directionsResult}
              routeIndex={0}
              options={{
                // suppressMarkers: true,
                polylineOptions: {
                  strokeWeight: 3,
                  strokeColor: "#4AB5FB",
                },
              }}
            />
          ) : marker ? (
            <Marker position={marker!} />
          ) : null}
          {/* <Marker
            position={originCoords!}
            icon={{
              url: markerGreen,
              scaledSize: new google.maps.Size(24, 30),
            }}
          />

          <Marker
            position={destinationCoords!}
            icon={{
              url: markerRed,
              scaledSize: new google.maps.Size(24, 30),
            }}
          />

          {waypointsCoords.length > 0 &&
            waypointsCoords.map((waypoint, index) => {
              console.log("waypoint", waypoint);
              return (
                <Marker
                  key={index}
                  position={waypoint}
                  icon={{
                    url: markerBlue,
                    scaledSize: new window.google.maps.Size(24, 30),
                  }}
                />
              );
            })} */}
        </GoogleMap>
      )}

      {directionsResult && (
        <p className="absolute right-0 top-0 rounded bg-green-200/40 px-2 py-1 text-center text-xs font-bold text-green-600">
          {distance} ({duration})
        </p>
      )}
    </div>
  );
};

export default memo(Map);
