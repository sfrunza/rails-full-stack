import { TNewRequestData } from "@/types/request";

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string;

export async function createRequestAction(serviceId: number) {
  try {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const response = await fetch("/api/v1/requests", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: localStorage.token,
      },
      body: JSON.stringify({ service_id: serviceId }),
    });
    const data = await response.json();
    if (data.success) {
      return { success: data.success, request: data.request };
    } else {
      return { error: data.error };
    }
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
  }
}


export async function updateRequestAction(id: number, newData: TNewRequestData) {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // console.log("updateRequest", id, newData);

  try {
    const response = await fetch(`/api/v1/requests/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: localStorage.token,
      },
      body: JSON.stringify({
        request: newData,
      }),
    });
    const data = await response.json();

    if (data.success) {
      return { success: data.success };
    } else {
      return { error: data.error };
    }
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
  }
}


export async function handleZipCodeSearch(zipCode: string) {
  if (!zipCode) {
    return { error: "Please enter a ZIP code" };
  }

  const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${zipCode}&key=${API_KEY}`;

  try {
    const response = await fetch(geocodeUrl);
    const data = await response.json();

    if (data.results.length > 0) {
      const addressComponents = data.results[0].address_components;
      const cityComponent = addressComponents.find((component: any) =>
        component.types.includes("locality"),
      );
      const stateComponent = addressComponents.find((component: any) =>
        component.types.includes("administrative_area_level_1"),
      );

      const location = data.results[0].geometry.location;

      const values = {
        zip: zipCode,
        city: cityComponent ? cityComponent.long_name : "",
        state: stateComponent ? stateComponent.short_name : "",
        location,
      };

      console.log("values", values);

      return { values };

    } else {
      return { error: "No Zip found" };
    }
  } catch (err) {
    return { error: "Error fetching data" };
  }
};