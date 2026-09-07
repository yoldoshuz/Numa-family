/**
 * Callback requests — the footer's "leave your number" form.
 *
 * Deliberately not a consultation. A consultation carries a description of the
 * problem the manager reads before dialling; this carries a phone number and
 * nothing else, and the backend keeps the two in separate tables and separate
 * sections of the admin panel. Sending one as the other would fill the
 * consultation list with blank cards.
 */

import { AxiosError } from "axios";

import { apiClient } from "./client";

export interface SupportRequestReceipt {
  id: string;
  status: "new";
  createdAt: string;
}

/**
 * One field, on purpose: every extra box in a block like this costs a share of
 * the leads. `name`, `problem` and `comment` are ignored by the endpoint, and
 * the city is resolved by the backend from the request IP.
 *
 * @param phone Strictly `+998XXXXXXXXX` — build it with `toApiPhone`.
 */
export async function submitSupportRequest(phone: string): Promise<SupportRequestReceipt> {
  const { data } = await apiClient.post<{ data: SupportRequestReceipt }>(
    "/support-requests",
    { phone },
    // The store is read from the header and nowhere else: a `store` in the body
    // is ignored, and a missing header is a flat `400`.
    { headers: { "X-Store": "family" } },
  );
  return data.data;
}

/** Which message the form should show when the request comes back unhappy. */
export type SupportRequestFailure = "rateLimit" | "validation" | "network";

/**
 * `429` is the anti-spam cap — 20 requests an hour per IP — and is the one
 * failure worth naming to the visitor. It does not mean anything is broken, so
 * the form must not retry it automatically; an office NAT can reach it while
 * every person behind it is real.
 */
export function classifySupportRequestError(error: unknown): SupportRequestFailure {
  const status = error instanceof AxiosError ? error.response?.status : undefined;
  if (status === 429) return "rateLimit";
  if (status === 400 || status === 422) return "validation";
  return "network";
}
