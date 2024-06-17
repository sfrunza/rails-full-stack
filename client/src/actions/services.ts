import { TService } from "@/types/service";

export async function getServices(): Promise<TService[]> {
  // await new Promise((resolve) => setTimeout(resolve, 2000));
  const response = await fetch("/api/v1/services",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: localStorage.token,
      },
    });
  const data = await response.json();
  return data as { id: number, name: string, droppable_index: number }[]
}


export async function addService(newService: { name: string, droppable_index: number }) {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  try {
    const response = await fetch("/api/v1/services", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: localStorage.token,
      },
      body: JSON.stringify(newService),
    });
    const data = await response.json();
    if (data.success) {
      return { success: data.success, service: data.service };
    } else {
      return { error: data.error };
    }
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
  }
}

export async function deleteService(id: string) {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  try {
    const response = await fetch(`/api/v1/services/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: localStorage.token,
      },
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

export async function updateServicesOrder(services: TService[]) {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const servicesIds = [] as {
    droppable_index: string;
    id: number;
    name: string;
  }[];

  Object.entries(services).forEach(([key, value]) => {
    servicesIds.push({
      droppable_index: key,
      id: value.id,
      name: value.name,
    });
  });

  try {
    const response = await fetch("/api/v1/services/update_order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: localStorage.token,
      },
      body: JSON.stringify({
        services: servicesIds,
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