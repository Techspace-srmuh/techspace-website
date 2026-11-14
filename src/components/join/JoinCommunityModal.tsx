"use client";

import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useJoinModal } from "./hooks/useJoinModal";
import { communityLinks } from "./communityLinks";
import { ModalHeader } from "./ModalHeader";
import { PlatformCard } from "./PlatformCard";
import { QuoteFooter } from "./QuoteFooter";

export function JoinCommunityModal() {
  const { isOpen, closeJoinModal } = useJoinModal();
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const lastActiveElementRef = useRef<HTMLElement | null>(null);

  // Focus trap, Escape key & body scroll lock handler
  useEffect(() => {
    if (isOpen) {
      lastActiveElementRef.current = document.activeElement as HTMLElement | null;
      document.body.style.overflow = "hidden";
      window.dispatchEvent(new CustomEvent("techspace-scroll-lock", { detail: true }));

      // Focus close button on mount
      const timer = setTimeout(() => {
        closeBtnRef.current?.focus();
      }, 50);

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          closeJoinModal();
          return;
        }

        // Focus trap
        if (e.key === "Tab" && modalRef.current) {
          const focusable = modalRef.current.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          if (focusable.length === 0) return;
          const first = focusable[0];
          const last = focusable[focusable.length - 1];

          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      };

      window.addEventListener("keydown", handleKeyDown);

      return () => {
        clearTimeout(timer);
        document.body.style.overflow = "";
        window.dispatchEvent(new CustomEvent("techspace-scroll-lock", { detail: false }));
        window.removeEventListener("keydown", handleKeyDown);
        if (lastActiveElementRef.current && typeof lastActiveElementRef.current.focus === "function") {
          lastActiveElementRef.current.focus();
        }
      };
    }
  }, [isOpen, closeJoinModal]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-6 overflow-y-auto">
          {/* Dimmed Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={closeJoinModal}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
            aria-hidden="true"
          />

          {/* Dialog Container: Mobile Bottom Sheet / Desktop Centered Glass Dialog */}
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, y: 100, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-full sm:max-w-[560px] rounded-t-3xl sm:rounded-3xl bg-[#0A0A0F]/95 border-t sm:border border-white/15 p-6 md:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.8)] backdrop-blur-2xl z-10 space-y-5 max-h-[92vh] overflow-y-auto pb-8 sm:pb-8"
            role="dialog"
            aria-modal="true"
            aria-labelledby="join-modal-title"
            data-lenis-prevent="true"
          >
            {/* Mobile Bottom Sheet Pull Indicator Handle */}
            <div className="sm:hidden flex justify-center pb-1">
              <div className="w-12 h-1.5 rounded-full bg-white/20" />
            </div>

            {/* Ambient Background Glow */}
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-72 h-72 bg-sky-500/10 rounded-full blur-[100px] pointer-events-none" />

            {/* Close Button */}
            <button
              ref={closeBtnRef}
              onClick={closeJoinModal}
              className="absolute top-5 right-5 p-2 rounded-full bg-neutral-900/80 border border-white/10 text-neutral-400 hover:text-white hover:bg-neutral-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-sky-500/40 z-20 cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Header */}
            <ModalHeader />

            {/* Platform Cards (WhatsApp Community & Instagram) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <PlatformCard config={communityLinks.whatsapp} />
              <PlatformCard config={communityLinks.instagram} />
            </div>

            {/* Quote Footer */}
            <QuoteFooter />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
