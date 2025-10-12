import { RestaurantModel } from "@/app/models/RestaurantModel";

export const getPaginatedRestaurants = async (
  page: number = 0,
  size: number = 10,
  token: string = ''
): Promise<RestaurantModel[] | null> => {
  const headers = new Headers();
  headers.append("Content-Type", "application/json");
  headers.append("Authorization", `Bearer ${token}`);

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_PLAZA_HOST}/restaurants?page=${page}&size=${size}`,
      {
        headers: headers,
        method: "GET",
      }
    );

    return await response.json();
  } catch (error) {
    throw new Error(`Could not find requested resources: ${error}`);
  }
};
