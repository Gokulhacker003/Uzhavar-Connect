// Configurable API base: set REACT_APP_API_URL to point to the hosted backend (e.g. https://uzhavar-connect.onrender.com)
const API_BASE = (process.env.REACT_APP_API_URL || '').replace(/\/$/, '');

function apiUrl(path) {a
  if (!path) path = '';
  // If API_BASE is empty, fall back to relative paths so local dev still works.
  if (!API_BASE) return path.startsWith('/') ? path : `/${path}`;
  return path.startsWith('/') ? `${API_BASE}${path}` : `${API_BASE}/${path}`;
}

// Example function to call backend API
export async function getHello() {
  const response = await fetch(apiUrl('/api/hello'));
  if (!response.ok) throw new Error('Network response was not ok');
  return response.json();
}
