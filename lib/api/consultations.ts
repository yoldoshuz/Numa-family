/**
 * Consultation requests. Family has no shop, but it does have the same lead
 * channel as its three sibling storefronts — the backend routes the request by
 * the `X-Store` header and hands it to Bitrix24 on its own, so a `201` here
 * means "saved" and there is nothing left for the site to do.
 */

import { AxiosError } from "axios";

import { apiClient } from "./client";

/** The API rejects anything shorter, so the form has to refuse it first. */
export const PROBLEM_MIN_LENGTH = 10;
export const PROBLEM_MAX_LENGTH = 4000;

export interface ConsultationPayload {
  name: string;
  /** Strictly `+998XXXXXXXXX` — build it with `toApiPhone`. */
  phone: string;
  problem: string;
}

export interface ConsultationReceipt {
  id: string;
  status: "new" | "in_progress" | "done" | "rejected";
  createdAt: string;
}

export async function submitConsultation(
  payload: ConsultationPayload,
): Promise<ConsultationReceipt> {
  const { data } = await apiClient.post<{ data: ConsultationReceipt }>(
    "/consultations",
    payload,
    // The store is read from the header and nowhere else: a `store` in the body
    // is ignored, and a missing header is a flat `400`.
    { headers: { "X-Store": "family" } },
  );
  return data.data;
}

/** Which message the modal should show when the request comes back unhappy. */
export type ConsultationFailure = "rateLimit" | "validation" | "network";

/**
 * `429` is the anti-spam cap (5 requests an hour per IP) and is the one failure
 * worth naming to the visitor — everything else reads as "try again".
 */
export function classifyConsultationError(error: unknown): ConsultationFailure {
  const status = error instanceof AxiosError ? error.response?.status : undefined;
  if (status === 429) return "rateLimit";
  if (status === 422) return "validation";
  return "network";
}
