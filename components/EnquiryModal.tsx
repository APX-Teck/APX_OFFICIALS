"use client";

import { AnimatePresence, motion } from "framer-motion";
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
          className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Background */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal Box */}
          <motion.div
            initial={{ opacity: 0, y: 25, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 25, scale: 0.97 }}
            transition={{ duration: 0.25 }}
            className="relative w-full max-w-2xl"
          >
            <div className="card max-h-[85vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-white/60">Get Enquiry</p>
                  <p className="text-xl font-semibold mt-1">
                    Tell us your requirement
                  </p>
                </div>

                <button
                  onClick={onClose}
                  className="p-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition"
                  aria-label="Close"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Form */}
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
