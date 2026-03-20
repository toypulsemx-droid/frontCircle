const API_URL = import.meta.env.VITE_API_WEB

export const getEvents = async () => {
  const response = await fetch(`${API_URL}/web/get-events`);
  const data = await response.json();
  console.log(data)
  return await data
}