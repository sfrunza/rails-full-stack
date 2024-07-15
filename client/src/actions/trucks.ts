import { TTruck } from "@/types/truck";

export async function getParklotTrucks(): Promise<TTruck[]> {
  // await new Promise((resolve) => setTimeout(resolve, 1000));
  const response = await fetch("/api/v1/parklots/trucks",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: localStorage.token,
      },
    });
  const data = await response.json();
  return data as TTruck[]
}


export async function getTrucks(): Promise<TTruck[]> {
  // await new Promise((resolve) => setTimeout(resolve, 1000));
  const response = await fetch("/api/v1/trucks",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: localStorage.token,
      },
    });
  const data = await response.json();
  return data as TTruck[]
}


export async function addTruck(newTruck: {
  name: string;
}) {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  try {
    const response = await fetch("/api/v1/trucks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: localStorage.token,
      },
      body: JSON.stringify(newTruck),
    });
    const data = await response.json();
    if (data.success) {
      return { success: data.success, truck: data.truck };
    } else {
      return { error: data.error };
    }
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
  }
}



export async function updateTrucks(newTruckList: TTruck[]) {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  try {
    const response = await fetch("/api/v1/trucks/bulk_update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: localStorage.token,
      },
      body: JSON.stringify({ trucks: newTruckList }),
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
