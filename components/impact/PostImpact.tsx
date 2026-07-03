"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, Loader } from "lucide-react";

type PostImpactProps = {
  campaignId: string;
  campaignTitle: string;
  campaignImage?: string;
  creatorAddress: string;
  onPostSuccess?: () => void;
};

export default function PostImpact({
  campaignId,
  campaignTitle,
  campaignImage,
  creatorAddress,
  onPostSuccess,
}: PostImpactProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isPosting, setIsPosting] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePost = async () => {
    if (!content.trim()) return;

    setIsPosting(true);
    try {
      const response = await fetch(`/api/campaigns/${campaignId}/updates`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content,
          image: imagePreview || undefined,
          creatorAddress,
        }),
      });

      if (!response.ok) throw new Error("Failed to post update");

      setContent("");
      setImagePreview(null);
      setIsOpen(false);
      onPostSuccess?.();
    } catch (error) {
      console.error(error);
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-full bg-white/[0.04] backdrop-blur-2xl border border-white/20 text-white font-bold py-3 px-4 rounded-2xl transition-all duration-500 ease-out shadow-[0_0_15px_rgba(127,191,127,0.15)] hover:shadow-[0_0_40px_rgba(127,191,127,0.3)] hover:border-primary/50 hover:bg-primary/15"
        >
          Share Impact Update
        </button>
      )}

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-overlay backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="bg-bg-card rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-border"
            >
              <div className="sticky top-0 bg-bg-card border-b border-border p-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-fg font-[family-name:var(--font-heading)]">
                  Share Impact Update
                </h2>
                <button
                  onClick={() => { setIsOpen(false); setContent(""); setImagePreview(null); }}
                  className="p-1 hover:bg-bg-muted rounded-full transition"
                >
                  <X size={24} className="text-fg-muted" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div className="bg-bg-muted rounded-xl p-3 flex items-center gap-3">
                  {campaignImage && (
                    <img src={campaignImage} alt={campaignTitle} className="w-10 h-10 rounded-lg object-cover" />
                  )}
                  <div className="min-w-0">
                    <p className="text-xs text-fg-subtle uppercase tracking-wide">Posting to</p>
                    <p className="font-bold text-sm text-fg truncate">{campaignTitle}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-fg mb-2">
                    Your Update (max 500 characters)
                  </label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value.slice(0, 500))}
                    placeholder="Share what you've accomplished, photos, stories of impact..."
                    className="w-full h-32 p-3 border border-border rounded-xl focus:ring-2 focus:ring-border-focus focus:outline-none resize-none bg-bg text-fg placeholder:text-fg-subtle"
                  />
                  <p className="text-xs text-fg-subtle mt-1">{content.length}/500 characters</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-fg mb-2">
                    Proof Photo / Evidence
                  </label>
                  {!imagePreview ? (
                    <label className="border-2 border-dashed border-border rounded-xl p-6 text-center cursor-pointer hover:border-accent transition bg-bg block">
                      <div className="flex flex-col items-center gap-2">
                        <Upload size={32} className="text-fg-subtle" />
                        <p className="font-semibold text-fg-muted">Click to upload image</p>
                        <p className="text-xs text-fg-subtle">PNG, JPG up to 10MB</p>
                      </div>
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                  ) : (
                    <div className="relative">
                      <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover rounded-xl" />
                      <button
                        onClick={() => setImagePreview(null)}
                        className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="sticky bottom-0 bg-bg-card border-t border-border p-4 flex gap-3">
                <button
                  onClick={() => { setIsOpen(false); setContent(""); setImagePreview(null); }}
                  className="flex-1 px-4 py-2 border border-border rounded-xl text-fg font-semibold hover:bg-bg-muted transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePost}
                  disabled={isPosting || !content.trim()}
                  className="flex-1 bg-white/[0.04] backdrop-blur-2xl border border-white/20 text-white font-semibold py-2 px-4 rounded-xl transition-all duration-500 ease-out disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(127,191,127,0.15)] hover:shadow-[0_0_40px_rgba(127,191,127,0.3)] hover:border-primary/50 hover:bg-primary/15"
                >
                  {isPosting && <Loader size={16} className="animate-spin" />}
                  {isPosting ? "Posting..." : "Share Impact Update"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
