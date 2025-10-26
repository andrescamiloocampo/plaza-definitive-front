export const getDishesByRestaurantId = async (
  rid: number,
  page: number,
  size: number,
  token: string = ''
) => {
  const headers = new Headers();
  headers.append("Content-Type", "application/json");
  headers.append("Authorization", `Bearer ${token}`);  

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_PLAZA_HOST}/dishes?rid=${rid}&page=${page}&size=${size}`,
      {
        method: "GET",
        headers,
      }
    );

    return await response.json();
  } catch (error) {
    throw new Error(`Could not find requested resources: ${error}`);
  }
};
