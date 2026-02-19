// src/lib/api/client.js
// "Senior-ish" API client: единый request, таймаут, нормальные ошибки, единый контракт

export class ApiError extends Error {
  constructor(message, { status = 0, code = "UNKNOWN", details = null } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

function toErrorMessage(err) {
  if (err instanceof ApiError) return err.message;
  if (err instanceof Error) return err.message;
  return "Unknown error";
}

/**
 * Единый формат ответов от сервера (рекомендуемо):
 * success: { ok: true, data: ... }
 * error:   { ok: false, error: { code, message, details? } }
 */
export function createApiClient({ baseUrl = "", timeoutMs = 10_000 } = {}) {
  async function request(path, { method = "GET", body, headers = {}, signal } = {}) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), timeoutMs);

    try {
      const res = await fetch(baseUrl + path, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
        body: body ? JSON.stringify(body) : undefined,
        credentials: "include", // если используешь httpOnly-cookie сессии
        signal: signal ?? ctrl.signal,
      });

      const contentType = res.headers.get("content-type") || "";
      const isJson = contentType.includes("application/json");

      // если сервер не JSON — всё равно обработаем
      const payload = isJson ? await res.json().catch(() => null) : await res.text().catch(() => "");

      if (!res.ok) {
        // стараемся вытащить message/code из вашего API формата
        const serverMsg =
          payload?.error?.message ||
          payload?.message ||
          (typeof payload === "string" && payload) ||
          "Request failed";

        const serverCode = payload?.error?.code || "HTTP_ERROR";

        throw new ApiError(serverMsg, {
          status: res.status,
          code: serverCode,
          details: payload?.error?.details ?? payload ?? null,
        });
      }

      // если ты используешь формат { ok: true, data }
      if (payload && typeof payload === "object" && "ok" in payload) {
        if (payload.ok !== true) {
          throw new ApiError(payload?.error?.message || "Request failed", {
            status: res.status,
            code: payload?.error?.code || "API_ERROR",
            details: payload?.error?.details ?? null,
          });
        }
        return payload.data;
      }

      // если сервер возвращает "сырой" data (без ok/data) — тоже поддержим
      return payload;
    } catch (err) {
      if (err?.name === "AbortError") {
        throw new ApiError("Request timeout", { code: "TIMEOUT", status: 0 });
      }
      // network errors
      if (!(err instanceof ApiError)) {
        throw new ApiError(toErrorMessage(err), { code: "NETWORK", status: 0 });
      }
      throw err;
    } finally {
      clearTimeout(timer);
    }
  }

  return { request };
}