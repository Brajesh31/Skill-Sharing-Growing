import { fetchWithAuth } from "./apiClient";

const BASE = "/api/v1/notifications";

// put --> /api/v1/notifications/{notificationId}/read
// get --> /api/v1/notifications/user/{userId}
// get --> /api/v1/notifications/user/{userId}/unread/count
// delete --> /api/v1/notifications/{notificationId}

export const notificationService = {

    //get all notifications
    getAll: () => fetchWithAuth(BASE),
    
    //get notification by id
    getById: (id) => fetchWithAuth(`${BASE}/${id}`),
    
    //mark notification as read
    markAsRead: (notificationId) =>
        fetchWithAuth(`${BASE}/${notificationId}/read`, {
        method: "PUT",
        }),
    
    //get notifications by user id
    getByUserId: (userId) => fetchWithAuth(`${BASE}/user/${userId}`),
    
    //get unread notifications count by user id
    getUnreadCount: (userId) => fetchWithAuth(`${BASE}/user/${userId}/unread/count`),
    
    //delete notification by id
    delete: (notificationId) =>
        fetchWithAuth(`${BASE}/${notificationId}`, {
        method: "DELETE",
        }),

    //mark all notifications as read
    markAllAsRead: () =>
        fetchWithAuth(`${BASE}/me/read/all`, {
        method: "PUT",
        }),
};