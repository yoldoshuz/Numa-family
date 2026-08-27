/**
 * Consultation requests. Family has no shop, but it does have the same lead
 * channel as its three sibling storefronts — the backend routes the request by
 * the `X-Store` header and hands it to Bitrix24 on its own, so a `201` here
 * means "saved" and there is nothing left for the site to do.
 */

import { AxiosError } from "axios";

import { apiClient } from "./client";

/**
 * The API rejects anything shorter, so the form has to refuse it first.
 *
 * Three characters, not ten. The old floor bounced short but perfectly usable
 * complaints — "Bosh og'riq" — into a 422, and a lead that never arrives is
 * worse than a terse one a manager can clarify on the phone. We only refuse
 * emptiness now.
 */
export const PROBLEM_MIN_LENGTH = 3;
export const PROBLEM_MAX_LENGTH = 4000;
export const SUBJECT_MAX_LENGTH = 256;

export interface ConsultationPayload {
  name: string;
  /** Strictly `+998XXXXXXXXX` — build it with `toApiPhone`. */
  phone: string;
  /**
   * "Murojaat mavzusi" — optional, and its own field rather than a headline
   * glued onto `problem`: the CRM prints it as a separate line on the deal
   * card, which it cannot do once it is buried in the description.
   */
  subject?: string;
  problem: string;
}

export interface ConsultationReceipt {
  id: string;
  status: "new" | "in_progress" | "done" | "rejected";
  createdAt: string;
}

/**
 * An empty `subject` is dropped rather than sent as `""` — "not chosen" is an
 * absent field, and an empty string only makes the CRM print a blank line.
 */
export async function submitConsultation({
  subject,
  ...payload
}: ConsultationPayload): Promise<ConsultationReceipt> {
  const { data } = await apiClient.post<{ data: ConsultationReceipt }>(
    "/consultations",
    subject ? { ...payload, subject } : payload,
    // The store is read from the header and nowhere else: a `store` in the body
    // is ignored, and a missing header is a flat `400`.
    { headers: { "X-Store": "family" } },
  );
  return data.data;
}

/** Which message the modal should show when the request comes back unhappy. */
export type ConsultationFailure = "rateLimit" | "validation" | "network";

/**
 * `429` is the anti-spam cap (20 requests an hour per IP) and is the one
 * failure worth naming to the visitor — everything else reads as "try again".
 * A real person never reaches the cap; an office NAT full of them might, which
 * is why it is no longer the five it started at.
 */
export function classifyConsultationError(error: unknown): ConsultationFailure {
  const status = error instanceof AxiosError ? error.response?.status : undefined;
  if (status === 429) return "rateLimit";
  if (status === 422) return "validation";
  return "network";
}
