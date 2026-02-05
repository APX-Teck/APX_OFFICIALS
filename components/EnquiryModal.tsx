"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import EnquiryForm from "@/components/EnquiryForm";

export default function EnquiryModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/70" onClick={onClose} />

          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.25 }}
            className="absolute left-1/2 top-1/2 w-[92vw] max-w-2xl -translate-x-1/2 -translate-y-1/2"
          >
            <div className="card">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm text-white/60">Get Enquiry</p>
                  <p className="text-xl font-semibold">
                    Tell us your requirement
                  </p>
                </div>

                <button
                  onClick={onClose}
                  className="p-2 rounded-xl border border-white/10 bg-white/5"
                  aria-label="Close"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="mt-6">
                <EnquiryForm onSuccess={onClose} />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
