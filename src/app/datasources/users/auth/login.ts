export const login = async (email: string, password: string) => {
  const body = JSON.stringify({ email, password });
  const headers = new Headers();
  headers.append("Content-Type", "application/json");

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_USERS_HOST}/auth/login`,
      {
        method: "POST",
        headers,
        body,
      }
    );

    if (!response) return null;
    
    return await response.json();
  } catch (error) {
    console.log(`Error retrieving the requested data: ${error}`);
  }
};
