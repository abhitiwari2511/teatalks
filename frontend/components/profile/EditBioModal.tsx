"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { motion, AnimatePresence } from "motion/react";

interface EditBioModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBio: string;
  onSave: (newBio: string) => Promise<void>;
}

export default function EditBioModal({
  isOpen,
  onClose,
  currentBio,
  onSave,
}: EditBioModalProps) {
  const [bio, setBio] = useState(currentBio || "");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (saving) return;

    setSaving(true);
    try {
      await onSave(bio);
      onClose();
    } catch (error) {
      console.error("Error saving bio:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    if (!saving) {
      setBio(currentBio || "");
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
          />

          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-card border-4 border-border rounded-2xl p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] w-full max-w-lg relative"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-extrabold text-foreground">
                  Edit Bio
                </h2>
                <button
                  onClick={handleClose}
                  disabled={saving}
                  className="text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold text-foreground mb-2">
                  About You
                </label>
                <Textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us about yourself... (e.g., CS senior | Coffee enthusiast ☕)"
                  className="min-h-30 border-4 border-border rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all resize-none"
                  maxLength={200}
                  disabled={saving}
                />
                <p className="text-xs text-muted-foreground mt-1 text-right">
                  {bio.length}/200 characters
                </p>
              </div>

              <div className="flex gap-3 justify-end">
                <Button
                  variant="outline"
                  onClick={handleClose}
                  disabled={saving}
                  className="border-4 border-border rounded-full font-normal shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-50"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={saving || bio === currentBio}
                  className="bg-primary text-primary-foreground border-4 border-border rounded-full font-normal shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all hover:bg-primary disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
