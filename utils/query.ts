export const query = async (uri: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/${uri}`,
  );

  if (!response.ok) {
    throw new Error('Network request failed');
  }
  return response.json();
};
