"use client";

import { useState } from "react";
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
    if (!content.trim()) {
      window.alert("Please write an update message");
      return;
    }

    setIsPosting(true);
    try {
      const response = await fetch(`/api/campaigns/${campaignId}/updates`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content,
          image: imagePreview || undefined,
          creatorAddress,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to post update");
      }

      setContent("");
      setImagePreview(null);
      setIsOpen(false);
      onPostSuccess?.();
    } catch (error) {
      window.alert("Failed to post update");
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
          className="w-full bg-gradient-to-r from-[#97422F] to-[#6B3220] text-white font-bold py-3 px-4 rounded-xl hover:shadow-lg transition"
        >
          📸 Share Impact Update
        </button>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-stone-200 p-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#97422F]">
                Share Impact Update
              </h2>
              <button
                onClick={() => {
                  setIsOpen(false);
                  setContent("");
                  setImagePreview(null);
                }}
                className="p-1 hover:bg-stone-100 rounded-full transition"
              >
                <X size={24} className="text-stone-600" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-stone-50 rounded-lg p-3 flex items-center gap-3">
                {campaignImage && (
                  <img
                    src={campaignImage}
                    alt={campaignTitle}
                    className="w-10 h-10 rounded object-cover"
                  />
                )}
                <div className="min-w-0">
                  <p className="text-xs text-stone-600 uppercase tracking-wide">
                    Posting to
                  </p>
                  <p className="font-bold text-sm text-stone-900 truncate">
                    {campaignTitle}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-2">
                  Your Update (max 500 characters)
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value.slice(0, 500))}
                  placeholder="Share what you&apos;ve accomplished, photos, stories of impact..."
                  className="w-full h-32 p-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#97422F] focus:outline-none resize-none"
                />
                <p className="text-xs text-stone-500 mt-1">{content.length}/500 characters</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-2">
                  Proof Photo / Evidence
                </label>
                {!imagePreview ? (
                  <label className="border-2 border-dashed border-stone-300 rounded-lg p-6 text-center cursor-pointer hover:border-[#97422F] transition">
                    <div className="flex flex-col items-center gap-2">
                      <Upload size={32} className="text-stone-400" />
                      <p className="font-semibold text-stone-700">Click to upload image</p>
                      <p className="text-xs text-stone-500">PNG, JPG up to 10MB</p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                ) : (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg"
                    />
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

            <div className="sticky bottom-0 bg-white border-t border-stone-200 p-4 flex gap-3">
              <button
                onClick={() => {
                  setIsOpen(false);
                  setContent("");
                  setImagePreview(null);
                }}
                className="flex-1 px-4 py-2 border border-stone-300 rounded-lg text-stone-700 font-semibold hover:bg-stone-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handlePost}
                disabled={isPosting || !content.trim()}
                className="flex-1 bg-[#97422F] text-white font-semibold py-2 px-4 rounded-lg hover:bg-[#8B3F24] disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
              >
                {isPosting && <Loader size={16} className="animate-spin" />}
                {isPosting ? "Posting..." : "Share Impact Update"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
