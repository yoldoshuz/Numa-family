"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { CloseIcon } from "@/components/ui/icons";
import { submitLead } from "@/lib/api/leads";
import type { Dictionary } from "@/lib/i18n/getDictionary";
import type { Locale } from "@/lib/i18n/config";

interface Props {
  locale: Locale;
  dict: Dictionary;
  source: string;
  onClose: () => void;
}

export function ConsultationModal({ locale, dict, source, onClose }: Props) {
  const t = dict.consultation;
  const [done, setDone] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    nameRef.current?.focus();
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    const phone = String(form.get("phone") ?? "").trim();
    const message = String(form.get("message") ?? "").trim();

    if (!name || !phone) {
      setError(t.required);
      return;
    }

    setError(null);
    setSending(true);
    try {
      await submitLead({ name, phone, message, locale, source });
      setDone(true);
    } catch {
      setError(t.required);
    } finally {
      setSending(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-ink/45 p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={t.title}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative my-auto w-full max-w-4xl overflow-hidden rounded-[1.75rem] shadow-[0_30px_90px_rgba(8,40,48,0.4)]">
        {/* Gradient plate — white in the top-left, deep teal in the bottom-right. */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 95% at 14% 20%, #ffffff 0%, rgba(255,255,255,0) 58%), linear-gradient(135deg, #eff4f5 0%, #dae7ea 38%, #86aeb8 72%, #226f7f 100%)",
          }}
        />
        <Image
          src="/decor/network-teal.svg"
          alt=""
          width={460}
          height={400}
          aria-hidden
          className="pointer-events-none absolute -top-14 -left-14 w-52 opacity-90 sm:w-72"
        />
        <Image
          src="/decor/network-light.svg"
          alt=""
          width={460}
          height={400}
          aria-hidden
          className="pointer-events-none absolute -right-10 -bottom-12 w-52 opacity-80 sm:w-72"
        />

        <button
          type="button"
          onClick={onClose}
          aria-label={t.close}
          className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-brand/50 text-brand transition-colors hover:bg-white/60 sm:top-6 sm:right-6 sm:h-12 sm:w-12"
        >
          <CloseIcon className="h-5 w-5 sm:h-6 sm:w-6" />
        </button>

        <div className="relative px-5 py-12 sm:px-12 sm:py-16 lg:px-20 lg:py-20">
          <h2 className="mx-auto max-w-2xl text-center text-2xl leading-[1.15] font-extrabold text-[#167888] sm:text-3xl lg:text-[2.6rem]">
            {t.title}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-center text-sm text-[#2b7d8a] sm:mt-5 sm:text-base">
            {t.description}
          </p>

          {done ? (
            <SuccessPanel dict={dict} locale={locale} onClose={onClose} />
          ) : (
            <form onSubmit={handleSubmit} className="mx-auto mt-8 max-w-2xl sm:mt-11" noValidate>
              <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
                <Field label={t.nameLabel} required>
                  <input
                    ref={nameRef}
                    name="name"
                    type="text"
                    autoComplete="name"
                    placeholder={t.namePlaceholder}
                    className="h-13 w-full rounded-xl bg-white px-4 text-[0.95rem] text-ink placeholder:text-faint focus:ring-2 focus:ring-[#167888]/40 focus:outline-none"
                  />
                </Field>
                <Field label={t.phoneLabel} required>
                  <input
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    placeholder={t.phonePlaceholder}
                    className="h-13 w-full rounded-xl bg-white px-4 text-[0.95rem] text-ink placeholder:text-faint focus:ring-2 focus:ring-[#167888]/40 focus:outline-none"
                  />
                </Field>
              </div>

              <div className="mt-4 sm:mt-5">
                <Field label={t.messageLabel}>
                  <textarea
                    name="message"
                    rows={4}
                    placeholder={t.messagePlaceholder}
                    className="w-full resize-none rounded-xl bg-white px-4 py-3.5 text-[0.95rem] text-ink placeholder:text-faint focus:ring-2 focus:ring-[#167888]/40 focus:outline-none"
                  />
                </Field>
              </div>

              <p className="mt-5 flex items-start gap-3 rounded-xl bg-white px-4 py-3.5 text-[0.8rem] leading-relaxed text-body sm:text-sm">
                <span
                  aria-hidden
                  className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-[4px] bg-[#4A90D9] text-[11px] font-bold text-white"
                >
                  i
                </span>
                {t.note}
              </p>

              {error && (
                <p role="alert" className="mt-3 text-center text-sm font-medium text-[#B4342F]">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={sending}
                className="mt-5 h-14 w-full rounded-2xl bg-white text-[0.95rem] font-bold text-ink shadow-[0_10px_30px_rgba(8,40,48,0.18)] transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70 sm:text-base"
              >
                {sending ? t.submitting : t.submit}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-[0.8rem] font-medium text-body sm:text-sm">
        {label}
        {required && <span className="text-[#B4342F]">*</span>}
      </span>
      {children}
    </label>
  );
}

function SuccessPanel({
  dict,
  locale,
  onClose,
}: {
  dict: Dictionary;
  locale: Locale;
  onClose: () => void;
}) {
  const t = dict.consultation;
  return (
    <div className="mx-auto mt-10 w-full max-w-md rounded-2xl bg-white px-6 py-9 text-center shadow-[0_20px_50px_rgba(8,40,48,0.18)] sm:px-10">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={onClose}
          aria-label={t.close}
          className="-mt-4 -mr-2 flex h-8 w-8 items-center justify-center rounded-full border border-[#2b8fa0] text-[#2b8fa0] transition-colors hover:bg-mist"
        >
          <CloseIcon className="h-4 w-4" />
        </button>
      </div>

      <p className="text-[0.95rem] text-body sm:text-base">{t.successTitle}</p>
      <p className="mt-5 text-[0.95rem] whitespace-pre-line text-body sm:text-base">
        {t.successText}
      </p>
      <p className="mt-5 text-[0.95rem] whitespace-pre-line text-body sm:text-base">
        {t.successNote}
      </p>

      <div className="mt-8 flex flex-col gap-3">
        <Link
          href={`/${locale}`}
          onClick={onClose}
          className="flex h-12 items-center justify-center rounded-full bg-brand text-sm font-bold text-white transition-colors hover:bg-brand-deep"
        >
          {t.successHome}
        </Link>
        <Link
          href={`/${locale}/blog`}
          onClick={onClose}
          className="flex h-12 items-center justify-center rounded-full border border-brand text-sm font-bold text-brand transition-colors hover:bg-mist"
        >
          {t.successBlog}
        </Link>
      </div>
    </div>
  );
}
