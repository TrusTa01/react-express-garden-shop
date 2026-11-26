/**
 * Demo mode (VITE_DEMO=true, used for the static GitHub Pages build): the catalogue is
 * read from JSON files shipped with the build (`<base>/demo-api/…`), images are served
 * from the build itself, and form submissions are simulated without any network call.
 */
export const DEMO = import.meta.env.VITE_DEMO === 'true';

// Base URL of the backend API. Override with VITE_API_URL in frontend/.env.
export const API_URL = DEMO
  ? `${import.meta.env.BASE_URL}demo-api`
  : (import.meta.env.VITE_API_URL || 'http://localhost:3333').replace(/\/+$/, '');

// Image paths from the API are relative (e.g. "/product_img/1.jpeg").
// In demo mode the images are copied next to index.html, so they live under BASE_URL.
export const imageUrl = (path) =>
  DEMO ? `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}` : `${API_URL}${path}`;

/** GETs JSON from the API (in demo mode: from the static `<path>.json` file). */
export async function getJson(path) {
  const response = await fetch(DEMO ? `${API_URL}${path}.json` : `${API_URL}${path}`);
  if (!response.ok) throw new Error(`Server responded with ${response.status}`);
  return response.json();
}

const DEMO_DELAY_MS = 700;
// Same body the real API returns for accepted orders and coupon requests.
const DEMO_ACCEPTED = { status: 'OK', message: 'request processed' };

/**
 * POSTs JSON to the API. Throws an Error with the server's message
 * (`{ error: { message } }`) when the response is not 2xx.
 * In demo mode nothing is sent: the request "succeeds" after a short delay.
 */
export async function postJson(path, body) {
  if (DEMO) {
    await new Promise((resolve) => setTimeout(resolve, DEMO_DELAY_MS));
    return { ...DEMO_ACCEPTED };
  }
  let response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  } catch {
    throw new Error('Could not reach the server. Check your connection and try again.');
  }
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(data?.error?.message || `Request failed (${response.status}). Please try again.`);
  }
  return data;
}
