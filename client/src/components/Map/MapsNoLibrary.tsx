import { LoadScriptProps, useLoadScript } from "@react-google-maps/api";
import React, { useRef, useEffect } from "react";
import mapStyles from "./mapStyles";
import greenMarker from "assets/marker-red-2.jpeg";
import redMarker from "assets/marker-green-2.jpeg";

export default function MapsNoLibrary() {
  const mapRef = useRef<google.maps.Map | HTMLDivElement | null>(null);

  const originAddress = "Dedham, MA";
  const destinationAddress = "Brookline, MA";
  const waypoints = ["Newton, MA", "Waltham, MA", "Watertown, MA"];

  // const { isLoaded } = useLoadScript({
  //   googleMapsApiKey: API_KEY,
  //   libraries: libraries as LoadScriptProps["libraries"],
  // });

  useEffect(() => {
    const geocoder = new google.maps.Geocoder();
    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer({
      suppressMarkers: true,
    });

    const geocodeAddress = (
      address: string,
    ): Promise<google.maps.LatLngLiteral> => {
      return new Promise((resolve, reject) => {
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

    // const loadMap = async () => {
    //   if (mapRef.current) {
    //     const originCoords = await geocodeAddress(originAddress);
    //     const destinationCoords = await geocodeAddress(destinationAddress);

    //     const mapOptions: google.maps.MapOptions = {
    //       center: originCoords, // Center the map on the origin coordinates
    //       zoom: 12,
    //     };
    //     const map = new google.maps.Map(mapRef.current as any, mapOptions);

    //     // Create custom marker for the origin (green)
    //     const originMarker = new google.maps.Marker({
    //       position: originCoords,
    //       map,
    //       icon: {
    //         path: google.maps.SymbolPath.CIRCLE,
    //         scale: 10,
    //         fillColor: "green",
    //         fillOpacity: 1,
    //         strokeWeight: 1,
    //       },
    //       title: "Origin",
    //     });

    //     // Create custom marker for the destination (red)
    //     const destinationMarker = new google.maps.Marker({
    //       position: destinationCoords,
    //       map,
    //       icon: {
    //         path: google.maps.SymbolPath.CIRCLE,
    //         scale: 10,
    //         fillColor: "red",
    //         fillOpacity: 1,
    //         strokeWeight: 1,
    //       },
    //       title: "Destination",
    //     });
    //   }
    // };
    const loadMap = async () => {
      try {
        if (mapRef.current) {
          const originCoords = await geocodeAddress(originAddress);
          const destinationCoords = await geocodeAddress(destinationAddress);

          const mapOptions: google.maps.MapOptions = {
            center: originCoords, // Center the map on the origin coordinates
            zoom: 8,
            zoomControl: false,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
            styles: mapStyles as google.maps.MapTypeStyle[],
            scrollwheel: true,
          };
          const map = new google.maps.Map(mapRef.current as any, mapOptions);

          // Set up DirectionsRenderer to display route on the map
          directionsRenderer.setMap(map);

          // Calculate route between origin and destination
          const routeRequest: google.maps.DirectionsRequest = {
            origin: originAddress,
            destination: destinationAddress,
            waypoints: waypoints.map((waypoint) => ({ location: waypoint })),
            travelMode: google.maps.TravelMode.DRIVING,
          };
          directionsService.route(routeRequest, (response, status) => {
            if (status === google.maps.DirectionsStatus.OK && response) {
              directionsRenderer.setDirections(response);
              console.log("Directions response:", response);

              const legs = response.routes[0].legs[0];
              console.log("Start Address:", legs.start_address);
              console.log("End Address:", legs.end_address);
              // console.log('Distance:', legs.distance.text);
              // console.log('Duration:', legs.duration.text);
              const originMarker = new google.maps.Marker({
                position: response.routes[0].legs[0].start_location,
                map,
                icon: {
                  url: greenMarker, // Green marker icon
                  scaledSize: new google.maps.Size(24, 30), // Custom icon size
                },
              });

              // Customize destination marker
              const destinationMarker = new google.maps.Marker({
                position:
                  response.routes[0].legs[response.routes[0].legs.length - 1]
                    .end_location,
                map,
                icon: {
                  url: redMarker, // Red marker icon
                  scaledSize: new google.maps.Size(24, 30), // Custom icon size
                },
              });

              for (let i = 1; i < response.routes[0].legs.length - 1; i++) {
                const waypointMarker = new google.maps.Marker({
                  position: response.routes[0].legs[i].start_location,
                  map,
                  icon: {
                    url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png", // Blue marker icon
                    scaledSize: new google.maps.Size(24, 30), // Custom icon size (width, height)
                  },
                });
              }

              // Customize waypoint markers (blue)
              // response.routes[0].legs.map((waypointLocation) => {
              //   const waypointMarker = new google.maps.Marker({
              //     position: waypointLocation.end_location,
              //     map,
              //     icon: {
              //       url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png", // Blue marker icon
              //       scaledSize: new google.maps.Size(24, 30), // Custom icon size (width, height)
              //     },
              //   });
              // });
            } else {
              console.error("Directions request failed:", status);
            }
          });
        }
      } catch (error) {
        console.error("Error loading map:", error);
      }
    };

    loadMap();

    return () => {
      // Clean up when the component is unmounted
    };
  }, [originAddress, destinationAddress]);

  return (
    <div ref={mapRef as any} className="h-full w-full">
      {/* Map container */}
    </div>
  );
}
