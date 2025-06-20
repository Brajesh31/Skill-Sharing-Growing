import { fetchWithAuth } from "./apiClient";

const BASE = "/api/v1/skill-posts";

export const skillPostService = {
    getAll: () => fetchWithAuth(BASE),
    getById: (id) => fetchWithAuth(`${BASE}/${id}`),

    create: ({
        skillName,
        title,
        description,
        images,
        video,
        videoDurationSeconds,
    }) => {
        const query = new URLSearchParams({ skillName, title });
        if (description) query.append("description", description);
        if (videoDurationSeconds != null)
            query.append("videoDurationSeconds", String(videoDurationSeconds));

        const formData = new FormData();
        if (images?.length) {
            images.forEach((img) => formData.append("images", img));
        }
        if (video) {
            formData.append("video", video);
        }

        return fetchWithAuth(`${BASE}?${query.toString()}`, {
            method: "POST",
            body: formData,
            headers: {}
        });
    },


    update: (
        id,
        {
            skillName,
            title,
            description,
            images,
            video,
            videoDurationSeconds,
            removeImages,
            removeVideo,
        }
    ) => {
        const query = new URLSearchParams();
        if (skillName) query.append("skillName", skillName);
        if (title) query.append("title", title);
        if (description) query.append("description", description);
        if (videoDurationSeconds != null)
            query.append("videoDurationSeconds", String(videoDurationSeconds));
        if (removeImages != null) query.append("removeImages", String(removeImages));
        if (removeVideo != null) query.append("removeVideo", String(removeVideo));
        const formData = new FormData();
        if (images?.length) {
            images.forEach((img) => formData.append("images", img));
        }
        if (video) {
            formData.append("video", video);
        }
        return fetchWithAuth(`${BASE}/${id}?${query.toString()}`, {
            method: "PUT",
            body: formData,
            headers: {}
        });
    },

    delete: (id) =>
        fetchWithAuth(`${BASE}/${id}`, {
            method: "DELETE",
        }),

    addComment: (id, data) =>
        fetchWithAuth(`${BASE}/${id}/comments`, {
            method: "POST",
            body: JSON.stringify(data),
        }),
    editComment: (id, commentId, data) =>
        fetchWithAuth(`${BASE}/${id}/comments/${commentId}`, {
            method: "PUT",
            body: JSON.stringify(data),
        }),
    removeComment: (id, commentId) =>
        fetchWithAuth(`${BASE}/${id}/comments/${commentId}`, {
            method: "DELETE",
        }),

    addLike: (id) =>
        fetchWithAuth(`${BASE}/${id}/like`, {
            method: "POST",
        }),
    removeLike: (id) =>
        fetchWithAuth(`${BASE}/${id}/like`, {
            method: "DELETE",
        }),

    getPostsByUser: (userId) => fetchWithAuth(`${BASE}/user/${userId}`),
    getSuggestedPosts: (limit) => {
        const query = limit ? `?limit=${limit}` : "";
        return fetchWithAuth(`${BASE}/suggested${query}`);
    },
    getPostsBySkill: (skillName) =>
        fetchWithAuth(`${BASE}/skill/${encodeURIComponent(skillName)}`),

    getPublicSuggestedPosts: (limit) => {
        const query = limit ? `?limit=${limit}` : "";
        return fetchWithAuth(
            `/api/v1/skill-posts/public/suggested${query}`
        );
    },
    getFeaturedSkillPosts: () =>
        fetch(`http://localhost:8080${BASE}/public/featured`),
    getCurrentUserPosts: () => fetchWithAuth(`${BASE}/me`),
    getLikedPosts: () => fetchWithAuth(`${BASE}/liked`),
    getFeed: () => fetchWithAuth(`${BASE}/feed`),
    getLikesForAllPostsByUser: (userId) =>
        fetchWithAuth(`${BASE}/user/${userId}/total-likes`),
    getLikesForAllPostsForCurrentUser: () =>
        fetchWithAuth(`${BASE}/me/total-likes`),
};
