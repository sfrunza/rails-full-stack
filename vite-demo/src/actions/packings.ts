import { TPacking } from "@/types/packing";

export async function getPackings(): Promise<TPacking[]> {
  // await new Promise((resolve) => setTimeout(resolve, 1000));
  const response = await fetch("/api/v1/packings",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: localStorage.token,
      },
    });
  const data = await response.json();
  return data as TPacking[]
}


export async function addPacking(newPacking: {
  name: string;
  description: string;
  is_defalut: boolean;
  labor_increase: number;
  droppable_index: number;
}) {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  try {
    const response = await fetch("/api/v1/packings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: localStorage.token,
      },
      body: JSON.stringify(newPacking),
    });
    const data = await response.json();
    if (data.success) {
      return { success: data.success, packing: data.packing };
    } else {
      return { error: data.error };
    }
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
  }
}

export async function updatePacking(id: number, newPacking: {
  name: string;
  description: string;
  labor_increase: number;
}) {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  try {
    const response = await fetch(`/api/v1/packings/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: localStorage.token,
      },
      body: JSON.stringify(newPacking),
    });
    const data = await response.json();
    if (data.success) {
      return { success: data.success, packing: data.packing };
    } else {
      return { error: data.error };
    }
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
  }
}

export async function deletePacking(id: number) {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  try {
    const response = await fetch(`/api/v1/packings/${id}`, {
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

export async function updatePackingsOrder(packings: TPacking[]) {
  const packingsIds = [] as {
    droppable_index: string;
    id: number;
  }[];

  Object.entries(packings).forEach(([key, value]) => {
    packingsIds.push({
      droppable_index: key,
      id: value.id,
    });
  });
  await new Promise((resolve) => setTimeout(resolve, 1000));

  try {
    const response = await fetch("/api/v1/packings/update_order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: localStorage.token,
      },
      body: JSON.stringify({
        packings: packingsIds,
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