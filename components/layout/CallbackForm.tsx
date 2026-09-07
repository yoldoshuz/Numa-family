"use client";

import { useState } from "react";

import {
  classifySupportRequestError,
  submitSupportRequest,
} from "@/lib/api/support-requests";
import { formatUzPhoneInput, toApiPhone, UZ_PHONE_PREFIX } from "@/lib/utils/phone";

type State = "idle" | "sending" | "done" | "invalid" | "rateLimit" | "network";

export interface CallbackCopy {
  title: string;
  hint: string;
  phoneLabel: string;
  submit: string;
  sending: string;
  success: string;
  errorPhone: string;
  errorRateLimit: string;
  errorNetwork: string;
}

/**
 * The footer's "leave your number" block.
 *
 * Deliberately not the consultation modal: that one asks for a name and a
 * description of the problem, and the two land in separate tables and separate
 * sections of the admin panel. One field is the whole point — the manager asks
 * for everything else in the first seconds of the call.
 */
export function CallbackForm({ copy }: { copy: CallbackCopy }) {
  const [phone, setPhone] = useState(UZ_PHONE_PREFIX);
  const [state, setState] = useState<State>("idle");

  const busy = state === "sending" || state === "done";

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (busy) return;

    const apiPhone = toApiPhone(phone);
    if (!apiPhone) {
      setState("invalid");
      return;
    }

    setState("sending");
    try {
      await submitSupportRequest(apiPhone);
      setState("done");
    } catch (error) {
      // A 429 is the anti-spam cap, not a fault: never retry it for the
      // visitor, or a shared office IP keeps hitting the same wall.
      const failure = classifySupportRequestError(error);
      setState(failure === "validation" ? "invalid" : failure);
    }
  }

  const message =
    state === "done"
      ? copy.success
      : state === "invalid"
        ? copy.errorPhone
        : state === "rateLimit"
          ? copy.errorRateLimit
          : state === "network"
            ? copy.errorNetwork
            : null;

  return (
    <form onSubmit={onSubmit} className="mt-8">
      <p className="text-sm font-bold">{copy.title}</p>
      <p className="mt-2 max-w-xs text-sm leading-relaxed text-white/85">{copy.hint}</p>
      <div className="mt-3 flex max-w-xs flex-col gap-2 sm:flex-row">
        <input
          type="tel"
          inputMode="tel"
          value={phone}
          onChange={(event) => {
            setPhone(formatUzPhoneInput(event.target.value));
            if (state === "invalid") setState("idle");
          }}
          disabled={busy}
          aria-label={copy.phoneLabel}
          placeholder={UZ_PHONE_PREFIX}
          className="h-11 min-w-0 flex-1 rounded-full border border-white/30 bg-white/10 px-4 text-sm text-white placeholder:text-white/50 focus:border-white focus:outline-none disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={busy}
          className="h-11 shrink-0 rounded-full bg-white px-6 text-sm font-bold text-sea transition-transform hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-60"
        >
          {state === "sending" ? copy.sending : copy.submit}
        </button>
      </div>
      {message ? (
        <p
          role={state === "done" ? "status" : "alert"}
          className={`mt-3 max-w-xs text-sm ${state === "done" ? "text-white" : "text-red-200"}`}
        >
          {message}
        </p>
      ) : null}
    </form>
  );
}
