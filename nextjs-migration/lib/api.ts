import { config } from './config';
import { jwtService } from './jwt';

class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public errors?: Record<string, string[]>
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(
      errorData.message || 'An error occurred',
      response.status,
      errorData.errors
    );
  }
  return response.json();
}

function getHeaders(): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  const authHeader = jwtService.getAuthorizationHeader();
  if (authHeader) {
    headers['Authorization'] = authHeader;
  }

  return headers;
}

export const api = {
  async get<T>(
    path: string, 
    params?: Record<string, any>, 
    options?: { next?: { revalidate?: number, tags?: string[] } }
  ): Promise<T> {
    const queryString = params
      ? '?' + new URLSearchParams(params).toString()
      : '';
    
    const response = await fetch(`${config.api_url}${path}${queryString}`, {
      method: 'GET',
      headers: getHeaders(),
      ...options
    });

    return handleResponse<T>(response);
  },

  async post<T>(path: string, body?: any): Promise<T> {
    const response = await fetch(`${config.api_url}${path}`, {
      method: 'POST',
      headers: getHeaders(),
      body: body ? JSON.stringify(body) : undefined,
    });

    return handleResponse<T>(response);
  },

  async put<T>(path: string, body?: any): Promise<T> {
    const response = await fetch(`${config.api_url}${path}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: body ? JSON.stringify(body) : undefined,
    });

    return handleResponse<T>(response);
  },

  async delete<T>(path: string): Promise<T> {
    const response = await fetch(`${config.api_url}${path}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });

    return handleResponse<T>(response);
  },
};

export { ApiError };
