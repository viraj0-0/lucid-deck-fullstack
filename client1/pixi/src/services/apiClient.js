const DEFAULT_BACKEND =
  (typeof process !== "undefined" &&
    (process.env.REACT_APP_BACKEND_URL || process.env.VITE_BACKEND_URL)) ||
  "http://localhost:3000";

const post = async (path, payload) => {
  const url = `${DEFAULT_BACKEND.replace(/\/$/, "")}${path}`.replace(
    /\/api/,
    "/api"
  );
  const resp = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!resp.ok)
    throw new Error(`API Error: ${resp.status} ${await resp.text()}`);
  return resp.json();
};

export default { post };
