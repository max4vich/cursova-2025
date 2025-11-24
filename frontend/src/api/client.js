const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";
const TOKEN_KEY = "techshop:token";

const getToken = () => localStorage.getItem(TOKEN_KEY);

const setToken = (token) => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
};

const request = async (path, options = {}) => {
  const isFormData = options.body instanceof FormData;
  const headers = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(options.headers || {}),
  };
  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const init = {
    ...options,
    headers,
    body: isFormData ? options.body : options.body ? JSON.stringify(options.body) : undefined,
  };

  const response = await fetch(`${API_BASE_URL}${path}`, init);

  const contentType = response.headers.get("content-type") || "";
  const payload = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message = payload?.message || "Request failed";
    throw new Error(message);
  }

  return payload.data ?? payload;
};

export { API_BASE_URL, getToken, setToken, request };

