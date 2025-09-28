import { BASE_URL } from './constants';

export async function fetchJSON(path) {
  console.log('Fetching:', `${BASE_URL}${path}`);
  const res = await fetch(`${BASE_URL}${path}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  console.log('Response:', data);
  return data;
}