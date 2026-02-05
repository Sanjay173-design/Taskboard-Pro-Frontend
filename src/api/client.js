export async function apiFetch(path, accessToken, options = {}) {
  if (!accessToken) {
    throw new Error("Missing access token");
  }

  const base = import.meta.env.VITE_API_BASE_URL.replace(/\/$/, "");

  const res = await fetch(`${base}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    throw new Error(`API error ${res.status}`);
  }

  return res.json();
}
