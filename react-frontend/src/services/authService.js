const API_BASE_URL = 'http://localhost:8080';

export const authService = {
  // Get the Google OAuth URL from backend
  getAuthUrl: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/url`);
      if (!response.ok) {
        throw new Error('Failed to get auth URL');
      }
      const data = await response.json();
      return data.url;
    } catch {
    }
  },

  // Exchange code for token
  getToken: async (code) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/callback?code=${code}`);
      if (!response.ok) {
        throw new Error('Failed to get token');
      }
      return await response.json();
    } catch {
    }
  },

  // Save token data to localStorage
  setToken: (tokenData) => {
    localStorage.setItem('auth_token', tokenData.accessToken);
    localStorage.setItem('refresh_token', tokenData.refreshToken);
    localStorage.setItem('token_expiry', Date.now() + (tokenData.expiresIn * 1000));
  },

  // Get token from localStorage
  getStoredToken: () => {
    return localStorage.getItem('auth_token');
  },

  // Get refresh token from localStorage
  getStoredRefreshToken: () => {
    return localStorage.getItem('refresh_token');
  },

  // Get token expiry timestamp
  getTokenExpiry: () => {
    return localStorage.getItem('token_expiry');
  },

  // Check if token needs refreshing (if it expires in less than 5 minutes)
  needsRefresh: () => {
    const expiry = localStorage.getItem('token_expiry');
    if (!expiry) return false;

    // Check if token expires in less than 5 minutes
    return parseInt(expiry) - Date.now() < 5 * 60 * 1000;
  },

  // Check if user is logged in
  isLoggedIn: () => {
    return !!localStorage.getItem('auth_token');
  },

  // Refresh the access token using the refresh token
  refreshToken: async () => {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `refresh_token=${encodeURIComponent(refreshToken)}`,
      });

      if (!response.ok) {
        throw new Error('Failed to refresh token');
      }

      const tokenData = await response.json();
      authService.setToken(tokenData);
      return tokenData.accessToken;
    } catch (error) {
      // If refresh fails, log the user out
      await authService.logout();
      throw error;
    }
  },

  logout: async () => {
    try {
      // Get the token before removing it
      const token = localStorage.getItem('auth_token');

      // Remove tokens from localStorage
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('token_expiry');

      // Revoke the Google access token
      if (token) {
        try {
          // This revokes the token at Google
          await fetch(`https://oauth2.googleapis.com/revoke?token=${token}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          });
        } catch {
        }
      }

      // Redirect to login page
      window.location.href = '/login';

      return true;
    } catch {
      return false;
    }
  },
};