import { authService } from './authService';

export const API_BASE_URL = 'http://localhost:8080';

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

/**
 * Generic fetch with bearer token and JSON handling.
 */
export async function fetchWithAuth(endpoint, options = {}) {
  // Check if token needs refreshing
  if (authService.needsRefresh()) {
    try {
      await authService.refreshToken();
    } catch {
    }
  }

  const token = authService.getStoredToken();
  if (!token) {
    throw new ApiError('No authentication token found', 401);
  }

  const isFormData = options.body instanceof FormData;

  const headers = {
    'Authorization': `Bearer ${token}`,
    ...(!isFormData && { 'Content-Type': 'application/json' }),
    ...options.headers
  };

  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers
    });

    if (res.status === 401) {
      try {
        await authService.refreshToken();
        // Retry the request with the new token
        const retryToken = authService.getStoredToken();
        const retryHeaders = {
          'Authorization': `Bearer ${retryToken}`,
          ...(!isFormData && { 'Content-Type': 'application/json' }),
          ...options.headers
        };

        const retryRes = await fetch(`${API_BASE_URL}${endpoint}`, {
          ...options,
          headers: retryHeaders
        });

        if (!retryRes.ok) {
          handleErrorResponse(retryRes);
        }

        return parseResponse(retryRes);
      } catch (refreshError) {
        await authService.logout();
        throw new ApiError(`Authentication failed. Please log in again. ${refreshError}`, 401);
      }
    }

    if (!res.ok) {
      handleErrorResponse(res);
    }

    return parseResponse(res);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(`Network error: ${error.message}`, 0);
  }
}

// Helper function to handle error responses
async function handleErrorResponse(res) {
  let errorMessage = `API request failed with status: ${res.status}`;

  try {
    const errorData = await res.json();
    if (errorData?.message) {
      errorMessage = errorData.message;
    }
  } catch {
  }

  throw new ApiError(errorMessage, res.status);
}

// Helper function to parse API responses
async function parseResponse(res) {
  if (res.status === 204) {
    return {};
  }

  try {
    return await res.json();
  } catch {
    return res;
  }
}