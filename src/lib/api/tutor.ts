import { apiFetch } from "./core";

const BASE_URL = process.env.NEXT_PUBLIC_AUTH_SERVICE_URL || "http://localhost:8080/api/v1";

export interface TutorChatRequest {
  lessonSlug: string;
  sessionId: string;
  message: string;
  context?: {
    sectionNumber?: number;
    componentType?: string;
  };
}

export interface TutorChatResponse {
  answer: string;
  sessionId: string;
  messageId: string;
  promptVersion: string;
}

export const tutorApi = {
  async chat(data: TutorChatRequest): Promise<TutorChatResponse> {
    return apiFetch<TutorChatResponse>(`${BASE_URL}/tutor/chat`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async listSessions(lessonSlug?: string): Promise<{ sessions: any[] }> {
    const query = lessonSlug ? `?lessonSlug=${lessonSlug}` : "";
    return apiFetch<{ sessions: any[] }>(`${BASE_URL}/tutor/sessions${query}`);
  },

  async getMessages(sessionId: string): Promise<{ messages: any[] }> {
    return apiFetch<{ messages: any[] }>(`${BASE_URL}/tutor/sessions/${sessionId}/messages`);
  },

  async submitFeedback(
    sessionId: string,
    messageId: string,
    rating: number,
    comment?: string,
    tags?: string[]
  ): Promise<{ success: boolean }> {
    return apiFetch<{ success: boolean }>(`${BASE_URL}/tutor/sessions/${sessionId}/messages/${messageId}/feedback`, {
      method: "POST",
      body: JSON.stringify({ rating, comment, tags }),
    });
  },

  async flagMessage(
    sessionId: string,
    messageId: string,
    reason: string
  ): Promise<{ success: boolean }> {
    return apiFetch<{ success: boolean }>(`${BASE_URL}/tutor/sessions/${sessionId}/messages/${messageId}/flag`, {
      method: "POST",
      body: JSON.stringify({ reason }),
    });
  },
};

