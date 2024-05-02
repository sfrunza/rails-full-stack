import { TNewData } from "@/types/request";

export async function createRequest(serviceId: number) {
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


export async function updateRequest(id: number, newData: TNewData) {
  // await new Promise((resolve) => setTimeout(resolve, 1000));

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