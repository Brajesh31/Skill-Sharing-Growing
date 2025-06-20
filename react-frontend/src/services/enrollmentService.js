import { fetchWithAuth } from "./apiClient";

const BASE = "/api/v1/enrollments";


export const enrollmentService = {
  // GET all enrolments for one user
  getAll: () => fetchWithAuth(`${BASE}`),

  // GET enrolment by ID
  getById: (id) => fetchWithAuth(`${BASE}/${id}/enrolment`),

  // POST to enroll in a roadmap
  create: (planId) =>
    fetchWithAuth(`${BASE}/${planId}/enrol`, {
      method: "POST",
    }),  

  // PUT to update progress
  update: (data, roadmapId) =>
    fetchWithAuth(`${BASE}/${roadmapId}/progress`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  // DELETE enrolment by ID
  delete: (id) =>
    fetchWithAuth(`${BASE}/${id}`, {
      method: "DELETE",
    }),
};
