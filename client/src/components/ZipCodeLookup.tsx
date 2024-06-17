import React, { useState } from "react";
import axios from "axios";

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string;

interface Location {
  city: string;
  state: string;
}

export default function ZipCodeLookup() {
  const [zipCode, setZipCode] = useState<string>("");
  const [location, setLocation] = useState<Location>({ city: "", state: "" });
  const [error, setError] = useState<string>("");

  const handleZipCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setZipCode(e.target.value);
  };

  const handleSearch = async () => {
    if (!zipCode) {
      setError("Please enter a ZIP code.");
      return;
    }

    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${zipCode}&key=${API_KEY}`;

    try {
      const response = await axios.get(geocodeUrl);
      const results = response.data.results;

      if (results.length > 0) {
        const addressComponents = results[0].address_components;
        const cityComponent = addressComponents.find((component: any) =>
          component.types.includes("locality"),
        );
        const stateComponent = addressComponents.find((component: any) =>
          component.types.includes("administrative_area_level_1"),
        );

        setLocation({
          city: cityComponent ? cityComponent.long_name : "",
          state: stateComponent ? stateComponent.long_name : "",
        });
        setError("");
      } else {
        setError("No results found.");
      }
    } catch (err) {
      setError("Error fetching data.");
    }
  };

  return (
    <div>
      <input
        type="text"
        value={zipCode}
        onChange={handleZipCodeChange}
        placeholder="Enter ZIP code"
      />
      <button onClick={handleSearch}>Search</button>

      {error && <p>{error}</p>}
      {location.city && <p>City: {location.city}</p>}
      {location.state && <p>State: {location.state}</p>}
    </div>
  );
}
