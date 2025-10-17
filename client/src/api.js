// Example function to call backend API
export async function getHello() {
  const response = await fetch('/api/hello');
  if (!response.ok) throw new Error('Network response was not ok');
  return response.json();
}
