const DEFAULT_BASE_URL = 'http://localhost:5001';

export const ApiConfig = {
  getBaseUrl: (): string => {
    return DEFAULT_BASE_URL;
  },

  getEndpoints: () => ({
    resources: `${DEFAULT_BASE_URL}/resources`,
    simulation: `${DEFAULT_BASE_URL}/simulation`,
    events: `${DEFAULT_BASE_URL}/events`,
    telemetry: `${DEFAULT_BASE_URL}/telemetry`,
    spaceWeather: `${DEFAULT_BASE_URL}/space/weather`,
    spaceAsteroids: `${DEFAULT_BASE_URL}/space/asteroids`,
    spaceMars: `${DEFAULT_BASE_URL}/space/mars/weather`,
    crew: `${DEFAULT_BASE_URL}/crew`,
  }),
};

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  ok: boolean;
}

export async function apiGet<T>(url: string): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return { data: null, error: errorData.message || `HTTP ${response.status}`, ok: false };
    }
    const data = await response.json();
    return { data, error: null, ok: true };
  } catch (err) {
    return { data: null, error: 'Network error. Is the server running?', ok: false };
  }
}

export async function apiPost<T, R>(url: string, body: T): Promise<ApiResponse<R>> {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return { data: null, error: errorData.message || `HTTP ${response.status}`, ok: false };
    }
    const data = await response.json();
    return { data, error: null, ok: true };
  } catch (err) {
    return { data: null, error: 'Network error. Is the server running?', ok: false };
  }
}

export async function apiPut<T, R>(url: string, body: T): Promise<ApiResponse<R>> {
  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return { data: null, error: errorData.message || `HTTP ${response.status}`, ok: false };
    }
    const data = await response.json();
    return { data, error: null, ok: true };
  } catch (err) {
    return { data: null, error: 'Network error. Is the server running?', ok: false };
  }
}