import React from "react";
import { FiX, FiImage, FiZap } from "react-icons/fi";
import { useTheme } from "../../BgContext/ThemeContext";


const PRESET_PROMPTS = [
  "What is in this image? Describe it in detail.",
  "Describe the main subject of this image.",
  "What colors and visual elements are visible in this image?",
  "What text (if any) is visible in this image?",
  "Describe this image in a professional way.",
  "What kind of image is this (photo, screenshot, design, etc.)?",
  "Give me a detailed caption for this image.",
  "Tell me interesting details about this image.",
  "What objects can you see in this image?",
  "Describe the background of this image.",
  "What is the main focus of this image?",
  "Describe the composition and layout of this image.",
  "What emotions or mood does this image convey?",
  "Is this image a photograph, illustration, or digital artwork?",
  "What is the overall theme of this image?",
  "Describe any people or figures in this image.",
  "What is happening in this scene?",
  "Describe the lighting and shadows in this image.",
  "What is the quality and resolution of this image?",
  "Summarize what this image is about in 2-3 sentences.",
  "If this image could talk, what would it say?",
  "What is the artistic style of this image?",
  "Describe this image as if explaining to a blind person.",
  "What would be a good title for this image?",
];

export default function ImagePromptModal({
  dark,
  onClose,
  onSelectPrompt,
  fileName,
}) {
  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full max-w-lg overflow-hidden rounded-2xl border shadow-2xl ${
          dark
            ? "border-white/10 bg-[#111214] text-white"
            : "border-gray-200 bg-white text-gray-900"
        }`}
      >
      
        <div
          className={`flex items-center justify-between border-b px-5 py-4 ${
            dark ? "border-white/10" : "border-gray-200"
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                dark
                  ? "bg-purple-500/20 text-purple-300"
                  : "bg-purple-100 text-purple-600"
              }`}
            >
              <FiImage size={18} />
            </div>
            <div>
              <h3 className="text-sm font-semibold">Image uploaded</h3>
              <p
                className={`max-w-[280px] truncate text-[11px] ${
                  dark ? "text-gray-500" : "text-gray-500"
                }`}
                title={fileName}
              >
                {fileName}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className={`flex h-8 w-8 items-center justify-center rounded-lg transition ${
              dark
                ? "text-gray-500 hover:bg-white/10 hover:text-white"
                : "text-gray-500 hover:bg-gray-100 hover:text-black"
            }`}
          >
            <FiX size={18} />
          </button>
        </div>

      
        <div
          className={`flex items-center gap-2 border-b px-5 py-2.5 ${
            dark
              ? "border-white/10 bg-purple-500/[0.04]"
              : "border-gray-200 bg-purple-50/50"
          }`}
        >
          <FiZap
            size={12}
            className={dark ? "text-purple-300" : "text-purple-600"}
          />
          <p
            className={`text-[11px] ${
              dark ? "text-purple-300" : "text-purple-700"
            }`}
          >
            Select a prompt — the AI will analyze your image and answer
            automatically
          </p>
        </div>

      
        <div className="max-h-[60vh] overflow-y-auto p-3">
          <div className="space-y-2">
            {PRESET_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onSelectPrompt(prompt)}
                className={`group flex w-full items-start gap-3 rounded-xl border px-3 py-2.5 text-left transition-all duration-200 hover:-translate-y-0.5 ${
                  dark
                    ? "border-white/10 bg-white/[0.02] hover:border-purple-500/30 hover:bg-purple-500/[0.08]"
                    : "border-gray-200 bg-white hover:border-purple-300 hover:bg-purple-50"
                }`}
              >
                <div
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[10px] font-bold ${
                    dark
                      ? "bg-purple-500/15 text-purple-300"
                      : "bg-purple-100 text-purple-700"
                  }`}
                >
                  {idx + 1}
                </div>
                <p
                  className={`flex-1 text-[12px] leading-relaxed ${
                    dark
                      ? "text-gray-300 group-hover:text-white"
                      : "text-gray-700 group-hover:text-gray-900"
                  }`}
                >
                  {prompt}
                </p>
              </button>
            ))}
          </div>
        </div>

       
      </div>
    </div>
  );
}

export { PRESET_PROMPTS };