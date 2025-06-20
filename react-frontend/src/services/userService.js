import { fetchWithAuth } from './apiClient';

const BASE = '/api/v1/users';
//user
export const userService = {
  getMe: () => fetchWithAuth(`${BASE}/me`),
  updateBio: (bio) => fetchWithAuth(`${BASE}/bio`, { method: 'PUT', body: JSON.stringify({ bio }) }),
  getUserById: (userId) => fetchWithAuth(`${BASE}/${userId}`),
  followUser: (userId) => fetchWithAuth(`${BASE}/follow/${userId}`, { method: 'POST' }),
  unfollowUser: (userId) => fetchWithAuth(`${BASE}/unfollow/${userId}`, { method: 'POST' }),
  getFollowers: (userId) => fetchWithAuth(`${BASE}/${userId}/followers`),
  getFollowing: (userId) => fetchWithAuth(`${BASE}/${userId}/following`),

};
