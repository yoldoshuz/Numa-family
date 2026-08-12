"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { ConsultationModal } from "./ConsultationModal";
import type { Dictionary } from "@/lib/i18n/getDictionary";
import type { Locale } from "@/lib/i18n/config";

interface ConsultationContextValue {
  open: () => void;
  close: () => void;
  isOpen: boolean;
}

const ConsultationContext = createContext<ConsultationContextValue | null>(null);

export function useConsultation() {
  const ctx = useContext(ConsultationContext);
  if (!ctx) {
    throw new Error("useConsultation must be used inside <ConsultationProvider>");
  }
  return ctx;
}

interface Props {
  locale: Locale;
  dict: Dictionary;
  children: ReactNode;
}

export function ConsultationProvider({ locale, dict, children }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  // Lock the page behind the modal so the backdrop doesn't scroll away.
  useEffect(() => {
    if (!isOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isOpen]);

  const value = useMemo(() => ({ open, close, isOpen }), [open, close, isOpen]);

  return (
    <ConsultationContext.Provider value={value}>
      {children}
      {isOpen && <ConsultationModal locale={locale} dict={dict} onClose={close} />}
    </ConsultationContext.Provider>
  );
}
