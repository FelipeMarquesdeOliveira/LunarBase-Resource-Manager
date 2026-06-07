const NASA_API_KEY = 'DEMO_KEY';
const NASA_BASE_URL = 'https://api.nasa.gov';

export interface ApodResponse {
  title: string;
  explanation: string;
  url: string;
  hdurl?: string;
  date: string;
  media_type: 'image' | 'video';
  copyright?: string;
  service_version: string;
}

export interface NeoWsResponse {
  element_count: number;
  near_earth_objects: {
    [date: string]: Array<{
      id: string;
      name: string;
      nasa_jpl_url: string;
      absolute_magnitude_h: number;
      estimated_diameter: {
        kilometers: {
          estimated_diameter_min: number;
          estimated_diameter_max: number;
        };
      };
      is_potentially_hazardous_asteroid: boolean;
      close_approach_data: Array<{
        close_approach_date: string;
        relative_velocity: {
          kilometers_per_second: string;
        };
        miss_distance: {
          lunar: string;
          kilometers: string;
        };
      }>;
    }>;
  };
}

async function nasaFetch<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
  const url = new URL(`${NASA_BASE_URL}${endpoint}`);
  url.searchParams.set('api_key', NASA_API_KEY);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`NASA API error: ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export async function getApod(): Promise<ApodResponse> {
  return nasaFetch<ApodResponse>('/planetary/apod', { hd: 'true' });
}

export async function getNeoWs(startDate: string, endDate: string): Promise<NeoWsResponse> {
  return nasaFetch<NeoWsResponse>('/neo/rest/v1/feed', {
    start_date: startDate,
    end_date: endDate,
  });
}

export async function getMarsRoverPhotos(rover: string = 'curiosity', sol: number = 1000): Promise<any> {
  return nasaFetch(`/mars-photos/api/v1/rovers/${rover}/photos`, {
    sol: String(sol),
    page: '1',
  });
}