import { getAccessToken } from "./core";

export interface StreamEvent {
  type: "token" | "done" | "error";
  content?: string;
  messageId?: string;
  citations?: string[];
  code?: string;
  message?: string;
}

export interface StreamOptions {
  lessonSlug: string;
  message: string;
  clientMessageId: string;
  onToken: (token: string) => void;
  onDone: (data: { messageId: string; citations: string[] }) => void;
  onError: (err: any) => void;
  signal?: AbortSignal;
}

const BASE_URL = process.env.NEXT_PUBLIC_AUTH_SERVICE_URL || "http://localhost:8080/api/v1";

export async function fetchTutorStream(
  sessionId: string,
  options: StreamOptions
): Promise<void> {
  const token = getAccessToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(token ? { "Authorization": `Bearer ${token}` } : {}),
  };

  const response = await fetch(`${BASE_URL}/tutor/sessions/${sessionId}/messages/stream`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      lessonSlug: options.lessonSlug,
      message: options.message,
      clientMessageId: options.clientMessageId,
    }),
    signal: options.signal,
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "Unknown error");
    throw new Error(errorText || `HTTP error ${response.status}`);
  }

  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error("Response body is not readable");
  }

  const decoder = new TextDecoder();
  let buffer = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        const cleanLine = line.trim();
        if (!cleanLine.startsWith("data:")) continue;

        const dataStr = cleanLine.substring(5).trim();
        if (!dataStr) continue;

        try {
          const event: StreamEvent = JSON.parse(dataStr);
          if (event.type === "token" && event.content) {
            options.onToken(event.content);
          } else if (event.type === "done") {
            options.onDone({
              messageId: event.messageId || "",
              citations: event.citations || [],
            });
            return;
          } else if (event.type === "error") {
            const errObj = new Error(event.message || event.code || "Stream error");
            try {
              options.onError(errObj);
            } catch (errCb) {
              console.error("Error inside onError callback:", errCb);
            }
            reader.cancel().catch(() => {});
            return;
          }
        } catch (e) {
          console.error("Failed to parse SSE event payload", e);
        }
      }
    }
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") {
      return;
    }
    throw err;
  }
}
