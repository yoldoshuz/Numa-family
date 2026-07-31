import axios from "axios";

export interface LeadPayload {
  name: string;
  phone: string;
  message?: string;
  locale: string;
  source: string;
}

/**
 * The consultation form has no backend route yet — the Numa API exposes only
 * blog + site content for the `family` store. Point NEXT_PUBLIC_LEADS_ENDPOINT
 * at the CRM/bot webhook once it exists and the form starts delivering for
 * real; until then the modal completes locally so the flow stays usable.
 */
const LEADS_ENDPOINT = process.env.NEXT_PUBLIC_LEADS_ENDPOINT;

export async function submitLead(payload: LeadPayload): Promise<void> {
  if (!LEADS_ENDPOINT) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[leads] NEXT_PUBLIC_LEADS_ENDPOINT is not set — lead not delivered", payload);
    }
    return;
  }

  await axios.post(LEADS_ENDPOINT, payload, {
    headers: { "Content-Type": "application/json" },
    timeout: 15000,
  });
}
